import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Statistique", href: "/" },
    { label: "CRM", href: "/crm" },
    { label: "Produits & Services", href: "/produits" },
    { label: "Facturation", href: "/facturation" },
    { label: "Comptabilité", href: "/comptabilite" },
    { label: "Flotte Véhicule", href: "/flotte" },
    { label: "Agenda", href: "/agenda" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
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
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600"
                activeClassName="text-red-600"
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Utilisateur Desktop */}
          <div className="hidden sm:flex items-center space-x-4">
            <NavLink
              to="/utilisateur"
              className="px-3 py-2 text-gray-700 hover:text-red-600"
            >
              Utilisateur
            </NavLink>
            <NavLink
              to="/parametre"
              className="px-3 py-2 text-gray-700 hover:text-red-600"
            >
              Paramètre
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
            <NavLink
              to="/utilisateur"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              Utilisateur
            </NavLink>
            <NavLink
              to="/parametre"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              Paramètre
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
