import unittest
from fastapi import HTTPException
from app.main import app, health_check, health_check_v1, root
from app.api.quantum_routes import simulate_quantum_circuit
from app.schemas.quantum import CircuitDefinition, QuantumOperation

class TestQuantumAPI(unittest.TestCase):
    def test_health_endpoints(self):
        res = health_check()
        self.assertEqual(res["status"], "ok")
        res_v1 = health_check_v1()
        self.assertEqual(res_v1["status"], "ok")
        res_root = root()
        self.assertEqual(res_root["status"], "ok")

    def test_routes_registered(self):
        paths = list(app.openapi()['paths'].keys())
        self.assertIn("/health", paths)
        self.assertIn("/api/v1/health", paths)
        self.assertIn("/api/v1/quantum/simulate", paths)
        self.assertIn("/quantum/simulate", paths)

    def test_simulate_valid(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate="H", target=0)],
            shots=100
        )
        result = simulate_quantum_circuit(circuit)
        self.assertIn("measurement_counts", result)

    def test_simulate_invalid_gate_value_error(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate="M", target=0)],
            shots=100,
            return_statevector=True
        )
        with self.assertRaises(HTTPException) as context:
            simulate_quantum_circuit(circuit)
        self.assertEqual(context.exception.status_code, 400)
        self.assertIn("incompatible", context.exception.detail)

    def test_simulate_invalid_condition_bit_index_error(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate="X", target=0, condition_bit=5, condition_val=1)],
            shots=100
        )
        with self.assertRaises(HTTPException) as context:
            simulate_quantum_circuit(circuit)
        self.assertEqual(context.exception.status_code, 400)

    def test_circuit_schema_validation_out_of_bounds(self):
        with self.assertRaises(ValueError):
            CircuitDefinition(
                num_qubits=2,
                operations=[QuantumOperation(gate="X", target=5)],
                shots=100
            )

    def test_circuit_schema_cx_same_target_control(self):
        with self.assertRaises(ValueError):
            QuantumOperation(gate="CX", target=0, control=0)

if __name__ == '__main__':
    unittest.main()
