# Git Changes Summary

- **Prisma Schema Update**:
  - Added an enum for user roles.
  - Updated the User model with a new `role` field (default “USER”).

- **Authentication Controller Changes**:
  - Enforced a normal user role during registration at `/api/register`.
  - Allowed admin registration only if a valid `x-admin-key` header is provided.

- **Role Middleware**:
  - Created middleware (`ensureUserRole`) to enforce the "USER" role during registration.

- **CLI Script for Admin Creation**:
  - Added `scripts/createAdmin.ts` to support creating an admin via the command line.

- **Swagger Documentation Updates**:
  - Updated Swagger docs to document the `role` property with allowed values `"USER"` and `"ADMIN"`.

- **Additional Updates**:
  - Reflected the new role-related functionality in tests, README, and other supporting files.
