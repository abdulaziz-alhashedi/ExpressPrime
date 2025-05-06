# Express Template API

A robust Express-based API template featuring secure authentication, role-based access control, input validation, and automated API module generation.

## Features

- JWT-based authentication with refresh tokens.
- Role-based authorization (with ADMIN and USER roles).
- Input validation using express-validator.
- Rate limiting and security middlewares (Helmet, CORS, mongoSanitize).
- API scaffolding via a custom generation script.
- Comprehensive logging with winston.
- Database access managed by Prisma.
- Environment variable management via envalid.
- Detailed API documentation (Swagger and Postman collections).

## Project Structure

// ...existing directory tree as documented in ModuleDocumentation.md...

## Setup Instructions

1. Copy `.env.example` to `.env` and update the configuration values.
2. Run `npm install` to install dependencies.
3. Run Prisma migrations with `npx prisma migrate dev`.
4. (Optional) Seed the database with `npx ts-node prisma/seed.ts`.
5. Start the application with `npm run start`.

## Development

- Use `npm run dev` for development with hot-reloading.
- Use the generate API script (`npx ts-node scripts/generateApi.ts`) to scaffold new API modules.

## Testing

- Run tests with `npm test`.

## 🛠️ Getting Started

### Prerequisites

- Node.js (>= 14.x)
- PostgreSQL (or your database configured via Prisma)
- Docker (optional, for containerized development)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/abdulaziz-alhashedi/express_F_S.git
    cd express_F_S
    ```

2. **Install dependencies**:
    - Using pnpm:
      ```bash
      pnpm install
      ```
    - Using npm:
      ```bash
      npm install
      ```
    - Using yarn:
      ```bash
      yarn install
      ```

3. **Set up environment variables**:
    - Copy the `.env.example` to `.env` and update the values:
      ```bash
      cp .env.example .env
      ```

4. **Database Setup with Prisma**:
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

### Running the Application

- **Development**:
  ```bash
  pnpm dev
  ```
- **Production**:
  ```bash
  pnpm build
  pnpm start
  ```

### Using Docker

1. **Build and run containers**:
    ```bash
    docker-compose up --build
    ```
2. The app will be accessible at `http://localhost:3000`.

## 📚 API Documentation

- **Swagger (OpenAPI 3.0)**:  
  Access at [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

- **Postman Collection**:  
  Import the provided Postman collection (`postman_collection.json`) and configure the `{{base_url}}` variable as needed.

## ⚙️ Utility Scripts

- **Generate New API Endpoint**:  
  Run the CLI tool to scaffold a new API:
  ```bash
  ts-node scripts/generateApi.ts
  ```

- **Create an Admin User**:  
  Use the CLI admin script:
  ```bash
  ts-node scripts/createAdmin.ts
  ```

## 🔒 Security & Role-Based Access

- Users registering via `/api/v1/auth/register` are forced to have the role `USER`.
- Only admin users can create, update, or delete other users via `/api/v1/users`.
- A dedicated middleware (`authenticateJWT`) and role checks ensure only authorized access to admin endpoints.

## 📂 Project Structure

```
...existing tree structure...
├── src
│   ├── controllers           // Slimmed controllers that delegate to services
│   ├── middlewares           // Security, validation, and rate limiting
│   ├── routes                // API route definitions
│   ├── services              // New service layer with business logic
│   └── utils                 // Utility functions & configurations
...existing code...
```

- **src**: Contains controllers, routes, middlewares, and utilities.
- **prisma**: Holds the Prisma schema and migration files.
- **scripts**: Includes CLI scripts for API generation and admin creation.
- **tests**: Contains automated tests for API endpoints.
- **CHANGELOG.md**: Summarizes recent changes.

## Architecture Overview

This project is designed for scalability and maintainability. Key design decisions and recent improvements include:
- Modular structure with clear separation of controllers, services, middlewares, routes, and utilities.
- Unified password validation using a dedicated utility so that both request validators and service logic enforce a minimum of 10 characters with mixed case, digit, and special character.
- A singleton PrismaClient to prevent duplicate connections and improve graceful shutdown across environments.
- Environment-specific logging configuration: development uses verbose console and file logging with colorization, while production logs are structured and less verbose.
- Robust configuration using envalid to consolidate .env files.
- Enhanced testing and API scaffolding with shared helper functions to promote DRY principles.
- Comprehensive documentation linking the core modules, usage instructions, and extension guidelines.
- Deep Dive: For an in-depth analysis of our architecture, scalability, modularity, and security enhancements, please refer to the following documents:
  - [Module Documentation](./Docs/ModuleDocumentation.md)
  - [Database Schema](./Docs/database-schema.md)
  - [Error Codes](./Docs/error-codes.md)
  - [Authentication](./Docs/authentication.md)
  - [API Reference](./Docs/api-reference.md)
  - [Getting Started](./Docs/getting-started.md)
  - [Introduction](./Docs/introduction.md)

For more details, please see the [Module Documentation](./Docs/ModuleDocumentation.md) and [Usage Documentation](./Docs/USAGE.md).

## 🤝 Contributing

We welcome contributions! Please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Happy coding!

