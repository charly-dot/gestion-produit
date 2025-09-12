import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

export function Reception() {
  const navigate = useNavigate();
  return (
    <div className="p-6 bg-gray-100 min-h-screen ">
      <div className=" min-h-screen flex flex-col items-center">
        {/* Navigation */}
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
            className="py-4 px-10 text-blue-500  hover:border  hover:border-gray-100  hover:border-b-blue-500"
            onClick={() => navigate("/Transaction")}
          >
            Transaction
          </a>
          <a
            href=""
            className="border  border-gray-100  border-b-blue-500 text-blue-500 py-4 px-10"
            onClick={() => navigate("/réception")}
          >
            Boîte de réception
          </a>
        </div>

        {/* Contenu */}
        <div>
          <div className="bg-white rounded shadow-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-white text-gray-700 uppercase text-sm">
                <tr>
                  <th className="w-1/6 px-4 py-3 text-left">Nom</th>
                  <th className="w-1/4 px-4 py-3 text-left">Email</th>
                  <th className="w-7/12 px-4 py-3 text-left">Commentaire</th>
                  <th className="w-7/12 px-4 py-3 text-left">Suppression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Jean Dupont</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    jean.dupont@example.com
                  </td>
                  <td className="px-4 py-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    pretium, justo ac cursus luctus, lorem arcu dapibus magna,
                    eu tincidunt arcu metus non justo.
                  </td>
                  <td>
                    <button className="text-red-500 ml-12 hover:text-red-700">
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Marie Claire</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    marie.claire@example.com
                  </td>
                  <td className="px-4 py-3">
                    Super service 👌, je recommande vivement cette équipe pour
                    leur professionnalisme !
                  </td>
                  <td>
                    <button className="text-red-500 ml-12 hover:text-red-700">
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
