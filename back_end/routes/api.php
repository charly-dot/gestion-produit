<?php

use App\Models\Article;
use App\Models\Articleservice;
use App\Models\Categori;
use App\Models\Categorie;
use App\Models\Groupe;
use App\Models\Produit;
use App\Models\Stock;
use App\Models\Tier;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

///////2em gestion de categori article et service tiers
///////2em gestion de categori article et service tiers
///////2em gestion de categori article et service tiers

////Stock dans le produit
Route::get('/liste_Stock', function () {
    $user = DB::table('stocks')
        ->join('produits', DB::raw('CAST(stocks."idProduit" AS bigint)'), '=', 'produits.id')
        ->select(
            'stocks.id',
            'stocks.entrepot',
            'stocks.casier',
            'stocks.colonne',
            'stocks.idProduit',
            'produits.nomProduit',
            'produits.stock_initia',
            'produits.prix'
        )
        ->get();

    return response()->json($user);
});
Route::post('/creationStock', function (Request $request) {

    $produit = Produit::findOrFail($request->idProduit);

    $stockExistant = Stock::where('idProduit', $produit->id)->first();
    if ($stockExistant) {
        return response()->json([
            'message' => "❌ Ce produit est déjà placé dans un entrepôt.",
            'data'    => $stockExistant
        ], 400); // Code 400 = bad request
    }

    $Stock = Stock::create([
        'nomProduit' => $produit->nomProduit,
        'idProduit'  => $produit->id,
        'entrepot'   => $request->entrepot,
        'casier'     => $request->casier,
        'colonne'    => "vide",
        'colonnes'   => "vide",
    ]);
    return response()->json([
        'message' => 'Super utilisateur créé avec succès',
        'data'    => $Stock
    ]);
});
Route::put('/modifier_Stock/{id}/{idS}', function (Request $request, $id, $idS) {

    try {
        $produit = Produit::findOrFail($id);
        $produit->stock_initia = $request->input('stock');
        $produit->save();

        $STOCK = Stock::findOrFail($idS);
        $STOCK->casier = $request->input('stock');
        $STOCK->entrepot = $request->input('entrepot');
        $STOCK->save();
        return response()->json([
            'message' => 'Produit modifié avec succès ✅',
            'data'    => $produit
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la modification',
            'error'   => $e->getMessage()
        ], 500);
    }
});
///////// categorie
Route::get('/liste_categori', function () {
    $user = \App\Models\Categori::all();

    if ($user->isEmpty()) {
        return response()->json(['message' => 'Aucun utilisateur trouvé'], 404);
    }

    return response()->json($user);
});
Route::patch('/changer_activationcategori/{id}', function ($id, Request $request) {
    $categorie = Categori::find($id);
    if (!$categorie) return response()->json(['message' => 'Catégorie non trouvée'], 404);

    $categorie->etat = $request->activation === "activer" ? "activer" : "desactiver";
    $categorie->save();

    return response()->json([
        'message' => "Catégorie " . $request->activation,
        'activation' => $categorie->etat
    ]);
});
Route::post('/creationCategori', function (Request $request) {
    $filePath = null;
    if ($request->hasFile('fichier')) {
        $filePath = $request->file('fichier')->store('categorie', 'public');
    }

    $categorie = Categori::create([
        'nom'         => $request->nom,
        'type'        => $request->type,
        'visibiliter' => $request->visibiliter,
        'fichier'     => $filePath,
        'etat'     => $request->etat,
        'colonne'     => false,
        'colonnes'    => false,
    ]);
    return response()->json([
        'message' => 'Super utilisateur créé avec succès',
        'data'    => $categorie
    ]);
});
Route::delete('/supprimer_scategori/{id}', function ($id) {
    $user = Categorie::find($id);
    if (!$user) return response()->json(['message' => 'categorie non trouvé'], 404);

    $user->delete();
    return response()->json(['message' => 'Categorie supprimé avec succès']);
});
Route::put('/modifier_categori/{id}', function (Request $request, $id) {
    $categorie = Categori::find($id);

    if (!$categorie) {
        return response()->json(['message' => 'Catégorie introuvable'], 404);
    }

    // Mise à jour des champs
    $categorie->nom = $request->nom;
    $categorie->type = $request->type;
    $categorie->visibiliter = $request->visibiliter;
    $categorie->etat = $request->etat ?? $categorie->etat; // éviter null si non envoyé
    $categorie->colonne = " ";
    $categorie->colonnes = " ";
    // Gestion fichier
    if ($request->hasFile('fichier')) {
        $file = $request->file('fichier');
        $filename = time() . '_' . $file->getClientOriginalName();
        $file->move(public_path('uploads/categorie'), $filename);
        $categorie->fichier = $filename;
    }

    $categorie->save();

    return response()->json([
        'message' => 'Catégorie modifiée avec succès ✅',
        'data' => $categorie
    ]);
});







