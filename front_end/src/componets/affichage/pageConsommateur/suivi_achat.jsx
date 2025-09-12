import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export function Suivi_achat() {
  const navigate = useNavigate();
  const [show, setShow] = useState("facture"); // "facture" ou "commande"
  const [showDocs, setShowDocs] = useState(false);
  const [croissant, setCroissant] = useState(false);
  const columns = [
    { field: "id", headerName: "N°", width: 90 },
    { field: "REFERENCE", headerName: "REFERENCE", width: 300 },
    { field: "date", headerName: "DATE", width: 250 },
    { field: "fournisseur", headerName: "FOURNISSEUR", width: 300 },
    { field: "ETAT", headerName: "ETAT", width: 300 },
  ];

  const rows = [
    {
      id: 1,
      REFERENCE: "000000",
      date: "2025-08-18",
      fournisseur: "F1",
      ETAT: "etat 2",
    },
    {
      id: 2,
      REFERENCE: "000000",
      date: "2025-07-18",
      fournisseur: "F1",
      ETAT: "etat 2",
    },
    {
      id: 3,
      REFERENCE: "000000",
      date: "2024-04-18",
      fournisseur: "F1",
      ETAT: "etat 2",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}

      {/* Navbar centrée */}
      <div className="flex justify-center text-lg font-bold mb-6 gap-6">
        <a
          href=""
          className="ttext-blue-500 py-4 px-10 text-blue-500  hover:border  hover:border-gray-100  hover:border-b-blue-500"
          onClick={() => navigate("/liste_super_utilisateur")}
        >
          Utilisateurs
        </a>
        <a
          href=""
          className="border  border-gray-100  border-b-blue-500 text-blue-500 py-4 px-10"
          onClick={() => navigate("/suivit")}
        >
          Suivi achat
        </a>
        <a
          href=""
          className="text-blue-500 py-4 px-10   hover:border  hover:border-gray-100  hover:border-b-blue-500"
          onClick={() => navigate("/Transaction")}
        >
          Transaction
        </a>
        <a
          href=""
          className="  py-4 px-10 text-blue-500  hover:border  hover:border-gray-100  hover:border-b-blue-500"
          onClick={() => navigate("/réception")}
        >
          Boîte de réception
        </a>
      </div>

      {/* Select */}
      <div className="mb-6 flex justify-center">
        <select
          value={show}
          onChange={(e) => setShow(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          <option value="facture">Facture</option>
          <option value="commande">Commande</option>
        </select>
      </div>

      {/* Tableau */}
      <div className=" rounded-xl shadow-lg overflow-hidden">
        {show === "facture" ? (
          <>
            <h1 className="mb-6 text-3xl font-bold text-blue-500">
              LISTE FACTURE
            </h1>
            <Box
              sx={{
                height: 400,
                width: "100%",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#cffafe", // bg-cyan-100 en Tailwind
                },
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowClick={(params) => {
                  setShowDocs(true); // 👉 Affiche la section DOCUMENTS
                  console.log("Row clicked:", params.row); // Tu peux voir la ligne cliquée
                }}
              />
            </Box>
          </>
        ) : (
          <>
            <h1 className="mb-6 text-3xl font-bold text-blue-500">
              LISTE COMMANDE
            </h1>
            <Box sx={{ height: "70vh", width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
                onRowClick={(params) => {
                  setShowDocs(true); // 👉 Affiche la section DOCUMENTS
                  console.log("Row clicked:", params.row); // Tu peux voir la ligne cliquée
                }}
              />
            </Box>
          </>
        )}
      </div>

      {/* Section DOCUMENTS */}
      {showDocs && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-2xl w-[40%]">
          <h3 className="text-2xl text-gray-700 font-semibold mb-4">
            DOCUMENTS {show === "facture" ? "FACTURE" : "COMMANDE"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {show === "commande" && (
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition">
                Commande
              </button>
            )}
            {show === "facture" && (
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition">
                Facture
              </button>
            )}
            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition">
              Livraison
            </button>
          </div>
        </div>
      )}

      {/* Bouton afficher */}
      <div className="mb-6 flex justify-center ">
        <button className="px-8 py-2 font-semibold mt-6 border bg-blue-400 text-gray-700 uppercase border-gray-300 rounded-xl shadow-sm ">
          Afficher
        </button>
      </div>
    </div>
  );
}
