import os

def gcp_enabled():
    return os.getenv("CLOUDTWIN_ENABLE_GCP", "").strip().lower() == "true"

def discover(project_id):
    # Read-only metadata discovery. No cloud mutation operations are used here.
    if not gcp_enabled():
        raise RuntimeError("GCP discovery is disabled. Set CLOUDTWIN_ENABLE_GCP=true to enable it.")
    try:
        from google.cloud import storage, compute_v1
    except ImportError as exc:
        raise RuntimeError("Install optional libraries: pip install -r requirements-gcp.txt") from exc

    buckets = []
    client = storage.Client(project=project_id)
    for bucket in client.list_buckets(project=project_id):
        public_principals = []
        try:
            policy = bucket.get_iam_policy(requested_policy_version=3)
            for binding in policy.bindings:
                for member in binding.get("members", []):
                    if member in {"allUsers", "allAuthenticatedUsers"}:
                        public_principals.append(member)
        except Exception:
            # Unknown policy status must not be reported as safe.
            public_principals = ["POLICY_READ_FAILED"]
        buckets.append({
            "id": bucket.name, "name": bucket.name, "location": bucket.location,
            "storage_class": bucket.storage_class,
            "public_principals": sorted(set(public_principals)), "source": "gcp"
        })

    vpcs = []
    for network in compute_v1.NetworksClient().list(request={"project": project_id}):
        vpcs.append({"id": network.name, "name": network.name, "self_link": network.self_link, "source": "gcp"})

    subnets = []
    for scoped in compute_v1.SubnetworksClient().aggregated_list(request={"project": project_id}):
        for subnet in scoped.subnetworks or []:
            subnets.append({
                "id": subnet.name, "name": subnet.name,
                "region": subnet.region.split("/")[-1] if subnet.region else None,
                "network": subnet.network.split("/")[-1] if subnet.network else None, "source": "gcp"
            })

    firewalls = []
    for fw in compute_v1.FirewallsClient().list(request={"project": project_id}):
        ports = []
        for allowed in fw.allowed or []:
            ports.extend(str(p) for p in (allowed.ports or []))
            if not allowed.ports:
                ports.append("all")
        if not fw.disabled:
            firewalls.append({
                "id": fw.name, "name": fw.name, "source_ranges": list(fw.source_ranges or []),
                "ports": ports, "direction": fw.direction,
                "network": fw.network.split("/")[-1] if fw.network else None,
                "source": "gcp"
            })

    return {
        "project_id": project_id, "buckets": buckets, "vpcs": vpcs,
        "subnets": subnets, "firewalls": firewalls,
        "discovery_note": "Read-only metadata discovery. Bucket objects were not listed or read; policy details can be unavailable due to permissions."
    }