Route::put('/modifier_Stock/{id}/{idS}', function (Request $request, $id, $idS) {
    try {
        // Validation minimale


        $produit = Produit::findOrFail($id);
        $STOCK = Stock::findOrFail($idS);

        // Mise à jour
        $produit->stock_initia = $request->stock;
        $produit->save();

        $STOCK->casier = $request->casier;
        $STOCK->entrepot = $request->entrepot;
        $STOCK->save();

        return response()->json([
            'message' => 'Produit modifié avec succès ✅',
            'data'    => $produit
        ], 200);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'message' => 'Validation échouée',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la modification',
            'error'   => $e->getMessage()
        ], 500);
    }
});




///ArticleService
Route::get('/liste_ArticleService', function () {
    $produit = Produit::all();

    if ($produit->isEmpty()) {
        return response()->json(['message' => 'Aucun produit trouvé'], 404);
    }
    return response()->json($produit);
});
Route::post('/creationArticleService', function (Request $request) {
    try {
        $profilPath = null;
        if ($request->hasFile('fichier')) {
            $profilPath = $request->file('fichier')->store('fichierProduit', 'public');
        }
        $produit = Produit::create([
            'nomProduit'      => $request->nomProduit,
            'prix'            => $request->prix,
            'zone'            => $request->zone,
            'fichier'         => $profilPath,
            'type_categorie'  => $request->type_categorie,
            'categorie'       => $request->categorie,
            'code_compta'     => $request->code_compta ?? "",
            'stock_minimum'   => $request->stock_minimum ?? "",
            'date_peremption' => $request->date_peremption ?? "",
            'stock_initia'    => $request->stock_initia ?? " ", // ✅ valeur par défaut
            'colonne'         => 'activer',
            'colonnes'        => "SERVICE",
        ]);


        return response()->json([
            'message' => 'Produit inséré avec succès',
            'data'    => $produit
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de l’insertion',
            'error'   => $e->getMessage()
        ], 500);
    }
});
Route::patch('/changer_activation_ArticleService/{id}', function ($id, Request $request) {
    $produit = Produit::find($id);
    if (!$produit) {
        return response()->json(['message' => 'Produit non trouvé'], 404);
    }

    $newEtat = $request->activation === "activer" ? "activer" : "desactiver";
    $produit->colonne = $newEtat;
    $produit->save();

    return response()->json([
        'message' => "Produit mis à jour : {$newEtat} ✅",
        'activation' => $produit->colonne
    ]);
});
Route::put('/modifier_ArticleService/{id}', function (Request $request, $id) {

    try {
        $produit = Produit::findOrFail($id);
        $produit->nomProduit     = $request->input('nomProduit');
        $produit->prix            = $request->input('prix');
        $produit->zone            = $request->input('zone');
        $produit->code_compta     = $request->input('code_compta');
        $produit->stock_minimum   = $request->input('stock_minimum');
        $produit->categorie       = $request->input('categorie');
        $produit->type_categorie  = $request->input('type_categorie');
        $produit->date_peremption = $request->input('date_peremption');
        // Gestion du fichier uploadé
        if ($request->hasFile('fichier')) {
            // Supprimer l'ancienne image si elle existe
            if ($produit->fichier && Storage::disk('public')->exists($produit->fichier)) {
                Storage::disk('public')->delete($produit->fichier);
            }

            // Stocker le nouveau fichier dans 'fichierProduit' du disque public
            $profilPath = $request->file('fichier')->store('fichierProduit', 'public');
            $produit->fichier = $profilPath;
        }
        $produit->save();

        return response()->json([
            'message' => 'Produit modifié avec succès ✅',
            'data'    => $produit
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la modification ❌',
            'error'   => $e->getMessage()
        ], 500);
    }
});

