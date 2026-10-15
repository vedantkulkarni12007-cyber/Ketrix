#!/usr/bin/env python3
"""
Ketrix Quantum API Staged Concurrency & Capacity Test Runner
============================================================
A safe, reproducible, bounded load test utility for the Ketrix
FastAPI + Qiskit Aer backend.

Safety guarantees:
- Always performs pre-flight health check before any load.
- Isolates Cold-Start probe from warm sustained traffic.
- Staged concurrency ramp-up (1 -> 2 -> 5 -> 10 virtual users).
- Strict bounded durations and request caps per stage.
- Configurable pacing (delays) between requests.
- Automatic circuit-breaker: aborts if failure rate > 20%.
- Does not modify production database or backend state.
"""

import sys
import os
import time
import json
import argparse
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

# Standard Workload Payloads
WORKLOAD_1Q_H = {
    "num_qubits": 1,
    "operations": [
        {"gate": "H", "target": 0}
    ],
    "shots": 100,
    "return_statevector": False
}

WORKLOAD_2Q_BELL = {
    "num_qubits": 2,
    "operations": [
        {"gate": "H", "target": 0},
        {"gate": "CX", "control": 0, "target": 1}
    ],
    "shots": 100,
    "return_statevector": False
}

TARGET_URLS = {
    "local": "http://localhost:8000",
    "prod": "https://ketrix-api.onrender.com"
}


def make_http_request(url: str, data: dict = None, timeout: float = 30.0):
    """
    Executes an HTTP request and measures latency in milliseconds.
    Returns: (success: bool, status_code: int, latency_ms: float, error_msg: str, response_json: dict)
    """
    req_data = None
    headers = {"User-Agent": "Ketrix-LoadTest/1.0"}
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=req_data, headers=headers, method="POST" if data else "GET")

    start_time = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            latency_ms = (time.perf_counter() - start_time) * 1000.0
            body = response.read().decode("utf-8")
            status_code = response.status
            try:
                parsed = json.loads(body)
            except Exception:
                parsed = None
            return True, status_code, latency_ms, None, parsed
    except urllib.error.HTTPError as e:
        latency_ms = (time.perf_counter() - start_time) * 1000.0
        return False, e.code, latency_ms, f"HTTPError {e.code}: {e.reason}", None
    except urllib.error.URLError as e:
        latency_ms = (time.perf_counter() - start_time) * 1000.0
        reason = str(e.reason)
        is_timeout = "timed out" in reason.lower()
        err_type = "Timeout" if is_timeout else "ConnectionError"
        return False, 0, latency_ms, f"{err_type}: {reason}", None
    except Exception as e:
        latency_ms = (time.perf_counter() - start_time) * 1000.0
        return False, 0, latency_ms, f"UnexpectedError: {str(e)}", None


def compute_percentiles(latencies):
    if not latencies:
        return {"min": 0, "max": 0, "mean": 0, "median": 0, "p95": 0}
    sorted_lats = sorted(latencies)
    n = len(sorted_lats)
    mean_val = sum(sorted_lats) / n
    median_val = sorted_lats[int(n * 0.50)]
    p95_idx = min(int(n * 0.95), n - 1)
    p95_val = sorted_lats[p95_idx]
    return {
        "min": round(sorted_lats[0], 2),
        "max": round(sorted_lats[-1], 2),
        "mean": round(mean_val, 2),
        "median": round(median_val, 2),
        "p95": round(p95_val, 2)
    }


