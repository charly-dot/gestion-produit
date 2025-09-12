import React, { useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import api from "./api/axios";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import { Navbar } from "./componets/navbar";
import { CreateSuperUser } from "./componets/create_super_admin";
import { ListeUtilisateur } from "./componets/affichage/liste_utilisateur";
import { Suivi_achat } from "./componets/affichage/pageConsommateur/suivi_achat";
import { Acceuil } from "./componets/affichage/acceuil";
import Discution from "./componets/affichage/message";
import { Consomateur } from "./componets/insertions/consommateur";
import { IndexConsommateur } from "./componets/affichage/pageConsommateur";
import { AcceuilConsommater } from "./componets/affichage/pageConsommateur/compte";
import { Transaction } from "./componets/affichage/pageConsommateur/transaction";
import { Reception } from "./componets/affichage/pageConsommateur/reception";
import { AcceuilUtilisateur } from "./componets/affichage/utilisateur";
import Login from "./Login";
import { NavbarConsommateur } from "./componets/affichage/pageConsommateur/navbar";
import { NavbarFournisseur } from "./componets/fournisseur/navbar";
import { IndexF } from "./componets/fournisseur/affichage/acceuil";
import { Tiers } from "./componets/tiers/tiers";
import { Produit } from "./componets/tiers/produit";
import { Article_Service } from "./componets/tiers/articleService";
import { Categorie } from "./componets/tiers/categorie";
import { Entrepot } from "./componets/entrepot/entrepot";

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Erreur Axios :", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des utilisateurs</h1>
      <ul className="list-disc pl-5 space-y-1">
        {users.map((user) => (
          <li key={user.id}>
            {user.nom} {user.prenom} - {user.email || user.contact}
          </li>
        ))}
      </ul>
    </div>
  );
}

const router = createBrowserRouter([
  //
  {
    path: "/Categorie",
    element: (
      <ProtectedRoute>
        <div>
          <NavbarFournisseur value={"Categorie"} />
          <Categorie />
        </div>
      </ProtectedRoute>
    ),
  },

  {
    path: "/ENTREPOT",
    element: (
      <ProtectedRoute>
        <div>
          <NavbarFournisseur value={"Article"} />
          <Entrepot />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/Article_Service",
    element: (
      <ProtectedRoute>
        <div>
          <NavbarFournisseur value={"Article"} />
          <Article_Service />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/tiers",
    element: (
      <ProtectedRoute>
        <div>
          <NavbarFournisseur value={"tiers"} />
          <Tiers />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/produits_tiers",
    element: (
      <ProtectedRoute>
        <div>
          <NavbarFournisseur value={"tiers"} />
          <Produit />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/acceuilF",
    element: (
      <ProtectedRoute>
        <div>
          <NavbarFournisseur value={" "} />
          <IndexF />
        </div>
      </ProtectedRoute>
    ),
  },

  ///fournisseur
  {
    path: "/",
    element: (
      <div>
        <Acceuil />
      </div>
    ),
  },
  { path: "/login", element: <Login /> },
  {
    path: "/cree",
    element: (
      <div>
        <Consomateur />
      </div>
    ),
  },
  {
    path: "/pageconsommateur",
    element: (
      <ProtectedRoute>
        <div>
          <NavbarConsommateur />
          <IndexConsommateur />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/message",
    element: (
      <ProtectedRoute>
        <div>
          <NavbarConsommateur />
          <Discution />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/AcceuilConso",
    element: (
      <ProtectedRoute>
        <div>
          <NavbarConsommateur />
          <AcceuilConsommater />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/cree_super_utilisateur",
    element: (
      <ProtectedRoute>
        <div>
          <NavbarConsommateur />
          <Consomateur />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/liste_super_utilisateur",
    element: (
      <ProtectedRoute>
        <div>
          {/* <Navbar /> */}
          <NavbarConsommateur />
          <AcceuilConsommater />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <div>
          {/* <Navbar /> */}
          <UsersPage />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/suivit",
    element: (
      <ProtectedRoute>
        <div>
          {/* <Navbar /> */}
          <NavbarConsommateur />
          <Suivi_achat />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/Transaction",
    element: (
      <ProtectedRoute>
        <div>
          <NavbarConsommateur />
          <Transaction />
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: "/réception",
    element: (
      <ProtectedRoute>
        <div>
          {/* <Navbar /> */}
          <NavbarConsommateur />
          <Reception />
        </div>
      </ProtectedRoute>
    ),
  },
  // {
  //   path: "/utilisateur",
  //   element: (
  //     <ProtectedRoute>
  //       <div>
  //         {/* <Navbar /> */}
  //         <NavbarConsommateur />
  //         <AcceuilUtilisateur />
  //       </div>
  //     </ProtectedRoute>
  //   ),
  // },
  AcceuilUtilisateur,
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
