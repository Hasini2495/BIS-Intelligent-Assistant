# BIS Intelligent Assistant Backend

## Setup
1. Ensure Python 3.11+ is installed.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` (or configure via environment variables).
4. Run the server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
