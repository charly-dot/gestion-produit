import { useState } from "react";
import axios from "axios";

export function CreateSuperUser() {
  const [name, setName] = useState("Charly");
  const [email, setEmail] = useState("superadmin@example.com");
  const [password, setPassword] = useState("0000");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/cree_super_user"); // GET selon ta route
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Erreur lors de la création du super utilisateur");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Créer un Super Administrateur
        </h2>

        <div>
          <label className="block text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
        >
          Créer
        </button>

        {message && (
          <p className="text-center text-green-600 font-semibold">{message}</p>
        )}
      </form>
    </div>
  );
}
