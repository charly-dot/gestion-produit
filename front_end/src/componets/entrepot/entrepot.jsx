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

export function Entrepot() {
  ///message de reuci
  const [message, setMessage] = useState(null);
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000); // disparaît après 3 sec
  };
  const [navbar, setNavbar] = useState("");
  const [loading, setLoading] = useState(false);

  const { DonneSession, logout } = useContext(AuthContext);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /// AFFICHAGE
  // navbar

  const [OriginalListe, setOriginalListe] = useState([]);
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
    { field: "id", headerName: "N°", width: 10 },
    { field: "colonnes", headerName: "TYPE", width: 110 },
    { field: "nomProduit", headerName: "NOM", width: 110 },
    { field: "type_categorie", headerName: "TYPE CATEGORIE", width: 110 },
    { field: "categorie", headerName: "CATEGORIE", width: 110 },
    { field: "prix", headerName: "PRIX", width: 110 },
    { field: "entrepot", headerName: "ENTREPOT", width: 110 },
    { field: "casier", headerName: "CASIER", width: 110 },
    { field: "stock_initia", headerName: "QUANTITER", width: 110 },
    {
      field: "action",
      headerName: "ACTIONS",
      width: 70,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDonne_PRODUIT(params.row);
              handleSelect("detailPRODUIT", "PRODUIT");
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
        "http://127.0.0.1:8000/api/liste_Produit"
      );
      // console.log(response.data);
      setListeProduit(response.data);
      setOriginalListe(response.data);
    } catch (err) {
      setErrors("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };
  //   INSERTION PRODUIT

  React.useEffect(() => {
    listeP();
    handleSelect("ENTREPOT", "ENTREPOT");
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
              ENTREPOT
            </h1>

            {showTIERS && (
              <div className="ml-3 mt-1 space-y-1">
                <a
                  onClick={() => handleSelect("InsertionENTREPOT", "ENTREPOT")}
                  className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  CRÉER
                </a>
                <a
                  onClick={() => handleSelect("ListeENTREPOT", "ENTREPOT")}
                  className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  LISTE
                </a>
              </div>
            )}
            <h1 className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
              <Link to="/Article_Service">SERVICE</Link>
            </h1>

            <h1 className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
              <Link to="/produits_tiers">PRODUIT</Link>
            </h1>

            <a className="mt-5 cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
              Historiques
            </a>
          </div>
        </div>

        {/* Contenu droit */}
        <div className="flex-1 bg-gray-200 p-6">
          {/* Navbar */}
          <div className="flex justify-center text-lg font-bold mb-2">
            {["PRODUIT", "PRIX", "STOCK", "DOCUMENT", "HISTORIQUE"].map(
              (item) => (
                <button
                  key={item}
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                    condition_navbar === item ? "border-b-blue-500" : ""
                  }`}
                  onClick={() => handleSelect(item, item)}
                >
                  {item}
                </button>
              )
            )}
          </div>
          {(ActivationAffichage === "ENTREPOT" ||
            ActivationAffichage === "ListeENTREPOT") && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div className="flex  items-center justify-end ">
                {/* <h1 className="text-2xl font-bold text-blue-600 mb-4 md:mb-0">
                  LISTE PRODUIT
                </h1> */}
                <form
                  // onSubmit={handleSearcheSubmit}
                  className="grid grid-cols-9 gap-4 items-center"
                >
                  <div>
                    <label
                      htmlFor="colonnes"
                      className="font-semibold text-gray-700"
                    >
                      TYPE
                    </label>
                    <select
                      id="colonnes"
                      // value={formDataSearche.colonnes}
                      // onChange={handleChangeSearche}
                      name="colonnes"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  {/* Nom */}
                  <div>
                    <label
                      htmlFor="nom"
                      className="font-semibold text-gray-700"
                    >
                      NOM
                    </label>

                    <input
                      name="nomProduit" // ✅ pas "nom"
                      // value={formDataSearche.nomProduit}
                      // onChange={handleChangeSearche}
                      type="text"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zone"
                      className="font-semibold text-gray-700"
                    >
                      ZONE
                    </label>

                    <input
                      name="zone"
                      // value={formDataSearche.zone}
                      // onChange={handleChangeSearche}
                      type="text"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zone"
                      className="font-semibold text-gray-700"
                    >
                      CATEGORIE
                    </label>

                    <select
                      id="CATEGORIE"
                      // value={formDataSearche.categorie}
                      // onChange={handleChangeSearche}
                      name="categorie" // ✅ mets en minuscule comme dans ton state
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <div>
                    <label
                      htmlFor="entrepot"
                      className="font-semibold text-gray-700"
                    >
                      ENTROPOT
                    </label>
                    <select
                      id="entrepot"
                      // value={formDataSearche.entrepot}
                      // onChange={handleChangeSearche}
                      name="entrepot"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(OriginalListe.map((item) => item.entrepot)),
                      ].map((entrepot, index) => (
                        <option key={`categorie-${index}`} value={entrepot}>
                          {entrepot}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="CASIER"
                      className="font-semibold text-gray-700"
                    >
                      CASIER
                    </label>
                    <select
                      // value={formDataSearche.casier}
                      // onChange={handleChangeSearche}
                      id="casier"
                      name="casier"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(OriginalListe.map((item) => item.casier)),
                      ].map((casier, index) => (
                        <option key={`casier-${index}`} value={casier}>
                          {casier}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="UTILISATEUR"
                      className="font-semibold text-gray-700"
                    >
                      UTILISATEUR
                    </label>
                    <select
                      id="UTILISATEUR"
                      name="UTILISATEUR"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="UTILISATEUR"
                      className="font-semibold text-white"
                    >
                      K
                    </label>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                      FILTRER
                    </button>
                  </div>
                  <div>
                    <label
                      htmlFor="UTILISATEUR"
                      className="font-semibold text-white"
                    >
                      K
                    </label>
                    <button
                      // onClick={handleRefresh}
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
          {ActivationAffichage === "InsertionENTREPOT" && (
            <div>
              <form className="bg-white p-6 rounded-lg shadow-md   space-y-6">
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
                      label: "STOCK",
                      name: "stock_initia",
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
                        // onChange={handleChangeP}
                        required={field.required || false}
                        {...(field.type !== "file"
                          ? { value: formDataP[field.name] }
                          : {})}
                        className=" flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                      />
                      {field.required ? (
                        <span className="text-red-600"> (*)</span>
                      ) : (
                        <span className="text-white"> (*)</span>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-4">
                    <label className="font-medium text-gray-700 w-32">
                      FICHIER JOINT:
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
                      // value={formDataP.type_categorie}
                      // onChange={handleChangeP}
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
                      // value={formDataP.categorie}
                      // onChange={handleChangeP}
                      required
                      disabled={!formDataP.type_categorie}
                      className={`flex-1 px-4 py-2 border rounded-md ${
                        !formDataP.type_categorie ? "bg-gray-200" : ""
                      }`}
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
                    onClick={() => handleSelect("ListePRODUIT", "PRODUIT")}
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
