import unittest
import math
from app.schemas.quantum import CircuitDefinition, QuantumOperation
from app.quantum.service import quantum_service

class TestQuantumChallenges(unittest.TestCase):
    """
    Tests simulation outputs for all four Ketrix State Preparation challenges:
    - Challenge 01: |1⟩ from |0⟩ (X on Q0)
    - Challenge 02: |+⟩ superposition (H on Q0)
    - Challenge 03: |−⟩ phase-encoded state (X then H, or H then Z)
    - Challenge 04: |Φ+⟩ Bell state (H on Q0, CX ctrl=0 tgt=1)
    """

    def test_challenge_01_state_one_preparation(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate='X', target=0)],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        self.assertEqual(len(sv), 2)
        # Expected |1>: index 0 is 0, index 1 is 1
        self.assertAlmostEqual(sv[0]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[0]['imag'], 0.0, places=5)
        self.assertAlmostEqual(sv[1]['real'], 1.0, places=5)
        self.assertAlmostEqual(sv[1]['imag'], 0.0, places=5)

        # 100% measurement outcome '1'
        counts = result.get('measurement_counts', {})
        self.assertEqual(counts.get('1'), 1000)
        self.assertEqual(counts.get('0', 0), 0)

    def test_challenge_02_superposition_plus_preparation(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate='H', target=0)],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        inv_sqrt2 = 1.0 / math.sqrt(2)
        # Expected |+>: index 0 is 1/sqrt(2), index 1 is 1/sqrt(2)
        self.assertAlmostEqual(sv[0]['real'], inv_sqrt2, places=5)
        self.assertAlmostEqual(sv[0]['imag'], 0.0, places=5)
        self.assertAlmostEqual(sv[1]['real'], inv_sqrt2, places=5)
        self.assertAlmostEqual(sv[1]['imag'], 0.0, places=5)

        # ~50/50 measurement distribution
        counts = result.get('measurement_counts', {})
        self.assertTrue(380 <= counts.get('0', 0) <= 620)
        self.assertTrue(380 <= counts.get('1', 0) <= 620)
        self.assertEqual(counts.get('0', 0) + counts.get('1', 0), 1000)

    def test_challenge_03_state_minus_preparation(self):
        # Solution: X then H on Q0
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[
                QuantumOperation(gate='X', target=0),
                QuantumOperation(gate='H', target=0)
            ],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        inv_sqrt2 = 1.0 / math.sqrt(2)
        # Expected |−>: index 0 is 1/sqrt(2), index 1 is -1/sqrt(2)
        self.assertAlmostEqual(sv[0]['real'], inv_sqrt2, places=5)
        self.assertAlmostEqual(sv[0]['imag'], 0.0, places=5)
        self.assertAlmostEqual(sv[1]['real'], -inv_sqrt2, places=5)
        self.assertAlmostEqual(sv[1]['imag'], 0.0, places=5)

        # Equivalent solution: H then Z on Q0
        circuit_equiv = CircuitDefinition(
            num_qubits=1,
            operations=[
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='Z', target=0)
            ],
            shots=1000,
            return_statevector=True
        )
        result_equiv = quantum_service.simulate_circuit(circuit_equiv)
        sv_equiv = result_equiv.get('statevector')
        self.assertAlmostEqual(sv_equiv[0]['real'], inv_sqrt2, places=5)
        self.assertAlmostEqual(sv_equiv[1]['real'], -inv_sqrt2, places=5)

    def test_plus_versus_minus_distinction(self):
        # Verify that |+> and |-> have identical measurement statistics
        # but opposite amplitudes, demonstrating why statevector check is mandatory
        res_plus = quantum_service.simulate_circuit(CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate='H', target=0)],
            shots=1000,
            return_statevector=True
        ))
        res_minus = quantum_service.simulate_circuit(CircuitDefinition(
            num_qubits=1,
            operations=[
                QuantumOperation(gate='X', target=0),
                QuantumOperation(gate='H', target=0)
            ],
            shots=1000,
            return_statevector=True
        ))

        # Both have ~50% 0 and ~50% 1
        self.assertTrue(380 <= res_plus['measurement_counts']['0'] <= 620)
        self.assertTrue(380 <= res_minus['measurement_counts']['0'] <= 620)

        # But statevectors are orthogonal!
        sv_plus = res_plus['statevector']
        sv_minus = res_minus['statevector']
        inner_product = (sv_plus[0]['real'] * sv_minus[0]['real'] +
                         sv_plus[1]['real'] * sv_minus[1]['real'])
        self.assertAlmostEqual(inner_product, 0.0, places=5)

    def test_challenge_04_bell_state_preparation(self):
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

        inv_sqrt2 = 1.0 / math.sqrt(2)
        # Expected |Φ+> = (|00> + |11>) / sqrt(2)
        # In Qiskit, index 0 is |00>, index 3 is |11>
        self.assertAlmostEqual(sv[0]['real'], inv_sqrt2, places=5)
        self.assertAlmostEqual(sv[1]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[2]['real'], 0.0, places=5)
        self.assertAlmostEqual(sv[3]['real'], inv_sqrt2, places=5)

        # Correlated measurement outcomes ('00' and '11')
        counts = result.get('measurement_counts', {})
        self.assertEqual(counts.get('01', 0), 0)
        self.assertEqual(counts.get('10', 0), 0)
        self.assertTrue(counts.get('00', 0) > 400)
        self.assertTrue(counts.get('11', 0) > 400)
        self.assertEqual(counts.get('00', 0) + counts.get('11', 0), 1000)

    def test_challenge_04_incorrect_gate_ordering(self):
        # CX before H should NOT create Bell state
        circuit = CircuitDefinition(
            num_qubits=2,
            operations=[
                QuantumOperation(gate='CX', control=0, target=1),
                QuantumOperation(gate='H', target=0)
            ],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        inv_sqrt2 = 1.0 / math.sqrt(2)
        # Control qubit Q0 was 0 during CX, so CX was identity
        # Then H on Q0 puts Q0 in |+>, Q1 remains |0>
        # Little-endian |q1 q0>: |00> has amplitude 1/sqrt(2), |01> has amplitude 1/sqrt(2)
        self.assertAlmostEqual(sv[0]['real'], inv_sqrt2, places=5)
        self.assertAlmostEqual(sv[1]['real'], inv_sqrt2, places=5)
        self.assertAlmostEqual(sv[3]['real'], 0.0, places=5)

if __name__ == '__main__':
    unittest.main()
