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

    def test_h_then_x_q0(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='X', target=0)
            ],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        # Expect |+>
        val = 1.0 / math.sqrt(2)
        self.assertAlmostEqual(sv[0]['real'], val, places=5)
        self.assertAlmostEqual(sv[1]['real'], val, places=5)

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
        # Test distribution (stochastic, use tolerance)
        self.assertTrue(400 < result['measurement_counts']['0'] < 600)
        self.assertTrue(400 < result['measurement_counts']['1'] < 600)

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

    def test_cx_control_1(self):
        # Prepare control qubit q1 as |1>, target q0 as |0>.
        circuit = CircuitDefinition(
            num_qubits=2,
            operations=[
                QuantumOperation(gate='X', target=1),
                QuantumOperation(gate='CX', control=1, target=0)
            ],
            shots=1000,
            return_statevector=True
        )
        result = quantum_service.simulate_circuit(circuit)
        sv = result.get('statevector')
        self.assertIsNotNone(sv)
        # After X(1), state is |10> (q1=1, q0=0).
        # After CX(control=1, target=0), state becomes |11>.
        self.assertAlmostEqual(sv[3]['real'], 1.0, places=5)
        counts = result.get('measurement_counts')
        self.assertIn('11', counts)
        self.assertEqual(counts['11'], 1000)

    def test_deutsch_jozsa_constant(self):
        # DJ algorithm for constant f(x) = 1
        # Ancilla q2, Inputs q0, q1
        circuit = CircuitDefinition(
            num_qubits=3,
            operations=[
                QuantumOperation(gate='X', target=2),
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='H', target=2),
                # Constant Oracle f(x) = 1
                QuantumOperation(gate='X', target=2),
                # Interference
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
                # Measure
                QuantumOperation(gate='M', target=0),
                QuantumOperation(gate='M', target=1),
            ],
            shots=1000,
            return_statevector=False
        )
        result = quantum_service.simulate_circuit(circuit)
        counts = result.get('measurement_counts')
        # Expect '000' because inputs collapsed to 0, and ancilla wasn't measured (0).
        self.assertIn('000', counts)
        self.assertEqual(counts['000'], 1000)

    def test_deutsch_jozsa_balanced(self):
        # DJ algorithm for balanced f(x) = x_0 XOR x_1
        circuit = CircuitDefinition(
            num_qubits=3,
            operations=[
                QuantumOperation(gate='X', target=2),
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='H', target=2),
                # Balanced Oracle
                QuantumOperation(gate='CX', control=0, target=2),
                QuantumOperation(gate='CX', control=1, target=2),
                # Interference
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
                # Measure
                QuantumOperation(gate='M', target=0),
                QuantumOperation(gate='M', target=1),
            ],
            shots=1000,
            return_statevector=False
        )
        result = quantum_service.simulate_circuit(circuit)
        counts = result.get('measurement_counts')
        # Expect '011' because inputs collapsed to 11.
        self.assertIn('011', counts)
        self.assertEqual(counts['011'], 1000)

    def test_deutsch_jozsa_constant_0(self):
        # DJ algorithm for constant f(x) = 0
        circuit = CircuitDefinition(
            num_qubits=3,
            operations=[
                QuantumOperation(gate='X', target=2),
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='H', target=2),
                # Interference
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
                # Measure
                QuantumOperation(gate='M', target=0),
                QuantumOperation(gate='M', target=1),
            ],
            shots=1000,
            return_statevector=False
        )
        result = quantum_service.simulate_circuit(circuit)
        counts = result.get('measurement_counts')
        # Expect '000'
        self.assertIn('000', counts)
        self.assertEqual(counts['000'], 1000)

    def test_deutsch_jozsa_balanced_2(self):
        # DJ algorithm for balanced f(x) = NOT x_0 XOR x_1
        circuit = CircuitDefinition(
            num_qubits=3,
            operations=[
                QuantumOperation(gate='X', target=2),
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='H', target=2),
                # Balanced Oracle 2
                QuantumOperation(gate='X', target=0),
                QuantumOperation(gate='CX', control=0, target=2),
                QuantumOperation(gate='X', target=0),
                QuantumOperation(gate='CX', control=1, target=2),
                # Interference
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
                # Measure
                QuantumOperation(gate='M', target=0),
                QuantumOperation(gate='M', target=1),
            ],
            shots=1000,
            return_statevector=False
        )
        result = quantum_service.simulate_circuit(circuit)
        counts = result.get('measurement_counts')
        # Expect '011'
        self.assertIn('011', counts)
        self.assertEqual(counts['011'], 1000)

    def test_teleportation_fidelity(self):
        # Prepare q0 in |1> state, teleport to q2.
        # Bob measures q2. Since q0 was |1>, Bob should always measure 1.
        circuit = CircuitDefinition(
            num_qubits=3,
            operations=[
                # 1. State preparation (q0 = |1>)
                QuantumOperation(gate='X', target=0),
                
                # 2. Bell pair (q1, q2)
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='CX', control=1, target=2),
                
                # 3. Alice interaction
                QuantumOperation(gate='CX', control=0, target=1),
                QuantumOperation(gate='H', target=0),
                
                # 4. Measurement
                QuantumOperation(gate='M', target=0),
                QuantumOperation(gate='M', target=1),
                
                # 5. Bob Corrections
                QuantumOperation(gate='X', target=2, condition_bit=1, condition_val=1),
                QuantumOperation(gate='Z', target=2, condition_bit=0, condition_val=1),
                
                # 6. Verify (Invert prep if necessary; here it's just X, so we measure directly, or apply X and expect 0)
                # Let's apply X to uncompute, then measure.
                QuantumOperation(gate='X', target=2),
                QuantumOperation(gate='M', target=2)
            ],
            shots=1000,
            return_statevector=False
        )
        result = quantum_service.simulate_circuit(circuit)
        counts = result.get('measurement_counts')
        
        # We measured q2 into c2. After uncomputing |1> with X, q2 should be |0>.
        # So c2 is always 0. The classical strings are c2c1c0.
        # Thus, all keys in counts should start with '0'.
        for state in counts.keys():
            self.assertTrue(state.startswith('0'), f"Failed teleportation fidelity, got state {state}")

    def test_teleportation_all_states(self):
        # We will test |0>, |+>, |->
        states_prep = {
            '|0>': [],
            '|+>': [QuantumOperation(gate='H', target=0)],
            '|->': [QuantumOperation(gate='X', target=0), QuantumOperation(gate='H', target=0)]
        }
        states_inverse = {
            '|0>': [],
            '|+>': [QuantumOperation(gate='H', target=2)],
            '|->': [QuantumOperation(gate='H', target=2), QuantumOperation(gate='X', target=2)]
        }
        
        for name in states_prep:
            ops = []
            ops.extend(states_prep[name])
            ops.extend([
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='CX', control=1, target=2),
                QuantumOperation(gate='CX', control=0, target=1),
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='M', target=0),
                QuantumOperation(gate='M', target=1),
                QuantumOperation(gate='X', target=2, condition_bit=1, condition_val=1),
                QuantumOperation(gate='Z', target=2, condition_bit=0, condition_val=1)
            ])
            ops.extend(states_inverse[name])
            ops.append(QuantumOperation(gate='M', target=2))
            
            circuit = CircuitDefinition(num_qubits=3, operations=ops, shots=100, return_statevector=False)
            res = quantum_service.simulate_circuit(circuit)
            for state in res['measurement_counts'].keys():
                self.assertTrue(state.startswith('0'), f"Failed teleportation fidelity for {name}, got {state}")

    def test_grovers_search_n2(self):
        # 2 qubits, marked state is |10> (q1=1, q0=0).
        # We expect measurement to yield '10' 100% of the time.
        circuit = CircuitDefinition(
            num_qubits=2,
            operations=[
                # Init
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
                
                # Oracle for |10>
                # Flip phase of |10> (which means x_1=1, x_0=0)
                # Apply X to q0, then CZ, then X to q0
                QuantumOperation(gate='X', target=0),
                # CZ via H CX H
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='CX', control=0, target=1),
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='X', target=0),
                
                # Diffuser
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='X', target=0),
                QuantumOperation(gate='X', target=1),
                # CZ
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='CX', control=0, target=1),
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='X', target=0),
                QuantumOperation(gate='X', target=1),
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
            ],
            shots=1000,
            return_statevector=False
        )
        result = quantum_service.simulate_circuit(circuit)
        counts = result.get('measurement_counts')
        # Expect '10' 100%
        self.assertIn('10', counts)
        self.assertEqual(counts['10'], 1000)

    def test_grovers_search_all_states(self):
        # We will dynamically build the circuit for 00, 01, 11
        for state in ['00', '01', '11']:
            ops = [
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
            ]
            # Oracle
            if state[0] == '0': ops.append(QuantumOperation(gate='X', target=1))
            if state[1] == '0': ops.append(QuantumOperation(gate='X', target=0))
            ops.extend([
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='CX', control=0, target=1),
                QuantumOperation(gate='H', target=1),
            ])
            if state[1] == '0': ops.append(QuantumOperation(gate='X', target=0))
            if state[0] == '0': ops.append(QuantumOperation(gate='X', target=1))
            # Diffuser
            ops.extend([
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='X', target=0),
                QuantumOperation(gate='X', target=1),
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='CX', control=0, target=1),
                QuantumOperation(gate='H', target=1),
                QuantumOperation(gate='X', target=0),
                QuantumOperation(gate='X', target=1),
                QuantumOperation(gate='H', target=0),
                QuantumOperation(gate='H', target=1),
            ])
            circuit = CircuitDefinition(num_qubits=2, operations=ops, shots=100, return_statevector=False)
            res = quantum_service.simulate_circuit(circuit)
            self.assertIn(state, res['measurement_counts'])
            self.assertEqual(res['measurement_counts'][state], 100)

    def test_conditional_execution(self):
        # Prepare q0 in |1>. Measure q0 to c0.
        # Apply X to q1 if c0 == 1. Measure q1 to c1.
        # Expected: c1 c0 = 11.
        circuit = CircuitDefinition(
            num_qubits=2,
            operations=[
                QuantumOperation(gate='X', target=0),
                QuantumOperation(gate='M', target=0),
                QuantumOperation(gate='X', target=1, condition_bit=0, condition_val=1),
                QuantumOperation(gate='X', target=1, condition_bit=0, condition_val=0), # Should not execute
                QuantumOperation(gate='M', target=1)
            ],
            shots=1000,
            return_statevector=False
        )
        result = quantum_service.simulate_circuit(circuit)
        self.assertIn('11', result['measurement_counts'])
        self.assertEqual(result['measurement_counts']['11'], 1000)
        
        # Prepare q0 in |0>. Measure q0 to c0.
        # Apply X to q1 if c0 == 1. (Should not execute).
        # Expected: c1 c0 = 00.
        circuit2 = CircuitDefinition(
            num_qubits=2,
            operations=[
                QuantumOperation(gate='M', target=0),
                QuantumOperation(gate='X', target=1, condition_bit=0, condition_val=1),
                QuantumOperation(gate='M', target=1)
            ],
            shots=1000,
            return_statevector=False
        )
        result2 = quantum_service.simulate_circuit(circuit2)
        self.assertIn('00', result2['measurement_counts'])
        self.assertEqual(result2['measurement_counts']['00'], 1000)

    def test_conditional_execution_invalid_bit(self):
        # We only have 2 classical bits (0 and 1). Condition on bit 2 should fail.
        circuit = CircuitDefinition(
            num_qubits=2,
            operations=[
                QuantumOperation(gate='X', target=1, condition_bit=2, condition_val=1)
            ],
            shots=10,
            return_statevector=False
        )
        with self.assertRaises(IndexError):
            quantum_service.simulate_circuit(circuit)


    def test_invalid_qubit_index(self):
        from pydantic import ValidationError
        with self.assertRaises(ValidationError):
            CircuitDefinition(
                num_qubits=1,
                operations=[QuantumOperation(gate='H', target=1)],
                shots=1000,
                return_statevector=True
            )

    def test_unsupported_gate(self):
        circuit = CircuitDefinition(
            num_qubits=1,
            operations=[QuantumOperation(gate='MAGIC', target=0)],
            shots=1000
        )
        with self.assertRaises(ValueError):
            quantum_service.simulate_circuit(circuit)

    def test_invalid_shots(self):
        from pydantic import ValidationError
        with self.assertRaises(ValidationError):
            CircuitDefinition(
                num_qubits=1,
                operations=[],
                shots=0,
                return_statevector=True
            )
        with self.assertRaises(ValidationError):
            CircuitDefinition(
                num_qubits=1,
                operations=[],
                shots=20000,
                return_statevector=True
            )

if __name__ == '__main__':
    unittest.main()
