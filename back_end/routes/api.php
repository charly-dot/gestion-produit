<?php

use App\Models\Article;
use App\Models\Articleservice;
use App\Models\Casier;
use App\Models\Categori;
use App\Models\Categorie;
use App\Models\Entrepot;
use App\Models\Groupe;
use App\Models\Historiquetransferstock;
use App\Models\Mouvementstock;
use App\Models\Produit;
use App\Models\Stock;
use App\Models\Inventaire;

use App\Models\Tier;
use App\Models\User;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/tout_liste', function () {
    $Casier = Casier::all();
    $Entrepot = Entrepot::all();
    return response()->json([
        'casier_liste'   => $Casier,
        'entrepot_liste' => $Entrepot
    ]);
});


/// 3em projet parti 2 stock
/// 3em projet parti 2 stock
/// 3em projet parti 2 stock


///transfert de stock
Route::post('/insertion_stock_transfert/{id}', function (Request $request, $id) {
    $nouvelStock = (int)$request->stock_actuel - (int)$request->stock_transferer;

    $produit = Produit::findOrFail($request->idProduit); // ✅ correction
    $produit->stock_initia = $nouvelStock; // ⚠️ adapte le nom de colonne si besoin
    $produit->save();

    $nouveauInventaire = Historiquetransferstock::create([
        'entrepotSource'   => $request->entrepotSource,
        'entrepotFinal'    => $request->entrepot_destinateur,
        'casierSource'     => $request->casierSource,
        'casierFinal'      => $request->casier_destinateur,
        'produit'          => $request->idProduit,
        'stock'            => $request->stock_transferer,
        'date'             => now(),
        'action' => "transfert de stock",
        'colone5'          => $id,
    ]);

    return response()->json([
        'message' => 'Inventaire bien sauvegardé',
        'data'    => $nouveauInventaire,
    ], 201);
});


