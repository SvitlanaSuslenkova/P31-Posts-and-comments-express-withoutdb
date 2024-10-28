import fs from 'fs';
const postsFilePath = './posts.json';

export const putLikes = (req, res) => {
  const reqLength = Object.keys(req.body).length;
  console.log('reqLength', reqLength);
  const { newLikes, postId, commentId, replyId } = req.body;

  // READ
  fs.readFile(postsFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read posts' });
    }
    const oldPosts = JSON.parse(data);

    let updatedPosts;

    // edit likes com
    const selectedPost = oldPosts.find((post) => post.id === postId);
    if (reqLength === 3) {
      const selectedComment = selectedPost.comments.find(
        (comment) => comment.id === commentId
      );
      selectedComment.likes = newLikes;
      updatedPosts = oldPosts;
    }
    if (reqLength === 4) {
      const selectedComment = selectedPost.comments.find(
        (comment) => comment.id == commentId
      );
      const selectedReply = selectedComment.replies.find(
        (reply) => reply.id == replyId
      );
      selectedReply.likes = newLikes;
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
