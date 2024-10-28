import express from 'express';
//import cors from 'cors';
import { putLikes } from '../controllers/likes.mjs';

const router = express.Router();

router.put('/likes', putLikes);

export default router;
