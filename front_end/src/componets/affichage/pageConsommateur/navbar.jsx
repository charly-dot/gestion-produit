import api from "../../../api/axios.js";
import { AuthContext } from "./../../../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

export function NavbarConsommateur() {
  const navigate = useNavigate();
  const { DonneSession, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div>
      <div className="bg-blue-500 flex justify-between items-center  shadow-lg">
        <div></div>
        <div className=" w-[25%] gap-6 flex justify-end  items-center">
          <button
            onClick={() => {
              if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
                handleLogout(); // si l'utilisateur clique sur "OK"
              }
            }}
            className="px-3 py-1  ml-[7%] bg-red-500 text-white rounded"
          >
            Déconnexion
          </button>

          <a
            href=""
            onClick={() => navigate("/AcceuilConso")}
            className="mr-[8%] p-1"
          >
            <img
              src={
                DonneSession?.profil
                  ? `http://localhost:8000/storage/${DonneSession.profil}`
                  : "/default-avatar.png"
              }
              alt="Profil"
              className="w-16 h-16 object-cover rounded-full border-4 border-cyan-500 shadow-md"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