///produit
Route::get('/liste_Produit', function () {
    // $Produit = \App\Models\Produit::all();
    $Produit = DB::table('produits')
        ->leftJoin('stocks', DB::raw('CAST(stocks."idProduit" AS bigint)'), '=', 'produits.id')
        ->select(
            'produits.id',
            'produits.nomProduit',
            'produits.type_categorie',
            'produits.categorie',
            'produits.prix',
            'produits.stock_initia',
            'produits.stock_minimum',
            'produits.zone',
            'produits.code_compta',
            'produits.colonne',
            'produits.date_peremption',
            'produits.colonnes',

            // Concaténer tous les entrepôts d’un même produit
            DB::raw("STRING_AGG(stocks.entrepot::text, ', ') as entrepot"),
            DB::raw("STRING_AGG(stocks.casier::text, ', ') as casier"),
            DB::raw("STRING_AGG(stocks.colonne::text, ', ') as colonnes_stock"),

            // Nombre de colonnes similaires
            DB::raw('COALESCE(COUNT(stocks.colonne), 0) as total_meme_colonne')
        )
        ->groupBy(
            'produits.id',
            'produits.nomProduit',
            'produits.type_categorie',
            'produits.categorie',
            'produits.prix',
            'produits.stock_initia',
            'produits.stock_minimum',
            'produits.date_peremption',
            'produits.colonnes',
            'produits.zone',
            'produits.code_compta',
            'produits.colonne',
        )
        ->get();

    // $Produit = DB::table('stocks')
    //     ->join('produits', DB::raw('CAST(stocks."idProduit" AS bigint)'), '=', 'produits.id')
    //     ->select(
    //         'stocks.id',
    //         'stocks.entrepot',
    //         'stocks.casier',
    //         // 'stocks.colonnes',
    //         'stocks.idProduit',
    //         'produits.colonnes',
    //         'produits.nomProduit',
    //         'produits.type_categorie',
    //         'produits.categorie',
    //         'produits.prix',
    //         'produits.stock_initia',
    //         'produits.date_peremption',
    //         DB::raw('(SELECT COUNT(*) FROM stocks s WHERE s.colonne = stocks.colonne) as total_meme_colonne')
    //     )
    //     ->get();
    if ($Produit->isEmpty()) {
        return response()->json(['message' => 'Aucun utilisateur trouvé'], 404);
    }
    return response()->json($Produit);
});
Route::post('/creationProduit', function (Request $request) {
    try {
        $profilPath = null;
        if ($request->hasFile('fichier')) {
            $profilPath = $request->file('fichier')->store('fichierProduit', 'public');
        }

        $produit = Produit::create([
            'nomProduit'      => $request->nomProduit,
            'prix'            => $request->prix,
            'stock_initia'    => $request->stock_initia,
            'zone'            => $request->zone,
            'fichier'         => $profilPath,
            'type_categorie'  => $request->type_categorie,
            'categorie'       => $request->categorie,
            'code_compta'     => $request->code_compta ?? "",
            'stock_minimum'   => $request->stock_minimum ?? "",
            'date_peremption' => $request->date_peremption ?? "",
            'colonne'         => 'activer',
            'colonnes'        => "PRODUIT",
        ]);

        return response()->json([
            'message' => 'Produit inséré avec succès',
            'data'    => $produit
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de l’insertion',
            'error'   => $e->getMessage()
        ], 500);
    }
});
Route::patch('/changer_activation_PRODUIT/{id}', function ($id, Request $request) {
    $produit = \App\Models\Produit::find($id);
    if (!$produit) {
        return response()->json(['message' => 'Produit non trouvé'], 404);
    }

    $newEtat = $request->activation === "activer" ? "activer" : "desactiver";
    $produit->colonne = $newEtat;
    $produit->save();

    return response()->json([
        'message' => "Produit mis à jour : {$newEtat} ✅",
        'activation' => $produit->colonne
    ]);
});
Route::put('/modifier_PRODUIT/{id}', function (Request $request, $id) {

    try {
        $produit = Produit::findOrFail($id);

        // Mettre à jour les champs
        $produit->nomProduit      = $request->input('nomProduit') ?? " ";
        $produit->prix            = $request->input('prix') ?? " ";
        $produit->stock_initia    = $request->input('stock_initia') ?? " ";
        $produit->zone            = $request->input('zone') ?? " ";
        $produit->code_compta     = $request->input('code_compta') ?? " ";
        $produit->stock_minimum   = $request->input('stock_minimum') ?? " ";
        $produit->categorie       = $request->input('categorie') ?? " ";
        $produit->type_categorie  = $request->input('type_categorie') ?? " ";
        $produit->date_peremption = $request->input('date_peremption') ?? " ";

        // Gestion du fichier uploadé
        if ($request->hasFile('fichier')) {
            // Supprimer l'ancienne image si elle existe
            if ($produit->fichier && Storage::disk('public')->exists($produit->fichier)) {
                Storage::disk('public')->delete($produit->fichier ?? " ");
            }

            // Stocker le nouveau fichier dans 'fichierProduit' du disque public
            $profilPath = $request->file('fichier')->store('fichierProduit', 'public');
            $produit->fichier = $profilPath;
        }
        $produit->save();
        return response()->json([
            'message' => 'Produit modifié avec succès ✅',
            'data'    => $produit
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la modification ❌',
            'error'   => $e->getMessage()
        ], 500);
    }
});

