
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let responseData: Record<string, any> | undefined;

  const originalJson = res.json;
  res.json = function (body, ...args) {
    responseData = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    if (!path.startsWith("/api")) return;
    
    const duration = Date.now() - start;
    const logMessage = formatLogMessage(req.method, path, res.statusCode, duration, responseData);
    log(logMessage);
  });

  next();
});

function formatLogMessage(method: string, path: string, status: number, duration: number, data?: any): string {
  let message = `${method} ${path} ${status} in ${duration}ms`;
  if (data) {
    message += ` :: ${JSON.stringify(data)}`;
  }
  return message.length > 80 ? message.slice(0, 79) + "…" : message;
}

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});

// Server initialization
(async () => {
  const server = await registerRoutes(app);

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`Server running on port ${port}`);
  });
})();
