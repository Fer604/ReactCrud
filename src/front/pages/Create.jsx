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
    setBook(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleBack = () => {
    navigate("/");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    })
    .then(() => navigate("/"))
    .catch(err => console.error(err));
  };

  return (
    <>

    <div className="min-h-screen bg-gray-900 text-white p-8">
      <button
        onClick={handleBack}
        class="bg-gray-900 text-center w-48 rounded-2xl h-14 relative text-white text-xl font-semibold group"
        type="button"
      >
        <div
          class="bg-purple-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500"
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
        <p class="translate-x-2">Voltar</p>
      </button>


      <form className="p-8 flex justify-between flex-col gap-2 items-center mt-6 mb-6">
        <input 
          className="bg-gray-700 text-white p-2 rounded"
          name="title"
          value={book.title}
          placeholder="Title"
          onChange={handleChange}
        />

        <input 
          className="bg-gray-700 text-white p-2 rounded"
          name="author_fname"
          value={book.author_fname}
          placeholder="First name"
          onChange={handleChange}
        />

        <input 
          className="bg-gray-700 text-white p-2 rounded"
          name="author_lname"
          value={book.author_lname}
          placeholder="Last name"
          onChange={handleChange}
        />

        <input 
          className="bg-gray-700 text-white p-2 rounded"
          name="released_year"
          value={book.released_year}
          placeholder="Released year"
          onChange={handleChange}
        />

        <input 
          className="bg-gray-700 text-white p-2 rounded"
          name="stock_quantity"
          value={book.stock_quantity}
          placeholder="Stock quantity"
          onChange={handleChange}
        />

        <input 
          className="bg-gray-700 text-white p-2 rounded"
          name="pages"
          value={book.pages}
          placeholder="Pages"
          onChange={handleChange}
        />

        <button
         onClick={handleSubmit}
         className="cursor-pointer bg-purple-600 p-2 rounded"

        >
          Registrar
        </button>
      </form>
    </div>
      
    </>
  );
}

export default Create;