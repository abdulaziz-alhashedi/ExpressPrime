# Testing Strategy

This directory contains tests for the Express.js backend template, organized as follows:

- `unit/`: Unit tests for individual components (services, controllers, utilities)
- `integration/`: Integration tests for API endpoints and middleware chains
- `common/`: Shared test utilities, helpers, and setup
- `app.test.ts`: Top-level application tests

## Test Structure

- **Unit Tests**: Test individual components in isolation with mocked dependencies
- **Integration Tests**: Test API endpoints with real HTTP requests
- **Common Utilities**: Shared helpers for creating test data and assertions

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run with coverage
npm run test:coverage
```

## Test Helpers

The `common/testHelpers.ts` file provides utilities for:

- Creating mock Express request/response objects
- Generating test users with valid credentials
- Making authenticated API requests
- Common assertions for error handling

## Test Environment

Tests run against a test database specified in the `.env.test` file. The test database is reset before each test run.
