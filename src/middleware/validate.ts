import { body, ContextRunner } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateNewUser = [
  body('firstname').isString().escape().withMessage('firstname is required'),
  body('lastname').isString().escape().withMessage('lastname is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const validateUserLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const validate = (validations: ContextRunner[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
      }
    }

    next();
  };
}; 