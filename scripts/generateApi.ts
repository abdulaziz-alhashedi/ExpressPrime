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
    const apiNameInput = await ask('Enter API name (e.g., Todo): ');
    const apiName = apiNameInput.trim();
    if (!apiName) {
      console.error('API name is required.');
      rl.close();
      return;
    }
    const routeFileName = `${apiName.toLowerCase()}.routes.ts`;
    const controllerFileName = `${apiName.toLowerCase()}.controller.ts`;

    const routesDir = path.join(__dirname, '../src/routes');
    const controllersDir = path.join(__dirname, '../src/controllers');

    // Ensure directories exist
    if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });
    if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });

    // Route template
    const routeTemplate = `import { Router } from 'express';
import { create${apiName}, get${apiName}s, update${apiName}, delete${apiName} } from '../controllers/${apiName.toLowerCase()}.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();

router.post('/', /* add validation middleware here */ validationMiddleware, create${apiName});
router.get('/', get${apiName}s);
router.put('/:id', /* add validation middleware here */ validationMiddleware, update${apiName});
router.delete('/:id', delete${apiName});

export default router;
`;

    // Controller template
    const controllerTemplate = `import { Request, Response, NextFunction } from 'express';

export const create${apiName} = async (req: Request, res: Response, next: NextFunction) => {
  // ...implement creation logic...
  res.status(201).json({ message: '${apiName} created' });
};

export const get${apiName}s = async (req: Request, res: Response, next: NextFunction) => {
  // ...implement retrieval logic...
  res.json({ message: 'List of ${apiName}s' });
};

export const update${apiName} = async (req: Request, res: Response, next: NextFunction) => {
  // ...implement update logic...
  res.json({ message: '${apiName} updated' });
};

export const delete${apiName} = async (req: Request, res: Response, next: NextFunction) => {
  // ...implement delete logic...
  res.status(204).send();
};
`;

    // Write files
    fs.writeFileSync(path.join(routesDir, routeFileName), routeTemplate);
    fs.writeFileSync(path.join(controllersDir, controllerFileName), controllerTemplate);
    
    console.log(`API files generated:
 - Route: ${path.join(routesDir, routeFileName)}
 - Controller: ${path.join(controllersDir, controllerFileName)}
    `);
  } catch (err) {
    console.error('Error generating API:', err);
  } finally {
    rl.close();
  }
}

generateApi();