import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [books, setBooks] = useState([]);
  const [reload, setReload] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/books", { method: "GET" })
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error(err));
  }, [reload]);

  const handlePage = () => {
    navigate("/Create");
  };
  const handleUpdate = (id) => {
    navigate(`/Update/${id}`);
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/books/${id}`, {
        method: "DELETE",
      });
      console.log("PINTO")

      if (response.ok) {
        setBooks(prevBooks =>
          prevBooks.filter(book => Number(book.book_id) !== Number(id))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 ">
      <div className="flex justify-between items-center mt-6 w-full mb-6">
        <div>
          <h2>Aluno:Fernando Aschwanden Soviersovski</h2>
          <h1 className="text-3xl font-bold">Books</h1>
        </div>
        <button
          onClick={handlePage}
          className="cursor-pointer transition-all bg-purple-700 text-white px-6 py-2 rounded-lg
          border-purple-800
          border-b-[4px] hover:brightness-110 hover:-translate-y-px hover:border-b-[6px]
          active:border-b-[2px] active:brightness-90 active:translate-y-0.5"
        >
          Registrar Livro
        </button>
      </div>



      <div className="grid gap-4 mb-6">
        {books.map((book) => (
          <div
            key={book.book_id}
            className="bg-gray-800 p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-400">
                {book.author_fname} {book.author_lname}
              </p>
            </div>

            <div>
              <div className="flex justify-end w-full gap-2 mt-2">
                <button
                  className="inline-flex cursor-pointer items-center justify-center px-4 py-2 bg-cyan-500 ease-in-out delay-75 hover:bg-cyan-600
                text-white text-sm font-medium rounded-md active:scale-95 transition-all duration-200"

                  onClick={() => handleUpdate(book.book_id)}
                >
                  <svg
                    className="h-5 w-5 mr-1 self-center items-center"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"
                    ></path>
                  </svg>
                  Edit
                </button>


                <button
                  className="inline-flex cursor-pointer items-center px-4 py-2 bg-rose-500 transition ease-in-out delay-75
                  hover:bg-rose-600 text-white text-sm font-medium rounded-md "

                  onClick={() => handleDelete(book.book_id)}
                >
                  <svg
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 
                      7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      stroke-width="2"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                    ></path>
                  </svg>

                  Deletar
                </button>

              </div>
            </div>
          </div>

        ))}

      </div>
    </div>
  )
}
export default Home;
