import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Create() {
  const [book, setBook] = useState({
    title: "",
    author_fname: "",
    author_lname: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    }).then(() => navigate("/"));
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 text-white">
      <input name="title" placeholder="Title" onChange={handleChange} />
      <input name="author_fname" placeholder="First name" onChange={handleChange} />
      <input name="author_lname" placeholder="Last name" onChange={handleChange} />

      <button type="submit">Criar</button>
    </form>
  );
}

export default Create;