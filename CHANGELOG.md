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
  
Happy coding!
