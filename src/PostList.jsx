import Post from './Post';
import './PostList.css';

export default function PostList() {
  // HARJOITUS
  // Korvaa nämä esimerkkipostaukset APIsta haetuilla postauksilla.
  //
  // Hae osoitteesta https://dummyjson.com/posts useEffectin sisällä
  // käyttäen fetchiä ja async/awaitia. Vastauksen lista on data.posts.
  //
  // Tarvitset tilat ainakin:
  // - postauksille
  // - lataustilalle
  // - virheviestille

  const posts = [
    {
      id: 1,
      title: 'Ensimmäinen postaus',
      body: 'Tämä on esimerkkipostaus. Vaihda kovakoodatut tiedot APIsta haettuihin.',
      tags: ['harjoitus', 'react'],
      reactions: { likes: 12, dislikes: 2 },
      views: 45,
      userId: 1,
    },
    {
      id: 2,
      title: 'Toinen postaus',
      body: 'Näytä myös tämä postaus samalla Post-komponentilla.',
      tags: ['api', 'fetch'],
      reactions: { likes: 8, dislikes: 1 },
      views: 31,
      userId: 2,
    },
  ];

  return (
    <main className="posts-page">
      <h1>Postaukset</h1>
      <div className="posts-list">
        {posts.map((post) => <Post key={post.id} post={post} />)}
      </div>
    </main>
  );
}
