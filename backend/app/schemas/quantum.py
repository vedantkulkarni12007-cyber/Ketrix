from pydantic import BaseModel, Field, model_validator
from typing import List, Dict, Union, Optional, Any

class QuantumOperation(BaseModel):
    gate: str = Field(..., description="The gate to apply, e.g., 'H', 'X', 'Y', 'Z', 'CX', 'M'")
    target: int = Field(..., ge=0, description="Target qubit index")
    control: Optional[int] = Field(None, ge=0, description="Control qubit index, required for 2-qubit gates like 'CX'")
    condition_bit: Optional[int] = Field(None, ge=0, description="Classical bit index to condition on")
    condition_val: Optional[int] = Field(None, description="Value of the classical bit to match (0 or 1)")

    @model_validator(mode='after')
    def check_gate_requirements(self):
        gate_upper = self.gate.upper()
        if gate_upper == 'CX':
            if self.control is None:
                raise ValueError("CX gate requires a control qubit")
            if self.control == self.target:
                raise ValueError("Control and target qubits must be different")
        else:
            if self.control is not None:
                raise ValueError(f"Gate {gate_upper} does not take a control qubit")
        return self

class CircuitDefinition(BaseModel):
    num_qubits: int = Field(..., ge=1, le=10, description="Number of qubits in the circuit")
    operations: List[QuantumOperation] = Field(..., description="List of operations to apply")
    shots: int = Field(1024, ge=1, le=10000, description="Number of shots for the simulation")
    return_statevector: bool = Field(False, description="Whether to extract and return the pre-measurement statevector")

    @model_validator(mode='after')
    def check_qubit_indices(self):
        for op in self.operations:
            if op.target >= self.num_qubits:
                raise ValueError(f"Target qubit index {op.target} is out of bounds for {self.num_qubits} qubits")
            if op.control is not None and op.control >= self.num_qubits:
                raise ValueError(f"Control qubit index {op.control} is out of bounds for {self.num_qubits} qubits")
        return self

class SimulationResult(BaseModel):
    num_qubits: int
    operations: List[Dict[str, Any]]
    measurement_counts: Dict[str, int]
    statevector: Optional[List[Dict[str, float]]] = None
    metadata: Dict[str, Any]
