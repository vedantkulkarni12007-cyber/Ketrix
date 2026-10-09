import unittest
import math
from app.schemas.quantum import CircuitDefinition, QuantumOperation
from app.quantum.service import quantum_service

class TestQuantumStatevector(unittest.TestCase):

    def test_empty_1_qubit_circuit(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        self.assertEqual(len(sv), 2)
        # Expect |0>
        self.assertAlmostEqual(sv[0]['real'], 1.0, places=5)
        self.assertAlmostEqual(sv[0]['imag'], 0.0, places=5)
        self.assertAlmostEqual(sv[1]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[1]['imag'], 0.0, places=5)

    def test_x_q0(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate='X', target=0)],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        # Expect |1>
        self.assertAlmostEqual(sv[0]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[1]['real'], 1.0, places=5)

    def test_h_q0(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate='H', target=0)],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        val = 1.0 / math.sqrt(2)
        # Expect |+>
        self.assertAlmostEqual(sv[0]['real'], val, places=5)
        self.assertAlmostEqual(sv[1]['real'], val, places=5)

    def test_h_then_h_q0(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=0)
            ],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        # Expect |0>
        self.assertAlmostEqual(sv[0]['real'], 1.0, places=5)
        self.assertAlmostEqual(sv[1]['real'], 0.0, places=5)

    def test_y_q0(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate='Y', target=0)],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        # Expect i|1>
        self.assertAlmostEqual(sv[0]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[0]['imag'], 0.0, places=5)
        self.assertAlmostEqual(sv[1]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[1]['imag'], 1.0, places=5)

    def test_z_q0(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate='Z', target=0)],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        # Expect |0> (Z|0> = |0>)
        self.assertAlmostEqual(sv[0]['real'], 1.0, places=5)
        self.assertAlmostEqual(sv[0]['imag'], 0.0, places=5)
        self.assertAlmostEqual(sv[1]['real'], 0.0, places=5)

    def test_bell_state(self):
        circuit = CircuitDefinition(
            num_qubits=2,
            operations=[
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='CX', control=0, target=1)
            ],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        self.assertEqual(len(sv), 4)
        val = 1.0 / math.sqrt(2)
        # Expect |00> and |11>
        # sv[0] is |00>, sv[3] is |11>
        self.assertAlmostEqual(sv[0]['real'], val, places=5)
        self.assertAlmostEqual(sv[1]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[2]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[3]['real'], val, places=5)

    def test_measurement_counts_behavior(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate='H', target=0)],
            shots=1000,
            return_statevector=False
        )
        result = quantum_service.simulate_circuit(circuit)
        self.assertNotIn('statevector', result)
        self.assertIsNotNone(result.get('measurement_counts'))
        self.assertIn('0', result['measurement_counts'])
        self.assertIn('1', result['measurement_counts'])
        total = result['measurement_counts']['0'] + result['measurement_counts']['1']
        self.assertEqual(total, 1000)

    def test_explicit_measurement_rejection(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate='M', target=0)],
            shots=1000,
            return_statevector=True
        )
        with self.assertRaises(ValueError) as context:
            quantum_service.simulate_circuit(circuit)
        self.assertIn("incompatible with statevector extraction", str(context.exception))

    def test_cx_behavior(self):
        # Prepare control qubit |1> using X, apply CX
        # q0 is control, q1 is target
        circuit = CircuitDefinition(
            num_qubits=2,
            operations=[
                QuantumOperation(gate='X', target=0),
                QuantumOperation(gate='CX', control=0, target=1)
            ],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        
        # After X(0), state is |01> (q1=0, q0=1).
        # After CX(control=0, target=1), state becomes |11> (q1=1, q0=1).
        # In Qiskit, |11> is index 3.
        self.assertAlmostEqual(sv[0]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[1]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[2]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[3]['real'], 1.0, places=5)
        
        # Check measurement counts too
        counts = result.get('measurement_counts')
        self.assertIn('11', counts)
        self.assertEqual(counts['11'], 1000)

if __name__ == '__main__':
    unittest.main()
