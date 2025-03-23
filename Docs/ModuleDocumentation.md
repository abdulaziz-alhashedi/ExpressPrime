# Module Documentation

This document explains the purpose of every major module in the project to reduce redundancy and improve maintainability.

## Project Structure

- **prisma/**
  - Contains the Prisma schema files and migrations.
  - *schema.prisma*: Defines the database schema, models, and migration configuration.
  - *seed.ts*: Script to initialize the database with seed data.
  - *schema_exammple.prisma*: Example Prisma schema for reference.
- **scripts/**
  - Utility scripts for administrative and automation tasks.
  - *createAdmin.ts*: Script to create an admin user using interactive CLI prompts.
  - *generateApi.ts*: Automation tool to scaffold new API modules (routes, controllers, models, services).
- **src/**
  - **app.ts**: Main entry point that initializes the Express server, connects to Prisma, sets up security, middleware, routes, and error handling.
  - **config/**: Loads and validates environment variables using envalid for runtime configuration.
  - **controllers/**: Contains request handler functions that bridge HTTP requests to business logic.
    - e.g. *auth.controller.ts* handles registration, login, and token refresh.
    - e.g. *user.controller.ts* manages user retrieval and updates.
  - **middlewares/**: Custom middlewares for:
    - Authentication (e.g. *auth.middleware.ts*)
    - API key validation (e.g. *apiKey.middleware.ts*)
    - Request validation (e.g. *validation.middleware.ts*)
    - Role enforcement (e.g. *role.middleware.ts*)
    - Rate limiting (e.g. *rateLimiter.middleware.ts*)
    - Global error handling (e.g. *errorHandler.ts*)
  - **models/**: (Optional) Contains ORM models or entity definitions for database records.
  - **routes/**: Defines API endpoints and maps them to controller functions.
    - e.g. *auth.routes.ts*, *external.routes.ts*, *user.routes.ts*
  - **services/**: Implements business logic routines such as user management and authentication.
    - e.g. *auth.service.ts* and *user.service.ts*
  - **utils/**: Contains helper functions and reusable utilities.
    - *logger.ts*: Configured Winston logger for structured logging.
    - *prisma.ts*: Initializes and exports the Prisma client instance.
    - *HttpError.ts* and *AppError.ts*: Custom error classes to standardize error responses.
    - *passwordValidator.ts*: Function to validate password strength.
- **tests**
  - Includes integration and unit tests for verifying API endpoints and business logic.
- **Docs**
  - Additional documentation including API swagger docs, Postman collections, and project updates.

By clearly documenting each module’s role, this structure reduces redundancy and aids in long-term project maintenance.

