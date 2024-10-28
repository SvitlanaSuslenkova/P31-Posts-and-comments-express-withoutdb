import express from 'express';
//import cors from 'cors';
import {
  getPosts,
  postPosts,
  deletePosts,
  putPosts,
} from '../controllers/posts.mjs';

const router = express.Router();

router.get('/', getPosts);
router.post('/', postPosts);
router.delete('/', deletePosts);
router.put('/', putPosts);

export default router;
