import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import api from "./../src/api/axios.js";

export default function Login() {
  const { DonneSession, login } = useContext(AuthContext);
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (DonneSession) {
      redirectByRole(DonneSession.groupe);
    }
  }, [DonneSession]);

  const redirectByRole = (groupe) => {
    if (groupe === "fournisseur") {
      navigate("/acceuilF");
    } else if (groupe === "entite") {
      navigate("/acceuilF");
    } else {
      navigate("/pageconsommateur");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", {
        email: loginInput,
        password,
      });

      // Sauvegarde de l'utilisateur et du token
      login(res.data.user, res.data.token);

      // Redirection selon le rôle
      redirectByRole(res.data.user.groupe);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Erreur login");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white p-4 overflow-hidden">
      {/* Background flouté */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/image/woman-shopping-legumes-au-supermarche.jpg')",
          filter: "blur(2px)", // 👈 blur seulement ici
          zIndex: 0,
        }}
      ></div>

      {/* Overlay sombre pour un meilleur contraste */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Card net */}
      <div className="relative p-8 rounded-2xl shadow-2xl w-full max-w-sm bg-[#3b82f6] z-20">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mt-4">
            <label className="mb-1 text-xl font-medium text-yellow-500">
              IDENTIFICATION
            </label>
            <input
              type="text"
              placeholder="Nom ou Email"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col mt-4">
            <label className="mb-1 text-xl font-medium text-yellow-500">
              MOT DE PASSE
            </label>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

          <button
            className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium"
            type="submit"
          >
            CONNEXION
          </button>
        </form>
      </div>
    </div>
  );
}

// import { useState, useContext } from "react";
// import { AuthContext } from "./AuthContext";
// import { useNavigate } from "react-router-dom";
// import api from "./../src/api/axios.js";

// export default function Login() {
//   const { login } = useContext(AuthContext);
//   const [loginInput, setLoginInput] = useState(""); // nom ou email
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("/login", {
//         email: loginInput,
//         password,
//       });

//       // Ici on sauvegarde tout l'objet user, y compris l'image
//       login(res.data.user, res.data.token);

//       // Redirection automatique après connexion
//       navigate("/pageconsommateur");
//     } catch (err) {
//       alert(err.response?.data?.message || "Erreur login");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-white p-4">
//       <div
//         className=" p-8 rounded-2xl shadow-2xl w-full max-w-sm bg-[#3b82f6]"
//         // style={{ backgroundColor: "#4f81bd" }}
//       >
//         <form onSubmit={handleSubmit}>
//           {/* <h2 className="text-2xl font-bold text-center text-white">
//             CONNEXION
//           </h2> */}

//           <div className="flex flex-col mt-4">
//             <label className="mb-1 text-xl font-medium text-yellow-500">
//               IDENTIFICATION
//             </label>
//             <input
//               type="text"
//               placeholder="Nom"
//               value={loginInput}
//               onChange={(e) => setLoginInput(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>

//           <div className="flex flex-col mt-4">
//             <label className="mb-1 text-xl font-medium text-yellow-500">
//               MOT DE PASSE
//             </label>
//             <input
//               type="password"
//               placeholder="Mot de passe"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>

//           <button
//             className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium"
//             type="submit"
//           >
//             CONNEXION
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
