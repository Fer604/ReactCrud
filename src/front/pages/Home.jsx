import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, getToken, getUser, isAdmin, isLoggedIn, logout } from "../auth";

function Home() {
  const [books, setBooks] = useState([]);
  const [myLoans, setMyLoans] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const user = getUser();
  const admin = isAdmin();

  const authHeaders = { Authorization: `Bearer ${getToken()}` };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  const loadBooks = (q = "") => {
    fetch(`${API}/books?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  };

  const loadMyLoans = () => {
    fetch(`${API}/loans/me`, { headers: authHeaders })
      .then((res) => res.json())
      .then((data) => setMyLoans(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadBooks();
    loadMyLoans();
  }, []);

  // Busca avançada (título, autor ou ISBN)
  useEffect(() => {
    const timer = setTimeout(() => loadBooks(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API}/books/${id}`, { method: "DELETE" });
      if (response.ok) {
        setBooks((prev) => prev.filter((b) => Number(b.book_id) !== Number(id)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBorrow = async (book_id) => {
    try {
      const res = await fetch(`${API}/loans`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ book_id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erro ao emprestar");
        return;
      }
      loadBooks(search);
      loadMyLoans();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReturn = async (loanId) => {
    try {
      const res = await fetch(`${API}/loans/${loanId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (res.ok) {
        loadBooks(search);
        loadMyLoans();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Topo */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-gray-400">Olá, {user?.name}</h2>
          <h1 className="text-3xl font-bold">Catálogo de Livros</h1>
        </div>
        <div className="flex gap-2">
          {admin && (
            <>
              <button
                onClick={() => navigate("/admin")}
                className="cursor-pointer bg-amber-600 hover:bg-amber-700 transition text-white px-4 py-2 rounded-lg"
              >
                Painel Admin
              </button>
              <button
                onClick={() => navigate("/Create")}
                className="cursor-pointer bg-purple-700 hover:bg-purple-800 transition text-white px-4 py-2 rounded-lg"
              >
                Registrar Livro
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            className="cursor-pointer bg-gray-700 hover:bg-gray-600 transition text-white px-4 py-2 rounded-lg"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Meus empréstimos (apenas usuário comum) */}
      {!admin && (
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Meus Empréstimos</h2>
        {myLoans.length === 0 ? (
          <p className="text-gray-500 text-sm">Você não tem livros emprestados.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {myLoans.map((loan) => (
              <li
                key={loan.id}
                className="flex justify-between items-center bg-gray-700/50 rounded-lg px-4 py-2"
              >
                <div>
                  <span className="font-medium">{loan.book_title}</span>
                  <span className="text-gray-400 text-sm">
                    {" "}
                    · devolver até {loan.due_date}
                  </span>
                </div>
                <button
                  onClick={() => handleReturn(loan.id)}
                  className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 transition text-white text-sm px-3 py-1 rounded-md"
                >
                  Devolver
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      )}

      {/* Busca avançada */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Busca avançada: título, autor ou ISBN..."
          className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none text-white p-3 rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">{books.length} livro(s) encontrado(s)</p>
      </div>

      {/* Lista */}
      <div className="grid gap-4">
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
              <p className="text-gray-500 text-sm">
                ISBN: {book.isbn || "—"} · {book.released_year || "?"} · Estoque:{" "}
                {book.stock_quantity ?? 0}
              </p>
            </div>

            <div className="flex gap-2">
              {!admin && (
                <button
                  disabled={(book.stock_quantity ?? 0) <= 0}
                  className="cursor-pointer px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition"
                  onClick={() => handleBorrow(book.book_id)}
                >
                  {(book.stock_quantity ?? 0) <= 0 ? "Indisponível" : "Emprestar"}
                </button>
              )}

              {admin && (
                <>
                  <button
                    className="cursor-pointer px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-md transition"
                    onClick={() => navigate(`/Update/${book.book_id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="cursor-pointer px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-md transition"
                    onClick={() => handleDelete(book.book_id)}
                  >
                    Deletar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {books.length === 0 && (
          <p className="text-gray-500 text-center mt-8">Nenhum livro encontrado.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
