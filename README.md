# ws1-exporter

> Unstable Version: 0.2.0
> Stable Version: 1.0.0 (target)

Project in development, no working version yet.

## Description

VMware WorkspaceOne Prometheus Exporter.
It's an exporter that queries the WorkspaceOne API and exposes metrics regarding your devices park.

## Environement variables

- WS1_AUTH_KEY
  - Basic auth cred in base64 format.
- WS1_TENANT_KEY
  - Tenant server key
- WS1_URL
  - API URL in format https://example.com/API
- WS1_EXPORTER_PORT
  - Port configuration for exporter (mind to correspond with the docker-compose mapping)
- WS1_TENANT_NAME
  - Friendly name for the tenant in case you have multiple tenants.
- WS1_INTERVAL
  - int num representing the frequency of check in minutes for WS1 at which the server check the devices
- WS1_INSECURE_TLS
  - Boolean true/false default value should be false
- WS1_LGID
  - The ID of the group from where you want to query the devices
- TZ
  - Timezone for the exporter in format Europe/Berlin

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
