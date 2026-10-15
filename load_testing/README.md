# Ketrix Quantum Backend Load Testing & Capacity Guide

Safe, reproducible load testing harness for the **Ketrix FastAPI + Qiskit Aer** simulation backend.

---

## 1. Workload Profiles

All tests evaluate the real quantum simulation engine:

1. **Workload A (1-Qubit Superposition)**:
   - Target: `POST /api/v1/quantum/simulate`
   - Operations: $H$ on $Q_0$
   - Shots: 100
   - Payload:
     ```json
     {
       "num_qubits": 1,
       "operations": [{"gate": "H", "target": 0}],
       "shots": 100,
       "return_statevector": false
     }
     ```

2. **Workload B (2-Qubit Bell State)**:
   - Target: `POST /api/v1/quantum/simulate`
   - Operations: $H$ on $Q_0$, followed by $CX$ (control: 0, target: 1)
   - Shots: 100
   - Payload:
     ```json
     {
       "num_qubits": 2,
       "operations": [
         {"gate": "H", "target": 0},
         {"gate": "CX", "control": 0, "target": 1}
       ],
       "shots": 100,
       "return_statevector": false
     }
     ```

---

## 2. Safety Safeguards

* **Pre-flight Health Check**: Verifies `/health` responds with HTTP 200 before sending any load.
* **Cold-Start Isolation**: Measures the initial wake-up request separately from warm simulation throughput.
* **Gradual Staging**: Concurrency steps ramp through 1 → 2 → 5 → 10 virtual users.
* **Bounded Budget**: Maximum 25 requests and 10 seconds per stage.
* **Worker Pacing**: 1.0s delay between requests per worker to simulate realistic human interaction.
* **Circuit Breaker**: If failure rate exceeds 20% or 3 consecutive timeouts occur, the runner immediately terminates to prevent server saturation.
* **No Production Modification**: The test suite does not modify server state, dependencies, or database records.

---

## 3. Running Locally

### Step 1: Start the Local Backend
```bash
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8000
```

### Step 2: Run Local Staged Concurrency Test
```bash
.\backend\.venv\Scripts\python.exe load_testing\runner.py --target local
```

Or using Locust:
```bash
.\backend\.venv\Scripts\locust.exe -f load_testing\locustfile.py --host http://localhost:8000
```

---

## 4. Running Against Production

> **CRITICAL**: Do NOT run without checking service status. Follow the phased ramp-up below.

### Initial Probe Test (2 requests total: 1 health + 1 simulation)
Measures cold-start vs warm baseline latency:
```bash
.\backend\.venv\Scripts\python.exe load_testing\runner.py --target prod --probe-only
```

### Full Staged Concurrency Test (1, 2, 5, 10 users)
Total expected volume: ~60–80 requests over ~45 seconds:
```bash
.\backend\.venv\Scripts\python.exe load_testing\runner.py --target prod --stages 1,2,5,10 --duration 10 --pacing 1.0 --max-requests-per-stage 20
```

---

## 5. Report Template

```markdown
# Ketrix Production Capacity & Concurrency Report

## Deployment Specifications
- **Target URL**: https://ketrix-api.onrender.com
- **Simulation Endpoint**: POST /api/v1/quantum/simulate
- **Render Service Type**: Web Service (Python 3.13 + FastAPI + Qiskit Aer)
- **Observed Characteristics**: Spins down after inactivity; cold start required on initial wake-up.

## Cold-Start vs Warm Performance
- **Pre-flight Health (/health)**: XX ms
- **Cold-Start Simulation Probe**: XX ms (spin-up from sleep)
- **Warm Baseline Simulation**: XX ms

## Staged Concurrency Results
| Virtual Users | Total Requests | Successful | Failures | Timeouts | RPS | Median Latency (ms) | p95 Latency (ms) |
|---|---|---|---|---|---|---|---|
| 1 User        | --             | --         | --       | --       | --  | --                  | --               |
| 2 Users       | --             | --         | --       | --       | --  | --                  | --               |
| 5 Users       | --             | --         | --       | --       | --  | --                  | --               |
| 10 Users      | --             | --         | --       | --       | --  | --                  | --               |

## Capacity Interpretation: Website Visitors vs Simulation Users
- **Website Visitors**: Static frontend assets are hosted on Vercel CDN and scale independently of Render.
- **Active Quantum Users**: Simulation execution is CPU-bound on Render. An active user running 1 simulation every 30 seconds places ~0.033 RPS load.
```
