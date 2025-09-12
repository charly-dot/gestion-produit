import { useEffect, useState } from "react";
import api from "../../../api/axios.js";

export function AcceuilUtilisateur() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = 3; // ID de l'utilisateur à afficher

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/liste_utilisateur/${74}`);
      setUser(response.data);
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleActivationToggle = async () => {
    if (!user) return;
    const newStatus = user.activation === "activer" ? "desactiver" : "activer";
    try {
      const response = await api.patch(`/changer_activation/${user.id}`, {
        activation: newStatus,
      });
      setUser({ ...user, activation: response.data.activation });
      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch {
      setError("Erreur lors de la modification de l'activation.");
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?"))
      return;

    try {
      const response = await api.delete(
        `/supprimer_super_utilisateur/${user.id}`
      );
      setUser(null);
      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  const handleEdit = () => setEditUser(user);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser) return;

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

      setUser(response.data);
      setSuccessMessage("Utilisateur modifié avec succès");
      setEditUser(null);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch {
      setError("Erreur lors de la modification.");
    }
  };

  return (
    <div>
      <div className=" p-6 bg-gradient-to-br from-cyan-500 to-blue-600 min-h-screen flex flex-col items-center">
        <div className="bg-blue-600 flex justify-between items-center p-6 shadow-lg rounded-lg mb-6 w-[95%]">
          <p></p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/AcceuilConso");
            }}
          >
            <img
              src="/image/telephone.jfif"
              alt="Profil"
              className="w-16 h-16 object-cover rounded-full border-4 border-white shadow-md"
            />
          </a>
        </div>
        <div className="flex justify-between items-center mb-4 ">
          <div className="flex justify-center text-lg font-bold mb-6">
            <a
              href=""
              className="border-2 border-gray-800  text-cyan-600 bg-white py-4 px-4 rounded-l-lg"
              onClick={() => navigate("/liste_super_utilisateur")}
            >
              Utilisateurs
            </a>
            <a
              href=""
              className="text-black/80 border-2  border-gray-800 bg-white py-4 px-7 hover:text-cyan-500"
              onClick={() => navigate("/suivit")}
            >
              Modul
            </a>
            <a
              href=""
              className="text-black/80 border-2 border-gray-800 bg-white py-4 px-4 hover:text-cyan-500"
              onClick={() => navigate("/Transaction")}
            >
              Stock/Casier
            </a>
            <a
              href=""
              className="text-black/80 border-2 border-gray-800 bg-white py-4 px-7 hover:text-cyan-500"
              onClick={() => navigate("/Transaction")}
            >
              Véhicules
            </a>
            <a
              href=""
              className="text-black/80 border-2 border-gray-800 bg-white py-4 px-4 hover:text-cyan-500"
              onClick={() => navigate("/Transaction")}
            >
              Emplacements
            </a>
            <a
              href=""
              className="text-black/80 border-2 border-gray-800 bg-white py-4 px-4 hover:text-cyan-500"
              onClick={() => navigate("/Transaction")}
            >
              Transaction
            </a>
            <a
              href=""
              className="text-black/80 border-2 border-gray-800 bg-white py-4 px-1 hover:text-cyan-500 rounded-r-lg"
              onClick={() => navigate("/réception")}
            >
              Boîte de réception
            </a>
          </div>
        </div>
        <select
          className=" px-8 py-2  ml-[90%] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onChange={(e) => {
            const value = e.target.value;
            if (value) window.location.href = value; // redirection
          }}
        >
          <option value="/liste_super_utilisateur">Liste</option>
          <option value="/cree_super_utilisateur">Créer</option>
          <option value="/groupe_utilisateur">Groupe</option>
        </select>
        {successMessage && (
          <p className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4 shadow-md">
            {successMessage}
          </p>
        )}
        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 shadow-md">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-white text-lg font-semibold">Chargement...</p>
        ) : user ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center transform transition duration-300 hover:scale-[1.02]">
            {/* Image centrée */}
            <div className="flex justify-center">
              <img
                src={
                  user.profil
                    ? `http://127.0.0.1:8000/storage/${user.profil}`
                    : "https://via.placeholder.com/100"
                }
                alt={user.nom}
                className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-md"
              />
            </div>

            {/* Infos utilisateur */}
            <div className="bg-white p-6 rounded-xl max-w-lg mx-auto mt-4">
              <div className="text-left space-y-2">
                <p className="grid grid-cols-2 gap-4 text-gray-700">
                  <strong>Nom:</strong> {user.nom}
                </p>
                <p className="grid grid-cols-2 gap-4 text-gray-700">
                  <strong>Prénom:</strong> {user.prenom}
                </p>
                <p className="grid grid-cols-2 gap-4 text-gray-700">
                  <strong>Sexe:</strong> {user.sexe}
                </p>
                <p className="grid grid-cols-2 gap-4 text-gray-700">
                  <strong>Rôle:</strong> {user.role}
                </p>
                <p className="grid grid-cols-2 gap-4 text-gray-700">
                  <strong>Contact:</strong> {user.contact || "-"}
                </p>
                <p className="grid grid-cols-2 gap-4 text-gray-700">
                  <strong>Activation:</strong> {user.activation}
                </p>
              </div>

              {/* Boutons alignés sur une seule ligne */}
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleActivationToggle}
                  className={`px-5 py-2 rounded-lg text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105 ${
                    user.activation === "activer"
                      ? "bg-orange-400 hover:bg-orange-500"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {user.activation === "activer" ? "Désactiver" : "Activer"}
                </button>

                <button
                  onClick={handleEdit}
                  className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
                >
                  Modifier
                </button>

                <button
                  onClick={handleDelete}
                  className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white font-semibold mt-10">
            Aucun utilisateur trouvé.
          </p>
        )}

        {editUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white p-8 rounded-2xl w-full max-w-lg space-y-4 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-center text-cyan-600">
                Modifier utilisateur
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editUser.nom}
                  onChange={(e) =>
                    setEditUser({ ...editUser, nom: e.target.value })
                  }
                  className="input"
                  placeholder="Nom"
                />
                <input
                  type="text"
                  value={editUser.prenom}
                  onChange={(e) =>
                    setEditUser({ ...editUser, prenom: e.target.value })
                  }
                  className="input"
                  placeholder="Prénom"
                />
                <input
                  type="text"
                  value={editUser.sexe}
                  onChange={(e) =>
                    setEditUser({ ...editUser, sexe: e.target.value })
                  }
                  className="input"
                  placeholder="Sexe"
                />
                <input
                  type="text"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  className="input"
                  placeholder="Rôle"
                />
                <input
                  type="email"
                  value={editUser.email || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="input"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={editUser.contact || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, contact: e.target.value })
                  }
                  className="input"
                  placeholder="Contact"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
