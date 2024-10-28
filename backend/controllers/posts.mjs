import fs from 'fs';
const postsFilePath = './posts.json';

/*GET POSTS*/
export const getPosts = (req, res) => {
  console.log('GET /posts request received');
  fs.readFile(postsFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Failed to read posts' });
    } else {
      try {
        const posts = JSON.parse(data);
        return res.json(posts);
      } catch (parseError) {
        console.log('Error parsing JSON:', parseError);
        return res.status(500).json({ message: 'Error parsing JSON' });
      }
    }
  });
};
/*POST POSTS*/
export const postPosts = (req, res) => {
  const reqLength = Object.keys(req.body).length;
  console.log('POST post/ request received:', req.body, reqLength);
  const { id, text, author, postId } = req.body;

  // READ
  fs.readFile(postsFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read posts' });
    }
    //post post
    const posts = JSON.parse(data);
    if (reqLength === 3) {
      const newPost = { id, text, author, comments: [] };
      posts.push(newPost);
    }
    //post comment
    if (reqLength === 4) {
      const postIndex = posts.findIndex((post) => post.id === postId);

      if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const newComment = { id, text, author, likes: 0, replies: [] };
      posts[postIndex].comments.push(newComment);
    }
    //post reply
    if (reqLength === 8) {
      const {
        id,
        author,
        postId,
        commentId,
        commentAutor,
        replyToId,
        replyAutor,
        text,
      } = req.body;

      //reply to comment
      const postIndex = posts.findIndex((post) => post.id === postId);
      const ourPost = posts[postIndex];
      const commentIndex = ourPost.comments.findIndex(
        (comment) => comment.id === commentId
      );
      if (replyToId == '') {
        const newReply = { id, author, text, replyTo: commentAutor, likes: 0 };
        console.log('newReply', newReply);
        //const repliesArray = posts[postIndex].comments[commentIndex].replies;
        posts[postIndex].comments[commentIndex].replies.unshift(newReply);
      }
      if (replyToId !== '') {
        const newReply = { id, author, text, replyTo: replyAutor, likes: 0 };
        console.log('newReply', newReply);
        const repliesArray = posts[postIndex].comments[commentIndex].replies;
        const replyToIndex = repliesArray.findIndex(
          (reply) => reply.id === replyToId
        );
        console.log('repliesArray', repliesArray);
        console.log('replyToIndex', replyToIndex);
        const newReplies = repliesArray.splice(replyToIndex + 1, 0, newReply);
        console.log('newReplies', newReplies);
      }
    }

    // WRITE
    fs.writeFile(postsFilePath, JSON.stringify(posts, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to write posts' });
      }

      return res.status(201).json();
    });
  });
};
/*DELETE POSTS*/
export const deletePosts = (req, res) => {
  const reqLength = Object.keys(req.body).length;
  console.log('reqLength', reqLength);
  const { postId, commentId, id } = req.body;
  console.log(
    'DELETE request received for post ID:',
    postId,
    'comment',
    commentId
  );
  // READ
  fs.readFile(postsFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read posts' });
    }
    const oldPosts = JSON.parse(data);

    let updatedPosts;
    // delete  post
    if (reqLength === 1) {
      updatedPosts = oldPosts.filter((post) => post.id !== postId);
    }
    // delete comment
    const postIndex = oldPosts.findIndex((post) => post.id === postId);
    if (reqLength === 2) {
      if (postIndex !== -1) {
        const oldComments = oldPosts[postIndex].comments;
        const newComments = oldComments.filter(
          (comment) => comment.id !== commentId
        );
        oldPosts[postIndex].comments = newComments;
        updatedPosts = oldPosts;
      } else {
        return res.status(404).json({ message: 'Post not found' });
      }
    }

    //delete reply
    if (reqLength === 3) {
      const commentIndex = oldPosts[postIndex].comments.findIndex(
        (comment) => comment.id == commentId
      );
      oldPosts[postIndex].comments[commentIndex].replies = oldPosts[
        postIndex
      ].comments[commentIndex].replies.filter((reply) => reply.id !== id);
      console.log();
      updatedPosts = oldPosts;
    }

    // WRITE
    fs.writeFile(
      postsFilePath,
      JSON.stringify(updatedPosts, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating posts' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
      }
    );
  });
};

/*EDIT*/
export const putPosts = (req, res) => {
  const reqLength = Object.keys(req.body).length;
  console.log('reqLength', reqLength);
  const { id, text, postId, commentId } = req.body;
  // READ
  fs.readFile(postsFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read posts' });
    }
    const oldPosts = JSON.parse(data);

    let updatedPosts;
    //edit post

    if (reqLength === 2) {
      console.log('edit post');
      const selectedPost = oldPosts.find((post) => post.id === id);

      selectedPost.text = text;
      updatedPosts = oldPosts;
    }
    // edit com
    const selectedPost = oldPosts.find((post) => post.id === postId);
    if (reqLength === 3) {
      console.log('edit comment');
      console.log('req.body', req.body);

      const selectedComment = selectedPost.comments.find(
        (comment) => comment.id === id
      );
      console.log('selectedComment', selectedComment);

      selectedComment.text = text;
      updatedPosts = oldPosts;
    }
    if (reqLength === 4) {
      console.log('edit comment');
      console.log('req.body', req.body);
      const selectedComment = selectedPost.comments.find(
        (comment) => comment.id == commentId
      );
      const selectedReply = selectedComment.replies.find(
        (reply) => reply.id == id
      );
      selectedReply.text = text;
      updatedPosts = oldPosts;
    }

    // WRITE
    fs.writeFile(
      postsFilePath,
      JSON.stringify(updatedPosts, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to write posts' });
        }
        console.log('Post edited');
        return res.status(201).json();
      }
    );
  });
};
