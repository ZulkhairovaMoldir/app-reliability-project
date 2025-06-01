import { collectDefaultMetrics, register, Histogram, Counter } from 'prom-client';

const metricsRegistry = register;

// Collect default metrics
collectDefaultMetrics();

// Create a histogram for request duration (latency SLI)
const requestDurationHistogram = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 1, 2], // 50ms, 100ms, 200ms, 300ms, 500ms, 1s, 2s
});

// Counter for error rate SLI
const errorCounter = new Counter({
    name: 'http_request_errors_total',
    help: 'Total number of error HTTP responses',
    labelNames: ['method', 'route', 'status'],
});

// Counter for health check (availability SLI)
const healthCheckCounter = new Counter({
    name: 'health_check_requests_total',
    help: 'Total health check requests',
    labelNames: ['status'],
});

// Function to record request duration
export const recordRequestDuration = (method: string, route: string, status: number, duration: number) => {
    requestDurationHistogram.labels(method, route, status.toString()).observe(duration);
};

// Function to record errors
export const recordError = (method: string, route: string, status: number) => {
    errorCounter.labels(method, route, status.toString()).inc();
};

// Function to record health check
export const recordHealthCheck = (status: string) => {
    healthCheckCounter.labels(status).inc();
};

// Function to expose metrics for Prometheus
export const collectMetrics = async () => {
    return await register.metrics();
};

// Function to expose metrics for Prometheus
export const setupPrometheusMetrics = (app: any) => {
    app.get('/metrics', async (req: any, res: any) => {
        res.set('Content-Type', metricsRegistry.contentType);
        res.end(await metricsRegistry.metrics());
    });
};