/// MOUVEMENT DE STOCK
Route::get('/MouvementStockEntrepot_inventaire', function () {
    $results = DB::table('mouvementstocks as m')
        ->join('users as u', 'm.colone5', '=', 'u.id')
        ->join('entrepots as e', 'm.entrepot', '=', 'e.id')
        ->join('casiers as c', 'm.casier', '=', 'c.id')
        ->join('produits as p', 'm.produit', '=', 'p.id')
        ->join('stocks as s', 's.id', '=', DB::raw('p."idStockage"'))
        ->select(
            'm.id as mouvement_id',
            'm.*',
            'e.id as entrepot_id',
            'e.nom as entrepot_nom',
            'c.id as casier_id',
            'c.nom as casier_nom',
            's.id as stock_id',
            's.nom as stock_nom',
            DB::raw('SUM(p.stock_initia) as total_stock')
        )
        ->groupBy(
            'm.id',
            'm.colone5',
            'm.entrepot',
            'm.casier',
            'm.produit',
            'e.id',
            'e.nom',
            'c.id',
            'c.nom',
            's.id',
            's.nom'
        )
        ->orderBy('e.nom')
        ->orderBy('c.nom')
        ->orderBy('s.nom')
        ->get();

    return response()->json($results);
});
///HISTORIQUE DE TRANSFERT
Route::get('/HistoriqueEntrepot_inventaire', function () {
    $result = DB::table('historiquetransferstocks as h')
        ->join('users as u', 'h.colone5', '=', 'u.id')
        ->join('produits as p', 'h.produit', '=', 'p.id')
        ->leftJoin('entrepots as es', 'h.entrepotSource', '=', 'es.id')
        ->leftJoin('entrepots as ef', 'h.entrepotFinal', '=', 'ef.id')
        ->leftJoin('casiers as cs', 'h.casierSource', '=', 'cs.id')
        ->leftJoin('casiers as cf', 'h.casierFinal', '=', 'cf.id')
        ->select(
            'ef.zone',
            DB::raw('es.nom as "nomEntrepotSource"'),
            DB::raw('ef.nom as "nomEntrepotFinal"'),
            DB::raw('cs.nom as "nomCasierSource"'),
            DB::raw('cf.nom as "nomCasierFinal"'),
            DB::raw('u.name as "nomUtilisateur"'),
            DB::raw('p."nomProduit"'),
            'h.*'
        )
        ->get();
    return response()->json($result);
});
/// ENTREPOT partie 2 INVENTAIRE
Route::put('/modifier_PRODUIT_inventaire/{id}', function (Request $request, $id) {

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


        $resultat = DB::table('inventaires as i')
            ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
            ->join('casiers as c', 'c.id', '=', 'i.idCasier')
            ->join('produits as p', 'p.id', '=', 'i.idProduit')
            ->join('users as u', 'u.id', '=', 'p.colone5')
            ->select(
                'u.name as name',
                'p.*',
                'e.nom as nomEntrepot',
                'e.id as idEntrepot_nom',
                'c.nom as nomCasier',
                'c.id as idCasier',
                'i.id as idInventaire',
                'i.reference as referenceInventaire'
            )
            ->get();

        return response()->json([
            'message' => 'Mise à jour réussie ✅',
            'data'    => $resultat,
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de la modification ❌',
            'error'   => $e->getMessage()
        ], 500);
    }
});
Route::put('/changer_activation_PRODUIT_inventaire/{id}', function ($id, Request $request) {
    $produit = Produit::find($id);

    if (!$produit) {
        return response()->json([
            'message' => 'Produit introuvable ❌'
        ], 404);
    }

    $produit->etat = $request->etat; // on prend directement l'état envoyé
    $produit->save();

    $resultat = DB::table('inventaires as i')
        ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
        ->join('casiers as c', 'c.id', '=', 'i.idCasier')
        ->join('produits as p', 'p.id', '=', 'i.idProduit')
        ->join('users as u', 'u.id', '=', 'p.colone5')
        ->select(
            'u.name as name',
            'p.*',
            'e.nom as nomEntrepot',
            'e.id as idEntrepot_nom',
            'c.nom as nomCasier',
            'c.id as idCasier',
            'i.id as idInventaire',
            'i.reference as referenceInventaire'
        )
        ->get();

    return response()->json([
        'message' => 'Mise à jour réussie ✅',
        'data'    => $resultat,
    ], 200);
});
Route::get('/listeProduitModifierInventaire', function (Request $request) {
    $resultat = DB::table('inventaires as i')
        ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
        ->join('casiers as c', 'c.id', '=', 'i.idCasier')
        ->join('produits as p', 'p.id', '=', 'i.idProduit')
        ->join('users as u', 'u.id', '=', 'p.colone5')
        ->select(
            'u.name as name',
            'p.*',
            'e.nom as nomEntrepot',
            'e.id as idEntrepot_nom',
            'c.nom as nomCasier',
            'c.id as idCasier',
            'i.id as idInventaire',
            'i.reference as referenceInventaire',
            'i.action as action'
        )
        ->get();

    return response()->json([
        'message' => 'Mise à jour réussie',
        'data'    => $resultat,
    ], 200);
});
Route::put('/ConfirmationModificationInventaireAnnuler/{id}/{id2}', function ($id, $id2, Request $request) {
    $nouveauInventaire = Inventaire::findOrFail($id2);
    $produits = DB::table('inventaires as i')
        ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
        ->join('casiers as c', 'c.id', '=', 'e.idCasier')
        ->join('stocks as s', 's.id', '=', 'c.stock')
        ->join('produits as p', 's.id', '=', 'p.idStockage')
        ->where('i.id', $nouveauInventaire->id)
        ->select('p.id', 'p.stock_initia', 'p.stock_Encours1', 'p.stock_Encours2')
        ->get();

    foreach ($produits as $produit) {
        DB::table('produits')
            ->where('id', $produit->id)
            ->update([
                'stock_initia' => $produit->stock_Encours2 - $produit->stock_Encours2,
                'stock_Encours1' => 0,
                'stock_Encours2' => 0,
            ]);
    }

    $produitsMisAJour = DB::table('produits')
        ->whereIn('id', $produits->pluck('id'))
        ->get();


    DB::table('produits as p')
        ->join('stocks as s', 'p.idStockage', '=', 's.id')
        ->join('casiers as c', 'c.stock', '=', 's.id')
        ->join('entrepots as e', 'e.idCasier', '=', 'c.id')
        ->join('inventaires as i', 'i.idEntrepot', '=', 'e.id')
        ->where('i.id', 1)
        ->update([
            'p.stock_initia'   => DB::raw('"p"."stock_Encours2"'),
            'p.stock_Encours1' => 0,
            'p.stock_Encours2' => 0,
        ]);



    $nouveauInventaire = Inventaire::findOrFail($id2);
    if ($nouveauInventaire->idProduit == 0) {
        $resultat = DB::table('inventaires as i')
            ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
            ->join('casiers as c', 'c.id', '=', 'e.idCasier')
            ->join('stocks as s', 's.id', '=', 'c.stock')
            ->join('produits as p', 's.id', '=', 'p.idStockage')
            ->where('i.id', $nouveauInventaire->id)
            ->select(
                'p.nomProduit as produit_nom',
                'p.id as idProduit',
                'p.stock_initia',
                'p.stock_Encours1',
                'p.stock_Encours2',
                'e.nom as nomEntrepot',
                'e.id as idEntrepot_nom',
                'c.nom as nomCasier',
                'c.id as idCasier',
                'i.id',
                // 'i.id as id',
                'i.reference as referenceInventaire',
            )
            ->get();
    } else {
        $resultat  = Produit::findOrFail($nouveauInventaire->idProduit);
    }


    return response()->json([
        'message'        => 'Mise à jour réussie',
        'data'           => $resultat,
    ], 201);
});
Route::put('/ConfirmationModificationInventaireEnregistrer/{id}', function ($id, $id2, Request $request) {
    $nouveauInventaire = Inventaire::findOrFail($id2);
    $produits = DB::table('inventaires as i')
        ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
        ->join('casiers as c', 'c.id', '=', 'e.idCasier')
        ->join('stocks as s', 's.id', '=', 'c.stock')
        ->join('produits as p', 's.id', '=', 'p.idStockage')
        ->where('i.id', $nouveauInventaire->id)
        ->select('p.id', 'p.stock_initia', 'p.stock_Encours1', 'p.stock_Encours2')
        ->get();

    foreach ($produits as $produit) {
        DB::table('produits')
            ->where('id', $produit->id)
            ->update([
                'stock_initia' => $produit->stock_Encours2,
                'stock_Encours1' => 20,
                'stock_Encours2' => 20,
            ]);
    }

    $produitsMisAJour = DB::table('produits')
        ->whereIn('id', $produits->pluck('id'))
        ->get();

    if ($nouveauInventaire->idProduit == 0) {
        $resultat = DB::table('inventaires as i')
            ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
            ->join('casiers as c', 'c.id', '=', 'e.idCasier')
            ->join('stocks as s', 's.id', '=', 'c.stock')
            ->join('produits as p', 's.id', '=', 'p.idStockage')
            ->where('i.id', $nouveauInventaire->id)
            ->select(
                'p.nomProduit as produit_nom',
                'p.id as idProduit',
                'p.stock_initia',
                'p.stock_Encours1',
                'p.stock_Encours2',
                'e.nom as nomEntrepot',
                'e.id as idEntrepot_nom',
                'c.nom as nomCasier',
                'c.id as idCasier',
                'i.id',
                'i.reference as referenceInventaire',
            )
            ->get();
    } else {
        //     $resultat = DB::table('inventaires as i')
        //         ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
        //         ->join('casiers as c', 'c.id', '=', 'e.idCasier')
        //         ->join('stocks as s', 's.id', '=', 'c.stock')
        //         ->join('produits as p', 's.id', '=', 'p.idStockage')
        //         ->where('i.id', $nouveauInventaire->id)
        //         ->select(
        //             'p.nomProduit as produit_nom',
        //             'p.id as idProduit',
        //             'p.stock_initia',
        //             'p.stock_Encours1',
        //             'p.stock_Encours2',
        //             'e.nom as nomEntrepot',
        //             'e.id as idEntrepot_nom',
        //             'c.nom as nomCasier',
        //             'c.id as idCasier',
        //             'i.id',
        //             'i.reference as referenceInventaire',
        //         )
        //         ->get();
        // }
        $produit  = Produit::findOrFail($nouveauInventaire->idProduit);
        $resultat = collect([$produit]);
    }
    return response()->json([
        'message'        => 'Mise à jour réussie',
        'data'           => $resultat,
    ], 201);
});
Route::put('/modificationValeurStockInventaire/{id}/{id2}/{nomProduit}', function ($id, $id2, $nomProduit, Request $request) {
    $valeur = $request->input('valeur'); // valeur envoyée depuis React

    // Chercher produit par son nom
    $produit = Produit::where('nomProduit', $nomProduit)->first();
    $nouveauInventaire = Inventaire::findOrFail($id2);

    $produit->stock_Encours1 = $valeur;
    $produit->stock_Encours2 = $produit->stock_initia - $valeur;
    $produit->save();

    if ($nouveauInventaire->idProduit == 0) {
        $resultat = DB::table('inventaires as i')
            ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
            ->join('casiers as c', 'c.id', '=', 'e.idCasier')
            ->join('stocks as s', 's.id', '=', 'c.stock')
            ->join('produits as p', 's.id', '=', 'p.idStockage')
            ->where('i.id', $nouveauInventaire->id)
            ->select(
                'p.nomProduit as produit_nom',
                'p.id as idProduit',
                'p.stock_initia',
                'p.stock_Encours1',
                'p.stock_Encours2',
                'e.nom as nomEntrepot',
                'e.id as idEntrepot_nom',
                'c.nom as nomCasier',
                'c.id as idCasier',
                'i.id',
                'i.reference as referenceInventaire',
            )
            ->get();
    } else {
        //     $resultat = DB::table('inventaires as i')
        //         ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
        //         ->join('casiers as c', 'c.id', '=', 'e.idCasier')
        //         ->join('stocks as s', 's.id', '=', 'c.stock')
        //         ->join('produits as p', 's.id', '=', 'p.idStockage')
        //         ->where('i.id', $nouveauInventaire->id)
        //         ->select(
        //             'p.nomProduit as produit_nom',
        //             'p.id as idProduit',
        //             'p.stock_initia',
        //             'p.stock_Encours1',
        //             'p.stock_Encours2',
        //             'e.nom as nomEntrepot',
        //             'e.id as idEntrepot_nom',
        //             'c.nom as nomCasier',
        //             'c.id as idCasier',
        //             'i.id',
        //             'i.reference as referenceInventaire',
        //         )
        //         ->get();
        // }
        $produit  = Produit::findOrFail($nouveauInventaire->idProduit);
        $resultat = collect([$produit]);
    }
    return response()->json([
        'message'        => 'Mise à jour réussie',
        'data'           => $resultat,
    ], 201);
});
Route::put('/modificationValeurStockInventaire2/{id}/{id2}/{nomProduit}', function ($id, $id2, $nomProduit, Request $request) {
    $valeur = $request->input('valeur'); // valeur envoyée depuis React

    // Chercher produit par son nom
    $produit = Produit::where('nomProduit', $nomProduit)->first();
    $nouveauInventaire = Inventaire::findOrFail($id2);

    $produit->stock_Encours1 = $valeur;
    $produit->stock_Encours2 = $produit->stock_initia + $valeur;

    $produit->save();

    if ($nouveauInventaire->idProduit == 0) {
        $resultat = DB::table('inventaires as i')
            ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
            ->join('casiers as c', 'c.id', '=', 'e.idCasier')
            ->join('stocks as s', 's.id', '=', 'c.stock')
            ->join('produits as p', 's.id', '=', 'p.idStockage')
            ->where('i.id', $nouveauInventaire->id)
            ->select(
                'p.nomProduit as produit_nom',
                'p.id as idProduit',
                'p.stock_initia',
                'p.stock_Encours1',
                'p.stock_Encours2',
                'e.nom as nomEntrepot',
                'e.id as idEntrepot_nom',
                'c.nom as nomCasier',
                'c.id as idCasier',
                'i.id',
                'i.reference as referenceInventaire',
            )
            ->get();
    } else {
        //     $resultat = DB::table('inventaires as i')
        //         ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
        //         ->join('casiers as c', 'c.id', '=', 'e.idCasier')
        //         ->join('stocks as s', 's.id', '=', 'c.stock')
        //         ->join('produits as p', 's.id', '=', 'p.idStockage')
        //         ->where('i.id', $nouveauInventaire->id)
        //         ->select(
        //             'p.nomProduit as produit_nom',
        //             'p.id as idProduit',
        //             'p.stock_initia',
        //             'p.stock_Encours1',
        //             'p.stock_Encours2',
        //             'e.nom as nomEntrepot',
        //             'e.id as idEntrepot_nom',
        //             'c.nom as nomCasier',
        //             'c.id as idCasier',
        //             'i.id',
        //             'i.reference as referenceInventaire',
        //         )
        //         ->get();
        // }
        $produit  = Produit::findOrFail($nouveauInventaire->idProduit);
        $resultat = collect([$produit]);
    }
    return response()->json([
        'message'        => 'Mise à jour réussie',
        'data'           => $resultat,
    ], 201);
});
Route::post('/insertion_inventaire_produit/{id}', function (Request $request, $id) {
    $nouveauInventaire = Inventaire::create([
        'idEntrepot'     => $request->entrepot,
        'idCasier'     => $request->casier,
        'dateCreation'     => $request->date,
        'reference'     => $request->reference,
        'idProduit'     => $request->produit,
        'colone5' => $id,
    ]);

    if ($nouveauInventaire->idProduit == 0) {
        $produits = DB::table('inventaires as i')
            ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
            ->join('casiers as c', 'c.id', '=', 'e.idCasier')
            ->join('stocks as s', 's.id', '=', 'c.stock')
            ->join('produits as p', 's.id', '=', 'p.idStockage')
            ->where('i.id', $nouveauInventaire->id)
            ->select(
                'p.nomProduit as produit_nom',
                'p.id as idProduit',
                'p.stock_initia',
                'p.stock_Encours1',
                'p.stock_Encours2',
                'e.nom as nomEntrepot',
                'e.id as idEntrepot_nom',
                'c.nom as nomCasier',
                'c.id as idCasier',
                'i.id',
                'i.reference as referenceInventaire',
            )
            ->get();
    } else {
        $produits = DB::table('inventaires as i')
            ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
            ->join('casiers as c', 'c.id', '=', 'e.idCasier')
            ->join('stocks as s', 's.id', '=', 'c.stock')
            ->join('produits as p', 's.id', '=', 'p.idStockage')
            ->where('i.id', $nouveauInventaire->id)
            ->select(
                'p.nomProduit as produit_nom',
                'p.id as idProduit',
                'p.stock_initia',
                'p.stock_Encours1',
                'p.stock_Encours2',
                'e.nom as nomEntrepot',
                'e.id as idEntrepot_nom',
                'c.nom as nomCasier',
                'c.id as idCasier',
                'i.id',
                'i.reference as referenceInventaire',
            )
            ->get();
    }


    return response()->json([
        'message' => 'Inventaire bien sauvegardé',
        'data'    => $produits,
    ], 201);

    // if ($nouveauInventaire->idProduit == 0) {
    //     $produits = DB::table('inventaires as i')
    //         ->join('entrepots as e', 'e.id', '=', 'i.idEntrepot')
    //         ->join('casiers as c', 'c.id', '=', 'e.idCasier')
    //         ->join('stocks as s', 's.id', '=', 'c.stock')
    //         ->join('produits as p', 's.id', '=', 'p.idStockage')
    //         ->where('i.id', $nouveauInventaire->id)
    //         ->select(
    //             'p.nomProduit as produit_nom',
    //             'p.id as idProduit',
    //             'p.stock_initia',
    //             'p.stock_Encours1',
    //             'p.stock_Encours2',
    //             'e.nom as nomEntrepot',
    //             'e.id as idEntrepot_nom',
    //             'c.nom as nomCasier',
    //             'c.id as idCasier',
    //             'i.id',
    //             // 'i.id as id',
    //             'i.reference as referenceInventaire',
    //         )
    //         ->get();

    //     // SELECT e.id, c.nom, p.*
    //     // FROM inventaires i
    //     // JOIN entrepots e ON e.id = i."idEntrepot"
    //     // JOIN casiers c ON e."idCasier" = c.id
    //     // JOIN stocks s ON s.id = c.stock
    //     // JOIN produits p ON p."idStockage" = s.id
    //     // WHERE i.id = 1;

    // } else {
    //     $produit  = Produit::findOrFail($nouveauInventaire->idProduit);
    //     $produits = collect([$produit]);
    // }

    return response()->json([
        'message'        => 'Inventaire bien sauvegardé',
        'data'           => $produits,

    ], 201);
});

