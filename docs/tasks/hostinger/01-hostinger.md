````markdown
# Hostinger VPS + API Notes

## Status

Hostinger API is fully working.

Verified:
- VPS API authentication works
- SSH works
- Docker services running
- OpenClaw running
- Postiz running
- Hermes running
- Traefik running

---

# VPS Information

| Item | Value |
|---|---|
| VPS ID | 1641664 |
| Hostname | srv1641664.hstgr.cloud |
| IPv4 | 2.24.69.242 |
| IPv6 | 2a02:4780:75:7a5d::1 |
| Plan | KVM 2 |
| RAM | 8192 MB |
| Disk | 102400 MB |
| OS Template | Ubuntu 24.04 with Docker + Traefik |
| State | running |

---

# Environment Variables

Added to ~/.bashrc:

```bash
export HOSTINGER_TOKEN="TOKEN"
export HAPI_API_TOKEN="$HOSTINGER_TOKEN"
export HOSTINGER_VPS_ID="1641664"
export HOSTINGER_VPS_IP="2.24.69.242"
````

Reload:

```bash
source ~/.bashrc
```

Verify:

```bash
echo $HOSTINGER_TOKEN
echo $HOSTINGER_VPS_ID
```

---

# API Base

```bash
https://developers.hostinger.com/api
```

---

# Working API Test

```bash
curl -s -H "Authorization: Bearer $HOSTINGER_TOKEN" \
https://developers.hostinger.com/api/vps/v1/virtual-machines/$HOSTINGER_VPS_ID | jq
```

Result:

* HTTP 200
* VPS metadata returned successfully

---

# Get VPS Actions

```bash
curl -s -H "Authorization: Bearer $HOSTINGER_TOKEN" \
https://developers.hostinger.com/api/vps/v1/virtual-machines/$HOSTINGER_VPS_ID/actions | jq
```

Confirmed:

* backups working
* docker_compose_up/down history working

---

# hapi CLI Status

Installed:

```bash
which hapi
```

Path:

```bash
/usr/local/bin/hapi
```

CLI version command:

```bash
hapi version
```

Current issue:

* hapi CLI does not automatically read HOSTINGER_TOKEN
* Direct curl API works correctly
* Use curl/API for now instead of CLI

---

# Current Infrastructure

| Service   | Status  |
| --------- | ------- |
| OpenClaw  | running |
| Postiz    | running |
| Hermes    | running |
| Paperclip | running |
| Traefik   | running |

---

# Recommended Architecture

## Core

| Layer               | Tool                 |
| ------------------- | -------------------- |
| AI orchestration    | Mastra               |
| AI UI/chat          | CopilotKit           |
| Database            | Supabase             |
| Maps                | Google Maps + Places |
| Social scheduling   | Postiz               |
| Browser automation  | OpenClaw             |
| Email               | Resend               |
| WhatsApp            | Meta/AiSensy         |
| Workflow automation | n8n                  |
| Reverse proxy       | Traefik              |

---

# MVP Priorities

1. Connect Postiz social accounts
2. Mastra event generation workflow
3. AI content generation
4. Approval workflow
5. Postiz publishing
6. WhatsApp/email automation
7. Event analytics

---

# Advanced Later

* OpenClaw autonomous workflows
* Sponsor outreach automation
* AI influencer recruitment
* Viral optimization
* Cross-platform growth agents
* pgvector recommendation engine
* Google ADK advanced grounding
* Multi-agent orchestration

---

# Important Commands

## VPS metadata

```bash
curl -s -H "Authorization: Bearer $HOSTINGER_TOKEN" \
https://developers.hostinger.com/api/vps/v1/virtual-machines/$HOSTINGER_VPS_ID | jq
```

## VPS actions

```bash
curl -s -H "Authorization: Bearer $HOSTINGER_TOKEN" \
https://developers.hostinger.com/api/vps/v1/virtual-machines/$HOSTINGER_VPS_ID/actions | jq
```

## SSH

```bash
ssh root@2.24.69.242
```

## Docker containers

```bash
docker ps
```

## Docker logs

```bash
docker logs <container>
```

---

# Key Product Direction

Build:

* AI-powered event growth engine
* AI-powered networking platform
* AI-powered venue intelligence
* Multi-platform publishing system
* Medellín social infrastructure layer

Not just:

* event listings
* ticketing
* social scheduler

```
```
