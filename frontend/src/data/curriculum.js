export const curriculumData = [
  {
    category: "Foundations",
    lessons: [
      { expId: 1, id: "classical-vs-quantum", title: "Classical vs Quantum Computing", description: "Understand the fundamental differences.", difficulty: "Beginner" },
      { expId: 2, id: "what-is-a-qubit", title: "What is a Qubit?", description: "Introduction to quantum bits.", difficulty: "Beginner" },
      { expId: 3, id: "superposition", title: "Superposition", description: "How a qubit can be in multiple states at once.", difficulty: "Beginner" },
      { expId: 4, id: "measurement", title: "Measurement", description: "What happens when you look at a quantum state.", difficulty: "Beginner" }
    ]
  },
  {
    category: "Quantum Gates",
    lessons: [
      { expId: 5, id: "x-gate", title: "X Gate", description: "The quantum NOT gate.", difficulty: "Beginner" },
      { expId: 6, id: "y-gate", title: "Y Gate", description: "Rotation around the Y-axis.", difficulty: "Beginner" },
      { expId: 7, id: "z-gate", title: "Z Gate", description: "Phase flip gate.", difficulty: "Beginner" },
      { expId: 8, id: "hadamard-gate", title: "Hadamard Gate", description: "Creating superposition.", difficulty: "Beginner" },
      { expId: 9, id: "cnot-gate", title: "Controlled-X / CNOT", description: "A conditional gate acting on two qubits.", difficulty: "Intermediate" }
    ]
  },
  {
    category: "Multi-Qubit Concepts",
    lessons: [
      { expId: 10, id: "multiple-qubits", title: "Multiple Qubits", description: "Working with systems of many qubits.", difficulty: "Intermediate" },
      { expId: 11, id: "entanglement", title: "Entanglement", description: "Spooky action at a distance.", difficulty: "Intermediate" },
      { expId: 12, id: "bell-states", title: "Bell States", description: "Maximally entangled quantum states.", difficulty: "Intermediate" }
    ]
  },
  {
    category: "Quantum Algorithms",
    lessons: [
      { expId: 13, id: "deutsch-jozsa", title: "Deutsch-Jozsa Algorithm", description: "Solving a specific problem exponentially faster.", difficulty: "Advanced" },
      { expId: 14, id: "grovers", title: "Grover's Algorithm", description: "Quantum database search.", difficulty: "Advanced" },
      { expId: 15, id: "teleportation", title: "Quantum Teleportation", description: "Transferring quantum information.", difficulty: "Advanced" }
    ]
  }
];
