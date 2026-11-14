
# Akash Garments Management System

A Flask application for garment production tracking. The interface is rendered with Jinja templates and standalone CSS; no Node.js toolchain is required.

## Run locally

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000 in a browser.

## Run tests

```powershell
python -m unittest discover -s tests -v
```

## Demo account

- Email: `admin@akashgarments.com`
- Password: `admin123`

Other seeded accounts are available in `app.py`. Operational data is held in memory and resets when the server restarts. Set `FLASK_SECRET_KEY` to a private random value before deploying; the default is intended only for local development.
  