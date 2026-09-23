# SPDT · RAT

Site statique HTML/CSS/JavaScript avec données partagées dans Supabase.
La consultation et la gestion des joueurs sont publiques, sans connexion.
Toute personne disposant de l'accès au site/API peut ajouter, modifier, déplacer ou supprimer des joueurs.

## Installation

1. Pour un nouveau projet, exécuter `supabase/001_roster.sql` une seule fois : création de la table et des 99 joueurs initiaux.
2. Exécuter ensuite `supabase/002_public_editing.sql` pour autoriser les modifications publiques. Pour une base existante où 001 a déjà été exécuté, exécuter uniquement 002. Cette migration ne change aucun joueur et peut être rejouée.
3. Renseigner l'URL et la clé publique publishable/anon dans `config.js`. Aucune clé secrète n'est nécessaire.
4. Servir le dossier avec un serveur HTTP statique puis ouvrir `/` pour consulter et `/admin/` pour gérer. Utiliser HTTPS en production.

Aucun compte Supabase Auth n'est nécessaire pour le site. Un compte créé précédemment peut rester en place ; il n'est plus utilisé par l'application.

## Fonctionnement

Les listes sont chargées à l'ouverture de la page. Chaque modification est enregistrée dans Supabase et devient visible aux autres visiteurs après rechargement. Les erreurs sont affichées, sans remplacement silencieux par des données locales. Après une erreur réseau pendant une écriture, recharger pour vérifier l'état avant de réessayer.

La dernière écriture reçue gagne pour un même champ. Les rangs restent indépendants de l'autorisation de ralliement. Pas de synchronisation temps réel.

`data.js` conserve les données historiques et n'est plus chargé par le site. Les anciennes modifications du navigateur (clé `spdt-event-planner-roster-v6`) ne sont ni importées ni effacées automatiquement.

## Vérification

```sh
node --test tests/supabase.test.cjs
node --check app.js
node --check admin/admin.js
node --check supabase.js
```

Après la migration 002, vérifier l'ajout, la modification, le déplacement et la suppression sans connexion, ainsi que la persistance après rechargement.
