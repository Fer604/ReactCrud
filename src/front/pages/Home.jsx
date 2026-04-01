import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/books", { method: "GET" })
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  }, []);

  const handlePage = () => {
    navigate("/Create");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Books</h1>
      
      <div className="flex justify-center mt-6">

        <button onClick={handlePage} className="cursor-pointer transition-all bg-purple-700 text-white px-6 py-2 rounded-lg
          border-purple-800
          border-b-[4px] hover:brightness-110 hover:-translate-y-px hover:border-b-[6px]
          active:border-b-[2px] active:brightness-90 active:translate-y-0.5">
          Registrar Livro
        </button>

      </div>



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
  )
}
export default Home;
