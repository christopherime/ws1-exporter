# ws1-exporter

> Unstable Version: 0.2.0
> Stable Version: 1.0.0 (target)

Project in development, no working version yet.

## Description

VMware WorkspaceOne Prometheus Exporter.
It's an exporter that queries the WorkspaceOne API and exposes metrics regarding your devices park.

## Endpoints

### /metrics

HTTP Method: GET | HTTP Status: 200 | Content-Type: text/plain
Provide OpenMetrics format.

### /healthz

HTTP Method: GET | HTTP Status: 200
Health check for the service exporter

## ports

Default: 8080

## Metrics

- **mdm_device_count**: Number of devices in the park
- **device_count_by_type**: Number of devices by type
- **device_count_by_status**: Number of devices by status
- **devices_count_offline**: Number of offline devices
- **devices_count_online**: Number of online devices

## Getting Started

### docker-compose

```bash
docker-compose up
```

It will spin up a Prometheus scrapper on port localhost:9090 and the ws1-exporter on port localhost:8080