///ENTREPOT
Route::get('/HistoriqueEntrepot/{id}', function ($id) {
    $id = 4;

    $Mouvementstock = DB::table('historiquetransferstocks as h')
        ->join('users as u', 'h.colone5', '=', 'u.id')
        ->join('produits as p', 'h.produit', '=', 'p.id')
        ->leftJoin('entrepots as es', 'h.entrepotSource', '=', 'es.id')
        ->leftJoin('entrepots as ef', 'h.entrepotFinal', '=', 'ef.id')
        ->leftJoin('casiers as cs', 'h.casierSource', '=', 'cs.id')
        ->leftJoin('casiers as cf', 'h.casierFinal', '=', 'cf.id')
        ->select(
            'ef.zone',
            DB::raw('es.nom as "nomEntrepotSource"'),
            DB::raw('ef.nom as "nomEntrepotFinal"'),
            DB::raw('cs.nom as "nomCasierSource"'),
            DB::raw('cf.nom as "nomCasierFinal"'),
            DB::raw('u.name as "nomUtilisateur"'),
            DB::raw('p."nomProduit"'),
            'h.*'
        )
        ->where('h.entrepotFinal', $id)
        ->orWhere('h.entrepotSource', $id)
        ->get();
    return response()->json($Mouvementstock);
});
Route::get('/HistoriqueEntrepot/{id}', function ($id) {
    $id = 4;

    $Mouvementstock = DB::table('historiquetransferstocks as h')
        ->join('users as u', 'h.colone5', '=', 'u.id')
        ->join('produits as p', 'h.produit', '=', 'p.id')
        ->leftJoin('entrepots as es', 'h.entrepotSource', '=', 'es.id')
        ->leftJoin('entrepots as ef', 'h.entrepotFinal', '=', 'ef.id')
        ->leftJoin('casiers as cs', 'h.casierSource', '=', 'cs.id')
        ->leftJoin('casiers as cf', 'h.casierFinal', '=', 'cf.id')
        ->select(
            'ef.zone',
            DB::raw('es.nom as "nomEntrepotSource"'),
            DB::raw('ef.nom as "nomEntrepotFinal"'),
            DB::raw('cs.nom as "nomCasierSource"'),
            DB::raw('cf.nom as "nomCasierFinal"'),
            DB::raw('u.name as "nomUtilisateur"'),
            DB::raw('p."nomProduit"'),
            'h.*'
        )
        ->where('h.entrepotFinal', $id)
        ->orWhere('h.entrepotSource', $id)
        ->get();
    return response()->json($Mouvementstock);
});

