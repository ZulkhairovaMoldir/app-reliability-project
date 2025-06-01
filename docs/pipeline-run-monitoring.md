# CI/CD Pipeline: Run & Monitoring Instructions

## How to Run the Pipeline

1. **Push or Pull Request to `main` branch**
   - The pipeline is triggered automatically on every push or pull request to the `main` branch.

2. **Manual Run (GitHub UI):**
   - Go to the repository on GitHub.
   - Navigate to the "Actions" tab.
   - Select the latest workflow run to view status and logs.

## Pipeline Stages
- **Build:** Installs dependencies and builds the app.
- **Test:** Runs all tests.
- **Deploy:** Deploys the stack using Docker Compose (can be adapted for production servers).

## How to Monitor the Application

1. **Prometheus**
   - Access Prometheus at: [http://localhost:9090](http://localhost:9090)
   - Use the "Targets" page to check if all app instances are up.
   - Alerts are configured in `alert.rules.yml` and will fire if an app is down or latency is high.

2. **Grafana**
   - Access Grafana at: [http://localhost:3001](http://localhost:3001)
   - Login (default password: `admin`).
   - Import dashboards or use pre-configured ones to visualize metrics.

3. **Nginx Load Balancer**
   - Access the application via: [http://localhost:8080](http://localhost:8080)
   - If one app is stopped, nginx will route traffic to the healthy instance.

## Troubleshooting
- Use `docker-compose ps` to check container status.
- Use `docker-compose logs <service>` to view logs for a specific service (e.g., `nginx`, `app`, `prometheus`).
- If a service is down, restart it with `docker-compose start <service>`.

## Useful Commands (PowerShell)

```powershell
# Start all services
docker-compose -f .\app-reliability-project\docker-compose.yml up -d

# Stop one app to test failover
docker-compose -f .\app-reliability-project\docker-compose.yml stop app

# View logs for nginx
docker-compose -f .\app-reliability-project\docker-compose.yml logs nginx

# Restart a service
docker-compose -f .\app-reliability-project\docker-compose.yml start app
```

---
For more details, see the documentation in the `docs/` folder.
