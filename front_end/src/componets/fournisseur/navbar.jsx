import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./../../AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

export function NavbarFournisseur({ value }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { DonneSession, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { label: "Statistique", href: "#" },
    { label: "CRM", href: "#" },
    { label: "Produits & Services", href: "#" },
    { label: "Facturation", href: "#" },
    { label: "Comptabilité", href: "#" },
    { label: "Flotte Véhicule", href: "#" },
    { label: "Agenda", href: "#" },
  ];

  return (
    <nav className="bg-blue-500  border-b border-gray-200 p-2">
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex text-white justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-red-600">Logo</span>
          </div>

          {/* Menu Desktop */}
          <div className="hidden sm:flex sm:space-x-4">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className="px-3 py-2 rounded-md text-sm font-medium  hover:underline"
                activeClassName="text-red-600"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <NavLink
            to="/Categorie"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              value === "Categorie"
                ? "underline text-yellow-500 px-3 py-2 rounded-md text-sm font-medium  "
                : "text-white hover:underline"
            }`}
          >
            Categorie
          </NavLink>

          <NavLink
            to="/tiers"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              value === "tiers"
                ? "underline text-yellow-500 px-3 py-2 rounded-md text-sm font-medium  "
                : "text-white hover:underline"
            }`}
          >
            TIERS
          </NavLink>
          <NavLink
            to="/Article_Service"
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              value === "Article"
                ? "underline text-yellow-500 px-3 py-2 rounded-md text-sm font-medium "
                : "text-white hover:underline"
            }`}
          >
            STOCK
          </NavLink>

          {/* Utilisateur Desktop */}
          <div className="hidden sm:flex items-center space-x-4">
            <NavLink className="px-3 py-2 text-gray-700 hover:text-red-600">
              <button
                onClick={() => {
                  if (
                    window.confirm("Voulez-vous vraiment vous déconnecter ?")
                  ) {
                    handleLogout(); // si l'utilisateur clique sur "OK"
                  }
                }}
                className="px-3 py-1  ml-[7%] bg-red-500 text-white rounded"
              >
                Déconnexion
              </button>
            </NavLink>
            <NavLink
              to="/parametre"
              className="px-3 py-2 text-gray-700 hover:text-red-600"
            >
              <img
                src={
                  DonneSession?.profil
                    ? `http://localhost:8000/storage/${DonneSession.profil}`
                    : "/default-avatar.png"
                }
                alt="Profil"
                className="w-16 h-16 object-cover rounded-full border-4 border-white shadow-md"
              />
            </NavLink>
          </div>

          {/* Menu Mobile Toggle */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span>{isOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600"
                activeClassName="text-red-600"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <div className=" w-[25%] gap-6 flex justify-end  items-center">
              <button
                onClick={handleLogout}
                className="px-3 py-1  ml-[7%] bg-red-500 text-white rounded"
              >
                Déconnexion
              </button>

              <a
                href=""
                onClick={() => navigate("/AcceuilConso")}
                className="mr-[8%] p-1"
              ></a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
