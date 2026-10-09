from fastapi import APIRouter, HTTPException
from app.schemas.quantum import CircuitDefinition, SimulationResult
from app.quantum.service import quantum_service

router = APIRouter()

@router.post("/simulate", response_model=SimulationResult)
def simulate_quantum_circuit(circuit: CircuitDefinition):
    print(f"RECEIVED CIRCUIT: {circuit}")
    try:
        result = quantum_service.simulate_circuit(circuit)
        return result
    except (ValueError, IndexError) as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")
