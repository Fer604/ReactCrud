import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API, getToken, isAdmin } from "../auth";

function Admin() {
  const [tab, setTab] = useState("loans");
  const [stats, setStats] = useState({ books: 0, users: 0, loans: 0 });
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const authHeaders = { Authorization: `Bearer ${getToken()}` };

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
      return;
    }
    fetch(`${API}/admin/stats`, { headers: authHeaders })
      .then((r) => r.json())
      .then(setStats);
    fetch(`${API}/admin/loans`, { headers: authHeaders })
      .then((r) => r.json())
      .then(setLoans);
    fetch(`${API}/admin/users`, { headers: authHeaders })
      .then((r) => r.json())
      .then(setUsers);
    fetch(`${API}/books`)
      .then((r) => r.json())
      .then(setBooks);
  }, []);

  const Card = ({ label, value, color }) => (
    <div className={`flex-1 rounded-xl p-5 ${color}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  const TabBtn = ({ id, children }) => (
    <button
      onClick={() => setTab(id)}
      className={`px-4 py-2 rounded-lg transition cursor-pointer ${
        tab === id ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel do Administrador</h1>
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer bg-gray-700 hover:bg-gray-600 transition px-4 py-2 rounded-lg"
        >
          Voltar ao catálogo
        </button>
      </div>

      {/* Estatísticas */}
      <div className="flex gap-4 mb-8">
        <Card label="Livros no acervo" value={stats.books} color="bg-purple-700" />
        <Card label="Usuários cadastrados" value={stats.users} color="bg-cyan-700" />
        <Card label="Livros emprestados" value={stats.loans} color="bg-amber-600" />
      </div>

      {/* Abas */}
      <div className="flex gap-2 mb-4">
        <TabBtn id="loans">Empréstimos</TabBtn>
        <TabBtn id="books">Acervo</TabBtn>
        <TabBtn id="users">Usuários</TabBtn>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 overflow-x-auto">
        {tab === "loans" && (
          <table className="w-full text-left">
            <thead className="text-gray-400 text-sm border-b border-gray-700">
              <tr>
                <th className="p-2">Livro</th>
                <th className="p-2">Usuário</th>
                <th className="p-2">Emprestado em</th>
                <th className="p-2">Devolução</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => (
                <tr key={l.id} className="border-b border-gray-700/50">
                  <td className="p-2">{l.book_title}</td>
                  <td className="p-2">{l.user_name}</td>
                  <td className="p-2">{l.borrowed_at}</td>
                  <td className="p-2">{l.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "books" && (
          <table className="w-full text-left">
            <thead className="text-gray-400 text-sm border-b border-gray-700">
              <tr>
                <th className="p-2">Título</th>
                <th className="p-2">Autor</th>
                <th className="p-2">ISBN</th>
                <th className="p-2">Estoque</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.book_id} className="border-b border-gray-700/50">
                  <td className="p-2">{b.title}</td>
                  <td className="p-2">
                    {b.author_fname} {b.author_lname}
                  </td>
                  <td className="p-2">{b.isbn || "—"}</td>
                  <td className="p-2">{b.stock_quantity ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "users" && (
          <table className="w-full text-left">
            <thead className="text-gray-400 text-sm border-b border-gray-700">
              <tr>
                <th className="p-2">Nome</th>
                <th className="p-2">E-mail</th>
                <th className="p-2">Perfil</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-700/50">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        u.role === "admin" ? "bg-amber-600" : "bg-gray-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Admin;
