# Ketrix

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Ketrix: Think Beyond Classical. An interactive quantum computing platform for learning quantum concepts, building circuits, running Qiskit simulations, and exploring quantum algorithms.

---

## Open Source

Ketrix is an open-source quantum computing education platform designed for learning quantum computing through interactive lessons and real local quantum simulation.

The project is licensed under the MIT License.

Contributions, educational use, experimentation, and derivative works are welcome subject to the terms of the license. 
*(Note: Third-party dependencies such as React, FastAPI, Qiskit, and Qiskit Aer retain their respective original licenses).*

---

## Architecture

```text
React + Vite Frontend
        ↓
     REST API
        ↓
 FastAPI Backend
        ↓
Qiskit Aer Simulator
        ↓
Local CPU Quantum Simulation
```

### Layer Roles
- **React + Vite Frontend**: Renders the dark sci-fi quantum terminal interface, manages client-side routing and interactive lesson workflows, and presents dynamic quantum-state visualizations and measurement results.
- **REST API**: Serves as the structured HTTP interface (`POST /api/v1/quantum/simulate`) facilitating decoupled communication between the client interface and backend quantum services.
- **FastAPI Backend**: Ingests circuit payloads, enforces strict Pydantic input validation (qubit bounds, shot limits, control/target relationships), constructs circuits, and handles errors with appropriate HTTP status codes.
- **Qiskit Aer Simulator**: High-performance quantum simulator (`AerSimulator`) executing circuit operations, injecting auto-measurement when needed, and producing shot distributions.
- **Local CPU Quantum Simulation**: Executes quantum state evolution and measurement sampling directly on local CPU compute threads, eliminating external cloud quantum hardware latency.

---

## Project Status

The project is currently in **Early Alpha**.

### Implemented Features
- **React + Vite frontend**: Modular single-page application built with modern React 19 and Vite.
- **FastAPI backend**: High-performance asynchronous Python API service.
- **Qiskit Aer quantum simulation engine**: Local CPU-based quantum execution via `AerSimulator`.
- **REST API for quantum circuit simulation**: Validated `POST /api/v1/quantum/simulate` endpoint.
- **Automatic quantum circuit measurement**: Automatically appends measurement operations to all qubits if not explicitly defined.
- **Interactive lesson architecture**: Modular framework featuring `LessonLayout`, `LessonSection`, `ConceptPanel`, `SimulationRunner`, `StateVisualizer`, and `Quiz`.
- **EXP-01 — Classical vs Quantum**: Hands-on lesson comparing classical deterministic bits with quantum superposition.
- **EXP-02 — What is a Qubit**: Interactive lesson exploring single-qubit states, probability amplitudes, and measurement.
- **Dynamic measurement-result visualization**: Flexible multi-qubit histogram rendering supporting arbitrary computational basis state bitstrings.
- **Quantum-state visualization**: Data-driven state viewer component supporting $|0\rangle$, $|1\rangle$, $|+\rangle$, and extensible basis states.
- **Backend input validation and simulation limits**: Pydantic schema validation restricting circuits to 1–10 qubits, 1–10,000 shots, and validating control/target gate constraints.
- **Frontend environment configuration**: Configurable API endpoints via `VITE_API_BASE_URL` with `.env.example` template.
- **ESLint and production build configuration**: Clean ESLint configuration with zero errors and verified production Vite builds.

---

## Completed Curriculum (Phase 2)

The interactive quantum curriculum is now fully complete across three foundational stages:

### Stage 1: Single-Qubit Foundations & Elementary Gates
- **EXP-03** — Superposition
- **EXP-04** — Measurement
- **EXP-05** — X Gate
- **EXP-06** — Y Gate
- **EXP-07** — Z Gate
- **EXP-08** — Hadamard Gate

### Stage 2: Multi-Qubit Systems & Entanglement
- **EXP-09** — CNOT Gate
- **EXP-10** — Multiple Qubits
- **EXP-11** — Quantum Entanglement
- **EXP-12** — Bell States

### Stage 3: Quantum Algorithms & Protocols
- **EXP-13** — Deutsch-Jozsa Algorithm
- **EXP-14** — Grover's Algorithm
- **EXP-15** — Quantum Teleportation

---

## Future Roadmap

- [ ] Complete interactive curriculum
- [ ] Drag-and-drop quantum circuit laboratory
- [ ] Code-based quantum challenges
- [ ] Automated challenge verification
- [ ] Learning progress tracking
- [ ] Student dashboard and analytics
- [ ] Expanded quantum visualization
- [ ] Authentication and persistent user data

---

## Technology Stack

### Frontend
- **React** (v19) — Component-based UI library
- **Vite** — Build tool and development server
- **JavaScript** (ESNext) — Client application logic
- **Axios** — HTTP client for REST API communication
- **CSS** — Custom dark sci-fi design system using Vanilla CSS

### Backend & Simulation
- **FastAPI** — Modern Python web framework for REST APIs
- **Python** (3.13) — Core backend programming language
- **Pydantic** (v2) — Data validation and schema enforcement
- **Qiskit** (2.5) — Quantum computing SDK
- **Qiskit Aer** (0.17) — Quantum circuit simulator backend

---

## Getting Started

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate your virtual environment and install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. (Optional) Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
