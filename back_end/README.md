/// TECHNOLOGIE UTILISER

Backend : Laravel 10 mode API
Base de données : PostgreSQL version 9.4
Securisation des route :  Middleware
Frontend : ReactJS
API : Axios
Design et responsive: Tailwind CSS


/// COMMANDE A LANCER DANS LE TERMINAL DU BACK_END

cd back_end
composer install
composer require laravel/sanctumn 
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
composer require fruitcake/laravel-cors
php artisan storage:link
php artisan migrate:fresh --seed


/// CONFIGURATION DANS LE FICHIER .env DANS LE BACK_END 

DB_CONNECTION = pgsql
DB_HOST = 127.0.0.1
DB_PORT = 5432
DB_DATABAS = GestionProduit
DB_USERNAME = (non d'utilisateur sur le pgAdmin)
DB_PASSWORD = (votre mot de passe)


/// COMMANDE A LANCER DANS LE TERMINAL DU FRONT_END

cd frontend
npm install
npm install axios
npm install ag-grid-react
npm install @mui/x-charts
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/x-data-grid
npm install @mui/x-data-grid-generator


/// LANCEMENT DE PROJET 

/// BACK_END
cd back_end 
php artisan serve 

///FRONT_END
cd front_end 
npm run dev


/// LOGIN 
