import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../auth";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao cadastrar");
        return;
      }
      navigate("/login");
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
        <h1 className="text-3xl font-bold text-center">Criar conta</h1>

        {error && (
          <div className="bg-rose-500/20 text-rose-300 text-sm p-2 rounded">{error}</div>
        )}

        <input
          className="bg-gray-700 p-2 rounded"
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="bg-gray-700 p-2 rounded"
          name="email"
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="bg-gray-700 p-2 rounded"
          name="password"
          type="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
        />

        <button className="cursor-pointer bg-purple-600 hover:bg-purple-700 transition p-2 rounded font-semibold">
          Cadastrar
        </button>

        <p className="text-sm text-gray-400 text-center">
          Já tem conta?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
