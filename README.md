# CloudTwin — Google Cloud security digital twin (starter)

Local simulation first; optional read-only Google Cloud discovery later.

## Requirements
- Python 3.11+
- Node.js 20+
- Recommended: VS Code

## Run locally

Terminal 1:
```bash
cd cloudtwin/backend
python -m venv .venv
```
Activate:
- Windows PowerShell: `.\.venv\Scripts\Activate.ps1`
- macOS/Linux: `source .venv/bin/activate`

Then:
```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API docs: http://127.0.0.1:8000/docs

Terminal 2:
```bash
cd cloudtwin/frontend
npm install
npm run dev
```
Open http://localhost:5173.

## Optional Google Cloud discovery

1. Create a project at https://console.cloud.google.com/ and note its project ID.
2. Enable Cloud Storage API and Compute Engine API.
3. Install the Google Cloud CLI: https://cloud.google.com/sdk/docs/install
4. Authenticate with Application Default Credentials:
   `gcloud auth application-default login`
5. Install optional libraries in the backend venv:
   `pip install -r requirements-gcp.txt`
6. Explicitly enable read-only discovery in the same terminal as the backend.

Windows PowerShell:
```powershell
$env:CLOUDTWIN_ENABLE_GCP="true"
$env:CLOUDTWIN_GCP_PROJECT="YOUR_PROJECT_ID"
uvicorn app.main:app --reload
```
macOS/Linux:
```bash
export CLOUDTWIN_ENABLE_GCP=true
export CLOUDTWIN_GCP_PROJECT=YOUR_PROJECT_ID
uvicorn app.main:app --reload
```

Use a dedicated identity with only these permissions, preferably through a custom role:
- `storage.buckets.list`
- `storage.buckets.getIamPolicy`
- `compute.networks.list`
- `compute.subnetworks.list`
- `compute.firewalls.list`

Do not use Owner/Editor roles or download service-account keys for this prototype. Some organizations may restrict IAM policy reads.

## Safety
- Discovery is disabled by default.
- GCP discovery only lists bucket metadata, reads bucket IAM policy, and lists VPC/subnet/firewall metadata.
- It does not list or read bucket objects and contains no cloud create/update/delete or policy mutation calls.
- Simulation operates on a copy of the demo dataset, never on real GCP resources.
- Findings are heuristic signals, not proof of exploitability.
- This prototype is not a production security control.

## API
- `GET /api/health`
- `GET /api/dashboard`
- `POST /api/simulate` with `{"scenario":"combined"}`
- `GET /api/gcp/status`
- `GET /api/gcp/discover` (only when explicitly enabled)

## Structure
```text
cloudtwin/
  backend/app/main.py
  backend/app/analyzer.py
  backend/app/simulator.py
  backend/app/gcp_discovery.py
  backend/requirements.txt
  backend/requirements-gcp.txt
  frontend/src/App.jsx
  frontend/src/main.jsx
  frontend/src/styles.css
  frontend/package.json
  frontend/vite.config.js
```
