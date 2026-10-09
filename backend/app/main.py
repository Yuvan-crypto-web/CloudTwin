import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .analyzer import analyze, summarize
from .simulator import run_simulation
from .gcp_discovery import discover, gcp_enabled

app = FastAPI(title="CloudTwin API", version="0.1.0",
              description="Local cloud risk simulation with optional read-only Google Cloud discovery.")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False, allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

DEMO = {
    "buckets": [
        {"id": "bucket-research", "name": "research-documents-demo", "location": "us-central1",
         "public_principals": ["allUsers"], "sensitivity": "high", "source": "demo"},
        {"id": "bucket-backups", "name": "internal-backups-demo", "location": "us-central1",
         "public_principals": [], "sensitivity": "high", "source": "demo"},
    ],
    "vpcs": [
        {"id": "vpc-prod", "name": "production-vpc-demo", "source": "demo"},
        {"id": "vpc-dev", "name": "development-vpc-demo", "source": "demo"},
    ],
    "subnets": [
        {"id": "subnet-app", "name": "private-app-subnet-demo", "network": "production-vpc-demo", "source": "demo"},
        {"id": "subnet-data", "name": "private-data-subnet-demo", "network": "production-vpc-demo", "source": "demo"},
    ],
    "firewalls": [
        {"id": "fw-ssh", "name": "allow-ssh-from-anywhere-demo", "source_ranges": ["0.0.0.0/0"], "ports": ["22"], "network": "production-vpc-demo", "source": "demo"},
        {"id": "fw-web", "name": "allow-https-demo", "source_ranges": ["0.0.0.0/0"], "ports": ["443"], "network": "production-vpc-demo", "source": "demo"},
    ],
}

def payload(resources, source, project_id=None):
    findings = analyze(resources)
    flat = resources.get("buckets", []) + resources.get("vpcs", []) + resources.get("subnets", []) + resources.get("firewalls", [])
    return {"source": source, "project_id": project_id, "resources": flat,
            "findings": findings, "summary": summarize(resources, findings)}

class SimulationRequest(BaseModel):
    scenario: str = "combined"

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "cloudtwin-api"}

@app.get("/api/dashboard")
def dashboard():
    return payload(DEMO, "simulated")

@app.post("/api/simulate")
def simulate(request: SimulationRequest):
    try:
        return run_simulation(DEMO, request.scenario)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

@app.get("/api/gcp/status")
def gcp_status():
    project = os.getenv("CLOUDTWIN_GCP_PROJECT")
    return {"enabled": gcp_enabled(), "project_configured": bool(project),
            "project_id": project if gcp_enabled() else None,
            "mode": "read-only metadata discovery" if gcp_enabled() else "disabled"}

@app.get("/api/gcp/discover")
def gcp_discover():
    if not gcp_enabled():
        raise HTTPException(status_code=403, detail="GCP discovery is disabled. Explicitly enable it in the backend environment.")
    project = os.getenv("CLOUDTWIN_GCP_PROJECT", "").strip()
    if not project:
        raise HTTPException(status_code=400, detail="Set CLOUDTWIN_GCP_PROJECT to your project ID.")
    try:
        resources = discover(project)
        result = payload(resources, "google-cloud-read-only", project)
        result["discovery_note"] = resources.get("discovery_note")
        return result
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Google Cloud discovery failed: {type(exc).__name__}: {exc}") from exc
