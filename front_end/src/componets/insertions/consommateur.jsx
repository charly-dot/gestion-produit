import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Consomateur() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    sexe: "",
    motDePasse: "",
    groupe: "",
    contact: "",
    email: "",
    profil: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }

      await axios.post(
        "http://127.0.0.1:8000/api/cree_super_utilisateurs",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (err) {
      console.error("Erreur :", err);
      setError("Information trop court");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4 ">
      <form
        onSubmit={handleSubmit}
        className="bg-cyan-500 w-full shadow-2xl max-w-lg p-6 sm:p-8 rounded-2xl shadow-lg space-y-5"
      >
        <h1 className="text-2xl font-bold text-center text-white">CREATION</h1>

        {/* Messages */}
        {error && <p className="text-red-500 text-center">{error}</p>}
       
        {success && (
          <p className=" font-semibold text-center bg-white rounded shadow-xl border border-white text-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 ">
          Vous êtes bien inscrit, vous pouvez vous authentifier
        </p>
        )}

        <div className="space-y-4">
          {/* Nom */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
            <label
              htmlFor="nom"
              className="font-medium"
              style={{ color: "#ffff00" }}
            >
              NOM :
            </label>
            <input
              id="nom"
              type="text"
              name="nom"
              required
              value={formData.nom}
              onChange={handleChange}
              className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Prénom */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
            <label
              htmlFor="prenom"
              className="font-medium"
              style={{ color: "#ffff00" }}
            >
              PRENOM :
            </label>
            <input
              id="prenom"
              type="text"
              name="prenom"
              required
              value={formData.prenom}
              onChange={handleChange}
              className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Mot de passe */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
            <label
              htmlFor="motDePasse"
              className="font-medium"
              style={{ color: "#ffff00" }}
            >
              MOT DE PASSE :
            </label>
            <input
              id="motDePasse"
              type="password"
              name="motDePasse"
              required
              value={formData.motDePasse}
              onChange={handleChange}
              minLength={5}
              pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$"
              title="Le mot de passe doit contenir au moins 5 caractères, avec au moins une lettre et un chiffre"
              placeholder="Mot de passe"
              className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
            <label
              htmlFor="contact"
              className="font-medium"
              style={{ color: "#ffff00" }}
            >
              CONTACTE :
            </label>
            <input
              id="contact"
              type="tel"
              name="contact"
              required
              value={formData.contact}
              onChange={handleChange}
              className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Email */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
            <label
              htmlFor="email"
              className="font-medium"
              style={{ color: "#ffff00" }}
            >
              EMAIL :
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Photo de profil */}
          <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
            <label
              htmlFor="profil"
              className="font-medium "
              style={{ color: "#ffff00" }}
            >
              PHOTO :
            </label>
            <input
              id="profil"
              type="file"
              name="profil"
              required
              onChange={handleChange}
              className="md:col-span-3 w-full px-4 py-2 border border-white rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-white bg-white"
            />
          </div>

          {/* Sexe + Groupe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sexe */}
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <label
                htmlFor="sexe"
                className="font-medium"
                style={{ color: "#ffff00" }}
              >
                SEXE :
              </label>
              <select
                id="sexe"
                name="sexe"
                required
                value={formData.sexe}
                onChange={handleChange}
                className="md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Sélectionnez</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
            </div>

            {/* Groupe */}
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
              <label
                htmlFor="groupe"
                className="font-medium"
                style={{ color: "#ffff00" }}
              >
                GROUPE:
              </label>
              <select
                id="groupe"
                name="groupe"
                required
                value={formData.groupe}
                onChange={handleChange}
                className="md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="">Sélectionnez</option>
                <option value="Consommateur">Consommateur</option>
                {/* <option value="fournisseur">fournisseur</option>
                <option value="entité">entité</option> */}
              </select>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div
          className="flex flex-col sm:flex-row justify-center items-center gap-3 pb-2"
          style={{ marginTop: "8%" }}
        >
          <button
            type="submit"
            className="w-full sm:w-auto px-[10%] bg-blue-600 text-white py-2 px-6 rounded-lg 
                       hover:bg-cyan-600 transition"
          >
            CREER
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-[8%] bg-red-500 text-white py-2 px-6 rounded-lg 
                       hover:bg-gray-400 transition"
          >
            ANNULER
          </button>
        </div>
      </form>
    </div>
  );
}
