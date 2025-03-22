# Changelog for Today's Session

## Updates Summary
- **Prisma Schema Update**:  
  - Added an enum for user roles and updated the User model with a new `role` field (default “USER”).
  
- **Authentication Controller Changes**:  
  - Updated the registration endpoint to enforce a normal user role when registering via `/api/register`.
  - Added logic to allow admin registration _only_ if a valid `x-admin-key` header is provided.
  
- **Role Middleware**:  
  - Created a new middleware (`ensureUserRole`) to force the role to “USER” during registration (rejects any non-USER role).
  
- **CLI Script for Admin Creation**:  
  - Added `scripts/createAdmin.ts` to allow creating an admin from the command line. This bypasses the public endpoint.
  
- **Swagger Documentation Updates**:  
  - Updated Swagger docs to display and document the role property (with allowed values `"USER"` and `"ADMIN"`) for users.
  
- **Additional Changes**:  
  - Updated tests, README, and supporting files to reflect the new role-related functionality.

## d:\express_F_S\scripts\generateApi.ts
- Added a utility script to scaffold new API endpoints.
- Uses user input to generate route, controller, and model files using TypeORM patterns.
```typescript
// ...existing code...
const routeTemplate = `import { Router } from 'express';
...
export default router;
`;
// ...existing code...
```

## d:\express_F_S\src\controllers\auth.controller.ts
- Integrated strong password validation via a regex check.
- Hashed passwords using bcrypt before saving.
- Generated and returned a JWT token on registration/login.
```typescript
// ...existing code...
function isStrongPassword(password: string): boolean { /* ... */ }
const hashedPassword = await bcrypt.hash(password, saltRounds);
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
// ...existing code...
```

## d:\express_F_S\src\controllers\user.controller.ts
- Restricted create, update, and delete operations to admin users.
- Added password strength validation and password hashing for create/update operations.
- Improved error handling and logging for user CRUD actions.
```typescript
// ...existing code...
if (!isStrongPassword(password)) { /* ... */ }
const hashedPassword = await bcrypt.hash(password, saltRounds);
// ...existing code...
```

## d:\express_F_S\postman_collection.json
- Updated all request URLs to use the `{{base_url}}` variable.
- Structured each URL with defined protocol, host, port, and path segments.
```json
// ...existing code...
"url": {
  "raw": "{{base_url}}/api/v1/health",
  "protocol": "http",
  "host": ["localhost"],
  "port": "3000",
  "path": ["api", "v1", "health"]
}
// ...existing code...
```

## d:\express_F_S\swagger.yaml
- Created a new OpenAPI 3.0 documentation file.
- Documented endpoints for health check, authentication (register, login, profile) and user CRUD.
- Added JWT bearer security under components.
```yaml
# ...existing code...
servers:
  - url: "{{base_url}}"
paths:
  /api/v1/health:
    get:
      summary: "Health Check"
      ...
# ...existing code...
```
  
Happy coding!
