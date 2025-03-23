import express, { Application, Router } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { json } from 'body-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { v4 as uuidv4 } from 'uuid';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json';
import { config } from '../config/config';
import logger from '../utils/logger';
import { errorHandler } from '../middlewares/errorHandler';

export class ExpressFramework {
  public app: Application;
  private port: number;

  constructor(port: number = config.PORT) {
    this.app = express();
    this.port = port;
    this.setupCoreMiddlewares();
  }

  // Core registrations (security, logging, body parsing, rate limiting)
  private setupCoreMiddlewares() {
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'"]
          }
        }
      })
    );
    this.app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
    this.app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
    this.app.use(helmet.noSniff());
    this.app.use(
      cors({
        origin: config.CORS_ORIGIN.split(','),
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
        optionsSuccessStatus: 200
      })
    );
    this.app.use(json());
    this.app.use(mongoSanitize());

    // Attach a trace ID to each request
    this.app.use((req, res, next) => {
      const traceId = uuidv4();
      req.headers['x-trace-id'] = traceId;
      res.setHeader('X-Trace-Id', traceId);
      next();
    });

    // Basic request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.url} - TraceID: ${req.headers['x-trace-id']}`);
      next();
    });

    // Global rate limiting (adjust as needed)
    this.app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
      })
    );

    // Serve documentation by default
    this.app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Global error handler
    this.app.use(errorHandler);
  }

  // Allow external routes/modules to be registered
  public registerModule(path: string, router: Router) {
    this.app.use(path, router);
  }

  // You can add methods to register middlewares, services, etc.
  public start() {
    this.app.listen(this.port, () => {
      logger.info(`Framework server running on port ${this.port}`);
    });
  }
}
