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
    const lowerApiName = apiName.toLowerCase();
    const routeFileName = `${lowerApiName}.routes.ts`;
    const controllerFileName = `${lowerApiName}.controller.ts`;
    const modelFileName = `${lowerApiName}.entity.ts`;

    const routesDir = path.join(__dirname, '../src/routes');
    const controllersDir = path.join(__dirname, '../src/controllers');
    const modelsDir = path.join(__dirname, '../src/models');

    // Ensure directories exist
    if (!fs.existsSync(routesDir)) fs.mkdirSync(routesDir, { recursive: true });
    if (!fs.existsSync(controllersDir)) fs.mkdirSync(controllersDir, { recursive: true });
    if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });

    // Route template
    const routeTemplate = `import { Router } from 'express';
import { create${apiName}, get${apiName}s, update${apiName}, delete${apiName} } from '../controllers/${lowerApiName}.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();

router.post('/', validationMiddleware, create${apiName});
router.get('/', get${apiName}s);
router.put('/:id', validationMiddleware, update${apiName});
router.delete('/:id', delete${apiName});

export default router;
`;

    // Controller template with basic ORM example using TypeORM's repository pattern
    const controllerTemplate = `import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { ${apiName} } from '../models/${lowerApiName}.entity';

export const create${apiName} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repo = getRepository(${apiName});
    // Create a new entity using request body data
    const newEntry = repo.create(req.body);
    const result = await repo.save(newEntry);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const get${apiName}s = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repo = getRepository(${apiName});
    const results = await repo.find();
    res.json(results);
  } catch (error) {
    next(error);
  }
};

export const update${apiName} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repo = getRepository(${apiName});
    const result = await repo.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const delete${apiName} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const repo = getRepository(${apiName});
    await repo.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
`;

    // ORM model template using TypeORM
    const modelTemplate = `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ${apiName} {
  @PrimaryGeneratedColumn()
  id: number;

  // Add your properties below
  @Column()
  name: string;
}
`;

    fs.writeFileSync(path.join(routesDir, routeFileName), routeTemplate);
    fs.writeFileSync(path.join(controllersDir, controllerFileName), controllerTemplate);
    fs.writeFileSync(path.join(modelsDir, modelFileName), modelTemplate);
    
    console.log(`API files generated:
 - Route: ${path.join(routesDir, routeFileName)}
 - Controller: ${path.join(controllersDir, controllerFileName)}
 - Model: ${path.join(modelsDir, modelFileName)}
    `);
  } catch (err) {
    console.error('Error generating API:', err);
  } finally {
    rl.close();
  }
}

generateApi();