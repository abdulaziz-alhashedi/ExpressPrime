import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
}

async function generateApi() {
  try {
    const apiNameInput = (await ask('Enter API name (Example., Todo): ')).trim();
    if (!apiNameInput) {
      console.error('API name cannot be empty. Please try again.');
      rl.close();
      return;
    }
    const apiName = apiNameInput.trim();
    if (!apiName) {
      console.error('API name is required.');
      rl.close();
      return;
    }
    const lowerApiName = apiName.toLowerCase();
    const routeFileName = `${lowerApiName}.routes.ts`;
    const controllerFileName = `${lowerApiName}.controller.ts`;
    const prismaModelFileName = `${lowerApiName}.prisma`;
    const serviceFileName = `${lowerApiName}.service.ts`;
    const validationFileName = `${lowerApiName}.validation.ts`;
    const typeFileName = `${lowerApiName}.types.ts`;

    const routesDir = path.join(__dirname, '../src/routes');
    const controllersDir = path.join(__dirname, '../src/controllers');
    const prismaDir = path.join(__dirname, '../prisma/models');
    const servicesDir = path.join(__dirname, '../src/services');
    const middlewaresDir = path.join(__dirname, '../src/middlewares');
    const validationsDir = path.join(__dirname, '../src/middlewares/validations');
    const typesDir = path.join(__dirname, '../src/types');

    // Ensure directories exist
    if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });
    if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });
    if (!fs.existsSync(prismaDir)) fs.mkdirSync(prismaDir, { recursive: true });
    if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });
    if (!fs.existsSync(validationsDir)) fs.mkdirSync(validationsDir, { recursive: true });
    if (!fs.existsSync(typesDir)) fs.mkdirSync(typesDir, { recursive: true });

    // Route template - updated to use the validation schemas
    const routeTemplate = `import { Router } from 'express';
import { create${apiName}, get${apiName}s, get${apiName}ById, update${apiName}, delete${apiName} } from '../controllers/${lowerApiName}.controller';
import { validate, validationMiddleware } from '../middlewares/validation.middleware';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticateJWT, validate('create${apiName}'), validationMiddleware, create${apiName});
router.get('/', authenticateJWT, get${apiName}s);
router.get('/:id', authenticateJWT, get${apiName}ById);
router.put('/:id', authenticateJWT, validate('update${apiName}'), validationMiddleware, update${apiName});
router.delete('/:id', authenticateJWT, delete${apiName});

export default router;
`;

    // Type definition template
    const typeTemplate = `export interface ${apiName}CreateInput {
  name: string;
  // Add other properties as needed
}

export interface ${apiName}UpdateInput {
  name?: string;
  // Add other properties as needed
}
`;

    // Controller template using Prisma
    const controllerTemplate = `import { Request, Response, NextFunction } from 'express';
import { 
  create${apiName} as create${apiName}Service, 
  get${apiName}s as get${apiName}sService, 
  get${apiName}ById as get${apiName}ByIdService,
  update${apiName} as update${apiName}Service, 
  delete${apiName} as delete${apiName}Service 
} from '../services/${lowerApiName}.service';
import { ${apiName}CreateInput, ${apiName}UpdateInput } from '../types/${lowerApiName}.types';

export const create${apiName} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: ${apiName}CreateInput = req.body;
    const result = await create${apiName}Service(data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const get${apiName}s = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await get${apiName}sService();
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const get${apiName}ById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await get${apiName}ByIdService(id);
    if (!result) {
      return res.status(404).json({ message: '${apiName} not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const update${apiName} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const data: ${apiName}UpdateInput = req.body;
    const result = await update${apiName}Service(id, data);
    if (!result) {
      return res.status(404).json({ message: '${apiName} not found' });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const delete${apiName} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    await delete${apiName}Service(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
`;

    // Prisma model template
    const prismaModelTemplate = `model ${apiName} {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Add additional fields as needed
  // Add relations as needed
}
`;

    // Service template using Prisma client
    const serviceTemplate = `import { prisma } from '../utils/prisma';
import { ${apiName}CreateInput, ${apiName}UpdateInput } from '../types/${lowerApiName}.types';
import { AppError } from '../types/errors';

/**
 * Create a new ${apiName}
 */
export const create${apiName} = async (data: ${apiName}CreateInput) => {
  try {
    return await prisma.${lowerApiName}.create({
      data
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(\`Error creating ${apiName}: \${message}\`, 500);
  }
};

/**
 * Get all ${apiName}s
 */
export const get${apiName}s = async () => {
  try {
    return await prisma.${lowerApiName}.findMany();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(\`Error fetching ${apiName}s: \${message}\`, 500);
  }
};

/**
 * Get a ${apiName} by ID
 */
export const get${apiName}ById = async (id: string) => {
  try {
    return await prisma.${lowerApiName}.findUnique({
      where: { id: parseInt(id) }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(\`Error fetching ${apiName}: \${message}\`, 500);
  }
};

/**
 * Update a ${apiName}
 */
export const update${apiName} = async (id: string, data: ${apiName}UpdateInput) => {
  try {
    return await prisma.${lowerApiName}.update({
      where: { id: parseInt(id) },
      data
    });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return null; // Record not found
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(\`Error updating ${apiName}: \${message}\`, 500);
  }
};

/**
 * Delete a ${apiName}
 */
export const delete${apiName} = async (id: string) => {
  try {
    await prisma.${lowerApiName}.delete({
      where: { id: parseInt(id) }
    });
    return true;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return false; // Record not found
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new AppError(\`Error deleting ${apiName}: \${message}\`, 500);
  }
};
`;

    // Create validation schema template
    const validationTemplate = `import { body } from 'express-validator';

/**
 * Validation schemas for ${apiName} entity
 */
export const ${lowerApiName}Validations = {
  create${apiName}: [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isString()
      .withMessage('Name must be a string')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    // Add more validations for other fields as needed
  ],
  update${apiName}: [
    body('name')
      .optional()
      .isString()
      .withMessage('Name must be a string')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    // Add more validations for other fields as needed
  ],
};
`;

    // Create the validation registry update
    // First, check if the validation.middleware.ts exists
    const validationMiddlewarePath = path.join(middlewaresDir, 'validation.middleware.ts');
    if (fs.existsSync(validationMiddlewarePath)) {
      // Append the import and update the validation registry
      let validationMiddlewareContent = fs.readFileSync(validationMiddlewarePath, 'utf8');
      
      // Check if we need to add the import for the new validation schema
      if (!validationMiddlewareContent.includes(`import { ${lowerApiName}Validations } from './validations/${lowerApiName}.validation'`)) {
        // Find the last import statement
        const lastImportIndex = validationMiddlewareContent.lastIndexOf('import ');
        const endOfImportsIndex = validationMiddlewareContent.indexOf('\n', lastImportIndex);
        if (lastImportIndex !== -1 && endOfImportsIndex !== -1) {
          // Insert the new import after the last import
          validationMiddlewareContent = 
            validationMiddlewareContent.slice(0, endOfImportsIndex + 1) + 
            `import { ${lowerApiName}Validations } from './validations/${lowerApiName}.validation';\n` + 
            validationMiddlewareContent.slice(endOfImportsIndex + 1);
          
          // Update the validationSchemas object 
          // Find the validationSchemas declaration
          const validationSchemasIndex = validationMiddlewareContent.indexOf('const validationSchemas = {');
          if (validationSchemasIndex !== -1) {
            // Find the end of the object declaration
            const endOfObjectIndex = validationMiddlewareContent.indexOf('};', validationSchemasIndex);
            if (endOfObjectIndex !== -1) {
              // Insert the new validation schema before the closing bracket
              validationMiddlewareContent = 
                validationMiddlewareContent.slice(0, endOfObjectIndex) + 
                `  create${apiName}: ${lowerApiName}Validations.create${apiName},\n` +
                `  update${apiName}: ${lowerApiName}Validations.update${apiName},\n` +
                validationMiddlewareContent.slice(endOfObjectIndex);
              
              // Write the updated file
              fs.writeFileSync(validationMiddlewarePath, validationMiddlewareContent);
              console.log(`Updated validation middleware to include ${apiName} validations.`);
            }
          }
        }
      }
    }

    fs.writeFileSync(path.join(routesDir, routeFileName), routeTemplate);
    fs.writeFileSync(path.join(controllersDir, controllerFileName), controllerTemplate);
    fs.writeFileSync(path.join(prismaDir, prismaModelFileName), prismaModelTemplate);
    fs.writeFileSync(path.join(servicesDir, serviceFileName), serviceTemplate);
    fs.writeFileSync(path.join(validationsDir, validationFileName), validationTemplate);
    fs.writeFileSync(path.join(typesDir, typeFileName), typeTemplate);
    
    console.log(`API files generated:
 - Route: ${path.join(routesDir, routeFileName)}
 - Controller: ${path.join(controllersDir, controllerFileName)}
 - Prisma Model: ${path.join(prismaDir, prismaModelFileName)}
 - Service: ${path.join(servicesDir, serviceFileName)}
 - Validation: ${path.join(validationsDir, validationFileName)}
 - Types: ${path.join(typesDir, typeFileName)}
    `);

    console.log(`
IMPORTANT: You need to add the ${apiName} model to your prisma/schema.prisma file:

1. Open prisma/schema.prisma
2. Copy and paste the following model:

${prismaModelTemplate}

3. Run prisma migrations:
   npx prisma migrate dev --name add_${lowerApiName}_model

4. Don't forget to register your new route in src/app.ts:

import ${lowerApiName}Routes from '@/routes/${lowerApiName}.routes';
// ...
framework.registerModule('/api/v1/${lowerApiName}s', ${lowerApiName}Routes);
    `);
    
  } catch (err) {
    console.error('Error generating API:', err);
  } finally {
    rl.close();
  }
}

generateApi();