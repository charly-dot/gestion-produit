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

export function Entrepot() {
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

  const [OriginalListe, setOriginalListe] = useState([]);
  const [NavbarDocuments, setNavbarDocuments] = useState("TSS");
  const [ActivationAffichage, setActivationAffichage] = useState(null);
  const [condition_navbar, setcondition_navbar] = useState(null);
  const [showTIERS, setShowTIERS] = useState(false);
  const [showcasier, setShowcasier] = useState(false);

  const [activationAffichagetype, setActivationAffichagetype] = useState(null);

  const handleSelect = (section, navbar) => {
    setActivationAffichage(section);
    // setActivationAffichage
    setcondition_navbar(navbar);
  };

  const handleSelectType = (section) => {
    setActivationAffichagetype(section);
    // setcondition_navbar(navbar);
  };

  // const listeP = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       "http://127.0.0.1:8000/api/liste_Produit"
  //     );
  //     // console.log(response.data);
  //     setListeProduit(response.data);
  //     setOriginalListe(response.data);
  //   } catch (err) {
  //     setErrors("Erreur lors du chargement de l'utilisateur.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };
  const [formData, setformData] = useState({
    nom: "",
    etat: "",
  });
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

  //   LISTE Casier
  const [ListeC, setListeC] = useState([]);
  const ColunneC = [
    { field: "id", headerName: "N°", width: 10 },
    { field: "DateCasier", headerName: "DATE", width: 150 },
    { field: "nomEntrepot", headerName: "ENTREPOT", width: 140 },
    { field: "nomCasier", headerName: "CASIER", width: 145 },
    { field: "produit", headerName: "PRODUIT", width: 145 },
    { field: "nomStock", headerName: "STOCK", width: 145 },
    { field: "utilisateur", headerName: "UTILISATEUR", width: 140 },
    { field: "stockTotal", headerName: "QUANTITER", width: 100 },
  ];
  const listeC = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/liste_Casier"
      );

      // Ajouter un id unique pour chaque ligne
      const dataWithId = response.data.map((item, index) => ({
        id: index + 1, // ou item.id si ton API renvoie un id unique
        ...item,
      }));

      setListeC(dataWithId);
      setOriginalC(dataWithId);
    } catch (err) {
      setErrors("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  // INSERTION Casier
  const [donneCasierCreer, setdonneCasierCreer] = useState({});

  const ajouterCasier = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      const response = await axios.post(
        `http://127.0.0.1:8000/api/creationCasier/${DonneSession.id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setdonneCasierCreer({
        ...response.data.data,
        totalGeneral: response.data.totalGeneral,
      });

      setdonneCasierCreer({
        ...response.data.data,
        totalGeneral: response.data.totalGeneral,
      });

      setformData({ nom: "", etat: "" });
      listeC();
      handleSelectType("casiercree");
      handleSelect("FicheCasier", "casiercree");
      showMessage("success", response.data.message);
    } catch (err) {
      if (err.response) {
        setdonneCasierCreer({
          ...err.response.data.data,
          totalGeneral: err.response.data.totalGeneral,
        });
      } else {
        showMessage("error", "Erreur réseau");
      }
      // console.log("dddddddddd");
      console.log({
        ...response.data.data,
        totalGeneral: response.data.totalGeneral,
      });
      setformData({ nom: "", etat: "" });
      // handleSelectType("casiercree");
      // handleSelect("FicheCasier", "casiercree");
      handleSelectType("casiercree");
      handleSelect("FicheCasier", "casiercree");
    }
  };

  ///stock de HISTORIQUE

  const [ListeHistoriqueTransfert, setListeHistoriqueTransfert] = useState([]);
  const [OriginalListehistorique, setOriginalListehistorique] = useState([]);

  const listemHistoriqueTransfert = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/HistoriqueEntrepot/${donneCasierCreer.id}`
      );
      setOriginalListehistorique(response.data);
      setListeHistoriqueTransfert(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const modifecasier = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nom: donneCasierCreer.nom,
        etat: donneCasierCreer.etat,
      };

      const res = await axios.post(
        `http://127.0.0.1:8000/api/modifecasier/${donneCasierCreer.id}`,
        payload
      );

      setdonneCasierCreer({
        ...res.data.data,
        totalGeneral: res.data.totalGeneral,
      });

      showMessage("success", res.data.message);
      console.log("TOTAL GENERAL :", res.data.totalGeneral);
    } catch (err) {
      const res = err.response;
      if (res) {
        setdonneCasierCreer({
          ...(res.data.data || {}),
          totalGeneral: res.data.totalGeneral,
        });

        showMessage("error", res.data.message || "Erreur serveur");
      } else {
        showMessage("error", "Erreur réseau");
      }
    } finally {
      setLoading(false);
      listeC();
      handleSelectType("casiercree");
      handleSelect("FicheCasier", "casiercree");
      showMessage("success", response.data.message);
    }
  };

  const etat_casier = async (id, currentEtat) => {
    const newStatus = currentEtat === "activer" ? "desactiver" : "activer";

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/changer_activation_casier/${id}`,
        { activation: newStatus }
      );

      setdonneCasierCreer({
        ...response.data.data,
        totalGeneral: response.data.totalGeneral,
      });

      listeC();
      handleSelectType("casiercree");
      handleSelect("FicheCasier", "casiercree");
      showMessage("success", response.data.message);
    } catch (err) {
      console.error(err);
      setError("❌ Erreur lors de la modification de l'état du casier.");
    }
  };

  const suppression_casier = async (id) => {
    if (!window.confirm("⚠️ Voulez-vous vraiment supprimer ce casier ?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/suppression_casier/${id}`
      );

      listeC();
      handleSelectType("casiercree");
      handleSelect("Listecasier", "casiercree");
      showMessage("success", response.data.message);
    } catch (err) {
      console.error(err);
      setError("❌ Erreur lors de la suppression du casier.");
    } finally {
      setLoading(false);
    }
  };

  const ColunneHistoriqueTransfert = [
    { field: "id", headerName: "N°", width: 70 },
    { field: "date", headerName: "DATE", width: 100 },
    { field: "nomEntrepotSource", headerName: "ENTREPOT SOURCE", width: 100 },
    { field: "nomCasierSource", headerName: "CASIER SOURCE", width: 100 },
    { field: "nomEntrepotFinal", headerName: "ENTREPOT FINAL", width: 100 },
    { field: "nomCasierFinal", headerName: "CASIER FINAL", width: 100 },
    { field: "nomProduit", headerName: "PRODUIT", width: 120 },
    { field: "stock", headerName: " STOCK", width: 120 },
    { field: "action", headerName: "ACTION", width: 120 },
    { field: "nomUtilisateur", headerName: "UTILISATEUR", width: 120 },
  ];
  // recherche
  const [formDataSModification, setformDataSModification] = useState({
    nomProduit: "",
    stock_initia: "",
    casier: "",
    entrepot: "",
    stockfinal: "",
    casierfinal: "",
    entrepotfinal: "",
  });

  ///mouvemnt de stock
  const [ListeMouvementStock, setListeMouvementStock] = useState([]);
  const [OrigineListeMouvementStock, setOrigineListeMouvementStock] = useState(
    []
  );
  const ColunneMouvementStock = [
    { field: "id", headerName: "N°", width: 70 },
    { field: "date", headerName: "DATE", width: 150 },
    { field: "entrepot", headerName: "ENTREPOT", width: 150 },
    { field: "casier", headerName: "CASIER", width: 150 },
    { field: "produit", headerName: "PRODUIT", width: 150 },
    { field: "stock", headerName: "STOCK", width: 100 },
    { field: "action", headerName: "ACTION", width: 120 },
    {
      field: "name",
      headerName: "UTILISATEUR",
      width: 180,
    },
  ];

  const listems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/MouvementStock/${donneCasierCreer.id}`
      );

      setOrigineListeMouvementStock(response.data);
      setListeMouvementStock(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des mouvements :", err);
    } finally {
      setLoading(false);
    }
  };

  const [formDataSearcheMouvement, setformDataSearcheMouvement] = useState({
    entrepot: "",
    utilisateur: "",
    produit: "",
    etat: "",
  });

  const handleChangeSearcheMouvement = (e) => {
    const { name, value } = e.target;
    setformDataSearcheMouvement((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearcheSubmitMouvementStock = (e) => {
    e.preventDefault();

    const filtered = OrigineListeMouvementStock.filter((item) => {
      const matchEntrepot =
        formDataSearcheMouvement.entrepot === "" ||
        (item.entrepot || "")
          .toLowerCase()
          .includes(formDataSearcheMouvement.entrepot.toLowerCase());

      const matchUtilisateur =
        formDataSearcheMouvement.utilisateur === "" ||
        (item.name || "")
          .toLowerCase()
          .includes(formDataSearcheMouvement.utilisateur.toLowerCase());

      const matchProduit =
        formDataSearcheMouvement.produit === "" ||
        (item.produit || "")
          .toLowerCase()
          .includes(formDataSearcheMouvement.produit.toLowerCase());

      const matchEtat =
        formDataSearcheMouvement.etat === "" ||
        (item.activation || "").toLowerCase() ===
          formDataSearcheMouvement.etat.toLowerCase();

      return matchEntrepot && matchUtilisateur && matchProduit && matchEtat;
    });

    setListeMouvementStock(filtered);
  };

  const handleSearcheSubmitansfertHistorique = (e) => {
    e.preventDefault();

    const filtered = OriginalListehistorique.filter((item) => {
      const matchEntrepot =
        formDataSearcheMouvement.entrepot === "" ||
        (item.entrepotFinal || "")
          .toLowerCase()
          .includes(formDataSearcheMouvement.entrepot.toLowerCase());

      const matchUtilisateur =
        formDataSearcheMouvement.utilisateur === "" ||
        (item.name || "")
          .toLowerCase()
          .includes(formDataSearcheMouvement.utilisateur.toLowerCase());

      const matchProduit =
        formDataSearcheMouvement.produit === "" ||
        (item.produit || "")
          .toLowerCase()
          .includes(formDataSearcheMouvement.produit.toLowerCase());

      const matchEtat =
        formDataSearcheMouvement.etat === "" ||
        (item.activation || "").toLowerCase() ===
          formDataSearcheMouvement.etat.toLowerCase();

      return matchEntrepot && matchUtilisateur && matchProduit && matchEtat;
    });

    // setListeMouvementStock(filtered);
    setListeHistoriqueTransfert(filtered);
  };

  const resetSearch = () => {
    setformDataSearcheMouvement({
      entrepot: "",
      utilisateur: "",
      produit: "",
      etat: "",
    });
    setListeMouvementStock(OrigineListeMouvementStock);
    setListeHistoriqueTransfert(OriginalListehistorique);
  };

  const [formDatatout, setFormDatatout] = useState({
    entrepot: "", // idEntrepot
    casier: "", // idCasier
    produit: "", // idProduit
    reference: "",
    date: "",
  });

  const handleChangetout = (e) => {
    const { name, value } = e.target;
    setFormDatatout((prev) => ({ ...prev, [name]: value }));
  };

  const [donneEntrepotCreer, setdonneEntrepotCreer] = useState([]);
  const [entrepot, setEntrepot] = useState({});
  const [produits, setProduits] = useState([]);

  const ajouterEntrepot = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/creationEntrepot/${DonneSession.id}`,
        formDatatout
      );

      setdonneEntrepotCreer({
        ...res.data.data[0], // prend le premier élément du tableau retourné
        totalGeneral: res.data.totalGeneral,
      });

      setEntrepot({
        ...res.data.data[0],
        totalGeneral: res.data.totalGeneral,
      });

      setProduits(res.data.data);

      showMessage("success", res.data.message);
      console.log(res.data.data);
    } catch (err) {
      const res = err.response;
      if (res) {
        setdonneEntrepotCreer({
          ...res.data.data[0], // prend le premier élément du tableau retourné
          totalGeneral: res.data.totalGeneral,
        });

        setEntrepot({
          ...res.data.data[0],
          totalGeneral: res.data.totalGeneral,
        });

        // Tous les produits pour le select
        setProduits(res.data.data);

        console.log(res.data.data);
        showMessage("error", res.data.message || "Erreur serveur");
      } else {
        showMessage("error", "Erreur réseau");
      }
    } finally {
      setFormDatatout({ nom: "", etat: "", zone: "", casier: "" });
      handleSelectType("entrepotcree");
      handleSelect("FicheENTREPOT", "entrepotcree");
      setLoading(false);
    }
  };

  const modifeEntrepot = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nom: donneEntrepotCreer.nom,
        etat: donneEntrepotCreer.etat,
        zone: donneEntrepotCreer.zone,
        casier: donneEntrepotCreer.idCasier, // ✅ c’est bien l'id
      };

      const res = await axios.post(
        `http://127.0.0.1:8000/api/modifeEntrepot/${donneEntrepotCreer.id}`,
        payload
      );

      setdonneEntrepotCreer({
        ...res.data.data,
        totalGeneral: res.data.totalGeneral,
      });

      showMessage("success", res.data.message);
      console.log("TOTAL GENERAL :", res.data.totalGeneral);
    } catch (err) {
      const res = err.response;
      if (res) {
        setdonneEntrepotCreer({
          ...(res.data.data || {}),
          totalGeneral: res.data.totalGeneral,
        });

        showMessage("error", res.data.message || "Erreur serveur");
        console.log("TOTAL GENERAL (ERREUR) :", res.data.totalGeneral);
      } else {
        showMessage("error", "Erreur réseau");
      }
    } finally {
      setFormDatatout({ nom: "", etat: "", zone: "", casier: "" });
      handleSelectType("entrepotcree");
      handleSelect("FicheENTREPOT", "entrepotcree");
      setLoading(false);
    }
  };

  const etat_entrepot = async (id, currentEtat) => {
    const newStatus = currentEtat === "activer" ? "desactiver" : "activer";

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/changer_activation_entrepot/${id}`,
        { activation: newStatus }
      );

      // mettre à jour l'état local
      setdonneEntrepotCreer({
        ...response.data.data,
        totalGeneral: response.data.totalGeneral,
      });

      showMessage("success", response.data.message);
      console.log("TOTAL GENERAL :", response.data.totalGeneral);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification de l'activation ❌");
    }
  };
  const suppression_entrepots = async (id) => {
    if (!window.confirm("⚠️ Voulez-vous vraiment supprimer ce entrepot ?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/suppression_entrepot/${id}`
      );

      handleSelectType("ENTREPOT");
      handleSelect("ENTREPOT", "ENTREPOT");
      showMessage("success", response.data.message);
    } catch (err) {
      console.error(err);
      setError("❌ Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  const [ListeMouvementStockENTREPOT, setListeMouvementStockENTREPOT] =
    useState([]);
  const [
    OrigineListeMouvementStockENTREPOT,
    setOrigineListeMouvementStockENTREPOT,
  ] = useState([]);
  const ColunneMouvementStockENTREPOT = [
    { field: "id", headerName: "N°", width: 70 },
    { field: "nomEntrepot", headerName: "ENTREPOT", width: 100 },
    { field: "nomCasier", headerName: "CASIER", width: 100 },
    { field: "nomProduit", headerName: "PRODUIT", width: 100 },
    { field: "stock", headerName: "STOCK REEL", width: 100 },
    { field: "stockCour", headerName: "STOCK ENCOUR", width: 100 },
    { field: "stock_initia", headerName: "STOCK FINAL", width: 120 },
    { field: "documentLier", headerName: " DOCUMENT LIER", width: 120 },
    { field: "raison", headerName: "RAISON", width: 120 },
    { field: "etat", headerName: "DATE", width: 120 },
    {
      field: "name",
      headerName: "UTILISATEUR",
      width: 180,
    },
    { field: "action", headerName: "ACTION", width: 120 },
  ];

  const listemsE = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/MouvementStockEntrepot/${donneEntrepotCreer.id}`
      );

      setOrigineListeMouvementStockENTREPOT(response.data);
      setListeMouvementStockENTREPOT(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des mouvements :", err);
    } finally {
      setLoading(false);
    }
  };

  const [
    formDataSearcheMouvementENTREPOT,
    setformDataSearcheMouvementENTREPOT,
  ] = useState({
    entrepot: "",
    utilisateur: "",
    produit: "",
    etat: "",
    casier: "",
    zone: "",
  });

  const handleChangeSearcheMouvementENTREPOT = (e) => {
    const { name, value } = e.target;
    setformDataSearcheMouvementENTREPOT((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearcheSubmitMouvementStockENTREPOT = (e) => {
    e.preventDefault();

    const filtered = OrigineListeMouvementStockENTREPOT.filter((item) => {
      const matchEntrepot =
        formDataSearcheMouvementENTREPOT.entrepot === "" ||
        (item.nomEntrepot || "")
          .toString()
          .toLowerCase()
          .includes(formDataSearcheMouvementENTREPOT.entrepot.toLowerCase());

      const matchUtilisateur =
        formDataSearcheMouvementENTREPOT.utilisateur === "" ||
        (item.name || "")
          .toString()
          .toLowerCase()
          .includes(formDataSearcheMouvementENTREPOT.utilisateur.toLowerCase());

      const matchProduit =
        formDataSearcheMouvementENTREPOT.produit === "" ||
        (item.nomProduit || "")
          .toString()
          .toLowerCase()
          .includes(formDataSearcheMouvementENTREPOT.produit.toLowerCase());

      const matchCasier =
        formDataSearcheMouvementENTREPOT.casier === "" ||
        (item.nomCasier || "")
          .toString()
          .toLowerCase()
          .includes(formDataSearcheMouvementENTREPOT.casier.toLowerCase());

      const matchEtat =
        formDataSearcheMouvementENTREPOT.etat === "" ||
        (item.etat || "").toString().toLowerCase() ===
          formDataSearcheMouvementENTREPOT.etat.toLowerCase();

      const matchZone =
        formDataSearcheMouvementENTREPOT.zone === "" ||
        (item.zone || "").toString().toLowerCase() ===
          formDataSearcheMouvementENTREPOT.zone.toLowerCase();

      return (
        matchEntrepot &&
        matchUtilisateur &&
        matchProduit &&
        matchCasier &&
        matchEtat &&
        matchZone
      );
    });

    setListeMouvementStockENTREPOT(filtered);
  };
  const resetSearcheEntreprise = () => {
    // 1️⃣ Réinitialiser le formulaire
    setformDataSearcheMouvementENTREPOT({
      entrepot: "",
      utilisateur: "",
      produit: "",
      etat: "",
      casier: "",
      zone: "",
    });

    // 2️⃣ Remettre la liste complète
    setListeMouvementStockENTREPOT(OrigineListeMouvementStockENTREPOT);
  };
  ///historique
  const [ListeHistoriqueStockENTREPOT, setListeHistoriqueStockENTREPOT] =
    useState([]);
  const [
    OrigineListeHistoriqueStockENTREPOT,
    setOrigineListeHistoriqueStockENTREPOT,
  ] = useState([]);

  const listesHE = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/HistoriqueEntrepot/${donneEntrepotCreer.id}`
      );
      setOrigineListeHistoriqueStockENTREPOT(response.data);
      setListeHistoriqueStockENTREPOT(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  const ColunneHistoriqueStockENTREPOT = [
    { field: "id", headerName: "N°", width: 70 },
    { field: "date", headerName: "DATE", width: 100 },
    { field: "nomEntrepotSource", headerName: "ENTREPOT SOURCE", width: 100 },
    { field: "nomCasierSource", headerName: "CASIER SOURCE", width: 100 },
    { field: "nomEntrepotFinal", headerName: "ENTREPOT FINAL", width: 100 },
    { field: "nomCasierFinal", headerName: "CASIER FINAL", width: 100 },
    { field: "nomProduit", headerName: "PRODUIT", width: 120 },
    { field: "stock", headerName: " STOCK", width: 120 },
    { field: "action", headerName: "ACTION", width: 120 },
    { field: "nomUtilisateur", headerName: "UTILISATEUR", width: 120 },
  ];

  const [
    formDataSearcheHistoriqueENTREPOT,
    setformDataSearcheHistoriqueENTREPOT,
  ] = useState({
    entrepot: "",
    utilisateur: "",
    produit: "",
    etat: "",
    casier: "",
    zone: "",
  });

  const handleChangeSearcheHistoriqueENTREPOT = (e) => {
    const { name, value } = e.target;
    setformDataSearcheHistoriqueENTREPOT((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearcheSubmitHistoriqueENTREPOT = (e) => {
    e.preventDefault();

    const filtered = OrigineListeHistoriqueStockENTREPOT.filter((item) => {
      const matchEntrepot =
        !formDataSearcheHistoriqueENTREPOT.entrepot ||
        (item.nomEntrepotFinal || "")
          .toLowerCase()
          .includes(formDataSearcheHistoriqueENTREPOT.entrepot.toLowerCase());

      const matchUtilisateur =
        !formDataSearcheHistoriqueENTREPOT.utilisateur ||
        (item.nomUtilisateur || "")
          .toLowerCase()
          .includes(
            formDataSearcheHistoriqueENTREPOT.utilisateur.toLowerCase()
          );

      const matchProduit =
        !formDataSearcheHistoriqueENTREPOT.produit ||
        (item.nomProduit || "")
          .toLowerCase()
          .includes(formDataSearcheHistoriqueENTREPOT.produit.toLowerCase());

      const matchCasier =
        !formDataSearcheHistoriqueENTREPOT.casier ||
        (item.nomCasierFinal || "")
          .toLowerCase()
          .includes(formDataSearcheHistoriqueENTREPOT.casier.toLowerCase());

      const matchEtat =
        !formDataSearcheHistoriqueENTREPOT.etat ||
        (item.activation || "").toLowerCase() ===
          formDataSearcheHistoriqueENTREPOT.etat.toLowerCase();

      const matchZone =
        !formDataSearcheHistoriqueENTREPOT.zone ||
        (item.zone || "").toLowerCase() ===
          formDataSearcheHistoriqueENTREPOT.zone.toLowerCase();

      return (
        matchEntrepot &&
        matchUtilisateur &&
        matchProduit &&
        matchCasier &&
        matchEtat &&
        matchZone
      );
    });

    setListeHistoriqueStockENTREPOT(filtered);
  };

  const resetSearchehistorique = () => {
    // 1️⃣ Réinitialiser le formulaire
    setformDataSearcheHistoriqueENTREPOT({
      entrepot: "",
      utilisateur: "",
      produit: "",
      etat: "",
      casier: "",
      zone: "",
    });

    setListeHistoriqueStockENTREPOT(OrigineListeHistoriqueStockENTREPOT);
  };

  const listes_casiere_entrepot = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/liste_casier_entrepot_id/${donneEntrepotCreer.id}`
      );
      setliste_Casier_id_inventaire(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  /// INVETAIRE
  const [invetaireSelectionTypeAffichage, setinvetaireSelectionTypeAffichage] =
    useState("sans");

  const [liste_Casier_id_inventaire, setliste_Casier_id_inventaire] = useState(
    []
  );
  const [liste_inventaire, setliste_inventaire] = useState([]);

  // Initialisation
  const [formDatatoutInventaire, setformDatatoutInventaire] = useState({
    entrepot: "",
    casier: "",
    produit: "",
    reference: "",
    date: "",
  });

  // Synchronisation quand donneEntrepotCreer change
  React.useEffect(() => {
    if (donneEntrepotCreer?.id && donneEntrepotCreer?.idCasier) {
      setformDatatoutInventaire((prev) => ({
        ...prev,
        entrepot: donneEntrepotCreer.id,
        casier: donneEntrepotCreer.idCasier,
      }));
    }
  }, [donneEntrepotCreer]);

  const handleChangetoutInventaire = (e) => {
    const { name, value } = e.target;
    setformDatatoutInventaire((prev) => ({ ...prev, [name]: value }));
  };

  const [formDatavaleur, setformDatavaleur] = useState({
    valeur: "",
  });
  const [valeursParLigne, setValeursParLigne] = useState({});

  // On stocke la valeur PAR ligne
  const handleChangevaleurInventaire = (id, value) => {
    setValeursParLigne((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const [liste_inventaire_tableau, setliste_inventaire_tableau] = useState([]);

  const [Donne_liste_inventaire, setDonne_liste_inventaire] = [];

  const [listeInventaire, setListeInventaire] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://127.0.0.1:8000/api/inventaires");
      setListeInventaire(res.data);
    };
    fetchData();
  }, []);

  const handleChangeValeurInventaire = (id, valeur) => {
    setValeursParLigne((prev) => ({ ...prev, [id]: valeur }));
  };

  const handleModifier = async (row) => {
    try {
      const valeur = valeursParLigne[row.id] ?? 0;

      const response = await axios.put(
        `http://127.0.0.1:8000/api/modificationValeurStockInventaire2/${
          DonneSession.id
        }/${row.idInventaire}/${encodeURIComponent(row.produit_nom)}`,
        { valeur }
      );

      alert("✅ " + response.data.message);

      // remplacer toute la liste par les données renvoyées
      const newList = response.data.data.map((item, index) => ({
        ...item,
        id: item.id ?? item.idProduit ?? index,
        idInventaire: item.id,
      }));

      setListeInventaire(newList);

      // reset la valeur saisie uniquement pour cette ligne
      setValeursParLigne((prev) => ({ ...prev, [row.id]: "" }));
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Erreur lors de la modification !");
    }
  };

  const handleSupprimer = async (row) => {
    try {
      const valeur = valeursParLigne[row.id] ?? 0;

      const response = await axios.put(
        `http://127.0.0.1:8000/api/modificationValeurStockInventaire/${
          DonneSession.id
        }/${row.idInventaire}/${encodeURIComponent(row.produit_nom)}`,
        { valeur }
      );

      const newList = response.data.data.map((item, index) => ({
        ...item,
        id: item.id ?? item.idProduit ?? index,
        idInventaire: item.id,
      }));

      setListeInventaire(newList);

      // Reset uniquement la valeur de la ligne supprimée
      setValeursParLigne((prev) => ({ ...prev, [row.id]: "" }));
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Erreur lors de la suppression !");
    }
  };

  const insertionInventaireEntrepot = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formDatatoutInventaire };
      const response = await axios.post(
        `http://127.0.0.1:8000/api/insertion_inventaire_produit/${DonneSession.id}`,
        payload
      );

      showMessage("success", response.data.message);

      setListeInventaire((prev) => [
        ...prev,
        ...response.data.data.map((row, index) => ({
          ...row,
          id: row.id ?? row.idProduit ?? index,
          idInventaire: row.id, // utile pour les modifs
        })),
      ]);

      // ✅ corrige ici
      setValeursParLigne({});

      handleSelectType("entrepotcree");
      handleSelect("tableau inventaire entrepot", "entrepotcree");

      setformDatatoutInventaire({
        entrepot: "",
        casier: "",
        produit: "",
        reference: "",
        date: "",
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      showMessage("error", "Erreur serveur, vérifie les champs !");
    }
  };

  const hadleBoutonEnregistrer = async (row) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/ConfirmationModificationInventaireEnregistrer/${DonneSession.id}/${row.idInventaire}`
      );

      // Réinitialiser le formulaire
      setformDatavaleur({ valeur: " " });

      // Créer une nouvelle liste sans doublon
      const newList = response.data.data.map((item, index) => ({
        ...item,
        id: item.id ?? item.idProduit ?? `unique-${Date.now()}-${index}`,
        idInventaire: item.id,
      }));

      setListeInventaire(newList);

      // Reset uniquement la valeur de la ligne modifiée
      setValeursParLigne((prev) => ({ ...prev, [row.id]: "" }));
    } catch (err) {
      console.error(err.response?.data || err.message);
      showMessage("error", "Erreur lors de l'enregistrement !");
    }
  };

  const hadleBoutonAnnuler = async (row) => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/ConfirmationModificationInventaireAnnuler/${DonneSession.id}/1`
      );
      setformDatavaleur({
        valeur: " ",
      });
      //   console.log("debutenregistrement");
      //   console.log(response.data.data);
      //   console.log("finenregistrement");
      showMessage("success", response.data.message);
      setliste_inventaire_tableau(
        response.data.data.map((row, index) => ({
          ...row,
          id: row.idProduit ?? index,
        }))
      );

      // reset uniquement la ligne modifiée
      setValeursParLigne((prev) => ({ ...prev, [row.id]: "" }));
      handleSelectType("entrepotcree");
      handleSelect("tableau inventaire entrepot", "entrepotcree");
    } catch (err) {
      console.error(err.response?.data || err.message);
      showMessage("error", "Erreur lors de la suppression !");
    }
  };

  React.useEffect(() => {
    ajouterCasier();
    listemHistoriqueTransfert();
    listems();
    listemsE();
    listeC();
    listesHE();
    handleSelect("ListeEntrepot", "ENTREPOT");
  }, []);
  if (!DonneSession) {
    return <div className="text-center text-3xl text-red">Chargement...</div>;
  }
  return (
    <div className="flex flex-col  bg-gray-200 ">
      <div className="flex min-h-screen">
        <div className="w-64 bg-white shadow-xl p-4 ">
          {/* Profil */}
          <div className="text-center mb-6">
            <img
              src={
                DonneSession?.profil
                  ? `http://localhost:8000/storage/${DonneSession.profil}`
                  : "/default-avatar.png"
              }
              alt="Profil"
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
              ENTREPOT
            </h1>

            {showTIERS && (
              <div className="ml-3 mt-1 space-y-1">
                <a
                  onClick={() => {
                    handleSelectType("casier");
                    handleSelect("Insertioncasier", "CASIER");
                  }}
                  className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  CRÉER CASIER
                </a>
                <a
                  onClick={() => {
                    handleSelectType("casier");
                    handleSelect("Listecasier", "CASIER");
                  }}
                  className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  LISTE CASIER
                </a>
                <a
                  onClick={() => {
                    handleSelectType("ENTREPOT");
                    handleSelect("InsertionENTREPOT", "ENTREPOT");
                  }}
                  className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  CRÉER ENTREPOT
                </a>
                <a
                  onClick={() => {
                    handleSelectType("ENTREPOT");
                    handleSelect("ListeEntrepot", "ENTREPOT");
                  }}
                  className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  LISTE ENTREPOT
                </a>
              </div>
            )}
            <h1 className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
              <Link to="/Article_Service">SERVICE</Link>
            </h1>

            <h1 className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
              <Link to="/produits_tiers">PRODUIT</Link>
            </h1>

            <a className="mt-5 cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
              Historiques
            </a>
          </div>
        </div>
        <div className="flex-1 bg-gray-200 p-6">
          <div className="flex justify-center text-lg font-bold mb-2">
            {activationAffichagetype === "casier" ? (
              <div></div>
            ) : activationAffichagetype === "casiercree" ? (
              <div>
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                    condition_navbar === "casiercree" ? "border-b-blue-500" : ""
                  }`}
                  onClick={() => {
                    handleSelectType("casiercree");
                    handleSelect("casiercree", "casiercree");
                  }}
                >
                  {donneCasierCreer.nom}
                  {/* {donneCasierCreer.nom.toUpperCase()} */}
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                    condition_navbar === "MOUVEMENT DE STOCK"
                      ? "border-b-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    handleSelectType("casiercree");
                    handleSelect("MOUVEMENT DE STOCK", "MOUVEMENT DE STOCK");
                  }}
                >
                  MOUVEMENT DE STOCK
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                    condition_navbar === "HISTORIQUE DE TRANSFERT"
                      ? "border-b-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    handleSelectType("casiercree");
                    handleSelect(
                      "HISTORIQUE DE TRANSFERT",
                      "HISTORIQUE DE TRANSFERT"
                    );
                  }}
                >
                  HISTORIQUE DE TRANSFERT
                </button>
              </div>
            ) : activationAffichagetype === "entrepotcree" ? (
              <div>
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                    condition_navbar === "FicheENTREPOT"
                      ? "border-b-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    handleSelectType("entrepotcree");
                    handleSelect("FicheENTREPOT", "FicheENTREPOT");
                  }}
                >
                  {/* {donneCasierCreer.nom} sdqfsdfqsfsd */}
                  {donneEntrepotCreer.nom}
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                    condition_navbar === "MOUVEMENT DE STOCK entrepot"
                      ? "border-b-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    handleSelectType("entrepotcree");
                    handleSelect(
                      "MOUVEMENT DE STOCK entrepot",
                      "MOUVEMENT DE STOCK entrepot"
                    );
                  }}
                >
                  MOUVEMENT DE STOCK
                </button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                    condition_navbar === "HISTORIQUE DE TRANSFERT entrepot"
                      ? "border-b-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    handleSelectType("entrepotcree");
                    handleSelect(
                      "HISTORIQUE DE TRANSFERT entrepot",
                      "HISTORIQUE DE TRANSFERT entrepot"
                    );
                  }}
                >
                  HISTORIQUE DE TRANSFERT
                </button>
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                    condition_navbar === "MOUVEMENT DE STOCK"
                      ? "border-b-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    handleSelectType("entrepotcree");
                    handleSelect("INVENTAIRE entrepot", "INVENTAIRE entrepot");
                  }}
                >
                  INVENTAIRE
                </button>
              </div>
            ) : activationAffichagetype === "ENTREPOT" ? (
              <div>
                <button
                  onClick={() => {
                    handleSelectType("ENTREPOT");
                    handleSelect("InsertionEntrepot", "ENTREPOT");
                  }}
                ></button>
              </div>
            ) : (
              <div>
                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                    condition_navbar === "ENTREPOT" ? "border-b-blue-500" : ""
                  }`}
                  onClick={() => {}}
                ></button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                    condition_navbar === "MOUVEMENT DE STOCK"
                      ? "border-b-blue-500"
                      : ""
                  }`}
                ></button>

                <button
                  className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                    condition_navbar === "HISTORIQUE DE TRANSFERT"
                      ? "border-b-blue-500"
                      : ""
                  }`}
                  onClick={() => {
                    handleSelectType("casier");
                    handleSelect(
                      "HISTORIQUE DE TRANSFERT",
                      "HISTORIQUE DE TRANSFERT"
                    );
                  }}
                >
                  HISTORIQUE DE TRANSFERT
                </button>
              </div>
            )}
          </div>
          {ActivationAffichage === "INVENTAIRE entrepot" && (
            <div>
              <div>
                {invetaireSelectionTypeAffichage === "creation" ? (
                  <div>
                    <button
                      onClick={() =>
                        setinvetaireSelectionTypeAffichage("liste")
                      }
                      className="w-full sm:w-auto bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition"
                    >
                      CREATION
                    </button>
                  </div>
                ) : invetaireSelectionTypeAffichage === "liste" ? (
                  <div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <form
                        className="items-center"
                        onSubmit={insertionInventaireEntrepot}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Entrepôt */}
                          {/* ENTREPOT */}
                          <select
                            name="entrepot"
                            required
                            value={formDatatoutInventaire.entrepot}
                            onChange={handleChangetoutInventaire}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                          >
                            <option value={donneEntrepotCreer.id}>
                              {donneEntrepotCreer.nom}
                            </option>
                          </select>

                          <select
                            name="casier"
                            value={formDatatoutInventaire.casier}
                            onChange={handleChangetoutInventaire}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
                          >
                            <option value={donneEntrepotCreer.idCasier}>
                              {donneEntrepotCreer.nomCasier}
                            </option>
                          </select>

                          {/* Produit */}
                          <div>
                            <label className="font-semibold text-gray-700 text-sm block">
                              PRODUIT
                            </label>
                            <select
                              name="produit"
                              required
                              value={formDatatoutInventaire.produit || ""}
                              onChange={handleChangetoutInventaire}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">...</option>
                              <option value="0">Tout produit</option>
                              {produits.map((item) => (
                                <option
                                  key={item.idProduitFinal}
                                  value={item.idProduitFinal}
                                >
                                  {item.nomProduit}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Référence */}
                          <div>
                            <label className="font-semibold text-gray-700 text-sm block">
                              REFERENCE
                            </label>
                            <input
                              name="reference"
                              required
                              value={formDatatoutInventaire.reference}
                              onChange={handleChangetoutInventaire}
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* Date */}
                          <div>
                            <label className="font-semibold text-gray-700 text-sm block">
                              DATE
                            </label>
                            <input
                              name="date"
                              required
                              value={formDatatoutInventaire.date}
                              onChange={handleChangetoutInventaire}
                              type="date"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Boutons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                          <button
                            type="submit"
                            disabled={loading}
                            className={`w-full sm:w-auto text-white py-2 px-6 rounded-md transition ${
                              loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {loading ? "En cours..." : "VALIDER"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setInventaireSelectionTypeAffichage("creation")
                            }
                            className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                          >
                            LISTES
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-cols">
                    <button
                      onClick={() =>
                        setinvetaireSelectionTypeAffichage("creation")
                      }
                      className="w-[30%] sm:w-auto bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition"
                    >
                      creation
                    </button>
                    <button
                      onClick={() =>
                        setinvetaireSelectionTypeAffichage("liste")
                      }
                      className="w-[30%] sm:w-auto bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition"
                    >
                      liste
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {ActivationAffichage === "tableau inventaire entrepot" && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div>
                {message && (
                  <div
                    className={` right-4 bg-green-300 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded text-lg shadow-md
      ${message?.type === "success" ? "bg-green-500 text-white" : ""}
      ${message?.type === "error" ? "bg-red-500 text-white" : ""}
      ${message?.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                  >
                    {message?.text}
                  </div>
                )}
              </div>
              {/* <Box sx={{ height: "58vh" }}>
                <DataGrid
                  rows={liste_inventaire_tableau}
                  columns={Colonetableauinvetairecree}
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
              </Box> */}

              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Entrepôt</th>
                    <th className="border px-2 py-1">Casier</th>
                    <th className="border px-2 py-1">Produit</th>
                    <th className="border px-2 py-1">Stock réel</th>
                    <th className="border px-2 py-1">Stock en Cours</th>
                    <th className="border px-2 py-1">Stock Final</th>
                    <th className="border px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listeInventaire.map((row, index) => (
                    <tr key={row.id} className="text-center">
                      <td className="border px-2 py-1">{index + 1}</td>
                      <td className="border px-2 py-1">{row.nomEntrepot}</td>
                      <td className="border px-2 py-1">{row.nomCasier}</td>
                      <td className="border px-2 py-1">{row.produit_nom}</td>
                      <td className="border px-2 py-1">{row.stock_initia}</td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          className="w-20 border text-center"
                          value={valeursParLigne[row.id] ?? ""}
                          placeholder={row.stock_Encours1}
                          onChange={(e) =>
                            handleChangeValeurInventaire(row.id, e.target.value)
                          }
                        />
                      </td>
                      <td className="border px-2 py-1">{row.stock_Encours2}</td>
                      <td className="border px-2 py-1">
                        <button
                          onClick={() => handleModifier(row)}
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                        >
                          Ajouter
                        </button>
                        <button
                          onClick={() => handleSupprimer(row)}
                          className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {listeInventaire.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center py-3 text-gray-500"
                      >
                        Aucun inventaire trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-end items-center  mt-6 gap-6">
                <button
                  onClick={() => hadleBoutonEnregistrer(row)}
                  className="w-full sm:w-auto bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition"
                >
                  ENREGISTRER
                </button>

                <button
                  onClick={hadleBoutonAnnuler}
                  type="button"
                  o
                  className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                >
                  ANNULER
                </button>
              </div>
            </div>
          )}

          {ActivationAffichage === "HISTORIQUE DE TRANSFERT entrepot" && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                {/* Titre à gauche */}
                <h1 className="text-xl font-bold text-gray-800"></h1>

                {/* Formulaire à droite */}
                <form
                  className="grid grid-cols-6 gap-4 items-end"
                  onSubmit={handleSearcheSubmitHistoriqueENTREPOT}
                >
                  <div>
                    <label className="font-semibold text-gray-700">
                      ENTREPOT
                    </label>
                    <select
                      name="entrepot"
                      value={formDataSearcheHistoriqueENTREPOT.entrepot}
                      onChange={handleChangeSearcheHistoriqueENTREPOT}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[
                        ...new Set(
                          OrigineListeHistoriqueStockENTREPOT.map(
                            (item) => item.nomEntrepotFinal
                          )
                        ),
                      ].map((nomEntrepotFinal, index) => (
                        <option key={index} value={nomEntrepotFinal}>
                          {nomEntrepotFinal}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* casier */}
                  <div>
                    <label className="font-semibold text-gray-700">
                      CASIER
                    </label>
                    <select
                      name="casier"
                      value={formDataSearcheHistoriqueENTREPOT.casier}
                      onChange={handleChangeSearcheHistoriqueENTREPOT}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OrigineListeHistoriqueStockENTREPOT.map(
                            (item) => item.nomCasierFinal
                          )
                        ),
                      ].map((nomCasierFinal, index) => (
                        <option key={index} value={nomCasierFinal}>
                          {nomCasierFinal}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700">
                      UTILISATEUR
                    </label>
                    <select
                      name="utilisateur"
                      value={formDataSearcheHistoriqueENTREPOT.utilisateur}
                      onChange={handleChangeSearcheHistoriqueENTREPOT}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OrigineListeHistoriqueStockENTREPOT.map(
                            (item) => item.nomUtilisateur
                          )
                        ),
                      ].map((nomUtilisateur, index) => (
                        <option key={index} value={nomUtilisateur}>
                          {nomUtilisateur}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700">
                      PRODUIT
                    </label>
                    <select
                      name="produit"
                      value={formDataSearcheHistoriqueENTREPOT.produit}
                      onChange={handleChangeSearcheHistoriqueENTREPOT}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OrigineListeHistoriqueStockENTREPOT.map(
                            (item) => item.nomProduit
                          )
                        ),
                      ].map((nomProduit, index) => (
                        <option key={index} value={nomProduit}>
                          {nomProduit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ETAT */}
                  <div>
                    <label className="font-semibold text-gray-700">ETAT</label>
                    <select
                      name="etat"
                      value={formDataSearcheHistoriqueENTREPOT.etat}
                      onChange={handleChangeSearcheHistoriqueENTREPOT}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OrigineListeHistoriqueStockENTREPOT.map(
                            (item) => item.activation
                          )
                        ),
                      ].map((activation, index) => (
                        <option key={index} value={activation}>
                          {activation}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700">ZONE</label>
                    <select
                      name="zone"
                      value={formDataSearcheHistoriqueENTREPOT.zone}
                      onChange={handleChangeSearcheHistoriqueENTREPOT}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OrigineListeHistoriqueStockENTREPOT.map(
                            (item) => item.zone
                          )
                        ),
                      ].map((zone, index) => (
                        <option key={index} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* FILTRER */}
                  <div className="flex flex-col">
                    <label className="text-white">-</label>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                      FILTRER
                    </button>
                  </div>

                  {/* RAFRAICHIR */}
                  <div className="flex flex-col">
                    <label className="text-white">-</label>
                    <button
                      type="button"
                      onClick={resetSearchehistorique}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                    >
                      RAFRAICHIR
                    </button>
                  </div>
                </form>
              </div>
              <div>
                {message && (
                  <div
                    className={` right-4 bg-green-300 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded text-lg shadow-md
      ${message?.type === "success" ? "bg-green-500 text-white" : ""}
      ${message?.type === "error" ? "bg-red-500 text-white" : ""}
      ${message?.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                  >
                    {message?.text}
                  </div>
                )}
              </div>
              <Box sx={{ height: "55vh", width: "160vh" }}>
                <DataGrid
                  rows={ListeHistoriqueStockENTREPOT}
                  columns={ColunneHistoriqueStockENTREPOT}
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

          {ActivationAffichage === "MOUVEMENT DE STOCK entrepot" && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                {/* Titre à gauche */}
                <h1 className="text-xl font-bold text-gray-800"></h1>

                {/* Formulaire à droite */}
                <form
                  className="grid grid-cols-6 gap-4 items-end"
                  onSubmit={handleSearcheSubmitMouvementStockENTREPOT}
                >
                  <div>
                    <label className="font-semibold text-gray-700">
                      ENTREPOT
                    </label>
                    <select
                      name="entrepot"
                      value={formDataSearcheMouvementENTREPOT.entrepot}
                      onChange={handleChangeSearcheMouvementENTREPOT}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[
                        ...new Set(
                          OrigineListeMouvementStockENTREPOT.map(
                            (item) => item.nomEntrepot
                          )
                        ),
                      ].map((nomEntrepot, index) => (
                        <option key={index} value={nomEntrepot}>
                          {nomEntrepot}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* casier */}
                  <div>
                    <label className="font-semibold text-gray-700">
                      CASIER
                    </label>
                    <select
                      name="casier"
                      value={formDataSearcheMouvementENTREPOT.casier}
                      onChange={handleChangeSearcheMouvementENTREPOT}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OrigineListeMouvementStockENTREPOT.map(
                            (item) => item.nomCasier
                          )
                        ),
                      ].map((nomCasier, index) => (
                        <option key={index} value={nomCasier}>
                          {nomCasier}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700">
                      UTILISATEUR
                    </label>
                    <select
                      name="utilisateur"
                      value={formDataSearcheMouvementENTREPOT.utilisateur}
                      onChange={handleChangeSearcheMouvementENTREPOT}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OrigineListeMouvementStockENTREPOT.map(
                            (item) => item.name
                          )
                        ),
                      ].map((name, index) => (
                        <option key={index} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-700">
                      PRODUIT
                    </label>
                    <select
                      name="produit"
                      value={formDataSearcheMouvementENTREPOT.produit}
                      onChange={handleChangeSearcheMouvementENTREPOT}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OrigineListeMouvementStockENTREPOT.map(
                            (item) => item.nomProduit
                          )
                        ),
                      ].map((nomProduit, index) => (
                        <option key={index} value={nomProduit}>
                          {nomProduit}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ETAT */}
                  <div>
                    <label className="font-semibold text-gray-700">ETAT</label>
                    <select
                      name="etat"
                      value={formDataSearcheMouvementENTREPOT.etat}
                      onChange={handleChangeSearcheMouvementENTREPOT}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OrigineListeMouvementStock.map(
                            (item) => item.activation
                          )
                        ),
                      ].map((activation, index) => (
                        <option key={index} value={activation}>
                          {activation}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* FILTRER */}
                  <div className="flex flex-col">
                    <label className="text-white">-</label>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                      FILTRER
                    </button>
                  </div>

                  {/* RAFRAICHIR */}
                  <div className="flex flex-col">
                    <label className="text-white">-</label>
                    <button
                      type="button"
                      onClick={resetSearcheEntreprise}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                    >
                      RAFRAICHIR
                    </button>
                  </div>
                </form>
              </div>
              <div>
                {message && (
                  <div
                    className={` right-4 bg-green-300 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded text-lg shadow-md
      ${message?.type === "success" ? "bg-green-500 text-white" : ""}
      ${message?.type === "error" ? "bg-red-500 text-white" : ""}
      ${message?.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                  >
                    {message?.text}
                  </div>
                )}
              </div>
              <Box sx={{ height: "55vh", width: "160vh" }}>
                <DataGrid
                  rows={ListeMouvementStockENTREPOT}
                  columns={ColunneMouvementStockENTREPOT}
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
          {ActivationAffichage === "FicheENTREPOT" && donneEntrepotCreer && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6 grid grid-cols-1 text-2xl fond-bold">
              {message && (
                <div
                  className={`right-4 pt-6 pb-6 px-[20%] text-center m-8 rounded text-lg shadow-md 
        ${message?.type === "success" ? "bg-green-500 text-white" : ""}
        ${message?.type === "error" ? "bg-red-500 text-white" : ""}
        ${message?.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                >
                  {message?.text}
                </div>
              )}

              <div className="p-6 mb-6 grid grid-cols-1">
                <h1>NOM :</h1>
                <h1>{donneEntrepotCreer.nom}</h1>
              </div>

              <div className="p-6 mb-6 grid grid-cols-2 items-center">
                <div>
                  <h1>ETAT :</h1>
                  <h1>{donneEntrepotCreer.etat}</h1>
                </div>
                <div>
                  <h1>CASIER :</h1>
                  <h1>{donneEntrepotCreer.nomCasier}</h1>
                </div>
              </div>
              {/* <div>
                <label
                  htmlFor="zone"
                  className="font-semibold text-gray-700 text-sm block"
                >
                  PRODUIT
                </label>
                <select name="produit" className="...">
                  <option value="">...</option>
                  <option value="">tout produit</option>
                  {produits.map((item) => (
                    <option
                      key={item.idProduitFinal}
                      value={item.idProduitFinal}
                    >
                      {item.nomProduit}
                    </option>
                  ))}
                </select>
              </div> */}
              <div>
                <h1>STOCK TOTAL :</h1>
                <h1>{donneEntrepotCreer.totalGeneral}</h1>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 text-lg fond-bold">
                <button
                  onClick={() => {
                    handleSelectType("entrepotcree");
                    handleSelect("ModificationEntrepot", "entrepotcree");
                  }}
                  className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                >
                  MODIFIER
                </button>

                <button
                  onClick={() =>
                    etat_entrepot(
                      donneEntrepotCreer.id,
                      donneEntrepotCreer.etat
                    )
                  }
                  className={`${
                    donneEntrepotCreer.etat === "activer"
                      ? "px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      : "px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  }`}
                >
                  {donneEntrepotCreer.etat === "activer"
                    ? "DESACTIVER"
                    : "ACTIVER"}
                </button>

                <button
                  type="button"
                  onClick={() => suppression_entrepots(donneEntrepotCreer.id)}
                  className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                >
                  SUPPRIMER
                </button>
              </div>
            </div>
          )}

          {ActivationAffichage === "InsertionENTREPOT" && (
            <div className="bg-white p-6 rounded-lg shadow-md flex justify-center">
              <form className="items-center" onSubmit={ajouterEntrepot}>
                <br />
                <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                  CREATION
                </h1>
                {message && (
                  <div
                    className={` right-4 bg-green-300 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded text-lg shadow-md
      ${message?.type === "success" ? "bg-green-500 text-white" : ""}
      ${message?.type === "error" ? "bg-red-500 text-white" : ""}
      ${message?.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                  >
                    {message?.text}
                  </div>
                )}

                <br />
                <br />
                {/* Grid principale : 2 champs par ligne */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6  ">
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      NOM :
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formDatatout.nom}
                      riquered
                      onChange={handleChangetout}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-red-600">(*)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      CASIER :
                    </label>
                    <select
                      name="casier"
                      value={formDatatout.casier}
                      onChange={handleChangetout}
                      className="flex-1 px-4 py-2 border rounded-md"
                    >
                      <option value="">...</option>

                      {ListeC.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nomCasier}
                        </option>
                      ))}
                    </select>

                    <span className="text-red-600">(*)</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      ETAT :
                    </label>
                    <select
                      name="etat"
                      value={formDatatout.etat}
                      onChange={handleChangetout}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">...</option>
                      <option value="activer">activer</option>
                      <option value="desactiver">desactiver</option>
                    </select>
                    <span className="text-red-600">(*)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      ZONE :
                    </label>
                    <input
                      type="text"
                      riquered
                      name="zone"
                      value={formDatatout.zone}
                      onChange={handleChangetout}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-red-600">(*)</span>
                  </div>
                </div>

                {/* Boutons */}
                <br />
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                  {/* <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                  >
                    VALIDER
                  </button> */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full sm:w-auto text-white py-2 px-6 rounded-md transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? "En cours..." : "VALIDER"}
                  </button>

                  <button
                    type="button"
                    o
                    className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    ANNULER
                  </button>
                </div>

                <br />
                <br />
                <br />
              </form>
            </div>
          )}

          {ActivationAffichage === "ModificationEntrepot" && (
            <div className="bg-white p-6 rounded-lg shadow-md flex justify-center">
              <form className="items-center" onSubmit={modifeEntrepot}>
                <br />
                <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                  MODIFICATION
                </h1>

                <br />
                <br />
                {/* Grid principale : 2 champs par ligne */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6  ">
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      NOM :
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={donneEntrepotCreer.nom}
                      riquered
                      onChange={(e) =>
                        setdonneEntrepotCreer({
                          ...donneEntrepotCreer,
                          nom: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-red-600">(*)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      CASIER :
                    </label>
                    <select
                      name="casier"
                      value={donneEntrepotCreer.idCasier} // 🔥 on garde l'id en tant que valeur
                      onChange={(e) =>
                        setdonneEntrepotCreer({
                          ...donneEntrepotCreer,
                          idCasier: e.target.value, // 🔥 on stocke bien l'id (pas le nom)
                        })
                      }
                      required
                      className="flex-1 px-4 py-2 border rounded-md"
                    >
                      {ListeC.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nomCasier}
                        </option>
                      ))}
                    </select>

                    <span className="text-red-600">(*)</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      ETAT :
                    </label>
                    <select
                      name="etat"
                      value={donneEntrepotCreer.etat}
                      onChange={(e) =>
                        setdonneEntrepotCreer({
                          ...donneEntrepotCreer,
                          etat: e.target.value,
                        })
                      }
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="activer">activer</option>
                      <option value="desactiver">desactiver</option>
                    </select>
                    <span className="text-red-600">(*)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      ZONE :
                    </label>
                    <input
                      type="text"
                      riquered
                      name="zone"
                      value={donneEntrepotCreer.zone}
                      onChange={(e) =>
                        setdonneEntrepotCreer({
                          ...donneEntrepotCreer,
                          zone: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-red-600">(*)</span>
                  </div>
                </div>

                {/* Boutons */}
                <br />
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full sm:w-auto text-white py-2 px-6 rounded-md transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? "En cours..." : "VALIDER"}
                  </button>

                  <button
                    type="button"
                    o
                    className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    ANNULER
                  </button>
                </div>

                <br />
                <br />
                <br />
              </form>
            </div>
          )}

          {ActivationAffichage === "Insertioncasier" && (
            <div className="bg-white p-6 rounded-lg shadow-md flex justify-center">
              <form className="w-[60%] items-center" onSubmit={ajouterCasier}>
                <br />
                <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                  CREATION
                </h1>
                <br />
                <br />
                {/* Grid principale : 2 champs par ligne */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6  ">
                  {[
                    {
                      label: "NOM",
                      name: "nom",
                      type: "text",
                      required: true,
                    },
                  ].map((field) => (
                    <div key={field.name} className="flex items-center gap-4  ">
                      <label className=" font-medium text-gray-700 w-[20%]">
                        {field.label}:
                      </label>

                      <input
                        type={field.type}
                        name={field.name}
                        onChange={handleChange}
                        required={field.required || false}
                        value={formData[field.name]}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                      />
                      {field.required ? (
                        <span className="text-red-600"> (*)</span>
                      ) : (
                        <span className="text-white"> (*)</span>
                      )}
                    </div>
                  ))}
                  {/* { label: "ETAT",
                      name: "etat",
                      type: "text",
                      required: true,} */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      ETAT :
                    </label>
                    <select
                      name="etat"
                      value={formData.etat}
                      onChange={handleChange}
                      required
                      className="flex-1 px-4 py-2 border rounded-md"
                    >
                      <option value="">...</option>
                      <option value="activer">activer</option>
                      <option value="desactiver">desactiver</option>
                    </select>
                    <span className="text-red-600">(*)</span>
                  </div>
                </div>

                {/* Boutons */}
                <br />
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                  >
                    VALIDER
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    ANNULER
                  </button>
                </div>

                {error && <p className="text-red-600 text-center">{error}</p>}
                {/* {success && (
                  <p className="text-green-600 text-center">
                    Produit inséré avec succès ✅
                  </p>
                )} */}
                <br />
                <br />
                <br />
              </form>
            </div>
          )}
          {ActivationAffichage === "FicheCasier" && donneCasierCreer && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6 grid grid-cols-1 text-2xl fond-bold">
              {message && (
                <div
                  className={`right-4 pt-6 pb-6 px-[20%] text-center m-8 rounded text-lg shadow-md
      ${message.type === "success" ? "bg-green-500 text-white" : ""}
      ${message.type === "error" ? "bg-red-500 text-white" : ""}
      ${message.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                >
                  {message.text}
                </div>
              )}

              <div className="p-6 mb-6 grid grid-cols-1">
                <h1>NOM :</h1>
                <h1>{donneCasierCreer.nom}</h1>
              </div>
              <div className="p-6 mb-6 grid grid-cols-2 items-center">
                <div>
                  <h1>ETAT :</h1>
                  <h1>{donneCasierCreer.etat}</h1>
                </div>
                <div>
                  <h1>ENTREPOT :</h1>
                  <h1>{donneCasierCreer.entrepot}</h1>
                </div>
              </div>
              <div>
                <h1>STOCK TOTAL :</h1>
                <h1>{donneCasierCreer.totalGeneral}</h1>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 text-lg font-bold">
                {/* Modifier */}
                <button
                  onClick={() => {
                    handleSelectType("casiercree");
                    handleSelect("ModifeCasier", "casiercree");
                  }}
                  className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                >
                  MODIFIER
                </button>

                {/* Activer / Désactiver */}
                <button
                  onClick={() =>
                    etat_casier(donneCasierCreer.id, donneCasierCreer.etat)
                  }
                  className={`w-full sm:w-auto py-2 px-6 rounded-md text-white transition ${
                    donneCasierCreer.etat === "activer"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {donneCasierCreer.etat === "activer"
                    ? "DESACTIVER"
                    : "ACTIVER"}
                </button>

                {/* Supprimer */}
                <button
                  type="button"
                  onClick={() => suppression_casier(donneCasierCreer.id)}
                  className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                >
                  SUPPRIMER
                </button>
              </div>
            </div>
          )}

          {ActivationAffichage === "ModifeCasier" && (
            <div className="bg-white p-6 rounded-lg shadow-md flex justify-center">
              <form className="items-center" onSubmit={modifecasier}>
                <br />
                <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                  MODIFICATION
                </h1>

                <br />
                <br />
                {/* Grid principale : 2 champs par ligne */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6  ">
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      NOM :
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={donneCasierCreer.nom}
                      riquered
                      onChange={(e) =>
                        setdonneCasierCreer({
                          ...donneCasierCreer,
                          nom: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-red-600">(*)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      ETAT :
                    </label>
                    {/* <input
                      type="text"
                      name="etat"
                      value={donneCasierCreer.etat}
                      riquered
                      onChange={(e) =>
                        setdonneCasierCreer({
                          ...donneCasierCreer,
                          etat: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    /> */}

                    <select
                      name="etat"
                      value={donneCasierCreer.etat}
                      onChange={(e) =>
                        setdonneCasierCreer({
                          ...donneCasierCreer,
                          etat: e.target.value,
                        })
                      }
                      required
                      className="flex-1 px-4 py-2 border rounded-md"
                    >
                      <option value="activer">activer</option>
                      <option value="desactiver">desactiver</option>
                    </select>

                    <span className="text-red-600">(*)</span>
                  </div>
                </div>

                {/* Boutons */}
                <br />
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full sm:w-auto text-white py-2 px-6 rounded-md transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? "En cours..." : "VALIDER"}
                  </button>

                  <button
                    type="button"
                    o
                    className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    ANNULER
                  </button>
                </div>

                <br />
                <br />
                <br />
              </form>
            </div>
          )}
          {ActivationAffichage === "MOUVEMENT DE STOCK" && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                {/* Titre à gauche */}
                <h1 className="text-xl font-bold text-gray-800"></h1>

                {/* Formulaire à droite */}
                <form
                  className="grid grid-cols-6 gap-4 items-end"
                  onSubmit={handleSearcheSubmitMouvementStock}
                >
                  {[
                    { label: "ENTREPOT", name: "entrepot", type: "text" },
                    { label: "UTILISATEUR", name: "utilisateur", type: "text" },
                    { label: "PRODUIT", name: "produit", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label className="font-semibold text-gray-700">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formDataSearcheMouvement[name]}
                        onChange={handleChangeSearcheMouvement}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}

                  {/* ETAT */}
                  <div>
                    <label className="font-semibold text-gray-700">ETAT</label>
                    <select
                      name="etat"
                      value={formDataSearcheMouvement.etat}
                      onChange={handleChangeSearcheMouvement}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OrigineListeMouvementStock.map(
                            (item) => item.activation
                          )
                        ),
                      ].map((activation, index) => (
                        <option key={index} value={activation}>
                          {activation}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* FILTRER */}
                  <div className="flex flex-col">
                    <label className="text-white">-</label>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                      FILTRER
                    </button>
                  </div>

                  {/* RAFRAICHIR */}
                  <div className="flex flex-col">
                    <label className="text-white">-</label>
                    <button
                      type="button"
                      onClick={resetSearch}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                    >
                      RAFRAICHIR
                    </button>
                  </div>
                </form>
              </div>
              <div>
                {message && (
                  <div
                    className={` right-4 bg-green-300 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded text-lg shadow-md
      ${message?.type === "success" ? "bg-green-500 text-white" : ""}
      ${message?.type === "error" ? "bg-red-500 text-white" : ""}
      ${message?.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                  >
                    {message?.text}
                  </div>
                )}
              </div>
              <Box sx={{ height: "55vh" }}>
                <DataGrid
                  rows={ListeMouvementStock}
                  columns={ColunneMouvementStock}
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
          {(ActivationAffichage === "CASIER" ||
            ActivationAffichage === "Listecasier") && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between  ">
                {/* Titre à gauche */}
                <h1 className="text-xl font-bold text-gray-800"></h1>

                {/* Formulaire à droite */}
                <form
                  // onSubmit={handleSearcheSubmit}
                  className="flex gap-4 items-center"
                >
                  {/* Zone */}
                  <div>
                    <label
                      htmlFor="zone"
                      className="font-semibold text-gray-700 text-sm block"
                    >
                      ZONE
                    </label>
                    <input
                      name="zone"
                      type="text"
                      className=" px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="zone"
                      className="font-semibold text-gray-700 text-sm block"
                    >
                      ZONE
                    </label>
                    <input
                      name="zone"
                      type="text"
                      className=" px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zone"
                      className="font-semibold text-gray-700 text-sm block"
                    >
                      ZONE
                    </label>
                    <input
                      name="zone"
                      type="text"
                      className=" px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label
                      htmlFor="categorie"
                      className="font-semibold text-gray-700 text-sm block"
                    >
                      CATÉGORIE
                    </label>
                    <select
                      id="categorie"
                      name="categorie"
                      className=" px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Choisir --</option>
                      {[
                        ...new Set(OriginalListe.map((item) => item.categorie)),
                      ].map((categorie, index) => (
                        <option key={`categorie-${index}`} value={categorie}>
                          {categorie}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Boutons */}
                  <div className="flex gap-2 mt-5">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
                    >
                      FILTRER
                    </button>
                    <button
                      type="button"
                      // onClick={handleRefresh}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600 transition"
                    >
                      RAFRAÎCHIR
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
              <Box sx={{ height: "58vh" }}>
                <DataGrid
                  rows={ListeC}
                  columns={ColunneC}
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

          {ActivationAffichage === "HISTORIQUE DE TRANSFERT" && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6 ">
              <div className="flex  items-center  justify-end">
                <form
                  className="grid grid-cols-6 gap-4 items-end"
                  onSubmit={handleSearcheSubmitansfertHistorique}
                >
                  {[
                    { label: "ENTREPOT", name: "entrepot", type: "text" },
                    { label: "UTILISATEUR", name: "utilisateur", type: "text" },
                    { label: "PRODUIT", name: "produit", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label className="font-semibold text-gray-700">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formDataSearcheMouvement[name]}
                        onChange={handleChangeSearcheMouvement}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}

                  {/* ETAT */}
                  <div>
                    <label className="font-semibold text-gray-700">ETAT</label>
                    <select
                      name="etat"
                      value={formDataSearcheMouvement.etat}
                      onChange={handleChangeSearcheMouvement}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value=""> </option>
                      {[
                        ...new Set(
                          OriginalListehistorique.map((item) => item.activation)
                        ),
                      ].map((activation, index) => (
                        <option key={index} value={activation}>
                          {activation}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* FILTRER */}
                  <div className="flex flex-col">
                    <label className="text-white">-</label>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                    >
                      FILTRER
                    </button>
                  </div>

                  {/* RAFRAICHIR */}
                  <div className="flex flex-col">
                    <label className="text-white">-</label>
                    <button
                      type="button"
                      onClick={resetSearch}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                    >
                      RAFRAICHIR
                    </button>
                  </div>
                </form>
              </div>
              <div>
                {message && (
                  <div
                    className={` right-4 bg-green-300 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded text-lg shadow-md
      ${message?.type === "success" ? "bg-green-500 text-white" : ""}
      ${message?.type === "error" ? "bg-red-500 text-white" : ""}
      ${message?.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                  >
                    {message?.text}
                  </div>
                )}
              </div>
              <Box sx={{ height: "55vh" }}>
                <DataGrid
                  rows={ListeHistoriqueTransfert}
                  columns={ColunneHistoriqueTransfert}
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

          {(ActivationAffichage === "ENTREPOT" ||
            ActivationAffichage === "FicheENTREPOTf") && (
            <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
              <div className="flex  items-center justify-end ">
                <form
                  // onSubmit={handleSearcheSubmit}
                  className="grid grid-cols-1 gap-4 items-center"
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
                      // value={formDataSearche.colonnes}
                      // onChange={handleChangeSearche}
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
                      name="nomProduit"
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
                      // value={formDataSearche.categorie}
                      // onChange={handleChangeSearche}
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
                      // value={formDataSearche.entrepot}
                      // onChange={handleChangeSearche}
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
                      // value={formDataSearche.casier}
                      // onChange={handleChangeSearche}
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
                      // onClick={handleRefresh}
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
                    className={` right-4 bg-green-300 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded text-lg shadow-md
      ${message?.type === "success" ? "bg-green-500 text-white" : ""}
      ${message?.type === "error" ? "bg-red-500 text-white" : ""}
      ${message?.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                  >
                    {message?.text}
                  </div>
                )}
              </div>
              {/* <Box sx={{ height: "55vh" }}>
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
              </Box> */}
            </div>
          )}

          {ActivationAffichage === "HISTORIQUE" && (
            <div className="">
              {/* <div>
                {[
                  "CASIER",
                  "MOUVEMENT DE STOCK",
                  "HISTORIQUE DE TRANSFERT",
                ].map((item) => (
                  <button
                    key={item}
                    className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10 ${
                      condition_navbar === item ? "border-b-blue-500" : ""
                    }`}
                    onClick={() => {
                      handleSelectType("casier");
                      handleSelect(item, item);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div> */}
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
