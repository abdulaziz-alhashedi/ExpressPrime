# 🚀 Express Template with TypeScript, Prisma, and Security Best Practices

Welcome to the Express Template! This template is designed to help backend developers quickly set up a robust and secure Express application using TypeScript, Prisma, and various security best practices. Whether you're starting a new open-source project or building a production-ready application, this template has you covered.

## ✨ Features

- **TypeScript**: Strongly typed language that helps catch errors early and improves code quality.
- **Prisma**: Modern database toolkit that simplifies database access and migrations.
- **Security Best Practices**: Includes middleware for security headers, rate limiting, input validation, and more.
- **Environment Configuration**: Uses `dotenv` for environment variable management.
- **Linting and Formatting**: Pre-configured with ESLint and Prettier for consistent code style.
- **Testing**: Set up with Jest for unit and integration tests.
- **Docker Support**: Docker Compose configuration for easy setup and deployment.

## 🛠️ Getting Started

### Prerequisites

- Node.js (>= 14.x)
- Docker (optional, for containerized development)
- PostgreSQL (if not using Docker)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/abdulaziz-alhashedi/express_F_S/.git
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
    - Copy the `.env.example` file to `.env` and fill in the required values.
    ```bash
    cp .env.example .env
    ```

4. **Run the application**:
    - For development:
    ```bash
    pnpm dev
    ```
    - For production:
    ```bash
    pnpm build
    pnpm start
    ```

### 🐳 Using Docker

1. **Build and run the containers**:
    ```bash
    docker-compose up --build
    ```

2. The application will be available at `http://localhost:3000`.

### 📚 Prisma Setup

1. **Generate Prisma client**:
    ```bash
    npx prisma generate
    ```

2. **Run migrations**:
    ```bash
    npx prisma migrate dev
    ```
    <!-- Note: After any schema changes (e.g., adding the Task model), be sure to run migrations to update your database. -->

### 📂 Project Structure

- **src**: Contains the source code.
  - **controllers**: Define the request handlers.
  - **middlewares**: Custom middleware functions.
  - **utils**: Utility functions and configurations.
- **prisma**: Prisma schema and migrations.
- **tests**: Test files.

### 🔒 Security Features

- **Helmet**: Adds security headers to HTTP responses.
- **Rate Limiting**: Limits the number of requests from a single IP.
- **Input Validation**: Validates and sanitizes user input using `express-validator`.
- **Mongo Sanitize**: Prevents MongoDB Operator Injection.
- **External API**: The `/api/v1/external` endpoint is protected by API key authentication. Set your API key in the `.env` file (`API_KEY`) and include it in the `x-api-key` header.

## Advanced Usage

### Running Tests
Run the test suite to validate the health of the application:
```bash
npm test
```

### Database Migrations and Prisma Commands
Use Prisma to manage your database schema:
- Generate Prisma client:
  ```bash
  npx prisma generate
  ```
- Run migrations:
  ```bash
  npx prisma migrate dev
  ```
- Open Prisma Studio to inspect your data:
  ```bash
  npx prisma studio
  ```

### Authentication Examples
Use the provided auth routes as a reference to build secure authentication:
- Register a new user:
  ```bash
  curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "password123"}'
  ```
- Log in as a user:
  ```bash
  curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email": "user@example.com", "password": "password123"}'
  ```
- **External API Example**:
  ```bash
  curl -X POST http://localhost:3000/api/v1/external \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-external-api-key" \
  -d '{"data": "your data"}'
  ```

### Full Power Usage for Backend Developers

This section details how to harness the full power of the template, with examples and best practices for backend development.

#### Logging
- The template uses Winston for logging. All logs are output to the console.
- Extend logging by modifying `src/utils/logger.ts` to fit your needs.

#### Authentication & Authorization
- Use the provided auth endpoints to secure your application.
- Example endpoints:
  - **Register a new user:**
    ```bash
    curl -X POST http://localhost:3000/api/register \
    -H "Content-Type: application/json" \
    -d '{"email": "backend@user.com", "password": "strongpassword"}'
    ```
  - **Login as a user:**
    ```bash
    curl -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{"email": "backend@user.com", "password": "strongpassword"}'
    ```

#### Testing and Quality Assurance
- Run the test suite using:
  ```bash
  npm test
  ```
- Extend tests by adding files in the `tests` folder.
- Use ESLint and Prettier (configured via `npm run lint` and `npm run format`) to maintain code quality.

#### Database Management with Prisma
- **Generate Prisma Client:**
  ```bash
  npx prisma generate
  ```
- **Run Migrations:**
  ```bash
  npx prisma migrate dev
  ```
- **Seed the Database:**
  ```bash
  npx prisma db seed
  ```
- Use Prisma Studio to inspect your data:
  ```bash
  npx prisma studio
  ```

#### Custom Middlewares and Extensions
- Add new express middlewares under `src/middlewares` to implement additional security, logging, or business logic.
- Extend the existing routes and controllers by following the established folder structure.

#### Deployment Best Practices
- For production, build the application using:
  ```bash
  npm run build
  ```
- Start the production server with:
  ```bash
  npm start
  ```
- Ensure environment variables in `.env` are properly configured for production.

### Customization and Extension
Leverage the structure of the template:
- Add new routes in the `src/routes` folder.
- Extend the logging functionality in `src/utils/logger.ts` if needed.
- Create additional controllers and middlewares to suit your business logic.

### 🤝 Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

### 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🎉 Conclusion

This template is a powerful starting point for any backend developer looking to build a secure and scalable Express application. With TypeScript, Prisma, and a suite of security best practices, you can focus on building features rather than setting up boilerplate code. Happy coding!

