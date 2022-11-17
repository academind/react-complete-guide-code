const names = ['Maximilian', 'Manuel'];

function Post() {
  const chosenName = Math.random() > 0.5 ? names[0] : names[1];

  return (
    <div>
      <p>{chosenName}</p>
      <p>React.js is awesome!</p>
    </div>
  );
}

export default Post;
