import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export function Acceuil() {
  const navigate = useNavigate();
  const produits = [
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
    {
      id: 4,
      image: "/image/moto.jfif",
      nom: "Moto Yamaha",
      description: "Moto 125cc en bon état",
      zone: "Mahajanga",
    },
    {
      id: 5,
      image: "/image/vetement.jfif",
      nom: "Chemise Homme",
      description: "Chemise coton slim fit",
      zone: "Antsirabe",
    },
    {
      id: 6,
      image: "/image/cousine.jfif",
      nom: "Mixeur Moulinex",
      description: "Mixeur 3 vitesses, 500W",
      zone: "Tamatave",
    },
    {
      id: 7,
      image: "/image/telephone.jfif",
      nom: "iPhone 13",
      description: "128Go, état neuf",
      zone: "Antananarivo",
    },
    {
      id: 8,
      image: "/image/lait).jfif",
      nom: "Fromage Président",
      description: "Pack de 12 portions",
      zone: "Diego Suarez",
    },
    {
      id: 9,
      image: "/image/fleur.jfif",
      nom: "Orchidée Blanche",
      description: "Plante vivante en pot",
      zone: "Antsirabe",
    },
    {
      id: 10,
      image: "/image/moto.jfif",
      nom: "Scooter Honda",
      description: "Scooter 50cc, faible consommation",
      zone: "Mahajanga",
    },
    {
      id: 11,
      image: "/image/vetement.jfif",
      nom: "Robe de soirée",
      description: "Robe élégante pour femmes",
      zone: "Antananarivo",
    },
    {
      id: 12,
      image: "/image/cousine.jfif",
      nom: "Four Micro-ondes",
      description: "20L, fonction grill",
      zone: "Tamatave",
    },
    {
      id: 13,
      image: "/image/telephone.jfif",
      nom: "Téléphone Oppo",
      description: "Caméra 48MP, 64Go",
      zone: "Antsirabe",
    },
    {
      id: 14,
      image: "/image/lait).jfif",
      nom: "Yaourt Nature",
      description: "Lot de 6 yaourts frais",
      zone: "Toliara",
    },
    {
      id: 15,
      image: "/image/fleur.jfif",
      nom: "Tulipes Jaunes",
      description: "Bouquet de 15 tiges",
      zone: "Fianarantsoa",
    },
    {
      id: 16,
      image: "/image/moto.jfif",
      nom: "Kawasaki Ninja",
      description: "600cc, sportif",
      zone: "Antananarivo",
    },
    {
      id: 17,
      image: "/image/vetement.jfif",
      nom: "Pantalon Jeans",
      description: "Jeans bleu slim",
      zone: "Mahajanga",
    },
    {
      id: 18,
      image: "/image/cousine.jfif",
      nom: "Casserole inox",
      description: "Casserole 24cm",
      zone: "Diego Suarez",
    },
    {
      id: 19,
      image: "/image/telephone.jfif",
      nom: "Huawei P40",
      description: "64Go, double SIM",
      zone: "Antananarivo",
    },
    {
      id: 20,
      image: "/image/lait).jfif",
      nom: "Beurre Président",
      description: "250g doux",
      zone: "Toamasina",
    },
    {
      id: 21,
      image: "/image/fleur.jfif",
      nom: "Marguerites",
      description: "Bouquet champêtre",
      zone: "Tamatave",
    },
    {
      id: 22,
      image: "/image/moto.jfif",
      nom: "Moto Suzuki",
      description: "250cc, parfait état",
      zone: "Antsirabe",
    },
  ];

  return (
    <div className="container-fluid mx-auto bg-gray-100">
      <div className="relative h-[70vh] w-full bg-gray-100 z-20">
        {/* Image de fond floue */}
        <div
          className="absolute top-0 left-0 h-full w-full"
          style={{
            backgroundImage:
              "url('/image/woman-shopping-legumes-au-supermarche.jpg')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "blur(2px)",
            zIndex: -2,
          }}
        ></div>

        {/* Overlay sombre */}
        <div className="absolute top-0 left-0 h-full w-full bg-black/50 z-[-1]"></div>

        {/* Contenu centré */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center gap-5 text-white">
          <h1 className="text-5xl font-bold drop-shadow-lg">Lorem Ipsum</h1>
          <h3 className="text-xl max-w-2xl leading-relaxed drop-shadow-lg">
            Le Lorem Ipsum est simplement du faux texte utilisé dans la
            composition et la mise en page avant impression.
          </h3>
          <button className="mt-4 px-6 py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-600 transition">
            VOIR LES PRODUITS
          </button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <h1 className="text-center text-3xl text-blue-500 font-bold mb-4">
        LES CATEGORIES
      </h1>
      <br />
      <br />

      <div
        className="grid grid-cols-4 gap-4 sm:grid-cols-2 md:grid-cols-3 gap-6 rounded  "
        style={{ paddingLeft: "20%", paddingRight: "20%" }}
      >
        <div>
          <div
            className="w-full bg-white rounded-xl p-1 mx-auto
              transition-transform duration-300 ease-in-out
              hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
          >
            <img
              src="/image/cousine.jfif"
              alt="Cuisine"
              className="rounded-lg h-[27vh] w-full object-cover" // fix height
            />
            <div></div>
            <p className="mt-3 text-black font-bold">
              Lorem Ipsum is placeholder text
            </p>

            <div className="mt-2 flex items-center gap-[12vh]">
              <p className="font-medium text-yellow-500 truncate max-w-[60%]">
                #commodo
              </p>
              <a
                className="px-4 py-1 bg-blue-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300 whitespace-nowrap"
                href="#"
              >
                Details
              </a>
            </div>
          </div>
        </div>

        <div>
          <div
            className="w-full bg-white rounded-xl p-1 mx-auto
              transition-transform duration-300 ease-in-out
              hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
          >
            <img
              src="/image/phone.jfif"
              alt="Cuisine"
              className="rounded-lg h-[27vh] w-full object-cover" // fix height
            />
            <div></div>
            <p className="mt-3 text-black font-bold">
              Lorem Ipsum is placeholder text
            </p>

            <div className="mt-2 flex items-center gap-[12vh]">
              <p className="font-medium text-yellow-500 truncate max-w-[60%]">
                #commodo
              </p>
              <a
                className="px-4 py-1 bg-blue-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300 whitespace-nowrap"
                href="#"
              >
                Details
              </a>
            </div>
          </div>
        </div>

        <div>
          <div
            className="w-full bg-white rounded-xl p-1 mx-auto
              transition-transform duration-300 ease-in-out
              hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
          >
            <img
              src="/image/lait).jfif"
              alt="Cuisine"
              className="rounded-lg h-[27vh] w-full object-cover" // fix height
            />
            <div></div>
            <p className="mt-3 text-black font-bold">
              Lorem Ipsum is placeholder text
            </p>

            <div className="mt-2 flex items-center gap-[12vh]">
              <p className="font-medium text-yellow-500 truncate max-w-[60%]">
                #commodo
              </p>
              <a
                className="px-4 py-1 bg-blue-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300 whitespace-nowrap"
                href="#"
              >
                Details
              </a>
            </div>
          </div>
        </div>

        <div>
          <div
            className="w-full bg-white rounded-xl p-1 mx-auto
              transition-transform duration-300 ease-in-out
              hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
          >
            <img
              src="/image/fleur.jfif"
              alt="Cuisine"
              className="rounded-lg h-[27vh] w-full object-cover" // fix height
            />
            <div></div>
            <p className="mt-3 text-black font-bold">
              Lorem Ipsum is placeholder text
            </p>

            <div className="mt-2 flex items-center gap-[12vh]">
              <p className="font-medium text-yellow-500 truncate max-w-[60%]">
                #commodo
              </p>
              <a
                className="px-4 py-1 bg-blue-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300 whitespace-nowrap"
                href="#"
              >
                Details
              </a>
            </div>
          </div>
        </div>

        <div>
          <div
            className="w-full bg-white rounded-xl p-1 mx-auto
              transition-transform duration-300 ease-in-out
              hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
          >
            <img
              src="/image/vetement.jfif"
              alt="Cuisine"
              className="rounded-lg h-[27vh] w-full object-cover" // fix height
            />
            <div></div>
            <p className="mt-3 text-black font-bold">
              Lorem Ipsum is placeholder text
            </p>

            <div className="mt-2 flex items-center gap-[12vh]">
              <p className="font-medium text-yellow-500 truncate max-w-[60%]">
                #commodo
              </p>
              <a
                className="px-4 py-1 bg-blue-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300 whitespace-nowrap"
                href="#"
              >
                Details
              </a>
            </div>
          </div>
        </div>

        <div>
          <div
            className="w-full bg-white rounded-xl p-1 mx-auto
              transition-transform duration-300 ease-in-out
              hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
          >
            <img
              src="/image/moto.jfif"
              alt="Cuisine"
              className="rounded-lg h-[27vh] w-full object-cover" // fix height
            />
            <div></div>
            <p className="mt-3 text-black font-bold">
              Lorem Ipsum is placeholder text
            </p>

            <div className="mt-2 flex items-center gap-[12vh]">
              <p className="font-medium text-yellow-500 truncate max-w-[60%]">
                #commodo
              </p>
              <a
                className="px-4 py-1 bg-blue-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300 whitespace-nowrap"
                href="#"
              >
                Details
              </a>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <h1 className="text-center text-3xl text-blue-500 font-bold mb-4">
        PRODUITS DISPONIBLES
      </h1>

      <br />
      <br />
      <div className="w-[90%] overflow-x-auto ml-[5%]">
        <div className="max-h-[70vh] overflow-y-auto rounded-lg shadow-md">
          <table className="min-w-full  text-left table-auto bg-white rounded-lg shadow-md">
            <thead>
              <tr className=" bg-white z-20 border-b border-gray-300">
                <th className="py-3 px-4  sticky top-0 bg-white z-20 border-b border-gray-300 ">
                  IMAGE
                </th>
                <th className="py-3 px-4  sticky top-0 bg-white z-20">NOM</th>
                <th className="py-3 px-4  sticky top-0 bg-white z-20">
                  DESCRIPTION
                </th>
                <th className="py-3 px-4  sticky top-0 bg-white z-20">ZONE</th>
                <th className="py-3 px-4  sticky top-0 bg-white z-20">
                  CONTACT
                </th>
              </tr>
            </thead>
            <tbody>
              {produits.map((produit) => (
                <tr
                  key={produit.id}
                  className="bg-white  hover:bg-[#a2def6a1] transition-colors duration-200"
                >
                  <td className="py-2 px-4 border-b border-gray-300">
                    <img
                      src={produit.image}
                      alt={produit.nom}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-300">
                    {produit.nom}
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-300">
                    {produit.description}
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-300">
                    {produit.zone}
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-300">
                    <button
                      onClick={() => navigate("/message")}
                      className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                    >
                      <FiMail className="w-8 h-8 text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      <br />
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6   w-full max-w-sm mx-auto mt-6">
        <a
          className=" text-center flex-1 px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-300"
          href=""
          onClick={() => navigate("/login")}
        >
          CONNECTER
        </a>
        <a
          className=" text-center flex-1 px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300"
          href=""
          onClick={() => navigate("/cree")}
        >
          CREER COMPTE
        </a>
      </div>
      <br />
      <br />
      <br />
      <br />
      <div></div>
    </div>
  );
}
