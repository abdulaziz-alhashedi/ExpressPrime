# Module Documentation

This document explains the purpose of every major module in the project to reduce redundancy and improve maintainability.

## Project Structure

- **prisma/**
  - Contains the Prisma schema files and migrations.
  - *schema.prisma*: Defines the database schema, models, and migration configuration.
  - *seed.ts*: Script to initialize the database with seed data.
  - *schema_exammple.prisma*: Example Prisma schema for reference.
- **scripts/**
  - Utility scripts for administrative tasks and API generation.
  - *createAdmin.ts*: Script to create an admin user via CLI prompts.
  - *generateApi.ts*: Automation tool to scaffold new API modules.
- **src/**
  - **app.ts**: Main entry point that initializes Express, connects to Prisma, and sets up middlewares, routes and error handling.
  - **config/**: Loads and validates environment variables using envalid.
  - **controllers/**: Contains request handlers that connect HTTP endpoints to business logic (e.g. auth.controller.ts, user.controller.ts).
  - **middlewares/**: Custom Express middlewares (authentication, API key, rate limiting, validation, role enforcement, and error handling).
  - **models/**: ORM models/entities for the database.
  - **routes**
    - *auth.routes.ts*: Defines routes for user registration, login, token refresh and profile.
    - *external.routes.ts*: Exposes endpoints for external API access (secured by API key middleware).
    - *user.routes.ts*: Handles CRUD operations for users (restricted to admin).
  - **services/**: Contains business logic and DB operations (e.g. auth.service.ts, user.service.ts).
  - **utils/**: Utility functions and configurations (logger, error classes, passwordValidator, prisma instance, etc.).
- **tests**
  - Contains integration and unit tests.
- **docs**
  - API documentation including Swagger and Postman collection.

By clearly documenting each module’s role, this structure reduces redundancy and aids in long-term project maintenance.

