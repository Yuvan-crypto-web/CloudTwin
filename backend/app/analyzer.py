SENSITIVE_PORTS = {22: "SSH", 3389: "RDP", 5432: "PostgreSQL", 3306: "MySQL", 6379: "Redis"}

def analyze(resources):
    findings = []
    for bucket in resources.get("buckets", []):
        public = set(bucket.get("public_principals", [])) & {"allUsers", "allAuthenticatedUsers"}
        if public:
            findings.append({
                "id": f"bucket-public-{bucket['id']}", "severity": "HIGH",
                "title": "Bucket has a public IAM principal", "resource": bucket["name"],
                "explanation": f"Bucket IAM includes {', '.join(sorted(public))}. Effective access depends on the bound role and other policies.",
                "recommendation": "Review the IAM policy, remove unintended public principals, and verify least-privilege access."
            })
    for fw in resources.get("firewalls", []):
        ranges = set(fw.get("source_ranges", []))
        if not ranges.intersection({"0.0.0.0/0", "::/0"}):
            continue
        ports = [str(p) for p in fw.get("ports", [])]
        broad = any(p.lower() in {"all", "*", "0-65535"} for p in ports)
        sensitive = [SENSITIVE_PORTS[int(p)] for p in ports if p.isdigit() and int(p) in SENSITIVE_PORTS]
        if broad or sensitive:
            port_text = "all ports" if broad else ", ".join(sensitive)
            findings.append({
                "id": f"firewall-wide-{fw['id']}",
                "severity": "HIGH", "title": "Firewall exposes sensitive ports to internet sources",
                "resource": fw["name"],
                "explanation": f"Source range includes a global IPv4/IPv6 range and allows {port_text}. Effective reachability also depends on targets, routes, and other firewall policies.",
                "recommendation": "Restrict source ranges to approved CIDRs and limit destination ports."
            })
    return findings

def summarize(resources, findings):
    return {
        "buckets": len(resources.get("buckets", [])),
        "vpcs": len(resources.get("vpcs", [])),
        "subnets": len(resources.get("subnets", [])),
        "firewalls": len(resources.get("firewalls", [])),
        "high": sum(f["severity"] == "HIGH" for f in findings),
        "medium": sum(f["severity"] == "MEDIUM" for f in findings),
        "low": sum(f["severity"] == "LOW" for f in findings),
    }
