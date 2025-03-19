import { Router } from 'express';
import { apiKeyMiddleware } from '../middlewares/apiKey.middleware';
import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';

const router = Router();

interface ExternalRouteBody {
    data: string;
}

router.post(
    '/',
    apiKeyMiddleware,
    [
        body('data').notEmpty().withMessage('data field is required')
    ],
    (req: Request<{}, {}, ExternalRouteBody>, res: Response<any>) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.json({ received: req.body.data });
    }
);

export default router;