//// TIERS
Route::get('/liste_TIERS', function () {
    $tiers = \App\Models\Tier::all();

    if ($tiers->isEmpty()) {
        return response()->json(['message' => 'Aucun utilisateur trouvé'], 404);
    }

    return response()->json($tiers);
});
Route::post('/creationTiers', function (Request $request) {
    try {
        $Tiers = Tier::create([
            'nomTier'    => $request->nomTier,
            'zone'       => $request->zone,
            'type'       => $request->type,
            'motDePasse' => $request->type === "Livreur" && !empty($request->motDePasse)
                ? $request->motDePasse
                : " ",


            'email'      => $request->email ?? "",
            'contact'    => $request->contact ?? "",
            'nif'        => $request->nif ?? "",
            'stat'       => $request->stat ?? "",
            'rcs'        => $request->rcs ?? "",
            'commercial' => $request->commercial ?? "",
            'colonne'    => 'activer',
            'colonnes'   => false,
        ]);


        return response()->json([
            'message' => 'Tiers inséré avec succès',
            'data'    => $Tiers
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de l’insertion',
            'error'   => $e->getMessage()
        ], 500);
    }
});
Route::delete('/supprimer_tier/{id}', function ($id) {
    $tier = Tier::find($id);
    if (!$tier) {
        return response()->json(['message' => 'Tier non trouvé'], 404);
    }

    $tier->delete();
    return response()->json(['message' => 'Tier supprimé avec succès ✅']);
});
Route::patch('/changer_activation_tier/{id}', function ($id, Request $request) {
    $tier = Tier::find($id);
    if (!$tier) {
        return response()->json(['message' => 'Tier non trouvé'], 404);
    }

    // Mettre à jour la colonne "colonne" qui sert pour l'état
    $newEtat = $request->activation === "activer" ? "activer" : "desactiver";
    $tier->colonne = $newEtat;
    $tier->save();

    return response()->json([
        'message' => "Tier mis à jour : {$newEtat} ✅",
        'activation' => $tier->colonne  // <-- renvoyer la bonne colonne
    ]);
});
Route::put('/modifier_tier/{id}', function ($id, Request $request) {
    $tier = Tier::find($id);
    if (!$tier) return response()->json(['message' => 'Tier non trouvé'], 404);

    $tier->nomTier    = $request->nomTier;
    $tier->zone       = $request->zone;
    $tier->type       = $request->type;
    $tier->email      = $request->email ?? "";
    $tier->nif        = $request->nif ?? "";
    $tier->stat       = $request->stat ?? "";
    $tier->rcs        = $request->rcs ?? "";
    if ($request->motDePasse) $tier->motDePasse = bcrypt($request->motDePasse);
    $tier->motDePasse = $request->motDePasse;
    $tier->contact    = $request->contact ?? "";
    $tier->commercial = $request->commercial ?? "";

    $tier->save();

    return response()->json($tier);
});
///////2em gestion de categori article et service tiers
///////2em gestion de categori article et service tiers
///////2em gestion de categori article et service tiers

