# SLI-SLO-SLA Documentation

## Service Level Indicators (SLIs)

SLIs are metrics that indicate the performance and reliability of the application. For our project, we have defined the following SLIs:

1. **Availability**: The percentage of time the application is available and responsive to user requests.
   - Measurement: Total uptime / Total time

2. **Latency**: The time taken to process a request.
   - Measurement: 95th percentile response time for all requests

3. **Error Rate**: The percentage of requests that result in an error.
   - Measurement: Total errors / Total requests

## Service Level Objectives (SLOs)

SLOs are the target levels of performance for the defined SLIs. Our SLOs are as follows:

1. **Availability**: 99.9% uptime over a rolling 30-day period.
2. **Latency**: 95th percentile response time should be less than 200ms.
3. **Error Rate**: Less than 1% of requests should result in an error.

## Service Level Agreements (SLAs)

SLAs are formal agreements that define the expected level of service between the service provider and the customer. Our SLAs include:

1. **Uptime Guarantee**: We guarantee 99.9% uptime, with service credits available for any downtime exceeding this threshold.
2. **Response Time**: We commit to a maximum response time of 200ms for 95% of requests.
3. **Error Handling**: In the event of an error rate exceeding 1%, we will notify affected customers and provide a remediation plan.

## Monitoring and Reporting

We will continuously monitor the defined SLIs and report on our performance against the SLOs. Regular reviews will be conducted to ensure compliance with the SLAs and to make necessary adjustments to our service delivery.

---

## Prometheus Metrics Examples

- **Availability:**
  
  ```promql
  sum(rate(health_check_requests_total{status="ok"}[5m])) / sum(rate(health_check_requests_total[5m]))
  ```

- **Error Rate:**
  
  ```promql
  sum(rate(http_request_errors_total[5m])) / sum(rate(http_request_duration_seconds_count[5m]))
  ```

- **Latency (p95):**
  
  ```promql
  histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
  ```

---

## Example Prometheus Alerts

```yaml
# prometheus-alerts.yml

groups:
- name: sre-alerts
  rules:
    - alert: HighErrorRate
      expr: sum(rate(http_request_errors_total[5m])) / sum(rate(http_request_duration_seconds_count[5m])) > 0.01
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "High error rate (>1%)"

    - alert: HighLatency
      expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 0.2
      for: 5m
      labels:
        severity: warning
      annotations:
        summary: "p95 latency exceeds 200ms"

    - alert: LowAvailability
      expr: sum(rate(health_check_requests_total{status!="ok"}[5m])) / sum(rate(health_check_requests_total[5m])) > 0.001
      for: 5m
      labels:
        severity: critical
      annotations:
        summary: "Availability below 99.9%"
```

---

## Example docker-compose.yml for Monitoring

```yaml
version: '3.7'
services:
  app:
    build: .
    ports:
      - "3000:3000"
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    ports:
      - "9090:9090"
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
```

---

## Пример prometheus.yml

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'app'
    static_configs:
      - targets: ['app:3000']
```