Route::get('/MouvementStockEntrepot/{id}', function ($id) {

    $id = 2;
    $Mouvementstock = DB::table('mouvementstocks')
        ->join('users', 'mouvementstocks.colone5', '=', 'users.id')
        ->join('entrepots', 'mouvementstocks.entrepot', '=', 'entrepots.id')
        ->join('casiers', 'mouvementstocks.casier', '=', 'casiers.id')
        ->join('produits', 'mouvementstocks.produit', '=', 'produits.id')
        ->where('mouvementstocks.entrepot', $id)
        ->select(
            'mouvementstocks.*',
            'users.activation AS etat',
            'users.name',
            'entrepots.nom AS nomEntrepot',
            'casiers.nom AS nomCasier',
            'produits.nomProduit',
            'produits.stock_initia',
        )
        ->get();

    return response()->json($Mouvementstock);
});

Route::post('/creationEntrepot/{id}', function (Request $request, $id) {

    // Vérifier si le casier est déjà attribué
    $entrepotExistant = Entrepot::where('idCasier', $request->casier)->first();

    // Fonction pour récupérer les détails de l'entrepôt
    function resultat($entrepotId)
    {
        return DB::table('entrepots as e')
            ->leftJoin('casiers as c', 'c.id', '=', 'e.idCasier')
            ->leftJoin('stocks as s', 's.id', '=', 'c.stock')
            ->leftJoin('stocks as s2', 's2.id', '=', 'e.stock')
            ->leftJoin('produits as p', function ($join) {
                $join->on('p.idStockage', '=', 's.id')
                    ->orOn('p.idStockage', '=', 's2.id');
            })
            ->where('e.id', $entrepotId)
            ->select(
                'e.id',
                'e.nom',
                'e.etat',
                'e.zone',
                'c.nom as nomCasier',
                'c.id as idCasier',
                'c.stock as idStock',
                'p.idStockage as idProduitStock',
                's2.id as idProduitS2',
                's2.nom as nomStockS2',
                'p.id as idProduitFinal',
                'p.nomProduit'
            )
            ->get();
    }

    // Fonction pour calculer le stock total
    function totalGeneral($entrepotId)
    {
        return DB::table('entrepots as e')
            ->leftJoin('casiers as c', 'c.id', '=', 'e.idCasier')
            ->leftJoin('stocks as s', 's.id', '=', 'c.stock')
            ->leftJoin('produits as p', 'p.idStockage', '=', 's.id')
            ->where('e.id', $entrepotId)
            ->sum('p.stock_initia');
    }

    if (!$entrepotExistant) {
        // Casier libre → création de l'entrepôt
        $entrepot = Entrepot::create([
            'nom'      => $request->nom,
            'etat'     => $request->etat,
            'zone'     => $request->zone,
            'idCasier' => $request->casier,
            'colone5'  => $id,
        ]);

        return response()->json([
            'message'      => "✅ Entrepôt créé avec succès.",
            'data'         => resultat($entrepot->id),
            'totalGeneral' => totalGeneral($entrepot->id),
        ], 201);
    } else {
        // Casier déjà utilisé → renvoyer les infos de l'entrepôt existant
        return response()->json([
            'message'      => "❌ Ce casier est déjà dans un entrepôt.",
            'data'         => resultat($entrepotExistant->id),
            'totalGeneral' => totalGeneral($entrepotExistant->id),
        ], 400);
    }
});

