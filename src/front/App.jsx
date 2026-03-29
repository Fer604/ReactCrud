import { useEffect, useState } from "react";

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/books")
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Books</h1>

      <div className="grid gap-4">
        {books.map((book) => (
          <div
            key={book.book_id}
            className="bg-gray-800 p-4 rounded-xl shadow"
          >
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-400">
              {book.author_fname} {book.author_lname}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;