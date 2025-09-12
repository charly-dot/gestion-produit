import { useEffect, useState, useContext } from "react";
import api from "../../../api/axios.js";
import { AuthContext } from "./../../../AuthContext";
import { useNavigate } from "react-router-dom";

export function AcceuilConsommater() {
  const navigate = useNavigate();
  const { DonneSession, logout } = useContext(AuthContext);

  // ✅ Tous les hooks déclarés en haut
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = DonneSession?.id;

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/liste_utilisateur/${userId}`);
      setUser(response.data);
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

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

  if (!DonneSession) {
    return <div className="text-center text-3xl text-red">Chargement...</div>;
  }

  return (
    <div>
      <div className="bg-gray-100 min-h-screen flex flex-col items-center">
        <div className="flex justify-center text-lg font-bold mb-6 gap-6">
          <a
            href=""
            className="border  border-gray-100  border-b-blue-500 text-blue-500 py-4 px-10"
            onClick={() => navigate("/liste_super_utilisateur")}
          >
            Utilisateurs
          </a>
          <a
            href=""
            className=" text-blue-500 py-4 px-10  hover:border  hover:border-gray-100  hover:border-b-blue-500"
            onClick={() => navigate("/suivit")}
          >
            Suivi achat
          </a>
          <a
            href=""
            className=" text-white py-4 px-10 text-blue-500  hover:border  hover:border-gray-100  hover:border-b-blue-500"
            onClick={() => navigate("/Transaction")}
          >
            Transaction
          </a>
          <a
            href=""
            className=" text-white py-4 px-10 text-blue-500  hover:border  hover:border-gray-100  hover:border-b-blue-500"
            onClick={() => navigate("/réception")}
          >
            Boîte de réception
          </a>
        </div>

        {/* Select rapide */}
        <select
          className="px-8 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onChange={(e) => {
            const value = e.target.value;
            if (value) window.location.href = value;
          }}
        >
          <option value="/liste_super_utilisateur">Liste</option>
          <option value="/cree_super_utilisateur">Créer</option>
          <option value="/groupe_utilisateur">Groupe</option>
        </select>

        {/* Messages */}
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

        {/* Corps principal */}
        {loading ? (
          <p className="text-white text-lg font-semibold">Chargement...</p>
        ) : user ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center transform transition duration-300 hover:scale-[1.02]">
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

            <div className="bg-white  rounded-xl max-w-lg mx-auto ml-[20%] mt-4 text-left space-y-2 text-gray-700">
              <p className="grid grid-cols-3 w-[90%]">
                <div className="grid grid-cols-2 gap-[50%]">
                  <strong>Nom</strong>:
                </div>{" "}
                {user.nom}
              </p>

              <p className="grid grid-cols-3 w-[90%]">
                <div className="grid grid-cols-2 gap-[50%]">
                  <strong>Prénom</strong>:
                </div>{" "}
                {user.prenom}
              </p>

              <p className="grid grid-cols-3 w-[90%]">
                <div className="grid grid-cols-2 gap-[50%]">
                  <strong>Sexe</strong>:
                </div>{" "}
                {user.sexe}
              </p>

              <p className="grid grid-cols-3 w-[90%]">
                <div className="grid grid-cols-2 gap-[50%]">
                  <strong>Rôle</strong>:
                </div>{" "}
                {user.role}
              </p>

              <p className="grid grid-cols-3 w-[90%]">
                <div className="grid grid-cols-2 gap-[50%]">
                  <strong>Contact</strong>:
                </div>{" "}
                {user.contact || "-"}
              </p>
              <p className="grid grid-cols-3 w-[90%]">
                <div className="grid grid-cols-2 gap-[50%]">
                  <strong>Email</strong>:
                </div>{" "}
                {user.email}
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleActivationToggle}
                className={`px-5 py-2 rounded-lg text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105 ${
                  user.activation === "activer"
                    ? "bg-orange-400 hover:bg-orange-500"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {user.activation === "activer" ? "DESACTIVER" : "ACTIVER"}
              </button>

              <button
                onClick={handleEdit}
                className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
              >
                MODIFIER
              </button>

              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
              >
                SUPPRIMER
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white font-semibold mt-10">
            Aucun utilisateur trouvé.
          </p>
        )}

        {/* Modal de modification */}
        {editUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white p-8 rounded-2xl w-full max-w-lg space-y-6 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-center text-blue-500 mb-4">
                MODIFICATION
              </h2>

              {/* NOM */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor="nom"
                  className="w-32 text-left font-medium text-gray-700"
                >
                  Nom :
                </label>
                <input
                  id="nom"
                  type="text"
                  value={editUser.nom}
                  onChange={(e) =>
                    setEditUser({ ...editUser, nom: e.target.value })
                  }
                  placeholder="Nom"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* PRENOM */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor="prenom"
                  className="w-32 text-left font-medium text-gray-700"
                >
                  Prénom :
                </label>
                <input
                  id="prenom"
                  type="text"
                  value={editUser.prenom}
                  onChange={(e) =>
                    setEditUser({ ...editUser, prenom: e.target.value })
                  }
                  placeholder="Prénom"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* SEXE */}

              <div className="flex items-center gap-4">
                <label
                  htmlFor="sexe"
                  className="w-32 text-left font-medium text-gray-700"
                >
                  Sexe :
                </label>

                <select
                  value={editUser.sexe}
                  onChange={(e) =>
                    setEditUser({ ...editUser, sexe: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="stock">HOMME</option>
                  <option value="flotte">FEMME</option>
                </select>

                {/* <input
                  id="sexe"
                  type="text"
                  value={editUser.sexe}
                  onChange={(e) =>
                    setEditUser({ ...editUser, sexe: e.target.value })
                  }
                  placeholder="Sexe"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                /> */}
              </div>

              {/* ROLE */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor="role"
                  className="w-32 text-left font-medium text-gray-700"
                >
                  Rôle :
                </label>
                <select
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="stock">CONSOMMATEUR</option>
                </select>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor="email"
                  className="w-32 text-left font-medium text-gray-700"
                >
                  Email :
                </label>
                <input
                  id="email"
                  type="email"
                  value={editUser.email || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  placeholder="Email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* CONTACT */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor="contact"
                  className="w-32 text-feft font-medium text-gray-700"
                >
                  Contact :
                </label>
                <input
                  id="contact"
                  type="text"
                  value={editUser.contact || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, contact: e.target.value })
                  }
                  placeholder="Contact"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-md"
                >
                  ANNULER
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
                >
                  VALIDER
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