Route::post('/modifeEntrepot/{id}', function (Request $request, $id) {

    $entrepot = Entrepot::findOrFail($id);
    $entrepot->nom      = $request->nom ?? "";
    $entrepot->etat     = $request->etat ?? "";
    $entrepot->zone     = $request->zone ?? "";
    $entrepot->idCasier = $request->casier ?? null;
    $entrepot->save(); // ✅ SAUVEGARDE

    // Fonction pour récupérer les détails de l'entrepôt
    function resultat($entrepotId)
    {
        return DB::table('entrepots as e')
            ->leftJoin('casiers as c', 'c.id', '=', 'e.idCasier')
            ->leftJoin('stocks as s', 's.id', '=', 'c.stock')
            ->leftJoin('stocks as s2', 's2.id', '=', 'e.stock')
            ->leftJoin('produits as p', function ($join) {
                $join->on('p.idStockage', '=', 's.id')
                    ->orOn('p.idStockage', '=', 's2.id');
            })
            ->where('e.id', $entrepotId)
            ->select(
                'e.id',
                'e.nom',
                'e.etat',
                'e.zone',
                'c.nom as nomCasier',
                'c.id as idCasier',
                'c.stock as idStock',
                'p.idStockage as idProduitStock',
                's2.id as idProduitS2',
                's2.nom as nomStockS2',
                'p.id as idProduitFinal',
                'p.nomProduit'
            )
            ->get();
    }

    // Fonction pour calculer le stock total
    function totalGeneral($entrepotId)
    {
        return DB::table('entrepots as e')
            ->leftJoin('casiers as c', 'c.id', '=', 'e.idCasier')
            ->leftJoin('stocks as s', 's.id', '=', 'c.stock')
            ->leftJoin('produits as p', 'p.idStockage', '=', 's.id')
            ->where('e.id', $entrepotId)
            ->sum('p.stock_initia');
    }



    return response()->json([
        'message'      => "✅ Modifier avec succès.",
        'data'         => resultat($entrepot->id),
        'totalGeneral' => totalGeneral($entrepot->id),
    ], 201);
});

