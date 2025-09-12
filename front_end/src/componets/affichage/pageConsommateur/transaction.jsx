import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export function Transaction() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [croissant, setCroissant] = useState(false);
  const [factultatif, setfactultatif] = useState(true);
  const [table, setTable] = useState(true);
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
      compte: "BNI",
      fournisseur: "F1",
      montantHT: 200,
      montantTTC: 240,
    },
    {
      id: 2,
      date: "2025-08-18",
      compte: "BOA",
      fournisseur: "F2",
      montantHT: 500,
      montantTTC: 600,
    },
  ];
  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc.ht += row.montantHT;
        acc.ttc += row.montantTTC;
        return acc;
      },
      { ht: 0, ttc: 0 }
    );
  }, [rows]);
  return (
    <div>
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
            className="  py-4 px-10 text-blue-500  hover:border  hover:border-gray-100  hover:border-b-blue-500"
            onClick={() => navigate("/suivit")}
          >
            Suivi achat
          </a>
          <a
            href=""
            className="border  border-gray-100  border-b-blue-500 text-blue-500 py-4 px-10"
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
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            onChange={(e) => {
              if (e.target.value === "table") setTable(true);
              if (e.target.value === "form") setTable(false);
            }}
          >
            <option value="table">Liste Transaction</option>
            <option value="form">Créer Transaction</option>
          </select>
        </div>
        {table ? (
          <div>
            {factultatif ? (
              <div className="mb-6">
                <div className="bg-white  py-1 px-8 rounded-xl shadow-lg w-[30%]">
                  <a
                    href="#"
                    className="underline text-cyan-600 block mb-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setfactultatif(true);
                    }}
                  >
                    Champs facultatif
                  </a>

                  <form className="space-y-2">
                    {/* Date */}
                    <div className="flex items-center gap-4">
                      <label className="w-32 text-gray-700 font-medium">
                        Date :
                      </label>
                      <input
                        type="date"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>

                    {/* Fournisseur */}
                    <div className="flex items-center gap-4">
                      <label className="w-32 text-gray-700 font-medium">
                        Fournisseur :
                      </label>
                      <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300">
                        <option>Fournisseur 1</option>
                        <option>Fournisseur 2</option>
                      </select>
                    </div>

                    {/* Complet */}
                    <div className="flex items-center gap-4">
                      <label className="w-32 text-gray-700 font-medium">
                        Compte :
                      </label>
                      <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300">
                        <option>BNI</option>
                        <option>BOA</option>
                      </select>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-4 pt-2">
                      <button
                        type="button"
                        className="px-6 py-2 font-semibold border bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
                        onClick={() => setfactultatif(true)}
                      >
                        Rafraîchir
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 font-semibold border bg-cyan-500 text-white rounded-lg shadow hover:bg-cyan-600 transition"
                      >
                        Rechercher
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="">
                <button
                  className="px-8 py-2 font-semibold mt-6 border bg-cyan-100 text-gray-700 uppercase border-gray-300 rounded-xl shadow-sm m-3"
                  onClick={() => setfactultatif(true)}
                >
                  Champs de Recherche
                </button>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-4">
              <Box
                sx={{
                  height: 400,
                  width: "100%",
                }}
              >
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>

              {/* ✅ Ligne de total en dessous */}
              <div className="flex justify-end mt-4 border-t pt-2 text-lg font-semibold">
                <span className="mr-10 text-yellow-600">
                  Total HT : {totals.ht}
                </span>
                <span className="text-yellow-600">
                  Total TTC : {totals.ttc}
                </span>
              </div>
            </div>

            {show && (
              <div className="mt-6 bg-cyan-300 p-6 rounded-lg shadow-lg w-[40%]">
                <h3 className="text-white text-2xl font-semibold mb-4">
                  DOCUMENTS
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <button className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                    Commande
                  </button>
                  <button className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                    Facture
                  </button>
                  <button className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                    Livraison
                  </button>
                </div>
              </div>
            )}
            <div className="mb-6 flex justify-center ">
              <button className="px-8 py-2 font-semibold mt-6 border bg-cyan-100 text-gray-700 uppercase text-smborder-gray-300 rounded-xl shadow-sm ">
                Affiche
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl text-center font-bold underline mb-6 text-gray-700">
              CREATION DE TRANSACTION
            </h1>

            <form className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg space-y-5">
              {/* Compte */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-gray-700 font-medium">
                  COMPTE :
                </label>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="N° de compte"
                />
              </div>

              {/* Fournisseur */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-gray-700 font-medium">
                  FOURNISSEUR :
                </label>
                <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300">
                  <option>Fournisseur 1</option>
                  <option>Fournisseur 2</option>
                </select>
              </div>

              {/* Montants */}
              <div className="grid grid-cols-2 gap-6">
                {/* Montant HT */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    MONTANT HT :
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                      placeholder="0.00"
                    />
                    <span className="absolute left-2 top-2.5 text-gray-500">
                      €
                    </span>
                  </div>
                </div>

                {/* Montant TTC */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    MONTANT TTC :
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                      placeholder="0.00"
                    />
                    <span className="absolute left-2 top-2.5 text-gray-500">
                      €
                    </span>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                  onClick={() => setTable(true)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
