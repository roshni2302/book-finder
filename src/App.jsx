import React, { useEffect, useState } from "react";

export default function BookFinder() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const searchBooks = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&page=${page}`
      );
      const data = await res.json();
      setBooks(data.docs || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleFavorite = (book) => {
    const exists = favorites.find((b) => b.key === book.key);
    if (exists) {
      setFavorites(favorites.filter((b) => b.key !== book.key));
    } else {
      setFavorites([...favorites, book]);
    }
  };

  useEffect(() => {
    if (query) searchBooks();
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-sky-100 p-6 font-['Plus_Jakarta_Sans']">
      <main className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/60">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-pink-600 drop-shadow-sm">
            Book Finder 📚✨
          </h1>
          <p className="text-sm text-gray-600 mt-1">Your cozy pastel library corner</p>
        </header>

        <div className="flex gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books..."
            className="w-full rounded-2xl px-4 py-2.5 border border-pink-200 bg-white/80 focus:ring-2 focus:ring-pink-300 outline-none transition"
          />
          <button
            onClick={searchBooks}
            className="px-6 py-2.5 bg-pink-400 text-white rounded-full shadow-sm hover:bg-pink-500 hover:shadow-md transition"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-center text-pink-600">Loading...</p>}

        <ul className="space-y-4">
          {books.map((book) => (
            <li
              key={book.key}
              className="flex gap-4 p-4 bg-white/80 border border-pink-100 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
            >
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt="cover"
                  className="w-20 h-28 object-cover rounded-xl"
                />
              ) : (
                <div className="w-20 h-28 bg-pink-200 rounded-xl flex items-center justify-center text-pink-600 text-sm">
                  No Cover
                </div>
              )}

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-pink-700">
                  {book.title}
                </h2>
                <p className="text-sm text-gray-600">
                  {book.author_name?.join(", ") || "Unknown Author"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {book.first_publish_year || "Unknown Year"}
                </p>
              </div>

              <button
                onClick={() => toggleFavorite(book)}
                className={
                  favorites.find((b) => b.key === book.key)
                    ? "px-3 py-1 rounded-full bg-pink-400 text-white text-xs shadow-sm hover:bg-pink-500 transition"
                    : "px-3 py-1 rounded-full border border-pink-300 text-pink-600 text-xs hover:bg-pink-100 transition"
                }
              >
                {favorites.find((b) => b.key === book.key)
                  ? "Favorited ♥"
                  : "Favorite ♡"}
              </button>
            </li>
          ))}
        </ul>

        {books.length > 0 && (
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded-full border border-pink-200 bg-white/70 hover:bg-pink-100 transition disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-pink-600 font-medium">Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 rounded-full border border-pink-200 bg-white/70 hover:bg-pink-100 transition"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
