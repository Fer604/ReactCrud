import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Update() {
  const { book_id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author_fname: "",
    author_lname: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3001/books/${book_id}`)
      .then(res => res.json())
      .then(data => setBook(data));
  }, [book_id]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3001/books/${book_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    }).then(() => navigate("/"));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <form onSubmit={handleSubmit} className="p-8 flex justify-between flex-col gap-2 items-center mt-6 mb-6">
          <input className="bg-gray-700"name="title" value={book.title} onChange={handleChange} />
          <input className="bg-gray-700"name="author_fname" value={book.author_fname} onChange={handleChange} />
          <input className="bg-gray-700"name="author_lname" value={book.author_lname} onChange={handleChange} />

          <button 
          type="submit"
          className="cursor-pointer bg-purple-600 p-2 rounded"
          >Atualizar</button>
        </form>
      </div>
    </>
  );
}

export default Update;