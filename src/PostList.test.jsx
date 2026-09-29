import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import PostList from './PostList.jsx';

const apiPosts = [
  {
    id: 101,
    title: 'APIsta haettu postaus',
    body: 'Tämän tekstin pitää tulla mockatusta API-vastauksesta.',
    tags: ['react', 'fetch'],
    reactions: { likes: 5, dislikes: 1 },
    views: 42,
    userId: 7,
  },
  {
    id: 102,
    title: 'Toinen API-postaus',
    body: 'Myös toinen postaus renderöidään.',
    tags: ['useeffect'],
    reactions: { likes: 9, dislikes: 0 },
    views: 77,
    userId: 8,
  },
];

function successfulResponse(posts = apiPosts) {
  return {
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue({ posts }),
  };
}

describe('PostList', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('näyttää lataustilan pyynnön aikana', async () => {
    let resolveRequest;
    fetch.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    render(<PostList />);

    expect(screen.getByText('Ladataan postauksia...')).toBeInTheDocument();

    resolveRequest(successfulResponse([]));

    await waitFor(() => {
      expect(screen.queryByText('Ladataan postauksia...')).not.toBeInTheDocument();
    });
  });

  test('hakee postaukset oikeasta osoitteesta kerran', async () => {
    fetch.mockResolvedValue(successfulResponse([]));

    render(<PostList />);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    expect(fetch.mock.calls[0][0]).toBe('https://dummyjson.com/posts');
  });

  test('renderöi APIsta saadut postaukset Post-komponentin avulla', async () => {
    fetch.mockResolvedValue(successfulResponse());

    render(<PostList />);

    expect(await screen.findByRole('heading', { name: 'APIsta haettu postaus' })).toBeInTheDocument();
    expect(screen.getByText('Tämän tekstin pitää tulla mockatusta API-vastauksesta.')).toBeInTheDocument();
    expect(screen.getByText('react, fetch')).toBeInTheDocument();
    expect(screen.getByText(/Tykkäyksiä: 5/)).toBeInTheDocument();
    expect(screen.getByText(/Katselukertoja: 42/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Toinen API-postaus' })).toBeInTheDocument();
  });

  test('näyttää virheen, jos palvelin vastaa virhetilalla', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn(),
    });

    render(<PostList />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Postausten lataaminen epäonnistui.');
    expect(screen.queryByText('Ladataan postauksia...')).not.toBeInTheDocument();
  });

  test('näyttää virheen myös verkkovirheessä', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    render(<PostList />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Postausten lataaminen epäonnistui.');
  });
});
