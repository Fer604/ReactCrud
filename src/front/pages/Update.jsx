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
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    }).then(() => navigate("/"));
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 text-white">
      <input name="title" value={book.title} onChange={handleChange} />
      <input name="author_fname" value={book.author_fname} onChange={handleChange} />
      <input name="author_lname" value={book.author_lname} onChange={handleChange} />

      <button type="submit">Atualizar</button>
    </form>
  );
}

export default Update;