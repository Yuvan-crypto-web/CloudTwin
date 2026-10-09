from copy import deepcopy
from .analyzer import analyze, summarize

SCENARIOS = {
    "restrict_public_bucket": "Hypothetically remove public IAM principals from modeled buckets.",
    "restrict_open_firewall": "Hypothetically restrict internet-wide firewall source ranges.",
    "combined": "Hypothetically harden both bucket IAM and firewall rules.",
    "no_change": "Analyze the unchanged demo model."
}

def run_simulation(resources, scenario):
    if scenario not in SCENARIOS:
        raise ValueError("Unknown scenario. Choose: " + ", ".join(SCENARIOS))
    before_model = deepcopy(resources)
    after_model = deepcopy(resources)
    before = analyze(before_model)

    if scenario in {"restrict_public_bucket", "combined"}:
        for bucket in after_model.get("buckets", []):
            bucket["public_principals"] = [
                p for p in bucket.get("public_principals", [])
                if p not in {"allUsers", "allAuthenticatedUsers"}
            ]
    if scenario in {"restrict_open_firewall", "combined"}:
        for fw in after_model.get("firewalls", []):
            if set(fw.get("source_ranges", [])) & {"0.0.0.0/0", "::/0"}:
                fw["source_ranges"] = ["192.0.2.0/24"]  # Documentation-only example CIDR.

    after = analyze(after_model)
    before_ids = {f["id"] for f in before}
    after_ids = {f["id"] for f in after}
    return {
        "scenario": scenario, "description": SCENARIOS[scenario],
        "mode": "IN-MEMORY ONLY — no cloud resources were changed",
        "before": {"findings": before, "summary": summarize(before_model, before)},
        "after": {"findings": after, "summary": summarize(after_model, after)},
        "resolved_finding_ids": sorted(before_ids - after_ids),
        "remaining_finding_ids": sorted(after_ids),
        "note": "The replacement CIDR is illustrative only, not a production recommendation."
    }