///////1em gestion de fournisseur ET CATEGORIE
///////1em gestion de fournisseur ET CATEGORIE
///////1em gestion de fournisseur ET CATEGORIE
///////// categorie
Route::post('/creationCategorie', function (Request $request) {
    $user = Categorie::create([
        'nom'     => $request->nom,
        'etat'    => "activer",
        'type'    => $request->type, // attention à la casse !
        'colonne' => false,
        'colonnes' => false,
    ]);

    return response()->json([
        'message' => 'Super utilisateur créé avec succès',
        'data'    => $user
    ]);
});
Route::delete('/supprimer_scategorie/{id}', function ($id) {
    $user = Categorie::find($id);
    if (!$user) return response()->json(['message' => 'categorie non trouvé'], 404);

    $user->delete();
    return response()->json(['message' => 'Categorie supprimé avec succès']);
});
Route::post('/modifier_categorie/{id}', function ($id, Request $request) {
    $Categorie = Categorie::find($id);
    if (!$Categorie) return response()->json(['message' => 'categorie non trouvé'], 404);
    $Categorie->nom = $request->nom;
    $Categorie->type = $request->type;
    $Categorie->etat = $request->etat;
    $Categorie->colonne =  false;
    $Categorie->colonnes = false;
    $Categorie->save();
    return response()->json($Categorie);
});
Route::get('/liste_utilisateurC', function () {
    $user = \App\Models\Categorie::all();

    if ($user->isEmpty()) {
        return response()->json(['message' => 'Aucun utilisateur trouvé'], 404);
    }

    return response()->json($user);
});
Route::patch('/changer_activationCategorie/{id}', function ($id, Request $request) {
    $categorie = Categorie::find($id);
    if (!$categorie) return response()->json(['message' => 'Catégorie non trouvée'], 404);

    $categorie->etat = $request->activation === "activer" ? "activer" : "desactiver";
    $categorie->save();

    return response()->json([
        'message' => "Catégorie " . $request->activation,
        'activation' => $categorie->etat
    ]);
});


/// groupe
Route::get('/liste_Groupe', function () {
    $user = \App\Models\Groupe::all();

    if ($user->isEmpty()) {
        return response()->json(['message' => 'Aucun utilisateur trouvé'], 404);
    }

    return response()->json($user);
});
Route::post('/creationG', function (Request $request) {
    $user = Groupe::create([
        'nomGroupe' => $request->nomGroupe,
        'etat'      => "activer",
        'type'      => $request->type,
        'colonne'   => false,
        'colonnes'  => false,
    ]);

    return response()->json([
        'message' => 'Super Groupe créé avec succès',
        'data'    => $user
    ]);
});
Route::patch('/changer_activationGroupe/{id}', function ($id, Request $request) {
    $categorie = Groupe::find($id);
    if (!$categorie) return response()->json(['message' => 'Catégorie non trouvée'], 404);

    $categorie->etat = $request->activation === "activer" ? "activer" : "desactiver";
    $categorie->save();

    return response()->json([
        'message' => "Catégorie " . $request->activation,
        'activation' => $categorie->etat
    ]);
});
Route::delete('/supprimer_Groupe/{id}', function ($id) {
    $user = Groupe::find($id);
    if (!$user) return response()->json(['message' => 'categorie non trouvé'], 404);

    $user->delete();
    return response()->json(['message' => 'Categorie supprimé avec succès']);
});
Route::post('/modifier_Groupe/{id}', function ($id, Request $request) {
    $groupe = Groupe::find($id);
    if (!$groupe) return response()->json(['message' => 'Goupe non trouvé'], 404);
    $groupe->nomGroupe = $request->nom;
    $groupe->type = $request->type;
    $groupe->etat = $request->etat;
    $groupe->colonne =  false;
    $groupe->colonnes = false;
    $groupe->save();
    return response()->json($groupe);
});