def run_stage(base_url: str, concurrency: int, duration_sec: float, pacing_sec: float, max_requests: int, timeout: float):
    """
    Runs a single concurrency stage with bounded duration, request cap, and pacing.
    """
    sim_endpoint = f"{base_url.rstrip('/')}/api/v1/quantum/simulate"
    stop_event = False
    start_time = time.time()
    
    records = []
    
    def worker_loop(worker_id):
        nonlocal stop_event
        workload_idx = worker_id % 2
        while not stop_event:
            # Check elapsed time
            if time.time() - start_time >= duration_sec:
                break
            if len(records) >= max_requests:
                break

            # Alternate workloads
            workload_idx = (workload_idx + 1) % 2
            payload = WORKLOAD_1Q_H if workload_idx == 0 else WORKLOAD_2Q_BELL
            workload_label = "1Q-H (100 shots)" if workload_idx == 0 else "2Q-Bell (100 shots)"

            success, status, latency_ms, err, resp = make_http_request(sim_endpoint, payload, timeout=timeout)
            
            # Verify simulation result structure
            if success and (not resp or "measurement_counts" not in resp):
                success = False
                err = "Invalid simulation response structure"

            record = {
                "worker_id": worker_id,
                "workload": workload_label,
                "success": success,
                "status": status,
                "latency_ms": latency_ms,
                "error": err,
                "timestamp": time.time()
            }
            records.append(record)

            if pacing_sec > 0:
                time.sleep(pacing_sec)

    with ThreadPoolExecutor(max_workers=concurrency) as executor:
        futures = [executor.submit(worker_loop, i) for i in range(concurrency)]
        # Monitor stage duration
        while time.time() - start_time < duration_sec and len(records) < max_requests:
            time.sleep(0.2)
        stop_event = True
        for f in futures:
            try:
                f.result(timeout=timeout + 2.0)
            except Exception:
                pass

    stage_duration = time.time() - start_time
    total_reqs = len(records)
    success_reqs = sum(1 for r in records if r["success"])
    fail_reqs = total_reqs - success_reqs
    timeouts = sum(1 for r in records if "timeout" in (r.get("error") or "").lower())
    http_errors = sum(1 for r in records if r["status"] >= 400)
    
    successful_lats = [r["latency_ms"] for r in records if r["success"]]
    percentiles = compute_percentiles(successful_lats)
    rps = round(success_reqs / stage_duration, 2) if stage_duration > 0 else 0

    return {
        "concurrency": concurrency,
        "total_requests": total_reqs,
        "successful_requests": success_reqs,
        "failed_requests": fail_reqs,
        "timeouts": timeouts,
        "http_errors": http_errors,
        "duration_sec": round(stage_duration, 2),
        "rps": rps,
        "metrics": percentiles,
        "raw_records": records
    }


