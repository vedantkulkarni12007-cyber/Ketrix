import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const simulateCircuit = async (circuitDefinition) => {
  console.log("SENDING CIRCUIT DEF:", JSON.stringify(circuitDefinition, null, 2));
  try {
    const response = await axios.post(`${API_BASE_URL}/quantum/simulate`, circuitDefinition);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || error.message;
  }
};
