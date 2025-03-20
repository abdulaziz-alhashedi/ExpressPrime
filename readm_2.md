# 🚀 Express Template with TypeScript, Prisma, Security, and Role-Based Authentication

// ...existing introductory content...

Welcome to the Express Template! This template provides a robust and secure backend foundation using TypeScript, Prisma, and cutting‑edge security best practices along with new role‑based authentication and task management features.

## ✨ Features

- **TypeScript**: Provides static type checking for enhanced code quality.
- **Prisma**: Simplifies database access, migrations, and type-safe queries.
- **Security Best Practices**: Helmet, rate limiting, input validation, and mongo sanitization.
- **Environment Configuration**: Uses `dotenv` for variable management.
- **Linting and Formatting**: Preconfigured with ESLint and Prettier.
- **Testing**: Set up with Jest and Supertest.
- **User Roles & Admin Registration**:  
  - User registrations default to the "USER" role.  
  - To register as "ADMIN", the proper `x-admin-key` header must be provided.  
  - A CLI script (`scripts/createAdmin.ts`) is available for creating admins from the command line.
- **Tasks Endpoint**:  
  - New CRUD endpoints for managing tasks are available under `/api/v1/tasks`.
- **Docker Support**: Docker Compose configuration for containerized deployment.

// ...existing installation and usage instructions...

## ✨ Getting Started

### Prerequisites

- Node.js (>= 14.x)
- PostgreSQL (or Docker for containerized development)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/abdulaziz-alhashedi/express_F_S.git
    cd express-template
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
    - Copy the `.env.example` file to `.env` and update the keys.

4. **Run Prisma commands**:
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

5. **Run the application**:
    - For development:
    ```bash
    pnpm dev
    ```
    - For production:
    ```bash
    pnpm build
    pnpm start
    ```

### Docker

1. **Build and run containers**:
    ```bash
    docker-compose up --build
    ```
2. The application will be available at `http://localhost:3000`.

// ...existing API usage sections...

## 🔒 New User Roles & Admin Registration

- **Registration Endpoint**:  
  When registering via `/api/register`, the system enforces a default role of "USER".  
  To register as an admin, you must supply a valid `x-admin-key` header matching the key in your environment variable (`ADMIN_KEY`).

- **Admin CLI Script**:  
  Use the CLI script located at `scripts/createAdmin.ts` to create an admin account via command line.

## 📢 Tasks Management

- **Tasks Endpoints**:  
  New CRUD endpoints are added under `/api/v1/tasks`:
  - **GET** `/api/v1/tasks` : Retrieve all tasks.
  - **POST** `/api/v1/tasks` : Create a new task.
  - **PUT** `/api/v1/tasks/:id` : Update an existing task.
  - **DELETE** `/api/v1/tasks/:id` : Delete a task.

// ...existing sections on authentication, API documentation, contributing, etc...

## 🤝 Contributing

Feel free to improve and extend the template. Please review the CHANGELOG for additional details on updates.

// ...existing license and closing sections...
