import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Update() {
  const { book_id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
  title: "",
  author_fname: "",
  author_lname: "",
  released_year: "",
  stock_quantity: "",
  pages: ""
});

  useEffect(() => {
    fetch(`http://localhost:3001/books/${book_id}`, {method:"GET"})
      .then(res => res.json())
      .then(data => setBook(data[0]));
  }, [book_id]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("1");
    fetch(`http://localhost:3001/books/${book_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    })
    .then(() => navigate("/"))
    .catch(err=> console.error(err));
    console.log("1");
  };
  const handleBack = () => {
    navigate("/");
  }

  return (
    <>

<div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">

  {/* BACK BUTTON */}
  <div className="w-full max-w-5xl mb-6 fixed top-6 left-6">
    <button
      onClick={handleBack}
      className="cursor-pointer bg-gray-900 text-center w-48 rounded-2xl h-14 relative text-white text-xl font-semibold group"
      type="button"
    >
      <div
        className="bg-purple-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          height="25px"
          width="25px"
        >
          <path
            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
            fill="#000000"
          ></path>
          <path
            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
            fill="#000000"
          ></path>
        </svg>
      </div>
      <p className="translate-x-2">Voltar</p>
    </button>
  </div>

  {/* MAIN CONTENT */}
  <div className="flex gap-12 w-full max-w-5xl">

    {/* LEFT SIDE */}
    <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Current Book</h2>

      {book && (
        <div className="space-y-2">
          <p><span className="font-semibold text-gray-400">Title:</span> {book.title}</p>
          <p><span className="font-semibold text-gray-400">Author:</span> {book.author_fname} {book.author_lname}</p>
          <p><span className="font-semibold text-gray-400">Year:</span> {book.released_year}</p>
          <p><span className="font-semibold text-gray-400">Stock:</span> {book.stock_quantity}</p>
          <p><span className="font-semibold text-gray-400">Pages:</span> {book.pages}</p>
        </div>
      )}
    </div>

    {/* RIGHT SIDE */}
    <div className="flex-1 bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Update Book</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="bg-gray-700 p-2 rounded" placeholder="Title"name="title" value={book.title} onChange={handleChange} />
        <input className="bg-gray-700 p-2 rounded" placeholder="Author first name "name="author_fname" value={book.author_fname} onChange={handleChange} />
        <input className="bg-gray-700 p-2 rounded" placeholder="Author last name"name="author_lname" value={book.author_lname} onChange={handleChange} />
        <input className="bg-gray-700 p-2 rounded" placeholder="Year released"name="released_year" value={book.released_year} onChange={handleChange} />
        <input className="bg-gray-700 p-2 rounded" placeholder="Stock quantity"name="stock_quantity" value={book.stock_quantity} onChange={handleChange} />
        <input className="bg-gray-700 p-2 rounded" placeholder="Number of pages"name="pages" value={book.pages} onChange={handleChange} />

        <button className="cursor-pointer bg-purple-600 hover:bg-purple-700 transition p-2 rounded mt-2">
          Atualizar
        </button>
      </form>
    </div>

  </div>
</div>


    </>
  );
}

export default Update;