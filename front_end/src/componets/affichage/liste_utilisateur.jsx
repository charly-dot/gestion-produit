import { useEffect, useState } from "react";
import api from "../../api/axios";

export function ListeUtilisateur() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editUser, setEditUser] = useState(null); // pour le modal de modification

  // Récupérer tous les utilisateurs
  const fetchUsers = async () => {
    try {
      const response = await api.get("/liste_utilisateur");
      setUsers(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Activer / Désactiver un utilisateur
  const handleActivationToggle = async (user) => {
    const newStatus = user.activation === "activer" ? "desactiver" : "activer";
    try {
      const response = await api.patch(`/changer_activation/${user.id}`, {
        activation: newStatus,
      });

      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, activation: response.data.activation } : u
        )
      );

      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification de l'activation.");
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?"))
      return;

    try {
      const response = await api.delete(`/supprimer_super_utilisateur/${id}`);
      setUsers(users.filter((user) => user.id !== id));

      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression.");
    }
  };

  // Ouvrir modal modification
  const handleEdit = (user) => setEditUser(user);

  // Soumettre modification
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (let key in editUser) {
        data.append(key, editUser[key]);
      }

      const response = await api.post(
        `/modifier_utilisateur/${editUser.id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Mettre à jour localement
      setUsers(users.map((u) => (u.id === editUser.id ? response.data : u)));

      setSuccessMessage("Utilisateur modifié avec succès");
      setEditUser(null); // fermer modal
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification.");
    }
  };

  return (
    <div className="p-6 bg-cyan-500 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          <div className="flex gap-6 text-2xl font-bold">
            <a
              href=""
              className="text-white "
              onClick={() => navigate("/liste_super_utilisateur")}
            >
              Utilisateurs
            </a>
            <a
              href=""
              className="text-white/80 hover:text-white"
              onClick={() => navigate("/suivit")}
            >
              Suivi achat
            </a>
            <a
              href=""
              className="text-white/80 hover:text-white"
              onClick={() => navigate("/Transaction")}
            >
              Transaction
            </a>
            <a
              href=""
              className="text-white/80 hover:text-white"
              onClick={() => navigate("/réception")}
            >
              Boîte de réception
            </a>
          </div>
        </h2>

        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onChange={(e) => {
            const value = e.target.value;
            if (value) window.location.href = value; // redirection
          }}
        >
          <option value="/liste_super_utilisateur">Liste</option>
          <option value="/cree_super_utilisateur">Créer</option>
          <option value="/groupe_utilisateur">Groupe</option>
        </select>
      </div>

      {successMessage && (
        <p className="text-green-600 font-semibold mb-4 text-center">
          {successMessage}
        </p>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl shadow-lg p-2 flex flex-col items-center"
          >
            <img
              src={
                user.profil
                  ? `http://127.0.0.1:8000/storage/${user.profil}`
                  : "https://via.placeholder.com/100"
              }
              alt={user.nom}
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />

            <div className="space-y-1 text-center">
              <p>
                <strong>Nom:</strong> {user.nom}
              </p>
              <p>
                <strong>Prénom:</strong> {user.prenom}
              </p>
              <p>
                <strong>Sexe:</strong> {user.sexe}
              </p>
              <p>
                <strong>Rôle:</strong> {user.role}
              </p>
              <p>
                <strong>Contact:</strong> {user.contact || "-"}
              </p>
              <p>
                <strong>Activation:</strong> {user.activation}
              </p>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleActivationToggle(user)}
                className={`px-3 py-1 -500 text-white py-2 px-2 rounded-lg hover:bg-gray-400 transition ${
                  user.activation === "activer"
                    ? "bg-yellow-400 hover:bg-yellow-500"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {user.activation === "activer" ? "Désactiver" : "Activer"}
              </button>

              <button
                onClick={() => handleEdit(user)}
                className="bg-indigo-500 text-white py-2 px-3 rounded-lg hover:bg-gray-400 transition text-sm"
              >
                Modifier
              </button>

              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-gray-400 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal modification */}
      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white p-6 rounded-2xl w-full max-w-lg space-y-4 shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              Modifier utilisateur
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={editUser.nom}
                onChange={(e) =>
                  setEditUser({ ...editUser, nom: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Nom"
              />
              <input
                type="text"
                value={editUser.prenom}
                onChange={(e) =>
                  setEditUser({ ...editUser, prenom: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Prénom"
              />
              <input
                type="text"
                value={editUser.sexe}
                onChange={(e) =>
                  setEditUser({ ...editUser, sexe: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Sexe"
              />
              <input
                type="text"
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Rôle"
              />
              <input
                type="email"
                value={editUser.email || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Email"
              />
              <input
                type="text"
                value={editUser.contact || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, contact: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Contact"
              />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
              >
                Modifier
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