///login
Route::post('/login', function (Request $request) {
    if (!$request->has(['email', 'password'])) {
        return response()->json(['message' => 'Champs manquants'], 400);
    }
    $user = Utilisateur::where('email', $request->email)
        ->orWhere('nom', $request->email)
        ->first();

    if (!$user || $user->motDePasse !== $request->password) {
        return response()->json(['message' => 'Identifiants invalides'], 401);
    }
    $token = $user->createToken('authToken')->plainTextToken;
    return response()->json([
        'token' => $token,
        'user' => $user
    ]);
});
Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

/// Utilisateur

Route::get('/liste_utilisateur/{id}', function ($id) {
    $user = Utilisateur::find($id);

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    $user->role = $user->groupe;
    $user->activation = $user->activation ? "activer" : "desactiver";

    return response()->json($user);
});
Route::get('/liste_utilisateur', function () {
    $user = \App\Models\Utilisateur::all();

    if ($user->isEmpty()) {
        return response()->json(['message' => 'Aucun utilisateur trouvé'], 404);
    }

    return response()->json($user);
});
Route::get('/users', function () {
    return response()->json(Utilisateur::all());
});
Route::post('/cree_super_utilisateurs', function (Request $request) {
    $profilPath = null;
    if ($request->hasFile('profil')) {
        $profilPath = $request->file('profil')->store('profils', 'public');
    }

    $user = Utilisateur::create([
        'nom'         => $request->nom,
        'prenom'      => $request->prenom,
        'sexe'        => $request->sexe,
        'motDePasse'  => $request->motDePasse,
        'email'       => $request->email,
        'contact'     => $request->contact,
        'groupe'      => $request->groupe,
        'profil'      => $profilPath,
        'lecture'     => false,
        'suppression' => false,
        'modification' => false,
        'creation'    => false,
        'activation'  => false,
        'colone'      => false,
        'colonee'     => false,
    ]);

    return response()->json([
        'message' => 'Super utilisateur créé avec succès',
        'data'    => $user
    ]);
});
Route::post('/modifier_utilisateur/{id}', function ($id, Request $request) {
    $user = Utilisateur::find($id);
    if (!$user) return response()->json(['message' => 'Utilisateur non trouvé'], 404);

    if ($request->hasFile('profil')) {
        $profilPath = $request->file('profil')->store('profils', 'public');
        $user->profil = $profilPath;
    }

    $user->nom = $request->nom;
    $user->prenom = $request->prenom;
    $user->sexe = $request->sexe;
    $user->email = $request->email;
    $user->contact = $request->contact;
    $user->groupe = $request->role;
    $user->save();

    $user->role = $user->groupe;
    $user->activation = $user->activation ? "activer" : "desactiver";

    return response()->json($user);
});

Route::delete('/supprimer_super_utilisateur/{id}', function ($id) {
    $user = Utilisateur::find($id);
    if (!$user) return response()->json(['message' => 'Utilisateur non trouvé'], 404);

    $user->delete();
    return response()->json(['message' => 'Utilisateur supprimé avec succès']);
});
Route::patch('/changer_activation/{id}', function ($id, Request $request) {
    $user = Utilisateur::find($id);
    if (!$user) return response()->json(['message' => 'Utilisateur non trouvé'], 404);

    $user->activation = $request->activation === "activer" ? true : false;
    $user->save();

    return response()->json([
        'message'    => "Utilisateur " . $request->activation,
        'activation' => $user->activation ? "activer" : "desactiver"
    ]);
});

///////1em gestion de fournisseur ET CATEGORIE
///////1em gestion de fournisseur ET CATEGORIE
///////1em gestion de fournisseur ET CATEGORIE
