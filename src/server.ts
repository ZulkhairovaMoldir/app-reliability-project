import express, { Request, Response, NextFunction } from 'express';
import { recordRequestDuration, recordError, recordHealthCheck, collectMetrics } from './monitoring/prometheus';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to measure request duration and errors
app.use((req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();
    res.on('finish', () => {
        const diff = process.hrtime(start);
        const duration = diff[0] + diff[1] / 1e9; // seconds
        recordRequestDuration(req.method, req.route?.path || req.path, res.statusCode, duration);
        if (res.statusCode >= 400) {
            recordError(req.method, req.route?.path || req.path, res.statusCode);
        }
    });
    next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    recordHealthCheck('ok');
    res.json({ status: 'ok' });
});

// Define a simple route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Application Reliability Project!');
});

// Metrics endpoint for Prometheus
app.get('/metrics', (req: Request, res: Response) => {
    res.set('Content-Type', 'text/plain');
    collectMetrics().then(metrics => res.send(metrics));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});