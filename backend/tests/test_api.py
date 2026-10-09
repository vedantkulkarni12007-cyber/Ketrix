import unittest
from fastapi import HTTPException
from app.api.quantum_routes import simulate_quantum_circuit
from app.schemas.quantum import CircuitDefinition, QuantumOperation

class TestQuantumAPI(unittest.TestCase):
    def test_simulate_valid(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate="H", target=0)],
            shots=100
        )
        result = simulate_quantum_circuit(circuit)
        self.assertIn("measurement_counts", result)

    def test_simulate_invalid_gate_value_error(self):
        # We simulate the validation bypass by directly testing the service if needed,
        # but pydantic schema already blocks invalid gates. Let's trigger a ValueError manually.
        # "M" with return_statevector=True causes a ValueError in the service.
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

if __name__ == '__main__':
    unittest.main()
