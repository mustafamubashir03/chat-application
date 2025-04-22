import express from 'express';
const router = express.Router();
import v1Router from './v1/v1Router';

router.use('/v1', v1Router);

export default router;
