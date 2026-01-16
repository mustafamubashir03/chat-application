import express from 'express';

import { signIn, signUp } from '../../controllers/userController.js';
import { validator } from '../../middlewares/validator.js';
import { userSchemaSignInZod, userSchemaSignUpZod } from '@itz____mmm/common';
import { verifyEmailController } from '../../controllers/workspaceController.js';

const router = express.Router();

router.post('/signup', validator(userSchemaSignUpZod), signUp);
router.post('/signin', validator(userSchemaSignInZod), signIn);

export default router;
