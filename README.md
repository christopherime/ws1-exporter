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

```javascript
const infoDevice = new client.Gauge({
name: 'info_devices',
help: 'Devices information for each enrolled device',
labelNames: [
    'tenant',
    'deviceName',
    'assetnumber',
    'serialnumber',
    'imei',
    'lastseen',
    'online',
    'deltaMinutes',
],
});
```

## Getting Started

### docker-compose

```bash
docker-compose up
```

It will spin up a Prometheus scrapper on port localhost:9090 and the ws1-exporter on port localhost:8080
