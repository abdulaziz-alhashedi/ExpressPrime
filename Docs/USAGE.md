# Project Usage Guide

## Introduction
This project provides a secure and scalable Express backend with TypeScript, Prisma ORM, and robust security practices. It includes a modular structure with controllers, services, middlewares, and utility modules.

## Getting Started

### Prerequisites
- Node.js (>=14.x)
- PostgreSQL (or your chosen database configured via Prisma)
- Docker (optional)

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/abdulaziz-alhashedi/express_F_S.git
    cd express_F_S
    ```
2. Install dependencies:
    ```bash
    pnpm install
    ```
    Or using npm/yarn as preferred.

3. Copy environment variables:
    ```bash
    cp .env.example .env
    ```
    Update the values in `.env` as required.

4. Set up the database:
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

## Running the Application

### Development Mode
```bash
pnpm dev
```

### Production Mode
```bash
pnpm build
pnpm start
```

### Using Docker
```bash
docker-compose up --build
```
The server will be accessible at [http://localhost:3000](http://localhost:3000).

## API Documentation
Access the Swagger UI at:
[http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

Refer to the Postman collection provided in `postman_collection.json` for sample API calls.

## CLI Tools
- **API Generator**: Run the CLI tool to scaffold new API endpoints:
  ```bash
  ts-node scripts/generateApi.ts
  ```
- **Admin Creation**: Create an admin user securely with:
  ```bash
  ts-node scripts/createAdmin.ts
  ```

## Testing
The project uses Jest for testing (unit & integration tests). Run the test suite with:
```bash
npm test
```

## Project Structure
```
├── prisma                  // Prisma schema and migrations
├── scripts                 // CLI scripts (API generator, admin creation)
├── src                     
│   ├── controllers         // Request handlers
│   ├── middlewares         // Security, validation & rate limiting
│   ├── routes              // API route definitions
│   ├── services            // Business logic and service layer
│   └── utils               // Utilities and configuration
├── tests                   // Automated tests
└── Docs                    // Project documentation
```

## Project Architecture and Components

- **d:\express_F_S\README.md** – Explains the project purpose, key features, setup instructions, and overall structure. It guides users in installation, running in development or production, API documentation (via Swagger/Postman), and using CLI tools for generating APIs and creating admin users.
- **d:\express_F_S\Docs\USAGE.md** – Provides a usage guide covering prerequisites, installation, database setup (via Prisma), running the app (including Docker), and testing instructions.
- **Configuration Files** (e.g., package.json, tsconfig.json, .env/.env.example) – Define project configuration, dependencies, TypeScript compiler options, and environment variables.
- **d:\express_F_S\src**
  - **app.ts** – The main entry point that configures Express with Helmet for security, CORS, rate limiting, body parsing, sanitization, and logging with trace IDs. It sets up routes for health checks, authentication, external endpoints, and user management, along with a global error handler.
  - **config/** – Centralizes environment variable validation using envalid.
  - **controllers/** – Contains request handlers for authentication (auth.controller.ts) and user management (user.controller.ts) that delegate business logic to the service layer.
  - **middlewares/** – Implements custom middleware for error handling, JWT authentication, API key validation, rate limiting, request validation, and enforcing user roles.
  - **routes/** – Defines the API endpoints. For example, auth.routes.ts (registration, login, refresh, profile), user.routes.ts (admin-protected user CRUD), and external.routes.ts (API key-based access).
  - **services/** – Encapsulates business logic separately from controllers. It includes auth.service.ts for user registration, login, and token refreshing, and user.service.ts for managing user data.
  - **utils/** – Contains reusable utilities such as the configured Prisma client (prisma.ts), a Winston logger (logger.ts), and custom error classes (HttpError.ts, AppError.ts).
- **d:\express_F_S\prisma\** – Holds your Prisma schema, migrations, and database seeding scripts.
- **d:\express_F_S\scripts\** – Contains CLI tools like generateApi.ts (to scaffold new API endpoints) and createAdmin.ts (for secure admin creation).
- **d:\express_F_S\tests\** – Includes Jest and Supertest tests for both integration and unit testing of endpoints and business logic.
- **Documentation Files** – Swagger (swagger.json/swagger.yaml) and Postman collection files provide API documentation and examples.
- **docker-compose.yml** – Enables container-based development for the Express app and PostgreSQL database.

## Contributing
See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License
This project is licensed under the MIT License. Refer to the [LICENSE](../LICENSE) file for details.

Happy coding!
