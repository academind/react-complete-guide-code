import classes from './PostItem.module.css';

function PostItem({ post }) {
  return (
    <article className={classes.item}>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}

export default PostItem;
