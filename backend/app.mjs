//import morgan from 'morgan';
//npm install --save-dev @types/cors
//package.json "type": "module", under main
//npm install typescript ts-node @types/node --save-dev

import express from 'express';
import cors from 'cors';

import postsRouter from './routes/posts.mjs'; //router in file
import likesRouter from './routes/likes.mjs';

const app = express();
app.use(cors());
//app.use(morgan('tiny'));

app.use(express.json()); //json to jsElement
//app.use(express.urlencoded({ extended: true })); //formDatta to obj
//app.use('/topicdiscussion', commentsRouter);
/*app.put('/likes', (req, res) => {
  console.log('likes request received, req.body:', req.body);
  res.status(200).json({ message: 'Likes updated successfully' });
});*/
app.put('/likes', likesRouter);
app.use('/', postsRouter);

app.listen(5000, () =>
  console.log('Server is running on http://localhost:5000')
);
