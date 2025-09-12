import * as React from "react";
import { AuthContext } from "../../AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
//tableau
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

///icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

export function Categorie() {
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
    { field: "id", headerName: "N°", width: 40 },
    {
      field: "fichier",
      headerName: "IMAGE",
      width: 220,
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full h-full px-2 py-2">
          <img
            src={
              params.row.fichier
                ? `http://127.0.0.1:8000/storage/${params.row.fichier}`
                : "https://via.placeholder.com/100"
            }
            alt={params.row.nom}
            className="w-15 h-12 rounded object-cover border border-gray-300 shadow-sm"
          />
        </div>
      ),
    },
    { field: "type", headerName: "TYPE", width: 220 },
    { field: "nom", headerName: "NOM", width: 220 },
    { field: "etat", headerName: "ETAT", width: 220 },
    {
      field: "action",
      headerName: "ACTIONS",
      width: 120,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDonne_PRODUIT(params.row);
              handleSelect("detailCATEGORIE", "CATEGORIE");
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
        "http://127.0.0.1:8000/api/liste_categori"
      );
      setListeProduit(response.data);
      setOriginalListeCATEGORI(response.data);
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };
  //   INSERTION PRODUIT
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: today,
  });
  const [formDataC, setFormDataC] = useState({
    nom: "",
    type: "",
    visibiliter: "",
    fichier: null,
    etat: "",
    date: today,
  });
  // Changement input
  const handleChangeP = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormDataC((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormDataC((prev) => ({ ...prev, [name]: value }));
    }
  };

  // soumission
  const handleSubmit_CATEGORIE = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      for (const key in formDataC) {
        formData.append(key, formDataC[key]);
      }

      await axios.post("http://127.0.0.1:8000/api/creationCategori", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      listeP();
      handleSelect("ListeCATEGORIE", "CATEGORIE");
      showMessage("success", "Insertion avec succès ✅");
      setSuccess(true);

      // ✅ Reset du formulaire
      setFormDataC({
        nom: "",
        type: "",
        visibiliter: "",
        fichier: null,
        etat: "",
        date: today,
      });
    } catch (err) {
      console.error("Erreur :", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Erreur de soumission : vérifie les champs."
      );
    }
  };

  ///detait
  const [Donne_PRODUIT, setDonne_PRODUIT] = useState(null);

  //   ACTIVATION
  const etat_PRODUIT = async (id, currentEtat) => {
    const newStatus = currentEtat === "activer" ? "desactiver" : "activer";

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/changer_activationcategori/${id}`,
        { activation: newStatus }
      );

      // mettre à jour l'état local pour re-render
      setDonne_PRODUIT((prev) => ({
        ...prev,
        etat: response.data.activation,
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

      // Ajoute les champs sauf fichier
      Object.keys(Donne_PRODUIT).forEach((key) => {
        if (key !== "fichier") {
          formData.append(key, Donne_PRODUIT[key]);
        }
      });

      // Ajoute le fichier si présent
      if (Donne_PRODUIT.fichier instanceof File) {
        formData.append("fichier", Donne_PRODUIT.fichier);
      }

      const response = await axios.put(
        `http://127.0.0.1:8000/api/modifier_categori/${Donne_PRODUIT.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      listeP();
      handleSelect("ListeCATEGORIE", "CATEGORIE");
      showMessage("success", "Modification réussie ✅");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification ❌");
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
  /// RECHERCHE

  const [OriginalListeCATEGORI, setOriginalListeCATEGORI] = useState([]);
  const [formDataSearcheCATEGORIE, setformDataSearcheCATEGORIE] = useState({
    nom: "",
    type: "",
  });

  const handleChangeSearcheCATEGORIE = (e) => {
    const { name, value } = e.target;
    setformDataSearcheCATEGORIE((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearcheSubmitCATEGORI = (e) => {
    e.preventDefault();

    const nomSearch = (formDataSearcheCATEGORIE.nom || "").trim().toLowerCase();
    const typeSearch = (formDataSearcheCATEGORIE.type || "")
      .trim()
      .toLowerCase();

    const filtered = OriginalListeCATEGORI.filter((item) => {
      // on tolère que l'API renomme le champ (nom / nomTier) :
      const itemNom = (item.nom || item.nomTier || "").toString().toLowerCase();
      const itemType = (item.type || "").toString().toLowerCase();

      const matchNom = nomSearch === "" || itemNom.includes(nomSearch);
      const matchType = typeSearch === "" || itemType === typeSearch; // ou .includes(typeSearch) si tu veux partiel

      return matchNom && matchType;
    });

    setListeProduit(filtered);
  };

  const handleRefreshCATEGORI = () => {
    setformDataSearcheCATEGORIE({ nom: "", type: "" });
    setListeProduit(OriginalListeCATEGORI);
  };

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
  React.useEffect(() => {
    listeP();
    handleSelect("CATEGORIE", "CATEGORIE");
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
              onClick={() => setShowTIERS((prev) => !prev)} // ✅ on utilise bien setShowTIERS
              className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition"
            >
              CATEGORIE
            </h1>

            {showTIERS && (
              <div className="ml-3 mt-1 space-y-1">
                <a
                  onClick={() =>
                    handleSelect("InsertionCATEGORIE", "CATEGORIE")
                  }
                  className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  CRÉER
                </a>
                <a
                  onClick={() => handleSelect("CATEGORIE", "CATEGORIE")}
                  className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  LISTE
                </a>
              </div>
            )}
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
            {["CATEGORIE", "ARTICLE LIES", "HISTORIQUE"].map((item) => (
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
          {(ActivationAffichage === "CATEGORIE" ||
            ActivationAffichage === "ListeCATEGORIE") && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div className="flex  items-center justify-between ">
                <h1 className="text-2xl font-bold text-blue-600 mb-4 md:mb-0"></h1>
                <form
                  className="flex flex-cols-2 gap-4 items-center justify-end"
                  onSubmit={handleSearcheSubmitCATEGORI}
                >
                  {/* Type */}

                  {/* Nom */}
                  <div className="grid grid-cols-1">
                    <label
                      htmlFor="nom"
                      className="font-semibold text-gray-700"
                    >
                      NOM
                    </label>
                    {/* INPUT NOM : bien ajouter name="nom" */}
                    <input
                      name="nom"
                      value={formDataSearcheCATEGORIE.nom}
                      onChange={handleChangeSearcheCATEGORIE}
                      type="text"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1">
                    <label
                      htmlFor="type"
                      className="font-semibold text-gray-700"
                    >
                      TYPE
                    </label>
                    <select
                      value={formDataSearcheCATEGORIE.type}
                      onChange={handleChangeSearcheCATEGORIE}
                      id="type"
                      name="type"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(
                          OriginalListeCATEGORI.map((item) => item.type)
                        ),
                      ].map((type, index) => (
                        <option key={`type-${index}`} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className=" grid grid-cols-1">
                    <label
                      htmlFor="UTILISATEUR"
                      className="font-semibold text-white"
                    >
                      ....
                    </label>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                      FILTRER
                    </button>
                  </div>
                  <div className=" grid grid-cols-1">
                    <label
                      htmlFor="UTILISATEUR"
                      className="font-semibold text-white"
                    >
                      K
                    </label>
                    <button
                      type="button"
                      onClick={handleRefreshCATEGORI}
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
          {ActivationAffichage === "InsertionCATEGORIE" && (
            <div>
              <form
                onSubmit={handleSubmit_CATEGORIE}
                className="bg-white p-6 rounded-lg shadow-md space-y-6"
              >
                <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                  CREATION
                </h1>

                {/* Grid principale */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* NOM */}
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-gray-700 w-32">
                      NOM <span className="text-red-600">***</span> :
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formDataC.nom}
                      onChange={handleChangeP}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* TYPE */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      TYPE <span className="text-red-600">***</span> :
                    </label>
                    <select
                      name="type"
                      value={formDataC.type}
                      onChange={handleChangeP}
                      required
                      className="flex-1 px-4 py-2 border rounded-md"
                    >
                      <option value=""></option>
                      <option value="Stock">Stock</option>
                      <option value="Flotte">Flotte véhicule</option>
                    </select>
                  </div>

                  {/* VISIBILITY */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      VISIBILITY <span className="text-red-600">***</span> :
                    </label>
                    <select
                      name="visibiliter"
                      value={formDataC.visibiliter}
                      onChange={handleChangeP}
                      required
                      className="flex-1 px-4 py-2 border rounded-md"
                    >
                      <option value=""></option>
                      <option value="Publique">Publique</option>
                      <option value="Priver">Privé</option>
                    </select>
                  </div>

                  {/* ETAT */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      ETAT <span className="text-red-600">***</span> :
                    </label>
                    <select
                      name="etat"
                      value={formDataC.etat}
                      onChange={handleChangeP}
                      required
                      className="flex-1 px-4 py-2 border rounded-md"
                    >
                      <option value=""></option>
                      <option value="Active">Activé</option>
                      <option value="Inactive">Désactivé</option>
                    </select>
                  </div>

                  {/* FICHIER */}
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-gray-700 w-32">
                      FICHIER JOINT <span className="text-red-600">***</span> :
                    </label>
                    <input
                      type="file"
                      name="fichier"
                      onChange={handleChangeP}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                    onClick={() => handleSelect("CATEGORIE", "CATEGORIE")}
                    className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    ANNULER
                  </button>
                </div>
              </form>
            </div>
          )}
          {ActivationAffichage === "detailCATEGORIE" && Donne_PRODUIT && (
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
              <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                DETAIL {Donne_PRODUIT.nom}
              </h1>
              <div>
                {/* Grille 3 colonnes */}
                <div className="grid grid-cols-2 ">
                  <div className="flex justify-center">
                    <img
                      src={
                        Donne_PRODUIT.fichier
                          ? `http://127.0.0.1:8000/storage/${Donne_PRODUIT.fichier}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={Donne_PRODUIT.nom}
                      className="w-60 h-60 rounded object-cover border-4 border-cyan-500 shadow-md"
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-1 gap-4">
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-600 w-32">
                        NOM :
                      </span>
                      <span className="text-gray-800">
                        <strong>{Donne_PRODUIT.nom}</strong>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-600 w-32">
                        TYPE :
                      </span>
                      <span className="text-gray-800">
                        <strong>{Donne_PRODUIT.type}</strong>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-600 w-32">
                        VISIBILITÉ :
                      </span>
                      <span className="text-gray-800">
                        <strong>{Donne_PRODUIT.visibiliter}</strong>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-600 w-32">
                        ÉTAT :
                      </span>
                      <span className="text-gray-800">
                        <strong>{Donne_PRODUIT.etat}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bouton fermer centré */}
              </div>

              <br />
              {/* <div className="mt-6 gap-8 flex justify-center">
                <button
                  onClick={() =>
                    etat_PRODUIT(Donne_PRODUIT.id, Donne_PRODUIT.etat)
                  }
                  className={`${
                    Donne_PRODUIT.etat === "activer"
                      ? "px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      : "px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  }`}
                >
                  {Donne_PRODUIT.etat === "activer" ? (
                    <div>DESACTIVER</div>
                  ) : (
                    <div>ACTIVER</div>
                  )}
                </button>
                <button
                  onClick={() => handleSelect("modification_CATEGORIE")}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  MODIFIER
                </button>

                <button
                  nClick={() => handleSelect("ListeCATEGORIE", "CATEGORIE")}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Fermer
                </button>
              </div> */}
              <div className="mt-6 gap-8 flex justify-center">
                <button
                  onClick={() => {
                    handleSelect("CATEGORIE", "CATEGORIE");
                    etat_PRODUIT(Donne_PRODUIT.id, Donne_PRODUIT.etat);
                  }}
                  className={`${
                    Donne_PRODUIT.etat === "activer"
                      ? "px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      : "px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  }`}
                >
                  {Donne_PRODUIT.etat === "activer" ? (
                    <div>DESACTIVER</div>
                  ) : (
                    <div>ACTIVER</div>
                  )}
                </button>
                <button
                  onClick={() => {
                    handleSelect("CATEGORIE", "CATEGORIE");
                    handleSelect("modification_CATEGORIE");
                  }}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  MODIFIER
                </button>

                <button
                  nClick={() => handleSelect("ListeCATEGORIE", "CATEGORIE")}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Fermer
                </button>
              </div>

              <br />
              <br />
              <h2 className="text-white">qsf</h2>
            </div>
          )}
          {ActivationAffichage === "modification_CATEGORIE" &&
            Donne_PRODUIT && (
              <div>
                <form
                  onSubmit={ModifePRODUIT}
                  className="bg-white p-6 rounded-lg shadow-md space-y-6 "
                  encType="multipart/form-data"
                >
                  <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                    MODIFICATION
                  </h1>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="nom"
                        required
                        value={Donne_PRODUIT.nom || ""}
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            nom: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* Catégorie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        TYPE
                      </label>

                      <select
                        name="type" // ✅ corriger ici
                        value={Donne_PRODUIT.type || ""}
                        required
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            type: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Stock">Stock</option>
                        <option value="Flotte véhicule">Flotte véhicule</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        VISIBILITER
                      </label>

                      <select
                        name="visibiliter"
                        value={Donne_PRODUIT.visibiliter || ""}
                        required
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            visibiliter: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Publique">Publique</option>
                        <option value="Privé">Privé</option>
                      </select>
                    </div>

                    {/* Fichier */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ÉTAT
                      </label>
                      <select
                        name="etat"
                        value={Donne_PRODUIT.etat || ""}
                        required
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            etat: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="ACTIVER">ACTIVER</option>
                        <option value="DESACTIVER">DESACTIVER</option>
                      </select>
                    </div>

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
                  </div>

                  {/* Bouton */}
                  <div className="flex gap-6 justify-end">
                    <button
                      type="submit"
                      // onClick={console.log('ID du produit:', Donne_PRODUIT.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      VALIDER
                    </button>
                    <button
                      onClick={() =>
                        handleSelect("ListeCATEGORIE", "CATEGORIE")
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      ANNULLER
                    </button>
                  </div>
                  <br />
                  <br />
                  <h2 className="text-white">qsf</h2>
                  <br />
                  <br />
                  <h2 className="text-white">qsf</h2>
                </form>
              </div>
            )}
          {ActivationAffichage === "ARTICLE LIES" && (
            <div className="p-0 m-0">
              {/* Bloc DataGrid */}
              <div className="p-3 rounded-lg shadow-lg bg-white">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div></div>
                  <form className="flex flex-wrap gap-4 items-center">
                    {/* className="grid grid-cols-1" */}
                    <div className="grid grid-cols-1">
                      <label htmlFor="NOM">NOM</label>
                      <input
                        type="text"
                        name="NOM"
                        id="NOM"
                        className=" px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1">
                      <label htmlFor="DATE">DATE</label>
                      <input
                        type="DATE"
                        name=""
                        id=""
                        className=" px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1">
                      <label htmlFor="DATE" className="text-white">
                        DATE
                      </label>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                      >
                        FILTRER
                      </button>
                    </div>
                    <div className="grid grid-cols-1">
                      <label htmlFor="DATE" className="text-white">
                        DATE
                      </label>
                      <button
                        type="button"
                        className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                      >
                        RAFRAICHIR
                      </button>
                    </div>
                  </form>
                </div>
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
                    <div className="grid grid-cols-1">
                      <label htmlFor="Catégorie">CATEGORIE</label>
                      <input
                        type="text"
                        name="categorie"
                        className=" px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1">
                      <label htmlFor="Catégorie">TYPE</label>
                      <input
                        type="text"
                        name="TYPE"
                        className=" px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1">
                      <label htmlFor="DATE">DATE</label>
                      <input
                        type="DATE"
                        name="DATE"
                        className=" px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1">
                      <label htmlFor="ACTION">ACTION</label>
                      <select
                        id="ACTION"
                        name="ACTION"
                        className=" px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value=""></option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1">
                      <h1 className="text-white">jkh</h1>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                      >
                        FILTRER
                      </button>
                    </div>
                    <div className="grid grid-cols-1">
                      <h1 className="text-white">jkh</h1>
                      <button
                        type="button"
                        className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                      >
                        RAFRAICHIR
                      </button>
                    </div>
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