Route::post('/changer_activation_entrepot/{id}', function (Request $request, $id) {
    $calculerTotalStock = function ($entrepotId) {
        return DB::table('entrepots as e')
            ->join('casiers as c', 'e.idCasier', '=', 'c.id')
            ->join('stocks as s', 'c.id', '=', 's.casier')
            ->join('produits as p', 's.idProduit', '=', 'p.id')
            ->where('e.id', $entrepotId)
            ->sum('p.stock_initia');
    };

    $entrepot = Entrepot::findOrFail($id);
    $newEtat = $request->activation === "activer" ? "activer" : "desactiver";
    $entrepot->etat = $newEtat;
    $entrepot->save();

    function resultat($entrepotId)
    {
        return DB::table('entrepots as e')
            ->leftJoin('casiers as c', 'c.id', '=', 'e.idCasier')
            ->leftJoin('stocks as s', 's.id', '=', 'c.stock')
            ->leftJoin('stocks as s2', 's2.id', '=', 'e.stock')
            ->leftJoin('produits as p', function ($join) {
                $join->on('p.idStockage', '=', 's.id')
                    ->orOn('p.idStockage', '=', 's2.id');
            })
            ->where('e.id', $entrepotId)
            ->select(
                'e.id',
                'e.nom',
                'e.etat',
                'e.zone',
                'c.nom as nomCasier',
                'c.id as idCasier',
                'c.stock as idStock',
                'p.idStockage as idProduitStock',
                's2.id as idProduitS2',
                's2.nom as nomStockS2',
                'p.id as idProduitFinal',
                'p.nomProduit'
            )
            ->get();
    }

    // Fonction pour calculer le stock total
    function totalGeneral($entrepotId)
    {
        return DB::table('entrepots as e')
            ->leftJoin('casiers as c', 'c.id', '=', 'e.idCasier')
            ->leftJoin('stocks as s', 's.id', '=', 'c.stock')
            ->leftJoin('produits as p', 'p.idStockage', '=', 's.id')
            ->where('e.id', $entrepotId)
            ->sum('p.stock_initia');
    }



    return response()->json([
        'message'      => "✅ Modifier avec succès.",
        'data'         => resultat($entrepot->id),
        'totalGeneral' => totalGeneral($entrepot->id),
    ], 201);
});

Route::delete('/suppression_entrepot/{id}', function ($id) {
    $entrepot = Entrepot::findOrFail($id);
    $entrepot->delete();

    return response()->json([
        'message' => "✅ Suppression avec succès.",
    ], 200);
});


