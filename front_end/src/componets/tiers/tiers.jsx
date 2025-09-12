import * as React from "react";
import { AuthContext } from "../../AuthContext";
import { Link } from "react-router-dom";
import { BarChart } from "@mui/x-charts/BarChart";
import { useContext, useState } from "react";

import axios from "axios";
/// incons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

//tableau
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

// COLONNE DOCUMENTS
const colonne_Documents = [
  { field: "DOCUMENT", headerName: "DOCUMENT", width: 350 },
  { field: "ETAT", headerName: "ETAT", width: 355 },
  { field: "NOMBRE", headerName: "VALEUR", width: 360 },
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
  // {
  //   id: 4,
  //   DOCUMENT: "LIVRAISON",
  //   ETAT: "VALIDER",
  //   NOMBRE: 9,
  // },
];

export function Tiers() {
  // recherche document
  const columns = [
    { field: "id", headerName: "N°", width: 90 },
    { field: "date", headerName: "DATE", width: 200 },
    { field: "compte", headerName: "COMPTE", width: 200 },
    { field: "fournisseur", headerName: "FOURNISSEUR", width: 300 },
    { field: "montantHT", headerName: "MONTANT HT", width: 200 },
    { field: "montantTTC", headerName: "MONTANT TTC", width: 220 },
  ];
  const rows = [
    {
      id: 1,
      date: "2025-08-18",
      ref: "BNI",
      ETAT: "F1",
      montantHT: 200,
      montantTTC: 240,
    },
    {
      id: 2,
      date: "2025-08-18",
      ref: "BOA",
      ETAT: "F2",
      montantHT: 500,
      montantTTC: 600,
    },
  ];

  const totals = React.useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.ht += row.montantHT;
        acc.ttc += row.montantTTC;
        return acc;
      },
      { ht: 0, ttc: 0 }
    );
  }, [rows]);
  const [navbar, setNavbar] = useState("");
  const [loading, setLoading] = useState(false);

  /// TIERS ////////
  const { DonneSession, logout } = useContext(AuthContext);
  const [showTIERS, setShowTERS] = useState(false); // ✅ Ajouté
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [errors, setErrors] = React.useState("");
  const [message, setMessage] = useState(null);
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000); // disparaît après 3 sec
  };

  // navbar
  const [condition_navbar, setcondition_navbar] = useState(" ");
  const [ActivationAffichage, setActivationAffichage] = useState(" ");
  const handleSelect = (section, navbar) => {
    setShowTERS(false);
    setActivationAffichage(section);
    setcondition_navbar(navbar);
  };

  ///insertion
  const [formDataT, setFormDataT] = useState({
    nomTier: "",
    zone: "",
    type: "",
    motDePasse: "",
    email: "",
    contact: "",
    nif: "",
    stat: "",
    rcs: "",
    commercial: "",
    colonne: "",
    colonnes: "",
  });
  const handleChangeT = (e) => {
    const { name, value } = e.target;
    setFormDataT((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit_tier = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await axios.post("http://127.0.0.1:8000/api/creationTiers", formDataT, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(true);
      listeT(); // recharge la liste
      handleSelect("ListeTiers");
      showMessage("success", "Inséré avec succès");
      setFormDataT({
        nomTier: "",
        zone: "",
        type: "",
        motDePasse: "",
        email: "",
        contact: "",
        nif: "",
        stat: "",
        rcs: "",
        commercial: "",
        colonne: "",
        colonnes: "",
      });
    } catch (err) {
      console.error("Erreur :", err.response?.data || err.message);
      setError("Erreur de soumission : vérifie les champs.");
    }
  };

  /// LISTE
  const [ListeTiers, setListeTiers] = useState([]);
  const ColunneTIERS = [
    { field: "id", headerName: "N°", width: 40 },
    { field: "type", headerName: "TYPE", width: 100 },
    { field: "nomTier", headerName: "NOM", width: 200 },
    { field: "zone", headerName: "ZONE", width: 200 },
    { field: "motDePasse", headerName: "MOT DE PASSE", width: 220 },
    { field: "colonne", headerName: "ETAT", width: 110 },
    {
      field: "action",
      headerName: "ACTIONS",
      width: 220,
      renderCell: (params) => (
        <div className="flex gap-2">
          {/* <button
            onClick={() => etat_Tier(params.row.id, params.row.colonne)}
            className={`${
              params.row.colonne === "activer"
                ? "text-orange-400 hover:text-orange-500"
                : "text-green-500 hover:text-green-600"
            }`}
          >
            {params.row.colonne === "activer" ? (
              <div className="w-[60%]">
                <ToggleOffIcon />
              </div>
            ) : (
              <ToggleOnIcon />
            )}
          </button> */}
          {/* <button
            onClick={() => {
              setmodife_Tier(params.row); // ⚡ stocke le tier à modifier
              handleSelect("modifTIERS");
            }}
            className="text-green-500 hover:text-green-700"
          >
            <EditIcon />
          </button> */}
          {/* <button
            onClick={() => TierSuppression(params.row.id)}
            className="text-red-500 hover:text-red-700"
          >
            <DeleteIcon />
          </button> */}
          <button
            onClick={() => {
              setDonne_Tier(params.row);
              handleSelect("detailTier");
            }}
            className="text-blue-300 hover:text-blue-400"
          >
            <VisibilityIcon />
          </button>
        </div>
      ),
    },
  ];

  const listeT = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/liste_TIERS");
      setOriginalListeTIERS(response.data);
      setrow_livreur(response.data);
      setListeTiers(response.data);
      // setcondition_navbar("tier");
    } catch (err) {
      setErrors("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };
  const [ListeUTILISATEUR, setListeUTILISATEUR] = useState([]);
  const listeU = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/liste_utilisateur"
      );

      setListeUTILISATEUR(response.data);
      console.log(response.data);
      // setcondition_navbar("tier");
    } catch (err) {
      setErrors("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SUPPRESSION tier
  const TierSuppression = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce tier ?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/supprimer_tier/${id}`);

      // ⚡ Rafraîchir la liste après suppression
      await listeT();
      listeT();
      handleSelect("ListeTiers");
      showMessage("success", "Suppression effectuée avec succès");
      setcondition_navbar("tier");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression ❌");
    }
  };

  // ✅ CHANGEMENT D’ÉTAT tiers
  const etat_Tier = async (id, currentEtat) => {
    const newStatus = currentEtat === "activer" ? "desactiver" : "activer";

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/changer_activation_tier/${id}`,
        { activation: newStatus }
      );

      listeT();
      showMessage("success", "Modification effectuée avec succès");
      handleSelect("ListeTiers", "ListeTiers");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification de l'activation ❌");
    }
  };
  ///modification tiers
  const [modife_Tier, setmodife_Tier] = useState(null);
  const ModifeService = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...modife_Tier };
      const response = await axios.put(
        `http://127.0.0.1:8000/api/modifier_tier/${modife_Tier.id}`,
        payload
      );
      listeT();
      handleSelect("ListeTiers", "ListeTiers");
      showMessage("success", "Modification effectuée avec succès");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification du Tier ❌");
    }
  };

  const ModifeTier = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...modife_Tier };
      const response = await axios.put(
        `http://127.0.0.1:8000/api/modifier_tier/${modife_Tier.id}`,
        payload
      );

      listeT();
      handleSelect("ListeTiers", "ListeTiers");
      showMessage("success", "Modification effectuée avec succès");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification du Tier ❌");
    }
  };

  // rechrerche TIERS
  const [OriginalListeTIERS, setOriginalListeTIERS] = useState([]);
  const [formDataSearcheTIERS, setformDataSearcheTIERS] = useState({
    nomTier: "",
    type: "",
    zone: "",
  });
  const handleChangeSearcheTIERS = (e) => {
    const { name, value } = e.target;
    setformDataSearcheTIERS((prev) => ({ ...prev, [name]: value }));
  };
  const handleSearcheSubmitTIERS = (e) => {
    e.preventDefault();
    const filtered = OriginalListeTIERS.filter((item) => {
      return (
        (formDataSearcheTIERS.nomTier === "" ||
          item.nomTier === formDataSearcheTIERS.nomTier) &&
        (formDataSearcheTIERS.type === "" ||
          item.type === formDataSearcheTIERS.type) &&
        (formDataSearcheTIERS.zone === "" ||
          item.zone === formDataSearcheTIERS.zone)
      );
    });
    setListeTiers(filtered); // ✅ corrigé
    setcondition_navbar("tier");
  };
  const handleRefreshTIERS = () => {
    setformDataSearcheTIERS({ nomTier: "", type: "", zone: "" });
    setListeTiers(OriginalListeTIERS); // ✅ corrigé
    setcondition_navbar("tier");
  };

  ///DETAIL TIER
  const [Donne_Tier, setDonne_Tier] = useState(null);

  // REMISE
  const [pourcetang, setpourcetang] = useState("pourcentage");
  const hadleChoisitRemise = () => {};

  // DOCUMENTS
  const [NavbarDocuments, setNavbarDocuments] = useState("TSS");

  // livreur
  const [row_livreur, setrow_livreur] = useState([]);
  const colonne_livreur = [
    { field: "id", headerName: "N°", width: 70 },
    { field: "nomTier", headerName: "NOM", width: 170 },
    { field: "email", headerName: "EMAIL", width: 200 },
    { field: "motDePasse", headerName: "MOT DE PASSE", width: 170 },
    { field: "contact", headerName: "CONTACT", width: 160 },
    { field: "zone", headerName: "ZONE", width: 120 },
    {
      field: "action",
      headerName: "ACTIONS",
      width: 110,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              handleSelect("LIVREUR", "LIVREUR");
              etat_Tier(params.row.id, params.row.colonne);
              handleSelect("LIVREUR", "LIVREUR");
            }}
            className={`${
              params.row.colonne === "activer"
                ? "text-orange-400 hover:text-orange-500"
                : "text-green-500 hover:text-green-600"
            }`}
          >
            {params.row.colonne === "activer" ? (
              <div className="w-[60%]">
                <ToggleOffIcon />
              </div>
            ) : (
              <ToggleOnIcon />
            )}
          </button>
          <button
            onClick={() => {
              setmodife_Tier(params.row); // ⚡ stocke le tier à modifier
              handleSelect("modifService");
            }}
            className="text-green-500 hover:text-green-700"
          >
            <EditIcon />
          </button>
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    listeT();
    listeU();
    setActivationAffichage(" ");
  }, []);
  if (!DonneSession) {
    return <div className="text-center text-3xl text-red">Chargement...</div>;
  }

  return (
    <div className="flex flex-col  bg-gray-200 ">
      {/* Sidebar fixe  container-fluid mx-auto h-screen bg-gray-200 flex flex-col  h-[130%]*/}

      <div className=" flex min-h-screen">
        {/* flex flex-grow h-0 */}
        <div className="w-64 bg-white shadow-xl p-4">
          {/*   w-[240px] bg-white shadow-xl px-3 overflow-y-auto*/}
          <div className="space-y-8">
            {/* text-center mb-6 */}
            {/* Profil */}
            <div id="profile" className="text-center space-y-2">
              <img
                src={
                  DonneSession?.profil
                    ? `http://localhost:8000/storage/${DonneSession.profil}`
                    : "/default-avatar.png"
                }
                alt="Profil"
                className="w-20 h-20 object-cover mx-auto rounded-full border-4 border-blue-500 shadow-md"
              />
              <h2 className="text-blue-600 font-semibold text-lg">
                {DonneSession.nom}
              </h2>
              <p className="text-sm text-gray-500">{DonneSession.groupe}</p>
            </div>

            {/* Menu */}
            <div id="menu" className="space-y-2">
              {/* TIERS */}
              <div>
                <h1
                  onClick={() => setShowTERS(!showTIERS)}
                  className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition"
                >
                  TIERS
                </h1>
                {showTIERS && (
                  <div className="ml-3 mt-1 space-y-1">
                    <a
                      onClick={() =>
                        handleSelect("insertionTiers", "insertionTiers")
                      }
                      className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                    >
                      CRÉER
                    </a>
                    <a
                      onClick={() => {
                        // handleSelect("ListeTiers");
                        // setNavbarDocuments("ListeTiers");

                        handleSelect("ListeTiers", "ListeTiers");
                      }}
                      className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                    >
                      LISTE
                    </a>
                  </div>
                )}

                {/* <h1 className="cursor-pointer text-sm font-semibold text-gray-700  py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
                  <Link to="/produits_tiers">PRODUIT</Link>
                </h1> */}
              </div>

              <a className="mt-5 cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
                Historiques
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-200 p-6">
          {/* remise */}

          {ActivationAffichage === "NOTES" && (
            <div>
              <div className="flex justify-center text-lg font-bold mb-2">
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                  `}
                  onClick={() => handleSelect("ListeTiers", "ListeTiers")}
                >
                  {Donne_Tier.type.toUpperCase()}
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => {
                    handleSelect("DOCUMENTS", "DOCUMENTS");
                  }}
                >
                  DOCUMENTS
                </button>

                <button
                  className={`hover:border-b-blue-500 border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => handleSelect("NOTES", "NOTES")}
                >
                  NOTES
                </button>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg ">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* QUALIFICATION + */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="QUALIFICATION"
                      className="mb-2 font-semibold text-gray-700"
                    >
                      QUALIFICATION +
                    </label>
                    <input
                      name="QUALIFICATION"
                      type="number"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* QUALIFICATION - */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="QUALIFICATION_"
                      className="mb-2 font-semibold text-gray-700"
                    >
                      QUALIFICATION -
                    </label>
                    <input
                      name="QUALIFICATION_"
                      type="number"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* MENSUEL */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="MENSUEL"
                      className="mb-2 font-semibold text-gray-700"
                    >
                      MENSUEL
                    </label>
                    <input
                      name="MENSUEL"
                      type="text"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  {/* ANNUEL */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="ANNUEL"
                      className="mb-2 font-semibold text-gray-700"
                    >
                      ANNUEL
                    </label>
                    <input
                      name="ANNUEL"
                      type="text"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </form>

                {/* Bouton en dessous */}
                <div className="mt-8 flex justify-end gap-6">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    VALIDER
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
                  >
                    REFRECHIR
                  </button>
                </div>
                <div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <h1 className="text-white">ssdf</h1>
                </div>
              </div>
            </div>
          )}

          {ActivationAffichage === "modifService" && (
            <div>
              <div className="flex justify-center text-lg font-bold mb-2">
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                  `}
                  onClick={() => handleSelect("ListeTiers", "ListeTiers")}
                >
                  {Donne_Tier.type.toUpperCase()}
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => {
                    handleSelect("DOCUMENTS", "DOCUMENTS");
                  }}
                >
                  DOCUMENTS
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => handleSelect("NOTES", "NOTES")}
                >
                  NOTES
                </button>
              </div>
              <form
                onSubmit={ModifeService}
                className="bg-white p-6 rounded-lg shadow-md  space-y-6"
              >
                <h1 className="text-2xl font-bold text-blue-600 mb-8 mt-8 text-center">
                  MODIFICATION
                </h1>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Nom", name: "nomTier", type: "text" },
                    { label: "Zone", name: "zone", type: "text" },
                    { label: "Contact", name: "contact", type: "text" },
                    { label: "Mot de passe", name: "motDePasse", type: "text" },
                    { label: "ADDRESSE EMAIL", name: "email", type: "email" },
                  ].map((field) => (
                    <div key={field.name} className="flex items-center gap-4">
                      <label className="w-32 font-medium">
                        {field.label} :
                      </label>
                      <input
                        type={field.type}
                        value={modife_Tier[field.name]}
                        riquired
                        onChange={(e) =>
                          setmodife_Tier({
                            ...modife_Tier,
                            [field.name]: e.target.value,
                          })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-red-600">(*)</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end gap-6">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    VALIDER
                  </button>
                  <button
                    onClick={() => handleSelect("LIVREUR", "LIVREUR")}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    ANNULLER
                  </button>
                </div>
                <div>
                  <br />
                  <h1 className="text-white ">.</h1>
                </div>
              </form>
            </div>
          )}

          {ActivationAffichage === "DOCUMENTS" && (
            <div>
              <div className="flex justify-center text-lg font-bold mb-2">
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                  `}
                  onClick={() => handleSelect("ListeTiers", "ListeTiers")}
                >
                  {Donne_Tier.type.toUpperCase()}
                </button>

                <button
                  className={`hover:border-b-blue-500 border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => {
                    handleSelect("DOCUMENTS", "DOCUMENTS");
                  }}
                >
                  DOCUMENTS
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => handleSelect("NOTES", "NOTES")}
                >
                  NOTES
                </button>
              </div>
              <div className="bg-white  p-3 rounded-lg shadow-lg ">
                {/* <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                  LISTE
                </h1> */}
                <div>
                  <div>
                    <Box sx={{ height: "45vh" }}>
                      <DataGrid
                        rows={row_documents}
                        columns={colonne_Documents}
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
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4 mt-6 shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between ">
                  <h1 className="text-2xl font-bold text-blue-600 mb-4 md:mb-0"></h1>

                  {/* FORMULAIRE DE RECHERCHE */}
                  <form className="flex flex-wrap gap-4 items-center">
                    {/* Nom */}
                    <select
                      id="DOCUMENT"
                      name="DOCUMENT"
                      className="w-25 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">DOCUMENT</option>
                    </select>

                    {/* Type */}
                    <select
                      id="ETAT"
                      name="ETAT"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">ETAT</option>
                    </select>
                    <select
                      name="ETAT"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <table className=" border border-gray-300 overflow-hidden shadow-md w-[100%] h-[45vh]">
                  <thead className="bg-blue-500 text-white ">
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
                      <td className="px-4 py-2 border border-gray-200">BNI</td>
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
                      <td className="px-4 py-2 border border-gray-200">BOA</td>
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
                        className="px-4 py-2 border border-gray-300 text-left"
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
          )}
          {ActivationAffichage === "DOCUMENTSFOURN" && (
            <div>
              <div className="flex justify-center text-lg font-bold mb-2">
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                  `}
                  onClick={() => handleSelect("ListeTiers", " ")}
                >
                  {DonneSession.groupe.toUpperCase()}
                </button>

                <button
                  className={`hover:border-b-blue-500  border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() =>
                    handleSelect(
                      "InsertionRemiseFOURNIISEUR",
                      "InsertionRemiseFOURNIISEUR"
                    )
                  }
                >
                  REMISE
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-b-blue-500 border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => {
                    handleSelect("DOCUMENTSFOURN", "DOCUMENTSFOURN");
                    // setNavbarDocuments("documents");
                  }}
                >
                  DOCUMENTS
                </button>
              </div>
              <div className="bg-white  p-3 rounded-lg shadow-lg ">
                {/* <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                  LISTE
                </h1> */}
                <div>
                  <div>
                    <Box sx={{ height: "45vh" }}>
                      <DataGrid
                        rows={row_documents}
                        columns={colonne_Documents}
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
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4 mt-6 shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between ">
                  <h1 className="text-2xl font-bold text-blue-600 mb-4 md:mb-0"></h1>

                  {/* FORMULAIRE DE RECHERCHE */}
                  <form className="flex flex-wrap gap-4 items-center">
                    {/* Nom */}
                    <select
                      id="DOCUMENT"
                      name="DOCUMENT"
                      className="w-25 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">DOCUMENT</option>
                    </select>

                    {/* Type */}
                    <select
                      id="ETAT"
                      name="ETAT"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">ETAT</option>
                    </select>
                    <select
                      name="ETAT"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <table className=" border border-gray-300 overflow-hidden shadow-md w-[100%] h-[45vh]">
                  <thead className="bg-blue-500 text-white ">
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
                      <td className="px-4 py-2 border border-gray-200">BNI</td>
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
                      <td className="px-4 py-2 border border-gray-200">BOA</td>
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
                        className="px-4 py-2 border border-gray-300 text-left"
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
          )}

          {ActivationAffichage === "InsertionRemiseFOURNIISEUR" && (
            <div>
              <div className="flex justify-center text-lg font-bold mb-2">
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                 `}
                  onClick={() => handleSelect("ListeTiers", " ")}
                >
                  {DonneSession.groupe.toUpperCase()}
                </button>

                <button
                  className={`hover:border-b-blue-500 border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() =>
                    handleSelect(
                      "InsertionRemiseFOURNIISEUR",
                      "InsertionRemiseFOURNIISEUR"
                    )
                  }
                >
                  REMISE
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => {
                    handleSelect("DOCUMENTSFOURN", "DOCUMENTSFOURN");
                    // setNavbarDocuments("documents");
                  }}
                >
                  DOCUMENTS
                </button>
              </div>{" "}
              <div className="bg-white p-6 rounded-lg shadow-lg ">
                <select
                  value={pourcetang}
                  onChange={(e) => setpourcetang(e.target.value)}
                  className="p-3 mx-[35%] mb-8 px-[10%] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value={"pourcetang"}>POURCENTAGE</option>
                  <option value={"valeur"}>VALEUR</option>
                </select>

                <div className="grid grid-cols-4 gap-4">
                  <div></div>
                  <div>
                    <form>
                      {pourcetang === "pourcetang" ? (
                        <div className="flex items-center gap-6">
                          <label
                            htmlFor="champ1"
                            className="text-sm font-medium text-gray-700"
                          >
                            POURCENTAGE:
                          </label>
                          <input
                            id="pourcentage"
                            type="number"
                            className="border p-4  border-gray-300 rounded-md px-[50%] py-2"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-6">
                          <label
                            htmlFor="champ1"
                            className="text-sm font-medium text-gray-700 text-3xl"
                          >
                            VALEUR:
                          </label>
                          <input
                            id="valeur"
                            type="number"
                            className="border border-gray-300 rounded-md px-[50%] py-2"
                          />
                        </div>
                      )}
                      <div className="mt-8 ml-[50%] flex   gap-6">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                        >
                          VALIDER
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
                        >
                          REFRECHIR
                        </button>
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />
                    <h1 className="text-white ">.</h1>
                  </div>
                </div>
                <div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <h1 className="text- ">QSFSDF.</h1>
                </div>
              </div>
            </div>
          )}
          {ActivationAffichage === "InsertionRemise" && (
            <div>
              <div className="flex justify-center text-lg font-bold mb-2">
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                  `}
                  onClick={() => handleSelect("ListeTiers", " ")}
                >
                  {Donne_Tier.type.toUpperCase()}
                </button>

                <button
                  className={`hover:border-b-blue-500 border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => handleSelect("InsertionRemise", "REMISE")}
                >
                  REMISE
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => {
                    handleSelect("DOCUMENTS", "DOCUMENTS");
                    // setNavbarDocuments("documents");
                  }}
                >
                  DOCUMENTS
                </button>
              </div>{" "}
              <div className="bg-white p-6 rounded-lg shadow-lg ">
                <select
                  value={pourcetang}
                  onChange={(e) => setpourcetang(e.target.value)}
                  className="p-3 mx-[35%] mb-8 px-[10%] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value={"pourcetang"}>POURCENTAGE</option>
                  <option value={"valeur"}>VALEUR</option>
                </select>

                <div className="grid grid-cols-4 gap-4">
                  <div></div>
                  <div>
                    <form>
                      {pourcetang === "pourcetang" ? (
                        <div className="flex items-center gap-6">
                          <label
                            htmlFor="champ1"
                            className="text-sm font-medium text-gray-700"
                          >
                            POURCENTAGE:
                          </label>
                          <input
                            id="pourcentage"
                            type="number"
                            className="border p-4  border-gray-300 rounded-md px-[50%] py-2"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-6">
                          <label
                            htmlFor="champ1"
                            className="text-sm font-medium text-gray-700 text-3xl"
                          >
                            VALEUR:
                          </label>
                          <input
                            id="valeur"
                            type="number"
                            className="border border-gray-300 rounded-md px-[50%] py-2"
                          />
                        </div>
                      )}
                      <div className="mt-8 ml-[50%] flex   gap-6">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                        >
                          VALIDER
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
                        >
                          REFRECHIR
                        </button>
                      </div>
                    </form>
                  </div>
                  <div>
                    <br />
                    <h1 className="text-white ">.</h1>
                  </div>
                </div>
                <div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <h1 className="text-white ">QSFSDF.</h1>
                </div>
              </div>
            </div>
          )}

          {ActivationAffichage === "insertionTiers" && (
            <div>
              <div className="flex justify-center text-lg font-bold mb-2">
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                  border-b-blue-500`}
                  onClick={() => handleSelect("ListeTiers", " ")}
                >
                  TIERS
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() =>
                    handleSelect(
                      "InsertionRemiseFOURNIISEUR",
                      "InsertionRemiseFOURNIISEUR"
                    )
                  }
                >
                  REMISE
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => {
                    handleSelect("DOCUMENTSFOURN", "DOCUMENTSFOURN");
                    // setNavbarDocuments("documents");
                  }}
                >
                  DOCUMENTS
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10`}
                  onClick={() => handleSelect("HISTORIQUE", "HISTORIQUE")}
                >
                  HISTORIQUE
                </button>
              </div>
              <form
                onSubmit={handleSubmit_tier}
                className="bg-white p-6 rounded-lg shadow-md   space-y-6"
              >
                {/* Grid principale : 2 champs par ligne */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      label: "Nom",
                      name: "nomTier",
                      type: "text",
                      required: true,
                    },
                    {
                      label: "Zone",
                      name: "zone",
                      type: "text",
                      required: true,
                    },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Contact", name: "contact", type: "text" },
                    { label: "NIF", name: "nif", type: "text" },
                    { label: "Stat", name: "stat", type: "text" },
                    { label: "RCS", name: "rcs", type: "text" },
                  ].map((field) => (
                    <div key={field.name} className="flex items-center gap-4">
                      <label className="w-32 font-medium text-gray-700">
                        {field.label}:
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formDataT[field.name]}
                        onChange={handleChangeT}
                        required={field.required || false}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {field.required ? (
                        <span className="text-red-600">***</span>
                      ) : (
                        <span className="text-white">***</span>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      COMMERCE :
                    </label>
                    <select
                      id="commercial"
                      value={formDataT.commercial}
                      onChange={handleChangeT}
                      name="commercial"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(ListeUTILISATEUR.map((item) => item.nom)),
                      ].map((nom, index) => (
                        <option key={`nom-${index}`} value={nom}>
                          {nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type et Mot de passe conditionnel */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      TYPE :
                    </label>
                    <select
                      name="type"
                      value={formDataT.type}
                      onChange={(e) => {
                        handleChangeT(e);
                        if (e.target.value !== "Livreur") {
                          setFormDataT((prev) => ({ ...prev, motDePasse: "" }));
                        }
                      }}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">...</option>
                      <option value="Fournisseur">Fournisseur</option>
                      <option value="Client">Client</option>
                      <option value="Livreur">Livreur</option>
                    </select>
                    <span className="text-red-600">***</span>
                  </div>

                  {formDataT.type === "Livreur" && (
                    <div className="flex items-center gap-4">
                      <label className="w-32 font-medium text-gray-700">
                        MOT DE PASSE :
                      </label>
                      <input
                        type="password"
                        name="motDePasse"
                        value={formDataT.motDePasse}
                        onChange={handleChangeT}
                        minLength={5}
                        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$"
                        title="Le mot de passe doit contenir au moins 5 caractères, avec au moins une lettre et un chiffre"
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-red-600">***</span>
                    </div>
                  )}
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
                    onClick={() => handleSelect("ListeTiers")}
                    className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    ANNULER
                  </button>
                </div>
              </form>
            </div>
          )}

          {ActivationAffichage === "ListeTiers" && (
            <div>
              <div className="flex justify-center text-lg font-bold mb-2">
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                  border-b-blue-500`}
                  onClick={() => handleSelect("ListeTiers", " ")}
                >
                  {DonneSession.groupe.toUpperCase()}
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() =>
                    handleSelect(
                      "InsertionRemiseFOURNIISEUR",
                      "InsertionRemiseFOURNIISEUR"
                    )
                  }
                >
                  REMISE
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => {
                    handleSelect("DOCUMENTSFOURN", "DOCUMENTSFOURN");
                    // setNavbarDocuments("documents");
                  }}
                >
                  DOCUMENTS
                </button>

                {/* <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10`}
                  onClick={() => handleSelect("HISTORIQUE", "HISTORIQUE")}
                >
                  HISTORIQUE
                </button> */}
              </div>
              <div className="bg-white p-6 mb-6">
                <div className="flex flex-col md:flex-row items-center justify-between  ">
                  <h1 className="text-2xl font-bold text-blue-600 mb-4 md:mb-0">
                    LISTE TIERS
                  </h1>

                  {/* FORMULAIRE DE RECHERCHE */}
                  <form
                    onSubmit={handleSearcheSubmitTIERS}
                    className="flex flex-wrap gap-4 items-center"
                  >
                    {/* Nom */}
                    <select
                      id="nomTier"
                      name="nomTier"
                      value={formDataSearcheTIERS.nomTier}
                      onChange={handleChangeSearcheTIERS}
                      className="w-25 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OriginalListeTIERS.map((item) => item.nomTier)
                        ),
                      ].map((nomTier, index) => (
                        <option key={`nom-${index}`} value={nomTier}>
                          {nomTier}
                        </option>
                      ))}
                    </select>

                    {/* Type */}
                    <select
                      id="type"
                      name="type"
                      value={formDataSearcheTIERS.type}
                      onChange={handleChangeSearcheTIERS}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(OriginalListeTIERS.map((item) => item.type)),
                      ].map((type, index) => (
                        <option key={`type-${index}`} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    {/* Zone */}
                    <select
                      id="zone"
                      name="zone"
                      value={formDataSearcheTIERS.zone}
                      onChange={handleChangeSearcheTIERS}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(OriginalListeTIERS.map((item) => item.zone)),
                      ].map((zone, index) => (
                        <option key={`zone-${index}`} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                      FILTRER
                    </button>

                    <button
                      type="button"
                      onClick={handleRefreshTIERS}
                      className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                    >
                      RAFRAICHIR
                    </button>
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
                    rows={ListeTiers}
                    columns={ColunneTIERS}
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
            </div>
          )}

          {ActivationAffichage === "detailTier" && Donne_Tier && (
            <div>
              {Donne_Tier.type === "Livreur" ? (
                <div>
                  <div className="flex justify-center text-lg font-bold mb-2">
                    <button
                      className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                  border-b-blue-500`}
                      onClick={() => handleSelect("ListeTiers", " ")}
                    >
                      {Donne_Tier.type.toUpperCase()}
                    </button>

                    <button
                      className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                      onClick={() => {
                        handleSelect("DOCUMENTS", "DOCUMENTS");
                      }}
                    >
                      DOCUMENTS
                    </button>

                    <button
                      className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                      onClick={() => handleSelect("NOTES", "NOTES")}
                    >
                      NOTES
                    </button>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                      DÉTAIL Mr/Mn <strong>{Donne_Tier.nomTier}</strong>
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          NOM :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.nomTier}</strong>
                        </span>
                      </div>

                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          ZONE :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.zone}</strong>
                        </span>
                      </div>

                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          EMAIL :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.email}</strong>
                        </span>
                      </div>

                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          EMAIL :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.email}</strong>
                        </span>
                      </div>

                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          MOT DE PASSE :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.motDePasse}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-6">
                      <button
                        onClick={() =>
                          etat_Tier(Donne_Tier.id, Donne_Tier.colonne)
                        }
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg transition ${
                          Donne_Tier.colonne === "activer"
                            ? "bg-orange-500 text-orange-100 hover:bg-orange-600"
                            : "bg-green-500 text-green-100 hover:bg-green-600"
                        }`}
                      >
                        {Donne_Tier.colonne === "activer" ? (
                          <>
                            <ToggleOffIcon /> <span>Désactiver</span>
                          </>
                        ) : (
                          <>
                            <ToggleOnIcon /> <span>Activer</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setmodife_Tier(Donne_Tier);
                          handleSelect("modifService");
                        }}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-blue-100 rounded-lg hover:bg-blue-600 transition"
                      >
                        <EditIcon />
                        <span>Modifier</span>
                      </button>

                      <button
                        onClick={() => handleSelect("ListeTiers")}
                        className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <span>Fermer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center text-lg font-bold mb-2">
                    <button
                      className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                  border-b-blue-500`}
                      onClick={() => handleSelect("ListeTiers", " ")}
                    >
                      {Donne_Tier.type.toUpperCase()}
                    </button>

                    <button
                      className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                      onClick={() => handleSelect("InsertionRemise", "REMISE")}
                    >
                      REMISE
                    </button>

                    <button
                      className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                      onClick={() => {
                        handleSelect("DOCUMENTSFOURN", "DOCUMENTSFOURN");
                        // setNavbarDocuments("documents");
                      }}
                    >
                      DOCUMENTS
                    </button>

                    {/* <button
                      className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10`}
                      onClick={() => handleSelect("HISTORIQUE", "HISTORIQUE")}
                    >
                      HISTORIQUE
                    </button> */}
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                      DÉTAIL Mr/Mn <strong>{Donne_Tier.nomTier}</strong>
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          NOM :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.nomTier}</strong>
                        </span>
                      </div>
                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          TYPE :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.type}</strong>
                        </span>
                      </div>
                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          ZONE :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.zone}</strong>
                        </span>
                      </div>

                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          EMAIL :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.email}</strong>
                        </span>
                      </div>

                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          NIF :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.nif}</strong>
                        </span>
                      </div>
                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          STAT :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.stat}</strong>
                        </span>
                      </div>
                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          RCS :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.rcs}</strong>
                        </span>
                      </div>

                      {/* <div className="p-3  rounded-lg flex gap-6">
                      <span className="font-semibold text-gray-600">
                        COMMERCIAL :
                      </span>
                      <span className="block text-gray-800">
                        <strong>{Donne_Tier.commercial}</strong>
                      </span>
                    </div> */}
                      <div className="p-3  rounded-lg flex gap-6">
                        <span className="font-semibold text-gray-600">
                          ETAT :
                        </span>
                        <span className="block text-gray-800">
                          <strong>{Donne_Tier.colonne}</strong>
                        </span>
                      </div>
                    </div>

                    {/* <div className="mt-6 flex">
                      <button
                        onClick={() => handleSelect("ListeTiers")}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Fermer
                      </button>
                      <button
                        onClick={() =>
                          etat_Tier(Donne_Tier.id, Donne_Tier.colonne)
                        }
                        className={`${
                          Donne_Tier.colonne === "activer"
                            ? "text-orange-400 hover:text-orange-500"
                            : "text-green-500 hover:text-green-600"
                        }`}
                      >
                        {Donne_Tier.colonne === "activer" ? (
                          <div className="w-[60%]">
                            <ToggleOffIcon />
                          </div>
                        ) : (
                          <ToggleOnIcon />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setmodife_Tier(Donne_Tier);
                          handleSelect("modifTIERS");
                        }}
                        className="text-green-500 hover:text-green-700"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => TierSuppression(Donne_Tier.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <DeleteIcon />
                      </button>
                    </div> */}
                    <div className="mt-8 flex justify-center gap-6">
                      {/* Bouton Fermer */}

                      {/* Bouton Activer/Désactiver */}
                      <button
                        onClick={() =>
                          etat_Tier(Donne_Tier.id, Donne_Tier.colonne)
                        }
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg transition ${
                          Donne_Tier.colonne === "activer"
                            ? "bg-orange-500 text-orange-100 hover:bg-orange-600"
                            : "bg-green-500 text-green-100 hover:bg-green-600"
                        }`}
                      >
                        {Donne_Tier.colonne === "activer" ? (
                          <>
                            <ToggleOffIcon /> <span>Désactiver</span>
                          </>
                        ) : (
                          <>
                            <ToggleOnIcon /> <span>Activer</span>
                          </>
                        )}
                      </button>

                      {/* Bouton Modifier */}
                      <button
                        onClick={() => {
                          setmodife_Tier(Donne_Tier);
                          handleSelect("modifTIERS");
                        }}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-blue-100 rounded-lg hover:bg-blue-600 transition"
                      >
                        <EditIcon />
                        <span>Modifier</span>
                      </button>

                      {/* Bouton Supprimer */}
                      <button
                        onClick={() => TierSuppression(Donne_Tier.id)}
                        className="flex items-center gap-2 px-5 py-2 bg-red-500 text-red-100 rounded-lg hover:bg-red-600 transition"
                      >
                        <DeleteIcon />
                        <span>Supprimer</span>
                      </button>
                      <button
                        onClick={() => handleSelect("ListeTiers")}
                        className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <span>Fermer</span>
                      </button>
                    </div>
                    <div className="mt-8 flex justify-center gap-6 flex-wrap">
                      {/* Bouton Créer Commande */}
                      <button className="flex items-center justify-center gap-2 w-[280px] px-6 py-4 bg-blue-500 text-white text-lg font-medium rounded-xl shadow-md hover:bg-blue-600 transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7h18M3 12h18M3 17h18"
                          />
                        </svg>
                        Créer Commande
                      </button>

                      {/* Bouton Créer Facture */}
                      <button className="flex items-center justify-center gap-2 w-[280px] px-6 py-4 bg-blue-500 text-white text-lg font-medium rounded-xl shadow-md hover:bg-blue-600 transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6M5 7h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Créer Facture
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {ActivationAffichage === "modifTIERS" && (
            <div>
              <div className="flex justify-center text-lg font-bold mb-2">
                <button
                  className={`hover:border-b-blue-500 border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                  border-b-blue-500`}
                  onClick={() => handleSelect("ListeTiers", " ")}
                >
                  {DonneSession.groupe.toUpperCase()}
                </button>

                <button
                  className={`hover:border-b-blue-500  border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() =>
                    handleSelect(
                      "InsertionRemiseFOURNIISEUR",
                      "InsertionRemiseFOURNIISEUR"
                    )
                  }
                >
                  REMISE
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => {
                    handleSelect("DOCUMENTSFOURN", "DOCUMENTSFOURN");
                    // setNavbarDocuments("documents");
                  }}
                >
                  DOCUMENTS
                </button>
              </div>

              {/* Formulaire */}
              <div className="text-lg mb-5">
                <form
                  onSubmit={ModifeTier}
                  className="bg-white p-6 rounded-lg shadow-md space-y-6"
                >
                  <h1 className="text-2xl font-bold text-blue-600 mb-8 mt-8 text-center">
                    MODIFICATION
                  </h1>

                  <div className="grid grid-cols-2 gap-6">
                    {[
                      {
                        label: "Nom",
                        name: "nomTier",
                        type: "text",
                        required: true,
                      },
                      {
                        label: "Zone",
                        name: "zone",
                        type: "text",
                        required: true,
                      },
                      { label: "Email", name: "email", type: "email" },
                      { label: "NIF", name: "nif", type: "text" },
                      { label: "Stat", name: "stat", type: "text" },
                      { label: "RCS", name: "rcs", type: "text" },
                    ].map((field) => (
                      <div key={field.name} className="flex items-center gap-4">
                        <label className="w-32 font-medium">
                          {field.label}:
                        </label>
                        <input
                          type={field.type}
                          value={modife_Tier[field.name] || ""}
                          onChange={(e) =>
                            setmodife_Tier({
                              ...modife_Tier,
                              [field.name]: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span
                          className={
                            field.required ? "text-red-600" : "text-white"
                          }
                        >
                          (*)
                        </span>
                      </div>
                    ))}

                    {/* TYPE (corrigé et aligné comme les autres) */}
                    <div className="flex items-center gap-12">
                      <label className="w-30 font-medium">Type:</label>
                      <select
                        name="type"
                        value={modife_Tier.type || ""}
                        onChange={(e) =>
                          setmodife_Tier({
                            ...modife_Tier,
                            type: e.target.value,
                          })
                        }
                        className="flex-1  px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Fournisseur">Fournisseur</option>
                        <option value="Client">Client</option>
                        <option value="Livreur">Livreur</option>
                      </select>
                      <span className="text-red-600">(*)</span>
                    </div>
                  </div>

                  {/* Boutons action */}

                  <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                    >
                      VALIDER
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect("ListeTiers")}
                      className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                    >
                      ANNULER
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {ActivationAffichage === "HISTORIQUE" && (
            <div>
              <div className="flex justify-center text-lg font-bold mb-2">
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
                  border-b-blue-500`}
                  onClick={() => handleSelect("ListeTiers", " ")}
                >
                  TIERS
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => handleSelect("InsertionRemise", "REMISE")}
                >
                  REMISE
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      `}
                  onClick={() => {
                    handleSelect("DOCUMENTS", "DOCUMENTS");
                    // setNavbarDocuments("documents");
                  }}
                >
                  DOCUMENTS
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10`}
                  onClick={() => handleSelect("HISTORIQUE", "HISTORIQUE")}
                >
                  HISTORIQUE
                </button>
              </div>
              <div className="p-0 m-0">
                {/* Bloc DataGrid */}

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
            </div>
          )}
          {ActivationAffichage === " " && (
            <div>
              <h1 className="text-2xl font-bold text-blue-500 mt-6 mb-4 underline">
                Statistiques
              </h1>

              <div className=" grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-3 overflow-x-auto">
                  <BarChart
                    xAxis={[
                      { data: ["Categorie A", "Categorie B", "Categorie C"] },
                    ]}
                    series={[
                      { data: [4, 6, 3] },
                      { data: [2, 4, 5] },
                      { data: [4, 3, 7] },
                    ]}
                    height={300}
                  />
                </div>
                <div className="flex flex-col justify-center space-y-3 ml-0 md:ml-6">
                  <div>
                    <span className="bg-blue-800 text-blue-800 rounded px-2">
                      G
                    </span>
                    <strong className="ml-2">Série 1</strong>
                  </div>
                  <div>
                    <span className="bg-red-500 text-red-500 rounded px-2">
                      G
                    </span>
                    <strong className="ml-2">Série 2</strong>
                  </div>
                  <div>
                    <span className="bg-yellow-400 text-yellow-400 rounded px-2">
                      G
                    </span>
                    <strong className="ml-2">Série 3</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
