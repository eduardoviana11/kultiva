![Kultiva](docs/assets/kultiva-banner.jpeg)

# Kultiva

**Kultiva** application (NASA Space Apps Challenge): a decision-support system for smallholder farmers, combining NASA satellite data, agronomic databases, and AI for resilient crop rotation planning.

## Prerequisites

- **Backend:** Python 3.11+ (or Docker + Docker Compose)
- **Frontend:** Node.js 18+ and npm

---

## Initial Setup (`.env`)

In the project root, create your `.env` file from the example:

```bash
cp .env.example .env
```

> Without `GOOGLE_API_KEY` configured, the LLM agent uses local deterministic/mocked responses.

---

## Running the Backend

### Option 1: Using Docker Compose (recommended)

Starts the FastAPI service (`http://localhost:8000`) and PostgreSQL database (`5432`):

```bash
docker-compose up --build
```

### Option 2: Locally without Docker

1. Create and activate a virtual environment in the project root:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:

   ```bash
   pip install -r backend/requirements.txt
   ```

3. (Optional) Run database migrations, if applicable to your `DATABASE_URL`:

   ```bash
   alembic upgrade head
   ```

4. Start the FastAPI server with hot reload:

   ```bash
   uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
   ```

- API available at: `http://localhost:8000`
- Interactive API docs (Swagger): `http://localhost:8000/docs`

---

## Running the Frontend

1. Go to the `frontend/` folder and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the development server (Vite):

   ```bash
   npm run dev
   ```

- Application available at: `http://localhost:5173`
- By default, the frontend consumes the API at `http://localhost:8000/api/v1`. To point to another URL, set `VITE_API_BASE_URL` in `frontend/.env`.

To validate the production build and type checking (`tsc --noEmit && vite build`):

```bash
npm run build
```

---

## Documentation (MkDocs)

Project technical documentation uses **MkDocs Material**. To preview it locally with live reload:
https://eduardoviana11.github.io/kultiva/

```bash
pip install mkdocs-material
mkdocs serve
```

To validate the static documentation build:

```bash
mkdocs build --strict
```

## Members
- [Edson Gabriel](https://github.com/EdsonToppzera)
- [João Eduardo](https://github.com/eduardoviana11)
- [João Guilherme](https://github.com/gleao-dev)
- [Matheus Levi](https://github.com/matheuslevicarmo99)
- [Sérgio Henrique](https://github.com/lealsh-dev)
