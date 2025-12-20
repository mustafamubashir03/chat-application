import express from 'express';

import { signIn, signUp } from '../../controllers/userController';
import { validator } from '../../middlewares/validator';
import { userSchemaSignInZod, userSchemaSignUpZod } from '@itz____mmm/common';
import { verifyEmailController } from '../../controllers/workspaceController';

const router = express.Router();

router.post('/signup', validator(userSchemaSignUpZod), signUp);
router.post('/signin', validator(userSchemaSignInZod), signIn);


export default router;
