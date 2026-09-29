export default function Post({ post }) {
  return (
    <article className="post-card">
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p className="post-tags">{post.tags.join(', ')}</p>
      <p>Tykkäyksiä: {post.reactions.likes} · Katselukertoja: {post.views}</p>
    </article>
  );
}
