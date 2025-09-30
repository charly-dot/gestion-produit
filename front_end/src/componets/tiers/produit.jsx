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

export function Produit() {
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
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    date: today,
  });
  const [formDataP, setformDataP] = useState({
    nomProduit: "",
    prix: "",
    stock_initia: "",
    zone: "",
    fichier: null, // fichier sera un File, pas string
    type_categorie: "",
    categorie: "",
    code_compta: "",
    stock_minimum: "",
    date_peremption: "",
  });
  // changement input
  const handleChangeP = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setformDataP((prev) => ({ ...prev, [name]: files[0] })); // fichier
    } else {
      setformDataP((prev) => ({ ...prev, [name]: value }));
    }
  };
  // soumission
  const handleSubmit_PRODUIT = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      for (const key in formDataP) {
        formData.append(key, formDataP[key]);
      }

      await axios.post("http://127.0.0.1:8000/api/creationProduit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      listeP();
      handleSelect("ListePRODUIT", "PRODUIT");
      showMessage("success", "Insertion avec succès ");
      setformDataP({
        nomProduit: "",
        prix: "",
        stock_initia: "",
        zone: "",
        fichier: null,
        type_categorie: "",
        categorie: "",
        code_compta: "",
        stock_minimum: "",
        date_peremption: "",
      });
    } catch (err) {
      console.error("Erreur :", err.response?.data || err.message);
      setError("Erreur de soumission : vérifie les champs.");
    }
  };

  ///detait
  const [Donne_PRODUIT, setDonne_PRODUIT] = useState(null);

  //   ACTIVATION
  const etat_PRODUIT = async (id, currentEtat) => {
    const newStatus = currentEtat === "activer" ? "desactiver" : "activer";

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/changer_activation_PRODUIT/${id}`,
        { activation: newStatus }
      );

      // mettre à jour l'état local pour re-render
      setDonne_PRODUIT((prev) => ({
        ...prev,
        colonne: response.data.activation,
      }));

      listeP(); // optionnel si tu veux actualiser la liste complète
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification de l'activation ❌");
    }
  };
  /// MODIFICATION
  const [valeurPRODUIT, setvaleurPRODUIT] = useState([]);
  const ModifePRODUIT = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Ajout des champs simples
      Object.keys(Donne_PRODUIT).forEach((key) => {
        if (key !== "fichier") {
          formData.append(key, Donne_PRODUIT[key]);
        }
      });

      // Ajout du fichier si présent
      if (Donne_PRODUIT.fichier instanceof File) {
        formData.append("fichier", Donne_PRODUIT.fichier);
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/modifier_PRODUIT/${Donne_PRODUIT.id}?_method=PUT`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      listeP();
      handleSelect("ListePRODUIT", "PRODUIT");
      showMessage("success", "Modification avec succès ");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification du produit ❌");
    }
  };

  /// PRIX
  const row_Prix = [
    {
      id: 4,
      PRODUIT: "Ordinateur",
      PRIX: "12000",
      DATE: "13/06/2025",
      UTILISATEUR: "Magasin C",
    },
    {
      id: 2,
      PRODUIT: "Telephone",
      PRIX: "50000",
      DATE: "23/06/2025",
      UTILISATEUR: "Magasin C",
    },
    {
      id: 3,
      PRODUIT: "Canapier",
      PRIX: "40000",
      DATE: "13/07/2025",
      UTILISATEUR: "Magasin C",
    },
  ];
  const ColunnePrix = [
    { field: "id", headerName: "id", width: 40 },
    { field: "PRODUIT", headerName: "PRODUIT", width: 266 },
    { field: "PRIX", headerName: "PRIX", width: 250 },
    { field: "DATE", headerName: "DATE", width: 250 },
    { field: "UTILISATEUR", headerName: "UTILISATEUR", width: 230 },
  ];
  const [modificationprix, setmodificationprix] = useState(false);

  const colonne_prix = [
    { field: "nomProduit", headerName: "NOM", width: 430 },
    { field: "prix", headerName: "PRIX", width: 430 },
    {
      field: "action",
      headerName: "ACTIONS",
      width: 122,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDonne_PRODUIT(params.row);
              setmodificationprix(true);
              // console.log(Donne_PRODUIT);
            }}
            className="text-blue-500 hover:text-blue-600"
          >
            <EditIcon />
          </button>
        </div>
      ),
    },
  ];

  // DOCUMENT
  // COLONNE DOCUMENTS
  const colonne_Documents = [
    { field: "DOCUMENT", headerName: "DOCUMENT", width: 380 },
    { field: "ETAT", headerName: "ETAT", width: 350 },
    { field: "NOMBRE", headerName: "VALEUR", width: 310 },
  ];
  const row_documents = [
    {
      id: 1,
      DOCUMENT: "Entreprise B",
      ETAT: "VALIDER",
      NOMBRE: 3,
    },
    {
      id: 2,
      DOCUMENT: "FACTURE",
      ETAT: "LIVRE",
      NOMBRE: 7,
    },
    {
      id: 3,
      DOCUMENT: "LIVRAISON",
      ETAT: "A LIVRE",
      NOMBRE: 3,
    },
    {
      id: 4,
      DOCUMENT: "LIVRAISON",
      ETAT: "VALIDER",
      NOMBRE: 9,
    },
  ];

  ///rechrerche produit
  const [OriginalListe, setOriginalListe] = useState([]);
  const [formDataSearche, setformDataSearche] = useState({
    nomProduit: "",
    type_categorie: "",
    zone: "",
    categorie: "",
    entrepot: "",
    casier: "",
    colonnes: "",
  });

  const handleChangeSearche = (e) => {
    const { name, value } = e.target;
    setformDataSearche((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearcheSubmit = (e) => {
    e.preventDefault();
    // entrepot: "",
    // casier: "",
    const filtered = OriginalListe.filter((item) => {
      const nom = item.nomProduit ? item.nomProduit.toLowerCase() : "";
      const zone = item.zone ? item.zone.toLowerCase() : "";
      const categorie = item.categorie ? item.categorie : "";
      const casier = item.casier ? item.casier : "";
      const entrepot = item.entrepot ? item.entrepot : "";
      const colonnes = item.colonnes ? item.colonnes : "";

      return (
        (formDataSearche.nomProduit === "" ||
          (item.nomProduit || "")
            .toLowerCase()
            .includes(formDataSearche.nomProduit.toLowerCase())) &&
        (formDataSearche.zone === "" ||
          zone.includes(formDataSearche.zone.toLowerCase())) &&
        (formDataSearche.categorie === "" ||
          categorie === formDataSearche.categorie) &&
        (formDataSearche.casier === "" || casier === formDataSearche.casier) &&
        (formDataSearche.entrepot === "" ||
          entrepot === formDataSearche.entrepot) &&
        (formDataSearche.colonnes === "" ||
          colonnes === formDataSearche.colonnes)
      );
    });

    setListeProduit(filtered);
  };

  // bouton RAFRAICHIR
  const handleRefresh = () => {
    setformDataSearche({
      nomProduit: "",
      zone: "",
      type_categorie: "",
      categorie: "",
      casier: "",
      entrepot: "",
    });
    setListeProduit(OriginalListe);
  };

  /// modification prix
  const [nouveauPrix, setNouveauPrix] = useState("");
  const modifeprix = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...Donne_PRODUIT,
        prix: nouveauPrix, // ⬅️ on remplace par le nouveau prix
      };

      const response = await axios.put(
        `http://127.0.0.1:8000/api/modifier_PRODUIT/${Donne_PRODUIT.id}`,
        payload
      );

      setNouveauPrix(""); // vider après succès
      listeP();
      setmodificationprix(false);
      handleSelect("PRIX", "PRIX");
      showMessage("success", "Modification effectuée avec succès");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification du produit");
    }
  };

  ///stock
  const [ListeStock, setListeStock] = useState([]);
  const [insertionStock, setinsertionStock] = useState(false);
  const Colunnestock = [
    { field: "id", headerName: "N°", width: 40 },
    { field: "nomProduit", headerName: "PRODUIT", width: 220 },
    { field: "stock_initia", headerName: "STOCK", width: 195 },
    { field: "entrepot", headerName: "ENTREPOT", width: 195 },
    { field: "casier", headerName: "CASIER", width: 202 },
    {
      field: "action",
      headerName: "ACTIONS",
      width: 120,
      renderCell: (params) => (
        <div className="flex gap-2">
          {/* Bouton édition */}
          <button
            onClick={() => {
              setDonne_Stock(params.row);

              handleSelect("modificationSTOCK", "STOCK");
            }}
            className="text-blue-500 hover:text-blue-600"
          >
            <EditIcon />
          </button>

          {/* Bouton transfert */}

          <button
            onClick={() => {
              setDonne_Stock(params.row);

              handleSelect("transferSTOCK", "STOCK");
            }}
            className="text-green-500 hover:text-green-600"
          >
            <FiRepeat size={18} />
          </button>
        </div>
      ),
    },
  ];

  const listeStock1 = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/liste_Stock");
      console.log("jjjjjjjjjjj");
      console.log(response.data);
      console.log("jjjjjjjjjjj");
      setListeStock(response.data);
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  const [formDataSearcheStock, setformDataSearcheStock] = useState({
    nomProduit: "",
    code_compta: "",
  });
  const handleChangeStock = (e) => {
    const { name, value } = e.target;
    setformDataSearche((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeSearcheStock = (e) => {
    const { value } = e.target;

    // Filtrer pour trouver le code_compta correspondant
    const selectedProduct = OriginalListe.find(
      (item) => item.nomProduit === value
    );

    setformDataSearcheStock({
      nomProduit: value,
      code_compta: selectedProduct ? selectedProduct.code_compta : "",
    });
    // console.log("dddddddddddddddddddddddddddd");
    // console.log(OriginalListe);
  };

  ///insertion stock

  const [formDataS, setFormDataS] = useState({
    idProduit: "",
    entrepot: "",
    casier: "",
  });

  // Gestion des changements
  const handleChangeS = (e) => {
    const { name, value } = e.target;
    setFormDataS((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire
  const handleSubmit_STOCK = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Vérification minimale avant envoi
    if (!formDataS.entrepot || !formDataS.casier || !formDataS.idProduit) {
      setError("Tous les champs sont obligatoires !");
      return;
    }
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/creationStock/${DonneSession.id}`,
        formDataS
      );

      // Recharger la liste
      listeStock();
      handleSelect("STOCK", "STOCK");

      // Fermer et réinitialiser
      setinsertionStock(false);
      setFormDataS({ idProduit: "", entrepot: "", stock: "" });

      showMessage("success", response.data.message || "Insertion réussie ✅");
    } catch (err) {
      console.error("Erreur :", err.response?.data || err.message);

      // Utiliser err.response au lieu de response
      const errorMessage =
        err.response?.data?.message ||
        "❌ Ce produit est déjà placé dans un entrepôt.";

      setError(errorMessage);
      showMessage("error", errorMessage);
    }
  };

  ///liste casier
  const [listeCasier, setlisteCasier] = useState([]);
  const listeCasi = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/liste_Casier"
      );
      // console.log("jjjjjjjjjjj");
      // console.log(response.data);
      // console.log("jjjjjjjjjjj");
      setlisteCasier(response.data);
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  // MODIFICATION STOCK

  const [Donne_Stock, setDonne_Stock] = useState({});
  const [formDataSModification, setformDataSModification] = useState({
    nomProduit: "",
    stock_initia: "",
    stock: "",
    casier: "",
    entrepot: "",
    stockfinal: "",
    casierfinal: "",
    entrepotfinal: "",
  });

  // Pré-remplir les champs au chargement du formulaire
  React.useEffect(() => {
    if (Donne_Stock.id) {
      setformDataSModification({
        nomProduit: Donne_Stock.nomProduit || "",
        stock_initia: Donne_Stock.stock_initia || "",
        casier: Donne_Stock.casier || "",
        entrepot: Donne_Stock.entrepot || "",
        stockfinal: "",
        casierfinal: "",
        entrepotfinal: "",
      });
    }
  }, [Donne_Stock]);

  const handleChangeSm = (e) => {
    const { name, value } = e.target;
    setformDataSModification((prev) => ({ ...prev, [name]: value }));
  };

  const modifeStock = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/modifier_Stock/${Donne_Stock.idProduit}/${Donne_Stock.id}/${DonneSession.id}`,
        formDataSModification
      );

      listeStock();
      handleSelect("STOCK", "STOCK");
      setinsertionStock(false);

      // Reset propre
      setformDataSModification({
        nomProduit: "",
        stock_initia: "",
        casier: "",
        entrepot: "",
        stock: "",
      });
      setDonne_Stock({});
      showMessage(
        "success",
        response.data.message || "Modification réussie ✅"
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
      showMessage(
        "error",
        err.response?.data?.message || "Erreur lors de la modification ❌"
      );
    }
  };
  const tranfertStock = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/transfertStock/${Donne_Stock.idProduit}/${Donne_Stock.id}/3`,
        formDataSModification
      );

      listeStock();
      handleSelect("STOCK", "STOCK");
      setinsertionStock(false);

      // Reset propre
      setformDataSModification({
        nomProduit: "",
        stock_initia: "",
        casier: "",
        entrepot: "",
        stockfinal: "",
        casierfinal: "",
        entrepotfinal: "",
      });
      setDonne_Stock({});
      showMessage(
        "success",
        response.data.message || "Modification réussie ✅"
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
      showMessage(
        "error",
        err.response?.data?.message || "Erreur lors de la modification ❌"
      );
    }
  };

  // stock
  const [OriginalListeCasier, setOriginalListeCasier] = useState([]);
  const liste_Caisier = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/liste_Caisier"
      );
      // console.log(response.data);
      setOriginalListeCasier(response.data);
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };
  const [OriginalListeEntrepot, setOriginalListeEntrepot] = useState([]);
  const liste_Entrepot = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/liste_Entrepot"
      );
      // console.log(response.data);
      setOriginalListeEntrepot(response.data);
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  /// Inventaire
  const [
    listeProduitModifierInventairetableau,
    setlisteProduitModifierInventairetableau,
  ] = useState([]);

  const [
    OriginelisteProduitModifierInventairetableau,
    setOriginelisteProduitModifierInventairetableau,
  ] = useState([]);

  const ColunneProduitModifier = [
    { field: "id", headerName: "N°", width: 70 },
    {
      field: "referenceInventaire",
      headerName: "REF",
      width: 110,
      renderCell: (params) => (
        <div>
          <a
            href="#"
            onClick={() => {
              setDonne_PRODUIT(params.row);
              handleSelect("detailPRODUIT_inventaire", "PRODUIT MODIFIER");
            }}
          >
            {params.row.referenceInventaire}
          </a>
        </div>
      ),
    },
    { field: "type_categorie", headerName: "TYPE", width: 110 },
    { field: "categorie", headerName: "F/ER", width: 130 },
    { field: "zone", headerName: "ZONE", width: 140 },
    { field: "stock_initia", headerName: "STOCK TOTAL", width: 110 },
    { field: "prix", headerName: "PRIX", width: 110 },
    { field: "nomCasier", headerName: "U/TEUR", width: 130 },
    { field: "etat", headerName: "ETAT", width: 110 },
  ];
  const listeProduitModifierInventaire = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/listeProduitModifierInventaire"
      );

      setOriginelisteProduitModifierInventairetableau(response.data.data);
      setlisteProduitModifierInventairetableau(response.data.data);
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  const [
    formDataSearcheTableauInventaire,
    setformDataSearcheTableauInventaire,
  ] = useState({
    produit: "",
    fournisseur: "",
    zone: "",
    entrepot: "",
    casier: "",
    etat: "",
    type_categorie: "",
  });

  const handleChangeSearchetableauInventaire = (e) => {
    const { name, value } = e.target;
    setformDataSearcheTableauInventaire((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearcheSubmittableInventaire = (e) => {
    e.preventDefault();
    const filtered = OriginelisteProduitModifierInventairetableau.filter(
      (item) => {
        const produit = item.nomProduit ? item.nomProduit.toLowerCase() : "";
        const fournisseur = item.fournisseur
          ? item.fournisseur.toLowerCase()
          : "";
        const zone = item.zone ? item.zone.toLowerCase() : "";
        const entrepot = item.nomEntrepot ? item.nomEntrepot.toLowerCase() : "";
        const casier = item.nomCasier ? item.nomCasier.toLowerCase() : "";
        const etat = item.etat ? item.etat.toLowerCase() : "";
        const type_categorie = item.type_categorie
          ? item.type_categorie.toLowerCase()
          : "";

        return (
          (formDataSearcheTableauInventaire.produit === "" ||
            produit.includes(
              formDataSearcheTableauInventaire.produit.toLowerCase()
            )) &&
          (formDataSearcheTableauInventaire.fournisseur === "" ||
            fournisseur.includes(
              formDataSearcheTableauInventaire.fournisseur.toLowerCase()
            )) &&
          (formDataSearcheTableauInventaire.zone === "" ||
            zone.includes(
              formDataSearcheTableauInventaire.zone.toLowerCase()
            )) &&
          (formDataSearcheTableauInventaire.entrepot === "" ||
            entrepot.includes(
              formDataSearcheTableauInventaire.entrepot.toLowerCase()
            )) &&
          (formDataSearcheTableauInventaire.casier === "" ||
            casier.includes(
              formDataSearcheTableauInventaire.casier.toLowerCase()
            )) &&
          (formDataSearcheTableauInventaire.etat === "" ||
            etat.includes(
              formDataSearcheTableauInventaire.etat.toLowerCase()
            )) &&
          (formDataSearcheTableauInventaire.type_categorie === "" ||
            type_categorie.includes(
              formDataSearcheTableauInventaire.type_categorie.toLowerCase()
            ))
        );
      }
    );

    setlisteProduitModifierInventairetableau(filtered);
  };

  const handleRefreshtableauInventaire = () => {
    setformDataSearcheTableauInventaire({
      produit: "",
      fournisseur: "",
      zone: "",
      entrepot: "",
      casier: "",
      etat: "",
      type_categorie: "",
    });
    setlisteProduitModifierInventairetableau(
      OriginelisteProduitModifierInventairetableau
    );
  };

  const etat_PRODUIT_inventaire = async (idProduit, currentEtat) => {
    const newStatus = currentEtat === "activer" ? "desactiver" : "activer";

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/changer_activation_PRODUIT_inventaire/${idProduit}`,
        { etat: newStatus }
      );

      listeProduitModifierInventaire();

      handleSelect("PRODUIT MODIFIER", "PRODUIT MODIFIER");
      showMessage("success", "Modification avec succès ");
    } catch (err) {
      console.error("❌ Erreur API :", err.response ? err.response.data : err);
      setError("Erreur lors de la modification de l'activation ❌");
    }
  };

  /// MODIFICATION
  const [valeurPRODUIT_inventaire, setvaleurPRODUIT_inventaire] = useState([]);
  const ModifePRODUIT_inventaire = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Ajout des champs simples
      Object.keys(Donne_PRODUIT).forEach((key) => {
        if (key !== "fichier") {
          formData.append(key, Donne_PRODUIT[key]);
        }
      });

      // Ajout du fichier si présent
      if (Donne_PRODUIT.fichier instanceof File) {
        formData.append("fichier", Donne_PRODUIT.fichier);
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/modifier_PRODUIT_inventaire/${Donne_PRODUIT.id}?_method=PUT`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      listeProduitModifierInventaire();

      handleSelect("PRODUIT MODIFIER", "PRODUIT MODIFIER");
      showMessage("success", "Modification avec succès ");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification du produit ❌");
    }
  };
  React.useEffect(() => {
    if (formDataSearcheStock?.id) {
      setFormDataS((prev) => ({
        ...prev,
        idProduit: formDataSearcheStock.id, // copie automatique de l'id dans ton form
      }));
    }
  }, [formDataSearcheStock]);

  /// modification de stock

  const [produit_nom_filtre, setproduit_nom_filtre] = useState([]);
  const [ORIGINE_produit_nom_filtre, set_ORIGINE_produit_nom_filtre] = useState(
    []
  );
  const [formData_produit_select, setformData_produit_select] = useState({
    produit: "",
  });
  const listeProduit = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/liste_Produit"
      );
      setproduit_nom_filtre(response.data);
      set_ORIGINE_produit_nom_filtre(response.data);
    } catch (err) {
      setErrors("Erreur lors du chargement des produits.");
    }
  };

  // useEffect(() => {
  //   listeProduit();
  // }, []);

  const select_Produit = (e) => {
    const { name, value } = e.target;
    setformData_produit_select((prev) => ({ ...prev, [name]: value }));

    // ⚡ déclenche la recherche automatique
    handleSearcheSubmitan_select_produit(value);
  };
  // Rechercher
  const [produitSelectionne, setProduitSelectionne] = useState(null); // ✅ un seul produit

  const handleSearcheSubmitan_select_produit = (produit) => {
    const filtered = ORIGINE_produit_nom_filtre.find(
      (item) => item.nomProduit === produit
    );
    setProduitSelectionne(filtered); // ✅ met à jour directement le produit sélectionné
  };

  const [
    formData_produit_insertion_stock_transfert,
    setformData_produit_insertion_stock_transfert,
  ] = useState({
    idProduit: "",
    stock_actuel: "",
    entrepotSource: "",
    casierSource: "",
    motif: "",
  });

  // 🔥 Sync automatique avec produitSelectionne
  React.useEffect(() => {
    if (produitSelectionne) {
      setformData_produit_insertion_stock_transfert((prev) => ({
        ...prev,
        idProduit: produitSelectionne.id || "",
        stock_actuel: produitSelectionne.stock_initia || "",
        entrepotSource: produitSelectionne.idEntrepot || "",
        casierSource: produitSelectionne.idCasier || "",
        entrepotSourcenom: produitSelectionne.entrepot || "",
        casierSourcenom: produitSelectionne.casier || "",
      }));
    }
  }, [produitSelectionne]);

  // Gestion des changements
  const onChangeData_produit_insertion_stock_transfert = (e) => {
    const { name, value } = e.target;
    setformData_produit_insertion_stock_transfert((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitData_produit_insertion_stock_transfert = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const data = new FormData();

      for (const key in formData_produit_insertion_stock_transfert) {
        data.append(key, formData_produit_insertion_stock_transfert[key]);
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/insertion_stock_transfert/${DonneSession.id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setformData_produit_insertion_stock_transfert({
        idProduit: "",
        stock_actuel: "",
        entrepotSource: "",
        casierSource: "",
        stock_transferer: "",
        entrepot_destinateur: "",
        casier_destinateur: "",
      });
      listesHE_tout();
      handleSelect("LISTE DE TRANSFERT", " ");
      showMessage("success", response.data.message);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        showMessage("error", err.response.data.message);
      } else {
        console.log("Erreur inconnue :", err.message);
        showMessage("error", "Une erreur est survenue");
      }
    }
  };

  const [tout_liste_casier, settout_liste_casier] = useState([]);
  const [tout_liste_entrepot, settout_liste_entrepot] = useState([]);
  const tout_liste = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/tout_liste");
      settout_liste_entrepot(response.data.entrepot_liste);
      settout_liste_casier(response.data.casier_liste);
    } catch (err) {
      setErrors("Erreur lors du chargement des entrepôts et casiers.");
    }
  };

  const [ajouter_supprimer, setajouter_supprimer] = useState("initial");

  React.useEffect(() => {
    listeProduit();
    liste_Entrepot();
    liste_Caisier();
    listeProduitModifierInventaire();
    listeStock1();
    listeCasi();
    listeP();
    handleSelect("PRODUIT", "PRODUIT");
    // handleSelect("ListePRODUIT", "PRODUIT");
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
                  ? `http://127.0.0.1:8000/storage/${DonneSession.profil}`
                  : "/default-avatar.png"
              }
              alt={DonneSession?.profil || "Profil"}
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
              PRODUIT
            </h1>

            {showTIERS && (
              <div className="ml-3 mt-1 space-y-1">
                <a
                  onClick={() => handleSelect("InsertionPRODUIT", "PRODUIT")}
                  className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  CRÉER
                </a>
                <a
                  onClick={() => handleSelect("ListePRODUIT", "PRODUIT")}
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
              <Link to="/ENTREPOT">ENTREPOT</Link>
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
            {[
              "PRODUIT",
              "PRIX",
              "STOCK",
              "DOCUMENT",
              "HISTORIQUE",
              "PRODUIT MODIFIER",
            ].map((item) => (
              <button
                key={item}
                className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                  condition_navbar === item ? "border-b-blue-500" : ""
                }`}
                onClick={() => handleSelect(item, item)}
              >
                {item}
              </button>
            ))}
          </div>

          {ActivationAffichage === "STOCK" && (
            <div className="bg-white p-8 rounded-xl shadow-md  justify-center">
              <form
                onSubmit={handleSearcheSubmitan_select_produit}
                method="post"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div></div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 text-sm md:text-base mb-2">
                      PRODUIT
                    </label>
                    <select
                      name="produit"
                      value={formData_produit_select.produit}
                      onChange={select_Produit}
                      required
                      className="w-full md:w-[40vh] px-4 py-3 border border-gray-300 rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">...</option>
                      {[
                        ...new Set(
                          produit_nom_filtre.map((item) => item.nomProduit)
                        ),
                      ].map((nomProduit, index) => (
                        <option key={index} value={nomProduit}>
                          {nomProduit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div></div>
                </div>
              </form>
              <form
                onSubmit={onSubmitData_produit_insertion_stock_transfert}
                className="w-full max-w-5xl"
              >
                <input
                  type="hidden"
                  name="idProduit"
                  value={formData_produit_insertion_stock_transfert.idProduit}
                />

                {/* Ligne 2 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 text-sm md:text-base mb-2">
                      STOCK ACTUEL
                    </label>
                    <input
                      type="text"
                      name="stock_actuel"
                      disabled
                      onChange={onChangeData_produit_insertion_stock_transfert}
                      value={
                        formData_produit_insertion_stock_transfert.stock_actuel
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 text-sm md:text-base mb-2">
                      ENTREPÔT SOURCE
                    </label>
                    <input
                      disabled
                      name="entrepotSourcenom"
                      value={
                        formData_produit_insertion_stock_transfert.entrepotSourcenom
                      }
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      disabled
                      name="entrepotSource"
                      onChange={onChangeData_produit_insertion_stock_transfert}
                      value={
                        formData_produit_insertion_stock_transfert.entrepotSource
                      }
                      type="hidden"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 text-sm md:text-base mb-2">
                      CASIER
                    </label>
                    <input
                      disabled
                      name="casierSourcenom"
                      value={
                        formData_produit_insertion_stock_transfert.casierSourcenom
                      }
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      disabled
                      name="casierSource"
                      onChange={onChangeData_produit_insertion_stock_transfert}
                      value={
                        formData_produit_insertion_stock_transfert.casierSource
                      }
                      type="hidden"
                      className="w-full md:w-[40vh] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* MOTIF uniquement si état = initial */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 text-sm md:text-base mb-2">
                      MOTIF
                    </label>
                    <select
                      required
                      onChange={onChangeData_produit_insertion_stock_transfert}
                      value={formData_produit_insertion_stock_transfert.motif}
                      name="motif"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">...</option>
                      <option value="Stock initia">Stock initia</option>
                      <option value="Correction de stock">
                        Correction de stock
                      </option>
                    </select>
                  </div>
                  {/* {ajouter_supprimer === "iniDDDtDial" && (
                    
                  )} */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {ajouter_supprimer === "INSERTION" && (
                    <div className="flex flex-col mb-6">
                      <label className="font-semibold text-gray-700 text-sm md:text-base mb-2">
                        NOUVEL STOCK
                      </label>
                      <input
                        value={
                          formData_produit_insertion_stock_transfert.nouvelStock
                        }
                        onChange={
                          onChangeData_produit_insertion_stock_transfert
                        }
                        name="nouvelStock"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="number"
                      />
                    </div>
                  )}
                  <div className="flex flex-col"></div>
                </div>
                {/* Boutons */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-6 mb-6">
                  <div></div>
                  <div>
                    {ajouter_supprimer === "initial" ? (
                      <div className="gap-6 flex justify-center space-x-4">
                        <button
                          type="submit"
                          onClick={() => setajouter_supprimer("seconde")}
                          disabled={
                            !formData_produit_insertion_stock_transfert.idProduit ||
                            !formData_produit_insertion_stock_transfert.motif
                          }
                          className={`text-white font-bold px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${
                !formData_produit_insertion_stock_transfert.idProduit ||
                !formData_produit_insertion_stock_transfert.motif
                  ? "bg-blue-200 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
                        >
                          MODIFIER
                        </button>

                        <button
                          type="button"
                          disabled={
                            !formData_produit_insertion_stock_transfert.idProduit ||
                            !formData_produit_insertion_stock_transfert.motif
                          }
                          className={`text-white font-bold px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${
                !formData_produit_insertion_stock_transfert.idProduit ||
                !formData_produit_insertion_stock_transfert.motif
                  ? "bg-red-200 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
                        >
                          ANNULER
                        </button>
                      </div>
                    ) : ajouter_supprimer === "seconde" ? (
                      <div className="gap-6 flex justify-center space-x-4">
                        <button
                          type="submit"
                          onClick={() => setajouter_supprimer("INSERTION")}
                          className="text-white font-bold bg-blue-500 hover:bg-blue-600 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          AJOUTER
                        </button>
                        <button
                          type="button"
                          className="text-white font-bold bg-red-500 hover:bg-red-600 px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          SUPPRIMER
                        </button>
                      </div>
                    ) : ajouter_supprimer === "INSERTION" ? (
                      <div className="gap-6 flex justify-center space-x-4">
                        <button
                          type="submit"
                          onClick={() => setajouter_supprimer(false)}
                          className="text-white font-bold bg-blue-500 hover:bg-blue-600 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          ENREGISTRER
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <div></div>
                </div>
              </form>
            </div>
          )}

          {ActivationAffichage === "modification_PRODUIT_inventaire" &&
            Donne_PRODUIT && (
              <div>
                <form
                  onSubmit={ModifePRODUIT_inventaire}
                  className="bg-white p-6 rounded-lg shadow-md  "
                  encType="multipart/form-data"
                >
                  <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                    MODIFICATION
                  </h1>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nom Produit
                      </label>
                      <input
                        type="text"
                        name="nomProduit"
                        required
                        value={Donne_PRODUIT.nomProduit || ""}
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            nomProduit: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    {/* Prix */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Prix
                      </label>
                      <input
                        type="number"
                        name="prix"
                        required
                        value={Donne_PRODUIT.prix}
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            prix: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* Stock Initial */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Stock Initial
                      </label>
                      <input
                        type="number"
                        name="stock_initia"
                        required
                        value={Donne_PRODUIT.stock_initia || ""}
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            stock_initia: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* Zone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Zone
                      </label>
                      <input
                        type="text"
                        name="zone"
                        value={Donne_PRODUIT.zone || ""}
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            zone: e.target.value,
                          })
                        }
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* Fichier */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fichier
                      </label>
                      <input
                        type="file"
                        name="fichier"
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            fichier: e.target.files[0],
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                      />
                    </div>

                    {/* Catégorie */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Catégorie
                      </label>

                      <select
                        name="categorie"
                        value={Donne_PRODUIT.categorie || ""}
                        required
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            categorie: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Entretien">Entretien</option>
                        <option value="Alimentation">Alimentation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        TYPE CATEGORIE
                      </label>

                      <select
                        name="type_categorie"
                        value={Donne_PRODUIT.type_categorie || ""}
                        required
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            type_categorie: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Stock">Stock</option>
                        <option value="Flotte">Flotte</option>
                      </select>
                    </div>

                    {/* Code Compta */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Code Compta
                      </label>
                      <input
                        type="text"
                        name="code_compta"
                        value={Donne_PRODUIT.code_compta || ""}
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            code_compta: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* Stock Minimum */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Stock Minimum
                      </label>
                      <input
                        type="number"
                        name="stock_minimum"
                        value={Donne_PRODUIT.stock_minimum}
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            stock_minimum: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    {/* Date Péremption */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date de Péremption
                      </label>
                      <input
                        type="date"
                        name="date_peremption"
                        value={Donne_PRODUIT.date_peremption || ""}
                        onChange={(e) =>
                          setDonne_PRODUIT({
                            ...Donne_PRODUIT,
                            date_peremption: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Bouton */}
                  <div className="flex gap-6 justify-end mt-6">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      VALIDER
                    </button>
                    <button
                      onClick={() =>
                        handleSelect("PRODUIT MODIFIER", "PRODUIT MODIFIER")
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      ANNULLER
                    </button>
                  </div>
                </form>
              </div>
            )}
          {ActivationAffichage === "detailPRODUIT_inventaire" &&
            Donne_PRODUIT && (
              <div className=" ">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
                  <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                    DÉTAIL Mr/Mn <strong>{Donne_PRODUIT.nomProduit}</strong>
                  </h1>

                  {/* Grille 3 colonnes */}
                  <div className="flex justify-center">
                    <img
                      src={
                        Donne_PRODUIT.fichier
                          ? `http://127.0.0.1:8000/storage/${Donne_PRODUIT.fichier}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={Donne_PRODUIT.nomProduit}
                      className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-md"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="grid grid-cols-3">
                      {/* p-3  rounded-lg flex gap-6 */}
                      <span className="font-semibold text-gray-600">NOM :</span>
                      <span className="block text-gray-800">
                        <strong>{Donne_PRODUIT.nomProduit}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="font-semibold text-gray-600">
                        PRIX :
                      </span>
                      <span className="block text-gray-800">
                        <strong>{Donne_PRODUIT.prix}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-semibold text-gray-600">
                        STOCK INITIAL :
                      </span>
                      <span className="block text-gray-800">
                        <strong>{Donne_PRODUIT.stock_initia}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-3">
                      <span className="font-semibold text-gray-600">
                        zone :
                      </span>
                      <span className="block text-gray-800">
                        <strong>{Donne_PRODUIT.zone}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-semibold text-gray-600">
                        TYPE CATEGORIE :
                      </span>
                      <span className="block text-gray-800">
                        <strong>{Donne_PRODUIT.type_categorie}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="font-semibold text-gray-600">
                        CATEGORIE :
                      </span>
                      <span className="block text-gray-800">
                        <strong>{Donne_PRODUIT.categorie}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-semibold text-gray-600">
                        CODE COMPTA :
                      </span>
                      <span className="block text-gray-800">
                        <strong>{Donne_PRODUIT.code_compta}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-2">
                      <span className="font-semibold text-gray-600">
                        DATE PEREMPTION :
                      </span>
                      <span className="block text-gray-800">
                        <strong>{Donne_PRODUIT.date_peremption}</strong>
                      </span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="font-semibold text-gray-600">
                        ETAT :
                      </span>
                      <span className="block text-gray-800">
                        <strong>{Donne_PRODUIT.etat}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Bouton fermer centré */}
                  <div className="mt-6 gap-8 flex justify-center">
                    <button
                      onClick={() =>
                        etat_PRODUIT_inventaire(
                          Donne_PRODUIT.id,
                          Donne_PRODUIT.etat
                        )
                      }
                      className={`${
                        Donne_PRODUIT.etat === "activer"
                          ? "px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                          : "px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      }`}
                    >
                      {Donne_PRODUIT.etat === "activer"
                        ? "DESACTIVER"
                        : "ACTIVER"}
                    </button>

                    <button
                      onClick={() =>
                        // handleSelect("modification_PRODUIT_inventaire")
                        handleSelect(
                          "modification_PRODUIT_inventaire",
                          "PRODUIT MODIFIER"
                        )
                      }
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      MODIFIER
                    </button>
                  </div>
                </div>
              </div>
            )}

          {ActivationAffichage === "PRODUIT MODIFIER" && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div className="flex  items-center justify-end ">
                <form
                  onSubmit={handleSearcheSubmittableInventaire}
                  className="grid grid-cols-9 gap-4 items-center"
                >
                  {/* PRODUIT */}
                  <div>
                    <label
                      htmlFor="produit"
                      className="font-semibold text-gray-700"
                    >
                      PRODUITS
                    </label>
                    <select
                      id="produit"
                      value={formDataSearcheTableauInventaire.produit}
                      onChange={handleChangeSearchetableauInventaire}
                      name="produit"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(
                          OriginelisteProduitModifierInventairetableau.map(
                            (item) => item.nomProduit
                          )
                        ),
                      ].map((nomProduit, index) => (
                        <option key={`nomProduit-${index}`} value={nomProduit}>
                          {nomProduit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* FOURNISSEUR */}
                  <div>
                    <label
                      htmlFor="fournisseur"
                      className="font-semibold text-gray-700"
                    >
                      FOURNISSEURS
                    </label>
                    <input
                      name="fournisseur"
                      value={formDataSearcheTableauInventaire.fournisseur}
                      onChange={handleChangeSearchetableauInventaire}
                      type="text"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* ZONE */}
                  <div>
                    <label
                      htmlFor="zone"
                      className="font-semibold text-gray-700"
                    >
                      ZONES
                    </label>
                    <select
                      id="zone"
                      value={formDataSearcheTableauInventaire.zone}
                      onChange={handleChangeSearchetableauInventaire}
                      name="zone"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(
                          OriginelisteProduitModifierInventairetableau.map(
                            (item) => item.zone
                          )
                        ),
                      ].map((zone, index) => (
                        <option key={`zone-${index}`} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ENTREPOT */}
                  <div>
                    <label
                      htmlFor="entrepot"
                      className="font-semibold text-gray-700"
                    >
                      ENTREPOTS
                    </label>
                    <select
                      id="entrepot"
                      value={formDataSearcheTableauInventaire.entrepot}
                      onChange={handleChangeSearchetableauInventaire}
                      name="entrepot"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(
                          OriginelisteProduitModifierInventairetableau.map(
                            (item) => item.nomEntrepot
                          )
                        ),
                      ].map((nomEntrepot, index) => (
                        <option
                          key={`nomEntrepot-${index}`}
                          value={nomEntrepot}
                        >
                          {nomEntrepot}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* CASIER */}
                  <div>
                    <label
                      htmlFor="casier"
                      className="font-semibold text-gray-700"
                    >
                      CASIERS
                    </label>
                    <select
                      id="casier"
                      value={formDataSearcheTableauInventaire.casier}
                      onChange={handleChangeSearchetableauInventaire}
                      name="casier"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(
                          OriginelisteProduitModifierInventairetableau.map(
                            (item) => item.nomCasier
                          )
                        ),
                      ].map((nomCasier, index) => (
                        <option key={`nomCasier-${index}`} value={nomCasier}>
                          {nomCasier}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ETAT */}
                  <div>
                    <label
                      htmlFor="etat"
                      className="font-semibold text-gray-700"
                    >
                      ETAT
                    </label>
                    <select
                      value={formDataSearcheTableauInventaire.etat}
                      onChange={handleChangeSearchetableauInventaire}
                      id="etat"
                      name="etat"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(
                          OriginelisteProduitModifierInventairetableau.map(
                            (item) => item.etat
                          )
                        ),
                      ].map((etat, index) => (
                        <option key={`etat-${index}`} value={etat}>
                          {etat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* TYPE */}
                  <div>
                    <label
                      htmlFor="type_categorie"
                      className="font-semibold text-gray-700"
                    >
                      TYPE
                    </label>
                    <select
                      value={formDataSearcheTableauInventaire.type_categorie}
                      onChange={handleChangeSearchetableauInventaire}
                      name="type_categorie"
                      id="type_categorie"
                      className="w-[100%] px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value=""></option>
                      {[
                        ...new Set(
                          OriginelisteProduitModifierInventairetableau.map(
                            (item) => item.type_categorie
                          )
                        ),
                      ].map((type_categorie, index) => (
                        <option
                          key={`type_categorie-${index}`}
                          value={type_categorie}
                        >
                          {type_categorie}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* BOUTONS */}
                  <div>
                    <label className="font-semibold text-white">K</label>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                      FILTRER
                    </button>
                  </div>
                  <div>
                    <label className="font-semibold text-white">K</label>
                    <button
                      onClick={handleRefreshtableauInventaire}
                      type="button"
                      className=" bg-gray-500 text-white py-2 px-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      RAFRAICHIR
                    </button>
                  </div>
                </form>
              </div>
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
              <Box sx={{ height: "55vh" }}>
                <DataGrid
                  rows={listeProduitModifierInventairetableau}
                  columns={ColunneProduitModifier}
                  getRowId={(row) => row.idInventaire} // 👈 changer ici
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  loading={loading}
                  sx={{
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#3B82F6",
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                      color: "#fff",
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-columnHeader": {
                      backgroundColor: "#3B82F6",
                      color: "#fff",
                    },
                  }}
                />
              </Box>
            </div>
          )}
          {(ActivationAffichage === "PRODUIT" ||
            ActivationAffichage === "ListePRODUIT") && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div className="flex  items-center justify-end ">
                <form
                  onSubmit={handleSearcheSubmit}
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
                      value={formDataSearche.colonnes}
                      onChange={handleChangeSearche}
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
                      value={formDataSearche.nomProduit}
                      onChange={handleChangeSearche}
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
                      value={formDataSearche.zone}
                      onChange={handleChangeSearche}
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
                      value={formDataSearche.categorie}
                      onChange={handleChangeSearche}
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
                      value={formDataSearche.entrepot}
                      onChange={handleChangeSearche}
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
                      value={formDataSearche.casier}
                      onChange={handleChangeSearche}
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
                      onClick={handleRefresh}
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
          {ActivationAffichage === "InsertionPRODUIT" && (
            <div>
              <form
                onSubmit={handleSubmit_PRODUIT}
                className="bg-white p-6 rounded-lg shadow-md   space-y-6"
              >
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
                        onChange={handleChangeP}
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
                      value={formDataP.type_categorie}
                      onChange={handleChangeP}
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
                      value={formDataP.categorie}
                      onChange={handleChangeP}
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
          {ActivationAffichage === "detailPRODUIT" && Donne_PRODUIT && (
            <div className=" ">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                  DÉTAIL Mr/Mn <strong>{Donne_PRODUIT.nomProduit}</strong>
                </h1>

                {/* Grille 3 colonnes */}
                <div className="flex justify-center">
                  <img
                    src={
                      Donne_PRODUIT.fichier
                        ? `http://127.0.0.1:8000/storage/${Donne_PRODUIT.fichier}`
                        : "https://via.placeholder.com/100"
                    }
                    alt={Donne_PRODUIT.nomProduit}
                    className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-md"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="grid grid-cols-3">
                    {/* p-3  rounded-lg flex gap-6 */}
                    <span className="font-semibold text-gray-600">NOM :</span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.nomProduit}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-gray-600">PRIX :</span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.prix}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-semibold text-gray-600">
                      STOCK INITIAL :
                    </span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.stock_initia}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-gray-600">zone :</span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.zone}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-semibold text-gray-600">
                      TYPE CATEGORIE :
                    </span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.type_categorie}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-gray-600">
                      CATEGORIE :
                    </span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.categorie}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-semibold text-gray-600">
                      CODE COMPTA :
                    </span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.code_compta}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="font-semibold text-gray-600">
                      DATE PEREMPTION :
                    </span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.date_peremption}</strong>
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold text-gray-600">ETAT :</span>
                    <span className="block text-gray-800">
                      <strong>{Donne_PRODUIT.colonne}</strong>
                    </span>
                  </div>
                </div>

                {/* Bouton fermer centré */}
                <div className="mt-6 gap-8 flex justify-center">
                  <button
                    onClick={() =>
                      etat_PRODUIT(Donne_PRODUIT.id, Donne_PRODUIT.colonne)
                    }
                    className={`${
                      Donne_PRODUIT.colonne === "activer"
                        ? "px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        : "px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    }`}
                  >
                    {Donne_PRODUIT.colonne === "activer" ? (
                      <div>DESACTIVER</div>
                    ) : (
                      <div>ACTIVER</div>
                    )}
                  </button>
                  <button
                    onClick={() => handleSelect("modification_PRODUIT")}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    MODIFIER
                  </button>

                  <button
                    onClick={() => handleSelect("ListePRODUIT", "PRODUIT")}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
          {ActivationAffichage === "modification_PRODUIT" && Donne_PRODUIT && (
            <div>
              <form
                onSubmit={ModifePRODUIT}
                className="bg-white p-6 rounded-lg shadow-md  "
                encType="multipart/form-data"
              >
                <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                  MODIFICATION
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nom Produit
                    </label>
                    <input
                      type="text"
                      name="nomProduit"
                      required
                      value={Donne_PRODUIT.nomProduit || ""}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          nomProduit: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  {/* Prix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Prix
                    </label>
                    <input
                      type="number"
                      name="prix"
                      required
                      value={Donne_PRODUIT.prix}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          prix: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Stock Initial */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Stock Initial
                    </label>
                    <input
                      type="number"
                      name="stock_initia"
                      required
                      value={Donne_PRODUIT.stock_initia || ""}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          stock_initia: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Zone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Zone
                    </label>
                    <input
                      type="text"
                      name="zone"
                      value={Donne_PRODUIT.zone || ""}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          zone: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Fichier */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fichier
                    </label>
                    <input
                      type="file"
                      name="fichier"
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          fichier: e.target.files[0],
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Catégorie
                    </label>

                    <select
                      name="categorie"
                      value={Donne_PRODUIT.categorie || ""}
                      required
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          categorie: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Entretien">Entretien</option>
                      <option value="Alimentation">Alimentation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      TYPE CATEGORIE
                    </label>

                    <select
                      name="type_categorie"
                      value={Donne_PRODUIT.type_categorie || ""}
                      required
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          type_categorie: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Stock">Stock</option>
                      <option value="Flotte">Flotte</option>
                    </select>
                  </div>

                  {/* Code Compta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Code Compta
                    </label>
                    <input
                      type="text"
                      name="code_compta"
                      value={Donne_PRODUIT.code_compta || ""}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          code_compta: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Stock Minimum */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Stock Minimum
                    </label>
                    <input
                      type="number"
                      name="stock_minimum"
                      value={Donne_PRODUIT.stock_minimum}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          stock_minimum: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Date Péremption */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date de Péremption
                    </label>
                    <input
                      type="date"
                      name="date_peremption"
                      value={Donne_PRODUIT.date_peremption || ""}
                      onChange={(e) =>
                        setDonne_PRODUIT({
                          ...Donne_PRODUIT,
                          date_peremption: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* Bouton */}
                <div className="flex gap-6 justify-end mt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    VALIDER
                  </button>
                  <button
                    onClick={() => handleSelect("ListePRODUIT", "PRODUIT")}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    ANNULLER
                  </button>
                </div>
              </form>
            </div>
          )}
          {ActivationAffichage === "PRIX" && (
            <div className="  p-0 m-0">
              <div className="bg-white p-8 rounded-2xl shadow-lg ">
                {modificationprix ? (
                  <div>
                    <form
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      onSubmit={modifeprix}
                    >
                      <div className="flex flex-col">
                        <label
                          htmlFor="QUALIFICATION"
                          className="mb-2 font-semibold text-gray-700"
                        >
                          NOM
                        </label>
                        <input
                          name="NOM"
                          type="text"
                          value={Donne_PRODUIT?.nomProduit || ""}
                          disabled
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>

                      <div className="flex flex-col"></div>

                      {/* PRIX ACTUEL */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="MENSUEL"
                          className="mb-2 font-semibold text-gray-700"
                        >
                          PRIX ACTUEL
                        </label>
                        <input
                          name="PRIXActuel"
                          value={Donne_PRODUIT?.prix || ""}
                          disabled
                          type="text"
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>

                      {/* PRIX NOUVEAU */}
                      <div className="flex flex-col">
                        <label
                          htmlFor="ANNUEL"
                          className="mb-2 font-semibold text-gray-700"
                        >
                          PRIX NOUVEAU
                        </label>
                        <input
                          name="nouveau"
                          value={nouveauPrix}
                          onChange={(e) => setNouveauPrix(e.target.value)}
                          type="text"
                          placeholder="Entrer le nouveau prix"
                          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div></div>
                      <div className="mt-8 flex justify-end gap-6">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-5 py-2 bg-blue-500 text-blue-100 rounded-lg hover:bg-blue-600 transition"
                        >
                          <span>VALIDER</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setmodificationprix(false)}
                          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
                        >
                          ANNULER
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
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
                        columns={colonne_prix}
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

                {/* Bouton en dessous */}
              </div>
              <h2 className="font-bold text-blue-600 text-2xl mb-4 mt-6 ml-[5%]">
                TABLEAU HISTORIQUE DE MODIFICATION
              </h2>
              <div className=" shadow-lg max-w-4xl   ">
                <Box sx={{ height: "55vh", width: "117%" }}>
                  <DataGrid
                    rows={row_Prix}
                    columns={ColunnePrix}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    loading={loading}
                    sx={{
                      "& .MuiDataGrid-columnHeaderTitle": {
                        color: "#fff", // texte blanc
                        fontWeight: "bold",
                      },
                      "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#3B82F6",
                        color: "#fff",
                      },
                    }}
                  />
                </Box>
              </div>
            </div>
          )}
          {/* {ActivationAffichage === "STOCK" && (
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              {insertionStock ? (
                <div>
                  <div>
                    {message && (
                      <div
                        className={` right-4  text-white pt-6 pb-6 px-[20%] text-center m-8 rounded shadow-md
      ${message.type === "success" ? "bg-green-500 text-white" : ""}
      ${message.type === "error" ? "bg-red-500 text-white" : ""}
      ${message.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                      >
                        {message.text}
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleSubmit_STOCK}>
                    <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                      CREATION STOCK
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4">
                        <label className="w-32 font-medium text-gray-700">
                          ENTREPOT :
                        </label>

                        <select
                          name="entrepot"
                          required
                          value={formDataS.entrepot}
                          onChange={handleChangeS}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value=""></option>

                          {OriginalListeEntrepot.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.nom}
                            </option>
                          ))}
                        </select>
                        <span className="text-red-600"> ***</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-32 font-medium text-gray-700">
                          CASIER :
                        </label>

                        <select
                          value={formDataS.casier}
                          onChange={handleChangeS}
                          id="casier"
                          name="casier"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value=""></option>

                          {OriginalListeEntrepot.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.nom}
                            </option>
                          ))}
                        </select>
                        <span className="text-red-600"> ***</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="w-32 font-medium text-gray-700">
                          PRODUIT :
                        </label>
                        <select
                          name="nomProduit"
                          value={formDataSearcheStock.nomProduit}
                          onChange={handleChangeSearcheStock}
                          required
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                        >
                          <option value="">...</option>
                          {[
                            ...new Set(
                              OriginalListe.map((item) => item.nomProduit)
                            ),
                          ].map((nomProduit, index) => (
                            <option
                              key={`nomProduit-${index}`}
                              value={nomProduit}
                            >
                              {nomProduit}
                            </option>
                          ))}
                        </select>
                        <span className="text-red-600"> ***</span>
                      </div>

                      {formDataSearcheStock.nomProduit && (
                        <div className="flex items-center gap-4 mt-2">
                          <label className="w-32 font-medium text-gray-700">
                            CODE COMPTA :
                          </label>
                          <select
                            name="idProduit"
                            value={formDataS.idProduit} // <-- garde la valeur numérique (id)
                            required
                            onChange={handleChangeS}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                          >
                            <option value="">...</option>
                            {OriginalListe.filter(
                              (item) =>
                                item.nomProduit ===
                                formDataSearcheStock.nomProduit
                            ).map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.categorie}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                      >
                        VALIDER
                      </button>
                      <button
                        type="button"
                        onClick={() => setinsertionStock(false)}
                        className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                      >
                        ANNULER
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
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
                      rows={ListeStock}
                      columns={Colunnestock}
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
                  <div className="flex justify-end m-4">
                    <button
                      onClick={() => setinsertionStock(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <FiPlus size={18} />
                      Création
                    </button>
                  </div>
                </div>
              )}
            </div>
          )} */}
          {ActivationAffichage === "modificationSTOCK" && (
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <form onSubmit={modifeStock}>
                <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                  MODIFICATION
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ENTREPOT */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      ENTREPOT :
                    </label>
                    <input
                      type="text"
                      disabled
                      name="entrepot"
                      value={Donne_Stock.entrepot}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* CASIER */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      CASIER :
                    </label>
                    <input
                      type="text"
                      name="casier"
                      disabled
                      value={Donne_Stock.casier}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      PRODUIT :
                    </label>
                    <input
                      type="text"
                      name="casier"
                      disabled
                      value={Donne_Stock.nomProduit}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      STOCK ACTUEL :
                    </label>
                    <input
                      type="text"
                      disabled
                      value={Donne_Stock.stock_initia}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      STOCK NOUVEL :
                    </label>
                    <input
                      type="text"
                      name="stock"
                      value={formDataSModification.stock || ""}
                      onChange={handleChangeSm}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                    onClick={() => setinsertionStock(false)}
                    className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    ANNULER
                  </button>
                </div>
                <br />

                <br />
                <h1 className="text-white">qf</h1>
              </form>

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
            </div>
          )}
          {ActivationAffichage === "transferSTOCK" && (
            <div className="bg-white p-8 rounded-2xl shadow-lg">
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
              <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                TRANSFER
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6"></div>

              <form onSubmit={tranfertStock}>
                <div className="">
                  {/* ENTREPOT */}
                  <div className="grid grid-cols-1 md:grid-cols-4 mt-6 gap-6">
                    <div className="">
                      <label className="w-32 font-medium text-gray-700">
                        PRODUIT :
                      </label>
                      <br />
                      <input
                        type="text"
                        disabled
                        name="nomProduit"
                        value={Donne_Stock.nomProduit}
                        onChange={handleChangeSm}
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="">
                      <label className="w-32 font-medium text-gray-700">
                        STOCK ACTUEL :
                      </label>
                      <br />
                      <input
                        type="text"
                        disabled
                        name="stock_initia"
                        value={Donne_Stock.stock_initia}
                        onChange={handleChangeSm}
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="">
                      <label className="w-32 font-medium text-gray-700">
                        ENTREPOT D'ORIGINE :
                      </label>
                      <input
                        type="text"
                        disabled
                        name="entrepot"
                        value={Donne_Stock.entrepot}
                        onChange={handleChangeSm}
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="">
                      <label className="w-32 font-medium text-gray-700">
                        CASIER :<span className="text-white">qkfhsqsfq</span>
                      </label>
                      <br />
                      <input
                        type="text"
                        disabled
                        name="entrepot"
                        value={Donne_Stock.casier}
                        onChange={handleChangeSm}
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-6">
                    {" "}
                    <div className=" items-center gap-4">
                      <label className="w-32 font-medium text-gray-700">
                        STOCK NOUVEL :
                      </label>
                      <input
                        type="text"
                        name="stockfinal"
                        onChange={handleChangeSm}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="  ">
                      <label className="w-32 font-medium text-gray-700">
                        ENTREPOT CHOISI:
                      </label>
                      <br />
                      <select
                        name="entrepotfinal"
                        onChange={handleChangeSm}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">...</option>
                        {[
                          ...new Set(ListeStock.map((item) => item.entrepot)),
                        ].map((entrepot, index) => (
                          <option key={`entrepot-${index}`} value={entrepot}>
                            {entrepot}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="">
                      <label className="w-32 font-medium text-gray-700">
                        CASIER :
                      </label>
                      <br />

                      <select
                        name="casierfinal"
                        onChange={handleChangeSm}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">...</option>
                        {[...new Set(listeCasier.map((item) => item.nom))].map(
                          (nom, index) => (
                            <option key={`nom-${index}`} value={nom}>
                              {nom}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                  >
                    TRANSFERER
                  </button>
                </div>
                <br />
                <br />
                <br />
                <h1 className="text-white">qf</h1>
              </form>
            </div>
          )}
          {ActivationAffichage === "DOCUMENT" && (
            <div className="p-0 m-0">
              {/* Bloc DataGrid */}
              <div className="p-3 rounded-lg shadow-lg bg-white">
                <Box sx={{ height: "55vh", width: "100%" }}>
                  <DataGrid
                    rows={row_documents}
                    columns={colonne_Documents}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    loading={loading}
                    className="border border-gray-300 rounded-lg shadow-md"
                    sx={{
                      "& .MuiDataGrid-columnHeaderTitle": {
                        color: "#fff", // texte blanc
                        fontWeight: "bold",
                      },
                      "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#3B82F6",
                        color: "#fff",
                      },
                    }}
                  />
                </Box>
              </div>

              {/* Bloc Tableau Classique */}
              <div className="bg-white rounded-lg shadow-lg p-4 mt-6">
                {/* Barre de filtre */}
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div></div>
                  <form className="flex flex-wrap gap-4 items-center">
                    <select
                      id="DOCUMENT"
                      name="DOCUMENT"
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">DOCUMENT</option>
                    </select>

                    <select
                      id="ETAT"
                      name="ETAT"
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">ETAT</option>
                    </select>

                    <select
                      name="DATE"
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">DATE</option>
                    </select>

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
                    <thead className="bg-[#5581e1] text-white">
                      <tr>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          REF
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          DATE
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          ETAT
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-right">
                          HT
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-right">
                          TTC
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-200">
                          BNI
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          2025-08-18
                        </td>
                        <td className="px-4 py-2 border border-gray-200">F1</td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          200
                        </td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          240
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-2 border border-gray-200">
                          BOA
                        </td>
                        <td className="px-4 py-2 border border-gray-200">
                          2025-08-18
                        </td>
                        <td className="px-4 py-2 border border-gray-200">F2</td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          500
                        </td>
                        <td className="px-4 py-2 border border-gray-200 text-right">
                          600
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
                          700
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-right text-yellow-600">
                          840
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