///CASIER
Route::get('/liste_Casier_tout', function () {

    $resultat = DB::table('casiers as c')
        ->select(
            'c.*',
            'c.nom',
            'u.name as user_name',
            'e.id as entrepot_id',
            'e.nom as entrepot_nom',
            's.id as stock_id',
            's.nom as stock_nom',
            DB::raw('p."nomProduit" as nomProduit'),
            'p.stock_initia as stock_total'
        )
        ->leftJoin('entrepots as e', 'e.idCasier', '=', 'c.id')
        ->leftJoin('users as u', 'u.id', '=', 'c.colone5')
        ->leftJoin('stocks as s', 's.casier', '=', 'c.id')
        ->leftJoin('produits as p', 'p.idStockage', '=', 's.id')
        ->orderBy('e.nom')
        ->orderBy('c.nom')
        ->orderBy('s.nom')
        ->get();

    return response()->json([
        'status' => 'success',
        'count' => $resultat->count(),
        'data' => $resultat
    ], 200);
});
Route::post('/changer_activation_casier/{id}', function (Request $request, $id) {
    $calculerTotalStock = function ($casierId) {
        $totalStock = DB::table('casiers as c')
            ->join('stocks as s', 'c.stock', '=', 's.casier')
            ->join('produits as p', 'p.id', '=', 's.id')
            ->where('c.id', $casierId)
            ->sum('p.stock_initia');

        return $totalStock ?? 0;
    };

    $casier = Casier::findOrFail($id);
    $newEtat = $request->activation === "activer" ? "activer" : "desactiver";
    $casier->etat = $newEtat;
    $casier->save();

    return response()->json([
        'message'      => "✅ Casier {$newEtat} avec succès.",
        'data'         => $casier,
        'totalGeneral' => $calculerTotalStock($casier->id),
    ], 200);
});
Route::delete('/suppression_casier/{id}', function ($id) {
    $casier = Casier::findOrFail($id);
    $casier->delete();

    return response()->json([
        'message' => "✅ Casier supprimé avec succès.",
    ], 200);
});
Route::post('/modifecasier/{id}', function (Request $request, $id) {
    $calculerTotalStock = function ($casierId) {
        $totalStock = DB::table('casiers as c')
            ->join('stocks as s', 'c.stock', '=', 's.casier')
            ->join('produits as p', 'p.id', '=', 's.id')
            ->where('c.id', $casierId)
            ->sum('p.stock_initia');

        return $totalStock ?? 0;
    };

    $modification = Casier::findOrFail($id);
    $modification->nom  = $request->nom ?? $modification->nom;
    $modification->etat = $request->etat ?? $modification->etat;
    $modification->save(); // 🔑 indispensable

    return response()->json([
        'message'      => 'Modification bien sauvegardée',
        'data'         => $modification,
        'totalGeneral' => $calculerTotalStock($modification->id),
    ], 201);
});
Route::get('/HistoriqueTransfert/{id}', function ($id) {
    $id = 4;

    $Mouvementstock = DB::table('historiquetransferstocks as h')
        ->join('users as u', 'h.colone5', '=', 'u.id')
        ->join('produits as p', 'h.produit', '=', 'p.id')
        ->leftJoin('entrepots as es', 'h.entrepotSource', '=', 'es.id')
        ->leftJoin('entrepots as ef', 'h.entrepotFinal', '=', 'ef.id')
        ->leftJoin('casiers as cs', 'h.casierSource', '=', 'cs.id')
        ->leftJoin('casiers as cf', 'h.casierFinal', '=', 'cf.id')
        ->select(
            'ef.zone',
            DB::raw('es.nom as "nomEntrepotSource"'),
            DB::raw('ef.nom as "nomEntrepotFinal"'),
            DB::raw('cs.nom as "nomCasierSource"'),
            DB::raw('cf.nom as "nomCasierFinal"'),
            DB::raw('u.name as "nomUtilisateur"'),
            DB::raw('p."nomProduit"'),
            'h.*'
        )
        ->where('h.casierFinal', $id)
        ->orWhere('h.casierSource', $id)
        ->get();
    return response()->json($Mouvementstock);
});
Route::get('/MouvementStock/{id}', function ($id) {
    $id = 1;
    $Mouvementstock = DB::table('mouvementstocks')
        ->join('users', 'mouvementstocks.colone5', '=', 'users.id')
        ->join('entrepots', 'mouvementstocks.entrepot', '=', 'entrepots.id')
        ->join('casiers', 'mouvementstocks.casier', '=', 'casiers.id')
        ->join('produits', 'mouvementstocks.produit', '=', 'produits.id')
        ->where('mouvementstocks.casier', $id)
        ->select(
            'mouvementstocks.*',
            'users.activation AS etat',
            'users.name',
            'entrepots.nom AS nomEntrepot',
            'casiers.nom AS nomCasier',
            'produits.nomProduit',
        )
        ->get();

    return response()->json($Mouvementstock);
});
Route::get('/liste_Casier', function () {
    $resultat = DB::table('casiers as c')
        ->leftJoin('entrepots as e', 'e.idCasier', '=', 'c.id')
        ->leftJoin('stocks as s', 's.casier', '=', 'c.id')
        ->leftJoin('produits as p', 's.id', '=', 'p.idStockage')
        ->leftJoin('users as u', 's.colone5', '=', 'u.id')
        ->select(
            'e.nom as nomEntrepot',
            'c.nom as nomCasier',
            'c.created_at AS DateCasier',
            's.nom as nomStock',
            'u.activation as etat',
            'u.name as utilisateur',
            'p.nomProduit as produit',
            'p.stock_initia as stockTotal'
        )
        ->get();
    return response()->json($resultat);
});
Route::post('/creationCasier/{id}', function (Request $request, $id) {

    $calculerTotalStock = function ($entrepotId) {
        return $totalStock = DB::table('casiers as c')
            ->join('stocks as s', 'c.stock', '=', 's.casier')
            ->join('produits as p', 'p.id', '=', 's.id')
            ->where('c.id', $entrepotId)
            ->sum('p.stock_initia');

        $totalStock = $totalStock ?? 0;
    };

    $nouveauCasier = Casier::create([
        'nom'     => $request->nom,
        'etat'    => $request->etat,
        'colone5' => $id,
    ]);


    return response()->json([
        'message'        => 'Casier bien sauvegardé',
        'data'           => $nouveauCasier,
        'totalGeneral'   => $calculerTotalStock($nouveauCasier->id),
    ], 201);
});
Route::get('/liste_Caisier', function () {
    $user = Casier::all();
    return response()->json($user);
});
Route::get('/liste_Entrepot', function () {
    $user = Casier::all();
    return response()->json($user);
});
Route::get('/liste_Stock', function () {
    $user = DB::table('stocks')
        ->join('produits', 'stocks.idProduit', '=', 'produits.id')
        ->join('casiers', 'stocks.casier', '=', 'casiers.id')
        ->join('entrepots', 'stocks.entrepot', '=', 'entrepots.id')
        ->select(
            'stocks.id as id',
            'casiers.nom as casier',
            'casiers.id as idcasier',
            'entrepots.nom as entrepot',
            'entrepots.id as identrepot',
            'produits.nomProduit',
            'produits.id',
            'produits.stock_initia',
            'produits.prix'
        )
        ->get();

    return response()->json($user);
});
Route::post('/creationStock/{id}', function (Request $request, $id) {

    $produit = Produit::findOrFail($request->idProduit);

    $stockExistant = Stock::where('idProduit', $produit->id)->first();
    if ($stockExistant) {
        return response()->json([
            'message' => "❌ Ce produit est déjà placé dans un entrepôt.",
            'data'    => $stockExistant
        ], 400);
    }
    $Stock = Stock::create([
        'nomProduit' => $produit->nomProduit,
        'idProduit'  => $produit->id,
        'entrepot'   => $request->entrepot,
        'casier'     => $request->casier ?? " ",
        'colonne'    => "vide",
        'colonnes'   => $id,
    ]);

    $casier = Mouvementstock::create([
        'produit' => $produit->nomProduit,
        'entrepot' => $request->entrepot,
        'casier' => $request->input('casier'),
        'stock' => $produit->stock_initia,
        'colone5' => $id,
        'action' => "Ajouter",
        'date' => now(), // ou une date que tu veux
    ]);
    return response()->json([
        'message' => 'Super utilisateur créé avec succès',
        'data'    => $Stock
    ]);
});
Route::put('/modifier_Stock/{id}/{idS}/{idF}', function (Request $request, $id, $idS, $idF) {
    try {
        $produit = Produit::findOrFail($id);
        $produit->stock_initia = $request->input('stock');
        $produit->save();

        $casier = Mouvementstock::create([
            'produit' => $request->nomProduit,
            'entrepot' => $request->entrepot,
            'casier' => $request->input('casier'),
            'stock' => $request->input('stock'),
            'colone5' => $idF,
            'action' => "modification",
            'date' => now(), // ou une date que tu veux
        ]);



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
Route::put('/transfertStock/{id}/{idS}/{idF}', function (Request $request, $id, $idS, $idF) {
    try {
        $produit = Produit::findOrFail($id);
        $produit->stock_initia = $request->input('stockfinal');
        $produit->save();

        $STOCK = Stock::findOrFail($idS);
        $STOCK->casier = $request->input('casierfinal');
        $STOCK->entrepot = $request->input('entrepotfinal');
        $STOCK->save();

        $casier = Historiquetransferstock::create([
            'produit'        => $produit->nomProduit,
            'entrepotSource' => $STOCK->entrepot,   // ✅ plus fiable
            'entrepotFinal'  => $request->input('entrepotfinal'),
            'casierSource'   => $STOCK->casier,     // ✅ plus fiable
            'casierFinal'    => $request->input('casierfinal'),
            'stock'          => $request->input('stockfinal'),
            'colone5'        => $idF,
            'action'         => "transfert",
        ]);
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

    $resultat = DB::table('produits as p')
        ->leftJoin('users as u', 'p.colone5', '=', 'u.id')
        ->leftJoin('stocks as s', 's.id', '=', DB::raw('p."idStockage"'))
        ->leftJoin('casiers as c', 's.casier', '=', 'c.id')
        ->leftJoin('entrepots as e', DB::raw('e."idCasier"'), '=', 'c.id')
        ->select(
            'p.*',
            'e.nom as entrepot',
            'e.id as idEntrepot',
            'c.nom as casier',
            'c.id as idCasier',
            'c.created_at as DateCasier',
            'u.name as utilisateur'
        )
        // ->where(DB::raw('p."nomProduit"'), '=', 'eaque')
        ->get();

    return response()->json($resultat);
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
    $produit->etat = $newEtat;
    $produit->save();

    return response()->json([
        'message' => "Produit mis à jour : {$newEtat} ✅",
        'activation' => $produit->etat
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
///////1em gestion de fournisseur ET CATEGORIE

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
