import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API, saveSession } from "../auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao entrar");
        return;
      }
      saveSession(data.token, data.user);
      navigate("/");
    } catch {
      setError("Não foi possível conectar ao servidor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-4"
      >
        <h1 className="text-3xl font-bold text-center">Biblioteca</h1>
        <p className="text-gray-400 text-center text-sm">Entre com sua conta</p>

        {error && (
          <div className="bg-rose-500/20 text-rose-300 text-sm p-2 rounded">{error}</div>
        )}

        <input
          className="bg-gray-700 p-2 rounded"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="bg-gray-700 p-2 rounded"
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="cursor-pointer bg-purple-600 hover:bg-purple-700 transition p-2 rounded font-semibold">
          Entrar
        </button>

        <p className="text-sm text-gray-400 text-center">
          Não tem conta?{" "}
          <Link to="/register" className="text-purple-400 hover:underline">
            Cadastre-se
          </Link>
        </p>

        <p className="text-xs text-gray-500 text-center border-t border-gray-700 pt-3">
          Admin de teste: admin@biblioteca.com / admin123
        </p>
      </form>
    </div>
  );
}

export default Login;
