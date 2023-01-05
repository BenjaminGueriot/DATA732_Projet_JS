# Projet visualisation GUERIOT Benjamin, NICOLAS Thomas, GONAY Arthur
Projet DATA732

### Sommaire 

- [Description](#description)
- [Utilisation](#utilisation)
- [Explications](#explications)

---
## Description

Ce programme a été réalisé dans le cadre de notre formation à Polytech Annecy-Chambéry 

Ce programme est construit a partir de données d'un sondage: https://www.kaggle.com/datasets/catherinerasgaitis/mxmh-survey-results

L'objectif est de réaliser plusieurs graphiques afin de pouvoir visualiser de manière fluide les différentes données

---
## Utilisation


Ouvrir un *cmd* à la racine et executer la commande :  

```shell
npm start
```

Il ne reste plus qu'à accèder au site par ce lien :
<code>http://localhost:3000/index3_3.html</code>

#### Installation

Cloner le projet dans un repertoire : 

`git  clone https://github.com/BenjaminGueriot/Data732_Projet_JS.git'

---
## Explications

En prélilminaire il est important de savoir que l'échantillon du sondage est assez faible (719 personnes intérogées), surtout pour les personnes âgés, et que les informations ont été directement saisies par l'utilisateur, ainsi certaines valeurs peuvent sembler incoherentes. 

### Graphique 1

Ce barChart représente la moyenne des heures d'écoutes en fonction de l'âge. 

Il nous a semblé pertinent d'étudier si une corrélation importante pouvait être observée. 

### Graphique 2

Ce stackedBarChart modélise les moyens d'écoute des personnes sondées selon leur âge.

On observe une domination du marché par la plateforme Spotify.

### Graphique 3

Ce barChart représente le pourcentage de musicien pour chaques âges. Comme dit en préliminaire certaines valeurs sont ici biaisé par le faible nombre de donées pour certains âges.

Ce manque de donné empêche toute analyse pertinente.

### Graphique 4

Ce StackedBarChart représente le genre favoris des sondés en fonction du nombre d'heures d'écoute par jour.

Il est compliqué d'observer des corrélation entre ces deux paramètres.

### Graphique 5

Ce StackedBarChart représente les platefromes d'écoute favorites des sondés en fonction du nombre d'heures d'écoute par jour.

### Graphique 6

Ce lineChart représente les états mentaux des sondées selon les bpm des musiques qu'ils écoutent.

Selon ces données, aucune corrélation ne peut-être établie.

### Graphique 7, 8, 9

Ces 3 derniers pieChart représentent les parts de chaques genre musical parmis les genres favoris des personnes sondées selon leurs pratiques instrumentales. Le graphique de gauche (n°7) pour les non musiciens, celui du milieux (n°8) pour l'ensemble du groupe, et celui de droite (n°9) pour les musiciens.

On peut observer certaines différences interessante entre ces groupes. Par exemple la musique classique est le 2nd genre le plus écouté pour les musicien mais le 11e parmis les non musiciens.

---
## Conclusion

Ce projet a été pour nous une initiation à DC.js qui, malgrés certaines qualités comme l'intéractivitée entre les différents graphiques du dashboard, il peut vite être trés pénible de réaliser certains graphiques complexes.
