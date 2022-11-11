import { Link } from 'react-router-dom';

import classes from './PostList.module.css';

function PostList({ posts }) {
  return (
    <ul className={classes.list}>
      {posts.map((post) => (
        <li key={post.id}>
          <Link to={post.id.toString()}>{post.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export default PostList;