def main():
    parser = argparse.ArgumentParser(description="Ketrix Quantum Simulation Backend Load Tester")
    parser.add_argument("--target", choices=["local", "prod", "custom"], default="local",
                        help="Target environment (local: http://localhost:8000, prod: https://ketrix-api.onrender.com)")
    parser.add_argument("--url", type=str, default=None, help="Custom target base URL (if --target custom)")
    parser.add_argument("--stages", type=str, default="1,2,5,10", help="Comma-separated concurrent user stages (e.g. 1,2,5,10)")
    parser.add_argument("--duration", type=float, default=10.0, help="Duration per stage in seconds (default: 10.0)")
    parser.add_argument("--pacing", type=float, default=1.0, help="Pacing delay in seconds between requests per worker (default: 1.0)")
    parser.add_argument("--max-requests-per-stage", type=int, default=25, help="Maximum requests per stage (default: 25)")
    parser.add_argument("--timeout", type=float, default=30.0, help="Per-request HTTP timeout in seconds (default: 30.0)")
    parser.add_argument("--probe-only", action="store_true", help="Only run health check and 1-request cold vs warm probe, then exit")
    parser.add_argument("--dry-run", action="store_true", help="Display planned test configuration and request estimates without sending traffic")
    
    args = parser.parse_args()

    # Determine Base URL
    if args.target == "custom":
        if not args.url:
            print("ERROR: --url must be provided when --target is 'custom'.")
            sys.exit(1)
        base_url = args.url.rstrip("/")
    else:
        base_url = TARGET_URLS[args.target]

    stages = [int(s.strip()) for s in args.stages.split(",") if s.strip()]

    # Calculate expected request volume
    est_reqs_per_stage = []
    for c in stages:
        # Approximate requests = min(max_requests, concurrency * (duration / pacing))
        est = min(args.max_requests_per_stage, int(c * (args.duration / max(0.2, args.pacing))))
        est_reqs_per_stage.append(est)
    total_est_requests = sum(est_reqs_per_stage) + 2  # +2 for health & probe

    print("\n" + "=" * 70)
    print("KETRIX QUANTUM API STAGED CONCURRENCY & CAPACITY TEST")
    print("=" * 70)
    print(f"Target Base URL:       {base_url}")
    print(f"Environment:           {args.target.upper()}")
    print(f"Simulation Endpoint:   {base_url}/api/v1/quantum/simulate")
    print(f"Health Endpoint:       {base_url}/health")
    print(f"Concurrency Stages:    {stages} users")
    print(f"Duration per Stage:    {args.duration}s")
    print(f"Worker Pacing:         {args.pacing}s delay between requests")
    print(f"Max Reqs per Stage:    {args.max_requests_per_stage}")
    print(f"Request Timeout:       {args.timeout}s")
    print(f"Est. Max Total Reqs:   ~{total_est_requests} requests across all stages")
    print("=" * 70)

    if args.dry_run:
        print("\n[DRY RUN] Configuration validated. No requests sent.")
        print(f"Expected request budget:")
        for c, est in zip(stages, est_reqs_per_stage):
            print(f"  Stage {c:2d} user(s): up to {est} requests over {args.duration}s")
        sys.exit(0)

    # -------------------------------------------------------------
    # PHASE 0: PRE-FLIGHT HEALTH CHECK
    # -------------------------------------------------------------
    print("\n[PHASE 0] Pre-flight Health Check...")
    health_url = f"{base_url}/health"
    h_success, h_code, h_lat, h_err, h_resp = make_http_request(health_url, timeout=10.0)

    if not h_success:
        print(f"[FAIL] HEALTH CHECK FAILED: {h_err} (status={h_code})")
        print("Aborting test to protect the server.")
        sys.exit(1)

    print(f"[OK] Health Check Passed: Status {h_code} in {h_lat:.1f}ms (Response: {h_resp})")

    # -------------------------------------------------------------
    # PHASE 0B: COLD-START VS WARM LATENCY PROBE
    # -------------------------------------------------------------
    print("\n[PHASE 0B] Cold-Start vs Warm Simulation Probe...")
    sim_url = f"{base_url}/api/v1/quantum/simulate"
    
    # Probe 1: Cold start probe
    print("  -> Sending Probe 1 (Cold-Start sample: 1Q H-gate)...")
    p1_ok, p1_code, p1_lat, p1_err, p1_resp = make_http_request(sim_url, WORKLOAD_1Q_H, timeout=args.timeout)
    if not p1_ok:
        print(f"[FAIL] Probe 1 Failed: {p1_err}")
        sys.exit(1)
    print(f"     Status: {p1_code} | Latency: {p1_lat:.1f}ms | Counts: {p1_resp.get('measurement_counts')}")

    time.sleep(1.0)

    # Probe 2: Warm baseline probe
    print("  -> Sending Probe 2 (Warm baseline sample: 2Q Bell-circuit)...")
    p2_ok, p2_code, p2_lat, p2_err, p2_resp = make_http_request(sim_url, WORKLOAD_2Q_BELL, timeout=args.timeout)
    if not p2_ok:
        print(f"[FAIL] Probe 2 Failed: {p2_err}")
        sys.exit(1)
    print(f"     Status: {p2_code} | Latency: {p2_lat:.1f}ms | Counts: {p2_resp.get('measurement_counts')}")

    probe_summary = {
        "cold_start_probe_ms": round(p1_lat, 2),
        "warm_baseline_probe_ms": round(p2_lat, 2)
    }

    if args.probe_only:
        print("\n[PROBE COMPLETE] Probe-only mode requested. Exiting safely.")
        print(json.dumps(probe_summary, indent=2))
        sys.exit(0)

    # -------------------------------------------------------------
    # PHASE 1: STAGED CONCURRENCY TESTING
    # -------------------------------------------------------------
    stage_results = []
    print("\n[PHASE 1] Commencing Staged Concurrency Execution...")
    
    for stage_idx, concurrency in enumerate(stages, 1):
        print(f"\n>>> Stage {stage_idx}/{len(stages)}: {concurrency} Concurrent Virtual User(s) for {args.duration}s (pacing={args.pacing}s)...")
        stage_res = run_stage(
            base_url=base_url,
            concurrency=concurrency,
            duration_sec=args.duration,
            pacing_sec=args.pacing,
            max_requests=args.max_requests_per_stage,
            timeout=args.timeout
        )
        stage_results.append(stage_res)

        # Print stage metrics immediately
        m = stage_res["metrics"]
        print(f"    Completed: {stage_res['successful_requests']}/{stage_res['total_requests']} successful | "
              f"Errors: {stage_res['failed_requests']} | Timeouts: {stage_res['timeouts']} | "
              f"RPS: {stage_res['rps']} req/s")
        print(f"    Latency:   p50={m['median']}ms | p95={m['p95']}ms | min={m['min']}ms | max={m['max']}ms")

        # Circuit Breaker Check
        failure_rate = (stage_res["failed_requests"] / stage_res["total_requests"]) if stage_res["total_requests"] > 0 else 0
        if failure_rate > 0.20:
            print(f"\n[CIRCUIT BREAKER] Failure rate ({failure_rate*100:.1f}%) exceeds safety threshold (20%).")
            print("Stopping further stages to prevent degradation of the target service.")
            break

        # Cool-down pause between stages
        if stage_idx < len(stages):
            time.sleep(2.0)

    # -------------------------------------------------------------
    # PHASE 2: GENERATE SUMMARY REPORT
    # -------------------------------------------------------------
    from datetime import timezone
    now_utc = datetime.now(timezone.utc)
    print("\n" + "=" * 70)
    print("LOAD TEST EXECUTION SUMMARY REPORT")
    print("=" * 70)
    print(f"Target:             {base_url}")
    print(f"Executed at:        {now_utc.isoformat()}")
    print(f"Cold-Start Latency: {probe_summary['cold_start_probe_ms']} ms")
    print(f"Warm-Probe Latency: {probe_summary['warm_baseline_probe_ms']} ms")
    print("-" * 70)
    print(f"{'Users':<6} | {'Total':<6} | {'Success':<8} | {'Errors':<7} | {'Timeouts':<9} | {'RPS':<7} | {'Median(ms)':<11} | {'p95(ms)':<9}")
    print("-" * 70)
    for s in stage_results:
        m = s["metrics"]
        print(f"{s['concurrency']:<6} | {s['total_requests']:<6} | {s['successful_requests']:<8} | {s['failed_requests']:<7} | "
              f"{s['timeouts']:<9} | {s['rps']:<7.2f} | {m['median']:<11.1f} | {m['p95']:<9.1f}")
    print("=" * 70)

    # Save results to file
    out_dir = os.path.dirname(os.path.abspath(__file__))
    ts = now_utc.strftime("%Y%m%d_%H%M%S")
    out_file = os.path.join(out_dir, f"results_{args.target}_{ts}.json")
    
    # Strip raw_records from JSON summary to keep it compact
    summary_data = {
        "target": base_url,
        "environment": args.target,
        "timestamp_utc": now_utc.isoformat(),
        "probe": probe_summary,
        "stages": [
            {k: v for k, v in s.items() if k != "raw_records"} for s in stage_results
        ]
    }
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(summary_data, f, indent=2)
    print(f"\nDetailed JSON report saved to: {out_file}\n")


if __name__ == "__main__":
    main()
