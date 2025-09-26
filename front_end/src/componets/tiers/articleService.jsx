import * as React from "react";
import { AuthContext } from "../../AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
//tableau
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

/// incons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { FiRepeat } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";
import { FiList } from "react-icons/fi";

export function Article_Service() {
  ///message de reuci
  const [message, setMessage] = useState(null);
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000); // disparaît après 3 sec
  };
  const [navbar, setNavbar] = useState("");
  const [loading, setLoading] = useState(false);
  // const showMessage = (type, message) => {
  //   alert(`${type.toUpperCase()} : ${message}`);
  // };
  const { DonneSession, logout } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /// AFFICHAGE
  // navbar
  const [ListeProduit, setListeProduit] = useState([]);
  const [NavbarDocuments, setNavbarDocuments] = useState("TSS");
  const [ActivationAffichage, setActivationAffichage] = useState(null);
  const [condition_navbar, setcondition_navbar] = useState(null);
  const [showTIERS, setShowTIERS] = useState(false);

  const handleSelect = (section, navbar) => {
    setActivationAffichage(section);
    setcondition_navbar(navbar);
  };

  //   LISTE PRODUIT
  const ColunneProduit = [
    // { field: "id", headerName: "N°", width: 40 },
    { field: "colonnes", headerName: "TYPE", width: 150 },
    { field: "nomProduit", headerName: "NOM", width: 150 },
    { field: "categorie", headerName: "CATEGORIE", width: 150 },
    { field: "type_categorie", headerName: "TYPE CATEGORIE", width: 150 },
    { field: "prix", headerName: "PRIX", width: 150 },
    { field: "date_peremption", headerName: "date_peremption", width: 150 },
    {
      field: "action",
      headerName: "ACTIONS",
      width: 100,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDonne_PRODUIT(params.row);
              handleSelect("detailSERVICE", "SERVICE");
            }}
            className="text-blue-500 hover:text-blue-600"
          >
            <VisibilityIcon />
          </button>
        </div>
      ),
    },
  ];
  const listeP = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/liste_ArticleService"
      );
      setListeProduit(response.data);
      setOriginalListe(response.data);
      console.log(response.data);
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };
  //   INSERTION PRODUIT
  // On définit la date du jour au format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: today,
  });
  const [formDataP, setformDataP] = useState({
    nomProduit: "",
    prix: "",
    zone: "",
    fichier: null,
    type_categorie: "",
    categorie: "",
    code_compta: "",
    stock_minimum: "",
    date_peremption: "",
  });
  // changement input
  const handleChangeP = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setformDataP((prev) => ({ ...prev, [name]: files[0] })); // fichier
    } else {
      setformDataP((prev) => ({ ...prev, [name]: value }));
    }
  };
  // soumission
  const handleSubmit_PRODUIT = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      for (const key in formDataP) {
        formData.append(key, formDataP[key]);
      }

      await axios.post(
        "http://127.0.0.1:8000/api/creationArticleService",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setformDataP({
        nomProduit: "",
        prix: "",
        zone: "",
        fichier: null,
        type_categorie: "",
        categorie: "",
        code_compta: "",
        stock_minimum: "",
        date_peremption: "",
      });
      listeP();
      handleSelect("ListeSERVICE", "SERVICE");
      showMessage("success", "Insertion avec succès ");
    } catch (err) {
      console.error("Erreur :", err.response?.data || err.message);
      setError("Erreur de soumission : vérifie les champs.");
    }
  };

  ///detait
  const [Donne_PRODUIT, setDonne_PRODUIT] = useState(null);

  //   ACTIVATION
  const etat_PRODUIT = async (id, currentEtat) => {
    const newStatus = currentEtat === "activer" ? "desactiver" : "activer";

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/changer_activation_ArticleService/${id}`,
        { activation: newStatus }
      );

      // mettre à jour l'état local pour re-render
      setDonne_PRODUIT((prev) => ({
        ...prev,
        colonne: response.data.activation,
      }));

      listeP(); // optionnel si tu veux actualiser la liste complète
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification de l'activation ❌");
    }
  };
  /// MODIFICATION
  const [valeurPRODUIT, setvaleurPRODUIT] = useState([]);
  const ModifePRODUIT = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Ajout des champs simples
      Object.keys(Donne_PRODUIT).forEach((key) => {
        if (key !== "fichier") {
          formData.append(key, Donne_PRODUIT[key]);
        }
      });

      // Ajout du fichier si présent
      if (Donne_PRODUIT.fichier instanceof File) {
        formData.append("fichier", Donne_PRODUIT.fichier);
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/modifier_ArticleService/${Donne_PRODUIT.id}?_method=PUT`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      listeP();
      handleSelect("ListeSERVICE", "SERVICE");
      showMessage("success", "Modification avec succès ");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification du produit ❌");
    }
  };

  // DOCUMENT
  // COLONNE DOCUMENTS
  const colonne_Documents = [
    { field: "DOCUMENT", headerName: "DOCUMENT", width: 380 },
    { field: "ETAT", headerName: "ETAT", width: 350 },
    { field: "NOMBRE", headerName: "VALEUR", width: 310 },
  ];
  const row_documents = [
    {
      id: 1,
      DOCUMENT: "Entreprise B",
      ETAT: "VALIDER",
      NOMBRE: 3,
    },
    {
      id: 2,
      DOCUMENT: "FACTURE",
      ETAT: "LIVRE",
      NOMBRE: 7,
    },
    {
      id: 3,
      DOCUMENT: "LIVRAISON",
      ETAT: "A LIVRE",
      NOMBRE: 3,
    },
    {
      id: 4,
      DOCUMENT: "LIVRAISON",
      ETAT: "VALIDER",
      NOMBRE: 9,
    },
  ];

  ///rechrerche article
  const [OriginalListe, setOriginalListe] = useState([]);
  const [formDataSearche, setformDataSearche] = useState({
    nomProduit: "", // 🔥 correspond à ton backend
    type_categorie: "",
    zone: "",
    categorie: "",
    colonnes: "",
  });

  const handleChangeSearche = (e) => {
    const { name, value } = e.target;
    setformDataSearche((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearcheSubmit = (e) => {
    e.preventDefault();

    const filtered = OriginalListe.filter((item) => {
      return (
        (formDataSearche.nomProduit === "" ||
          (item.nomProduit || "")
            .toLowerCase()
            .includes(formDataSearche.nomProduit.toLowerCase())) &&
        (formDataSearche.zone === "" ||
          (item.zone || "")
            .toLowerCase()
            .includes(formDataSearche.zone.toLowerCase())) &&
        (formDataSearche.type_categorie === "" ||
          (item.type_categorie || "") === formDataSearche.type_categorie) &&
        (formDataSearche.categorie === "" ||
          (item.categorie || "") === formDataSearche.categorie) &&
        (formDataSearche.colonnes === "" ||
          (item.colonnes || "") === formDataSearche.colonnes)
      );
    });

    setListeProduit(filtered);
  };

  // bouton RAFRAICHIR
  const handleRefresh = () => {
    setformDataSearche({
      nomProduit: "",
      zone: "",
      type_categorie: "",
      categorie: "",
      colonnes: "",
    });
    setListeProduit(OriginalListe); // remettre la liste complète
  };

  // ::::PRIX
  /// modification prix
  const [nouveauPrix, setNouveauPrix] = useState("");
  const modifeprix = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...Donne_PRODUIT,
        prix: nouveauPrix, // ⬅️ on remplace par le nouveau prix
      };

      const response = await axios.put(
        `http://127.0.0.1:8000/api/modifier_PRODUIT/${Donne_PRODUIT.id}`,
        payload
      );

      setNouveauPrix(""); // vider après succès
      listeP();
      setmodificationprix(false);
      handleSelect("PRIX", "PRIX");
      showMessage("success", "Modification effectuée avec succès");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification du produit");
    }
  };

  /// PRIX
  const row_Prix = [
    {
      id: 4,
      PRODUIT: "Ordinateur",
      PRIX: "12000",
      DATE: "13/06/2025",
      UTILISATEUR: "Magasin C",
    },
    {
      id: 2,
      PRODUIT: "Telephone",
      PRIX: "50000",
      DATE: "23/06/2025",
      UTILISATEUR: "Magasin C",
    },
    {
      id: 3,
      PRODUIT: "Canapier",
      PRIX: "40000",
      DATE: "13/07/2025",
      UTILISATEUR: "Magasin C",
    },
  ];
  const ColunnePrix = [
    { field: "id", headerName: "id", width: 40 },
    { field: "PRODUIT", headerName: "PRODUIT", width: 266 },
    { field: "PRIX", headerName: "PRIX", width: 250 },
    { field: "DATE", headerName: "DATE", width: 250 },
    { field: "UTILISATEUR", headerName: "UTILISATEUR", width: 230 },
  ];
  const [modificationprix, setmodificationprix] = useState(false);

  const colonne_prix = [
    { field: "nomProduit", headerName: "NOM", width: 430 },
    { field: "prix", headerName: "PRIX", width: 430 },
    {
      field: "action",
      headerName: "ACTIONS",
      width: 122,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDonne_PRODUIT(params.row);
              setmodificationprix(true);
              console.log(Donne_PRODUIT);
            }}
            className="text-blue-500 hover:text-blue-600"
          >
            <EditIcon />
          </button>
        </div>
      ),
    },
  ];
  React.useEffect(() => {
    listeP();
    handleSelect("SERVICE", "SERVICE");
    // handleSelect("ListePRODUIT", "PRODUIT");
  }, []);
  if (!DonneSession) {
    return <div className="text-center text-3xl text-red">Chargement...</div>;
  }
  return (
    <div className="flex flex-col  bg-gray-200 ">
      {/* overflow-auto  h-screen*/}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl p-4 ">
          {/* Profil */}
          <div className="text-center mb-6">
            <img
              src={
                DonneSession?.profil
                  ? `http://localhost:8000/storage/${DonneSession.profil}`
                  : "/default-avatar.png"
              }
              alt="Profil"
              className="w-20 h-20 mx-auto rounded-full border-4 border-blue-500 shadow-md"
            />
            <h2 className="text-blue-600 font-semibold text-lg">
              {DonneSession.nom}
            </h2>
            <p className="text-sm text-gray-500">{DonneSession.groupe}</p>
          </div>

          {/* Menu */}
          <div className="space-y-2">
            <h1
              onClick={() => setShowTIERS((prev) => !prev)}
              className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition"
            >
              SERVICE
            </h1>

            {showTIERS && (
              <div className="ml-3 mt-1 space-y-1">
                <a
                  onClick={() => handleSelect("InsertionSERVICE", "SERVICE")}
                  className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  CRÉER
                </a>
                <a
                  onClick={() => handleSelect("SERVICE", "SERVICE")}
                  className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  LISTE
                </a>
              </div>
            )}

            <h1 className="cursor-pointer text-sm font-semibold text-gray-700  py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
              <Link to="/produits_tiers">PRODUIT</Link>
            </h1>
            <h1 className="cursor-pointer text-sm font-semibold text-gray-700  py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
              <Link to="/CASIER">CASIER</Link>
            </h1>
            <h1 className="cursor-pointer text-sm font-semibold text-gray-700  py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
              <Link to="/ENTREPOT">ENTREPOT</Link>
            </h1>
            <a
              onClick={() => handleSelect("HISTORIQUE", "HISTORIQUE")}
              className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
            >
              HISTORIQUE
            </a>
          </div>
        </div>

        {/* Contenu droit */}
        <div className="flex-1 bg-gray-200 p-6">
          {/* Navbar */}
          <div className="flex justify-center text-lg font-bold mb-2">
            {["SERVICE", "PRIX", "DOCUMENT", "HISTORIQUE"].map((item) => (
              <button
                key={item}
                className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                  condition_navbar === item ? "border-b-blue-500" : ""
                }`}
                onClick={() => handleSelect(item, item)}
              >
                {item}
              </button>
            ))}
          </div>
          {(ActivationAffichage === "SERVICE" ||
            ActivationAffichage === "ListeSERVICE") && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div className="flex  items-center justify-between ">
                {/* <h1 className="text-2xl font-bold text-blue-600 mb-4 md:mb-0">
                  LISTE PRODUIT
                </h1> */}
                <form
                  onSubmit={handleSearcheSubmit}
                  className="grid grid-cols-9 gap-4 items-center justify-end"
                >
                  {/* NOM */}
                  <div>
                    <label
                      htmlFor="colonnes"
                      className="font-semibold text-gray-700"
                    >
                      TYPE
                    </label>
                    <select
                      id="colonnes"
                      value={formDataSearche.colonnes}
                      onChange={handleChangeSearche}
                      name="colonnes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(OriginalListe.map((item) => item.colonnes)),
                      ].map((colonnes, index) => (
                        <option key={`colonnes-${index}`} value={colonnes}>
                          {colonnes}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="nomProduit"
                      className="font-semibold text-gray-700"
                    >
                      NOM
                    </label>
                    <input
                      name="nomProduit"
                      value={formDataSearche.nomProduit}
                      onChange={handleChangeSearche}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* ZONE */}
                  <div>
                    <label
                      htmlFor="zone"
                      className="font-semibold text-gray-700"
                    >
                      ZONE
                    </label>
                    <input
                      name="zone"
                      value={formDataSearche.zone}
                      onChange={handleChangeSearche}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* COLONNES */}

                  {/* CATEGORIE */}
                  <div>
                    <label
                      htmlFor="categorie"
                      className="font-semibold text-gray-700"
                    >
                      CATEGORIE
                    </label>
                    <select
                      id="categorie"
                      value={formDataSearche.categorie}
                      onChange={handleChangeSearche}
                      name="categorie"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(OriginalListe.map((item) => item.categorie)),
                      ].map((categorie, index) => (
                        <option key={`categorie-${index}`} value={categorie}>
                          {categorie}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* TYPE_CATEGORIE */}
                  <div>
                    <label
                      htmlFor="type_categorie"
                      className="font-semibold text-gray-700"
                    >
                      TYPE_CATEG
                    </label>
                    <select
                      id="type_categorie"
                      value={formDataSearche.type_categorie}
                      onChange={handleChangeSearche}
                      name="type_categorie"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(
                          OriginalListe.map((item) => item.type_categorie)
                        ),
                      ].map((type_categorie, index) => (
                        <option key={`type-${index}`} value={type_categorie}>
                          {type_categorie}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="nomProduit"
                      className="font-semibold text-gray-700"
                    >
                      UTILISATEUR
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* BOUTONS */}
                  <div className="ml-6">
                    <label
                      htmlFor="nomProduit"
                      className="font-semibold text-white"
                    >
                      UTILI
                    </label>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                      FILTRER
                    </button>
                  </div>
                  <div className="ml-6">
                    <label
                      htmlFor="nomProduit"
                      className="font-semibold text-white"
                    >
                      UTILI
                    </label>
                    <button
                      onClick={handleRefresh}
                      type="button"
                      className=" bg-gray-500 text-white py-2 px-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      RAFRAICHIR
                    </button>
                  </div>
                </form>
              </div>
              <div>
                {message && (
                  <div
                    className={` right-4 bg-green-300 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded shadow-md
      ${message.type === "success" ? "bg-green-500 text-white" : ""}
      ${message.type === "error" ? "bg-red-500 text-white" : ""}
      ${message.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
              <Box sx={{ height: "55vh" }}>
                <DataGrid
                  rows={ListeProduit}
                  columns={ColunneProduit}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  loading={loading}
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#3B82F6", // bleu
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                      color: "#fff", // texte blanc
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-columnHeader": {
                      backgroundColor: "#3B82F6", // pour chaque cellule d’en-tête
                      color: "#fff",
                    },
                  }}
                />
              </Box>
            </div>
          )}
          {ActivationAffichage === "InsertionSERVICE" && (
            <div>
              <form
                onSubmit={handleSubmit_PRODUIT}
                className="bg-white p-6 rounded-lg shadow-md   space-y-6"
              >
                <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                  CREATION
                </h1>

                {/* Grid principale : 2 champs par ligne */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      label: "NOM",
                      name: "nomProduit",
                      type: "text",
                      required: true,
                    },
                    {
                      label: "PRIX",
                      name: "prix",
                      type: "number",
                      required: true,
                    },

                    {
                      label: "ZONE",
                      name: "zone",
                      type: "text",
                      required: true,
                    },

                    {
                      label: "CODE COMPTA",
                      name: "code_compta",
                      type: "text",
                    },
                    {
                      label: "STOCK MINIMUM",
                      name: "stock_minimum",
                      type: "number",
                    },
                    {
                      label: "DATE PEREMPTION",
                      name: "date_peremption",
                      type: "date",
                    },
                  ].map((field) => (
                    <div key={field.name} className="flex items-center gap-4">
                      <label className="w-32 font-medium text-gray-700">
                        {field.label}:
                      </label>

                      <input
                        type={field.type}
                        name={field.name}
                        onChange={handleChangeP}
                        required={field.required || false}
                        {...(field.type !== "file"
                          ? { value: formDataP[field.name] }
                          : {})}
                        className=" flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                      />
                      {field.required ? (
                        <span className="text-red-600">(*)</span>
                      ) : (
                        <span className="text-white">(*)</span>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-gray-700 w-32">
                      FICHIER JOINT :
                    </label>
                    <input
                      type="file"
                      name="fichier"
                      onChange={handleChangeP} // <-- obligatoire pour récupérer le fichier
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md bg-gray-100 w-32"
                    />
                    <span className="text-red-600">(*)</span>
                  </div>
                  {/* Type categorie */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      TYPE CATEGORIE :
                    </label>
                    <select
                      name="type_categorie"
                      value={formDataP.type_categorie}
                      onChange={handleChangeP}
                      required
                      className="flex-1 px-4 py-2 border rounded-md"
                    >
                      <option value="">...</option>
                      <option value="Stock">Stock</option>
                      <option value="Flotte">Flotte</option>
                    </select>
                    <span className="text-red-600">(*)</span>
                  </div>

                  {/* Categorie */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      CATEGORIE :
                    </label>
                    <select
                      name="categorie"
                      value={formDataP.categorie}
                      onChange={handleChangeP}
                      required
                      className="flex-1 px-4 py-2 border rounded-md"
                    >
                      <option value="">...</option>
                      <option value="Entretien">Entretien</option>
                      <option value="Alimentation">Alimentation</option>
                    </select>
                    <span className="text-red-600">(*)</span>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                  >
                    VALIDER
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect("SERVICE", "SERVICE")}
                    className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    ANNULER
                  </button>
                </div>

                {error && <p className="text-red-600 text-center">{error}</p>}
                {success && (
                  <p className="text-green-600 text-center">
                    Produit inséré avec succès ✅
                  </p>
                )}
              </form>
            </div>
          )}
          {ActivationAffichage === "detailSERVICE" && Donne_PRODUIT && (
            <div className=" ">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                  DÉTAIL Mr/Mn <strong>{Donne_PRODUIT.nomProduit}</strong>
                </h1>

                {/* Grille 3 colonnes */}
                <div className="flex justify-center">
                  <img
                    src={
                      Donne_PRODUIT.fichier
                        ? `http://127.0.0.1:8000/storage/${Donne_PRODUIT.fichier}`
                        : "https://via.placeholder.com/100"
                    }
                    alt={Donne_PRODUIT.nomProduit}
                    className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-md"
                  />
                </div>
                <br />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="grid grid-cols-3">
                    {/* p-3  rounded-lg flex gap-6 */}
                    <span className="font-semibold text-gray-600">NOM :</span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.nomProduit}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-gray-600">PRIX :</span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.prix}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-gray-600">zone :</span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.zone}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-semibold text-gray-600">
                      TYPE CATEGORIE :
                    </span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.type_categorie}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-gray-600">
                      CATEGORIE :
                    </span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.categorie}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-semibold text-gray-600">
                      CODE COMPTA :
                    </span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.code_compta}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-semibold text-gray-600">
                      DATE PEREMPTION :
                    </span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.date_peremption}</strong>
                    </span>
                  </div>
                </div>

                {/* Bouton fermer centré */}
                <div className="mt-6 gap-8 flex justify-center">
                  <button
                    onClick={() =>
                      etat_PRODUIT(Donne_PRODUIT.id, Donne_PRODUIT.colonne)
                    }
                    className={`${
                      Donne_PRODUIT.colonne === "activer"
                        ? "px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        : "px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    }`}
                  >
                    {Donne_PRODUIT.colonne === "activer" ? (
                      <div>DESACTIVER</div>
                    ) : (
                      <div>ACTIVER</div>
                    )}
                  </button>
                  <button
                    onClick={() => handleSelect("modification_PRODUIT")}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    MODIFIER
                  </button>

                  <button
                    onClick={() => handleSelect("SERVICE", "SERVICE")}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Fermer
                  </button>
                </div>

                <br />
                <h1 className="text-white">sdfs</h1>
              </div>
            </div>
          )}
          {ActivationAffichage === "modification_PRODUIT" && Donne_PRODUIT && (
            <div>
              <form
                onSubmit={ModifePRODUIT}
                className="bg-white p-6 rounded-lg shadow-md space-y-6 "
                encType="multipart/form-data"
              >
                {error && <p className="text-red-500">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="nomProduit"
                      required
                      value={Donne_PRODUIT.nomProduit || ""}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          nomProduit: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  {/* Prix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Prix
                    </label>
                    <input
                      type="number"
                      name="prix"
                      required
                      value={Donne_PRODUIT.prix || ""}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          prix: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Zone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Zone
                    </label>
                    <input
                      type="text"
                      name="zone"
                      value={Donne_PRODUIT.zone || ""}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          zone: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Fichier */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fichier
                    </label>
                    <input
                      type="file"
                      name="fichier"
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          fichier: e.target.files[0],
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Catégorie
                    </label>

                    <select
                      name="categorie"
                      value={Donne_PRODUIT.categorie || ""}
                      required
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          categorie: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Entretien">Entretien</option>
                      <option value="Alimentation">Alimentation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      TYPE CATEGORIE
                    </label>

                    <select
                      name="type_categorie"
                      value={Donne_PRODUIT.type_categorie || ""}
                      required
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          type_categorie: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Stock">Stock</option>
                      <option value="Flotte">Flotte</option>
                    </select>
                  </div>

                  {/* Code Compta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Code Compta
                    </label>
                    <input
                      type="text"
                      name="code_compta"
                      value={Donne_PRODUIT.code_compta || ""}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          code_compta: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Stock Minimum */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Stock Minimum
                    </label>
                    <input
                      type="number"
                      name="stock_minimum"
                      value={Donne_PRODUIT.stock_minimum || ""}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          stock_minimum: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Date Péremption */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date de Péremption
                    </label>
                    <input
                      type="date"
                      name="date_peremption"
                      value={Donne_PRODUIT.date_peremption || ""}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          date_peremption: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Bouton */}
                <div className="flex gap-6 justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    VALIDER
                  </button>
                  <button
                    onClick={() => handleSelect("ListePRODUIT", "PRODUIT")}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    ANNULLER
                  </button>
                </div>
              </form>
            </div>
          )}

          {ActivationAffichage === "PRIX" && (
            <div className="  p-0 m-0">
              <div className="bg-white p-8 rounded-2xl shadow-lg ">
                {modificationprix ? (
                  <div>
                    <form
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      onSubmit={modifeprix}
                    >
                      <div className="flex flex-col">
                        <label
                          htmlFor="QUALIFICATION"
                          className="mb-2 font-semibold text-gray-700"
                        >
                          NOM
                        </label>
                        <input
                          name="NOM"
                          type="text"
                          value={Donne_PRODUIT?.nomProduit || ""}
                          disabled
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>

                      <div className="flex flex-col"></div>

                      {/* PRIX ACTUEL */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="MENSUEL"
                          className="mb-2 font-semibold text-gray-700"
                        >
                          PRIX ACTUEL
                        </label>
                        <input
                          name="PRIXActuel"
                          value={Donne_PRODUIT?.prix || ""}
                          disabled
                          type="text"
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>

                      {/* PRIX NOUVEAU */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="ANNUEL"
                          className="mb-2 font-semibold text-gray-700"
                        >
                          PRIX NOUVEAU
                        </label>
                        <input
                          name="nouveau"
                          value={nouveauPrix}
                          onChange={(e) => setNouveauPrix(e.target.value)}
                          type="text"
                          placeholder="Entrer le nouveau prix"
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div></div>
                      <div className="mt-8 flex justify-end gap-6">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-blue-100 rounded-lg hover:bg-blue-600 transition"
                        >
                          <span>VALIDER</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setmodificationprix(false)}
                          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
                        >
                          ANNULER
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <div>
                      {message && (
                        <div
                          className={` right-4 bg-green-300 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded shadow-md
      ${message.type === "success" ? "bg-green-500 text-white" : ""}
      ${message.type === "error" ? "bg-red-500 text-white" : ""}
      ${message.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                        >
                          {message.text}
                        </div>
                      )}
                    </div>

                    <Box sx={{ height: "55vh" }}>
                      <DataGrid
                        rows={ListeProduit}
                        columns={colonne_prix}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10]}
                        loading={loading}
                        sx={{
                          "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#3B82F6", // bleu
                          },
                          "& .MuiDataGrid-columnHeaderTitle": {
                            color: "#fff", // texte blanc
                            fontWeight: "bold",
                          },
                          "& .MuiDataGrid-columnHeader": {
                            backgroundColor: "#3B82F6", // pour chaque cellule d’en-tête
                            color: "#fff",
                          },
                        }}
                      />
                    </Box>
                  </div>
                )}

                {/* Bouton en dessous */}
              </div>
              <h2 className="font-bold text-blue-600 text-2xl mb-4 mt-6 ml-[5%]">
                TABLEAU HISTORIQUE DE MODIFICATION
              </h2>
              <div className=" shadow-lg max-w-4xl   ">
                <Box sx={{ height: "55vh", width: "117%" }}>
                  <DataGrid
                    rows={row_Prix}
                    columns={ColunnePrix}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    loading={loading}
                    sx={{
                      "& .MuiDataGrid-columnHeaderTitle": {
                        color: "#fff", // texte blanc
                        fontWeight: "bold",
                      },
                      "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#3B82F6",
                        color: "#fff",
                      },
                    }}
                  />
                </Box>
              </div>
            </div>
          )}
          {ActivationAffichage === "STOCK" && (
            <div className="  p-0 m-0">
              <div className="bg-red-300 p-8 rounded-2xl shadow-lg ">
                <h1>mbola tsy vita</h1>
              </div>
            </div>
          )}
          {ActivationAffichage === "DOCUMENT" && (
            <div className="p-0 m-0">
              {/* Bloc DataGrid */}
              <div className="p-3 rounded-lg shadow-lg bg-white">
                <Box sx={{ height: "55vh", width: "100%" }}>
                  <DataGrid
                    rows={row_documents}
                    columns={colonne_Documents}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    loading={loading}
                    className="border border-gray-300 rounded-lg shadow-md"
                    sx={{
                      "& .MuiDataGrid-columnHeaderTitle": {
                        color: "#fff", // texte blanc
                        fontWeight: "bold",
                      },
                      "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#3B82F6",
                        color: "#fff",
                      },
                    }}
                  />
                </Box>
              </div>

              {/* Bloc Tableau Classique */}
              <div className="bg-white rounded-lg shadow-lg p-4 mt-6">
                {/* Barre de filtre */}
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div></div>
                  <form className="flex flex-wrap gap-4 items-center">
                    <select
                      id="DOCUMENT"
                      name="DOCUMENT"
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">DOCUMENT</option>
                    </select>

                    <select
                      id="ETAT"
                      name="ETAT"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">ETAT</option>
                    </select>

                    <select
                      name="DATE"
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">DATE</option>
                    </select>

                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                      FILTRER
                    </button>

                    <button
                      type="button"
                      className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                    >
                      RAFRAICHIR
                    </button>
                  </form>
                </div>

                {/* Tableau classique */}
                <div className="mt-4">
                  <table className="w-full h-[55vh] border border-gray-300 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-[#5581e1] text-white">
                      <tr>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          REF
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          DATE
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          ETAT
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-right">
                          HT
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-right">
                          TTC
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-200">
                          BNI
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          2025-08-18
                        </td>
                        <td className="px-4 py-2 border border-gray-200">F1</td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          200
                        </td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          240
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-200">
                          BOA
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          2025-08-18
                        </td>
                        <td className="px-4 py-2 border border-gray-200">F2</td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          500
                        </td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          600
                        </td>
                      </tr>
                      <tr className="bg-gray-100 font-semibold">
                        <td
                          className="px-4 py-2 border border-gray-300 text-right"
                          colSpan={3}
                        >
                          TOTAL :
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-right text-yellow-600">
                          700
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-right text-yellow-600">
                          840
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {ActivationAffichage === "HISTORIQUE" && (
            <div className="">
              {/* Bloc DataGrid */}

              {/* Bloc Tableau Classique */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                {/* Barre de filtre */}
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div></div>
                  <form className="flex flex-wrap gap-4 items-center">
                    <select
                      id="DOCUMENT"
                      name="DOCUMENT"
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">UTILISATEUR</option>
                    </select>

                    <select
                      id="ETAT"
                      name="ETAT"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">ETAT</option>
                    </select>

                    <input
                      type="DATE"
                      name="DATE"
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                      FILTRER
                    </button>

                    <button
                      type="button"
                      className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                    >
                      RAFRAICHIR
                    </button>
                  </form>
                </div>

                {/* Tableau classique */}
                <div className="mt-4">
                  <table className="w-full h-[55vh] border border-gray-300 shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-blue-500 text-white">
                      <tr>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          PRODUIT
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          ACTION
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          ETAT
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-right">
                          DATE
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-right">
                          UTILISATEUR
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-200">
                          PNEU
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          FACTURE
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          VALIDE
                        </td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          01/03/25
                        </td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          RAKOTO
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-200">
                          ORDINATEUR
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          FACTURE
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          VALIDE
                        </td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          14/04/25
                        </td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          MEVA
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-200">
                          SOURIE
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          FACTURE
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          VALIDE
                        </td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          08/03/25
                        </td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          TOKY
                        </td>
                      </tr>

                      <tr className="bg-gray-100 font-semibold">
                        <td
                          className="px-4 py-2 border border-gray-300 text-right"
                          colSpan={3}
                        >
                          TOTAL :
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-right text-yellow-600">
                          Mensuel/annuel (Janvier soit 2025)
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-right text-yellow-600">
                          Qté
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
