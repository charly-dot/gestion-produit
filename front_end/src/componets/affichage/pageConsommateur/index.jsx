import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./../../../AuthContext";
import { useContext } from "react";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  {
    id: 1,
    image: "/image/telephone.jfif",
    nom: "Téléphone Samsung",
    description: "Smartphone dernière génération",
    zone: "Antananarivo",
  },
  {
    id: 2,
    image: "/image/lait).jfif",
    nom: "Lait Gloria",
    description: "Boîte de lait concentré sucré",
    zone: "Toamasina",
  },
  {
    id: 3,
    image: "/image/fleur.jfif",
    nom: "Bouquet de Roses",
    description: "Roses rouges fraîches",
    zone: "Fianarantsoa",
  },
];

export function IndexConsommateur() {
  const navigate = useNavigate();
  const { DonneSession, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!DonneSession) {
    return <div className="text-center text-3xl text-red">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="max-w-6xl mx-auto mt-10 px-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className=" text-blue-500 font-bold mb-4 mb-6 text-3xl font-bold border-4 border-gray-100 border-b--blue-500">
              LISTE DES PRODUITS
            </h1>
            {/* <input
              type="text"
              placeholder="Rechercher un produit..."
              className="px-4 py-2 rounded border border-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            /> */}
            <div className=" focus:outline-none focus:ring-2 focus:ring-blue-300">
              <form class="max-w-md mx-auto">
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      class="w-4 h-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    class="block w-full p-4 px-12 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                    placeholder="Search Mockups, Logos..."
                    required
                  />
                  <button
                    type="submit"
                    class="dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 absolute end-2.5 bottom-2.5 font-medium rounded-lg text-sm px-4 py-2 "
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>

          <TableContainer
            component={Paper}
            className="max-h-[70vh] overflow-y-auto"
          >
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead className="py-4 px-4 sticky top-0 hover:bg-red z-20">
                <TableRow>
                  <TableCell>
                    <strong className="text-lg p-4 text-gray-900">Image</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong className="text-lg p-4  text-gray-900">Nom</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong className="text-lg p-4">Description</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong className="text-lg p-4">Zone</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong className="text-lg p-4">Contact</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <img
                        src={row.image}
                        alt={row.nom}
                        className="w-20 h-20 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell align="right">{row.nom}</TableCell>
                    <TableCell align="right">{row.description}</TableCell>
                    <TableCell align="right">{row.zone}</TableCell>
                    <TableCell align="right">
                      <button
                        onClick={() => navigate("/message")}
                        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                      >
                        <FiMail className="w-8 h-8 text-blue-600" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
