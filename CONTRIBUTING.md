# Contributing

Contributions are welcome! We appreciate your help in making Ketrix an even better quantum computing education platform.

## Suggested Workflow

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run frontend lint
5. Run frontend build
6. Test the backend
7. Open a pull request

## Basic Development Commands

### Frontend

Navigate to the `frontend` directory and run:

```bash
npm install
npm run dev
npm run lint
npm run build
```

### Backend

Navigate to the `backend` directory and run:

```powershell
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

## What to Avoid Committing

Contributors should avoid committing the following items:
- `.env` files
- secrets
- API keys
- `node_modules`
- Python virtual environments
- `__pycache__`
- generated build artifacts
