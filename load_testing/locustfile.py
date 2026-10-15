"""
Locustfile for Ketrix Quantum Simulation API Load Testing.

Tests realistic workloads against the FastAPI + Qiskit Aer backend:
1. One-qubit H-gate circuit, 100 shots
2. Two-qubit Bell-state circuit (H on Q0, CX ctrl=0 tgt=1), 100 shots
3. Lightweight Health Check (/health)
"""

from locust import HttpUser, task, between, tag
import json

class KetrixSimulationUser(HttpUser):
    # Pacing: 1 to 2 seconds wait between simulated actions per user
    wait_time = between(1.0, 2.0)

    def on_start(self):
        """Initial user setup / pre-flight health ping."""
        self.client.get("/health", name="00_health_preflight", timeout=10.0)

    @tag('1qubit_h')
    @task(3)
    def simulate_one_qubit_h(self):
        """Workload 1: 1-qubit H-gate circuit with 100 shots."""
        payload = {
            "num_qubits": 1,
            "operations": [
                {"gate": "H", "target": 0}
            ],
            "shots": 100,
            "return_statevector": False
        }
        headers = {"Content-Type": "application/json"}
        with self.client.post(
            "/api/v1/quantum/simulate",
            json=payload,
            headers=headers,
            name="01_simulate_1q_h100",
            catch_response=True,
            timeout=30.0
        ) as response:
            if response.status_code == 200:
                data = response.json()
                if "measurement_counts" in data:
                    response.success()
                else:
                    response.failure(f"Missing measurement counts in response: {response.text[:100]}")
            else:
                response.failure(f"Status {response.status_code}: {response.text[:100]}")

    @tag('2qubit_bell')
    @task(2)
    def simulate_two_qubit_bell(self):
        """Workload 2: 2-qubit Bell circuit (H on Q0, CX on 0->1) with 100 shots."""
        payload = {
            "num_qubits": 2,
            "operations": [
                {"gate": "H", "target": 0},
                {"gate": "CX", "control": 0, "target": 1}
            ],
            "shots": 100,
            "return_statevector": False
        }
        headers = {"Content-Type": "application/json"}
        with self.client.post(
            "/api/v1/quantum/simulate",
            json=payload,
            headers=headers,
            name="02_simulate_2q_bell100",
            catch_response=True,
            timeout=30.0
        ) as response:
            if response.status_code == 200:
                data = response.json()
                if "measurement_counts" in data:
                    response.success()
                else:
                    response.failure(f"Missing measurement counts in response: {response.text[:100]}")
            else:
                response.failure(f"Status {response.status_code}: {response.text[:100]}")

    @tag('health')
    @task(1)
    def health_check(self):
        """Periodic background health ping."""
        self.client.get("/health", name="03_health_check", timeout=10.0)
