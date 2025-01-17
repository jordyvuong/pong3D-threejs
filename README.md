# Pong Game

## Description
Ce projet est une implémentation du célèbre jeu Pong, développé avec Three.js. Le jeu utilise des modèles 3D pour la balle et les raquettes, et intègre des textures et des matériaux pour rendre le jeu visuellement attractif. Le jeu supporte deux joueurs et propose une mécanique de score simple, avec un système de réinitialisation à chaque victoire.

## Fonctionnalités
- Deux joueurs peuvent jouer en utilisant les touches `z` et `s` pour le joueur 1, et les touches `flèche haut` et `flèche bas` pour le joueur 2.
- La balle rebondit contre les bords et les raquettes.
- Le jeu réinitialise la balle après chaque point et affiche le score en temps réel.
- Un tableau de score est affiché au centre de l'écran.
- Lorsque l'un des joueurs atteint un score limite (défini par défaut à 5), le jeu affiche un message de victoire et permet de recommencer en appuyant sur la touche `Enter`.

## Prérequis
- Un navigateur moderne (Chrome, Firefox, Safari, etc.).

## Installation
1. Clonez le dépôt sur votre machine locale :
   ```bash
   git clone https://github.com/votre-nom/utilisateur/pong-game.git
   ```

	2.	Installez les dépendances :
```bash
npm install
```

	3.	Lancez votre serveur local (npm run dev).

## Utilisation
	1.	Ouvrez votre navigateur et accédez à localhost:8080 ou l’adresse correspondant à votre serveur local.
	2.	Utilisez les touches z et s pour déplacer la raquette du joueur 1 (à gauche).
	3.	Utilisez les touches flèche haut et flèche bas pour déplacer la raquette du joueur 2 (à droite).
	4.	Lorsque l’un des joueurs marque un point, la balle est réinitialisée et le score mis à jour.
	5.	Le jeu se termine lorsque l’un des joueurs atteint le score maximum (par défaut 5 points). Appuyez sur Enter pour recommencer.

## Technologies utilisées
	•	Three.js : bibliothèque JavaScript pour le rendu 3D.
	•	GLTFLoader : charge les modèles 3D au format GLTF pour la balle.
	•	OBJLoader : charge les modèles 3D des raquettes au format OBJ.
	•	MTLLoader : charge les matériaux associés aux modèles OBJ.
