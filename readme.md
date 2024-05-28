# SVG Graphics

Ce projet permet de créer et d'animer des graphiques SVG (Scalable Vector Graphics) dans une page web. Il comprend des fonctionnalités pour dessiner des courbes, des lignes et des graphiques en camembert (pie charts).

## Installation

Pas d'installation nécessaire. Le code peut être inclus dans n'importe quel projet web en copiant les fichiers nécessaires.

## Utilisation

### Dessiner des Courbes et des Lignes

1. Inclure le fichier `svgGraphics.js` dans votre projet :

    ```html
    <script src="svgGraphics.js"></script>
    ```

2. Créer une instance de `CurvesSVGCreator` pour ajouter des éléments SVG :

    ```javascript
    const svgCreator = new CurvesSVGCreator(document.getElementById('chart'));
    ```

3. Utiliser les méthodes de `CurvesSVGCreator` pour créer des courbes et des lignes :

    ```javascript
    svgCreator.createPath("M10 10 H 90 V 90 H 10 Z", true, "blue", "black", 2);
    svgCreator.createLine(10, 10, 50, 50, "red", 1);
    ```

### Dessiner et Animer un Graphique en Camembert

1. Inclure le fichier `pieChart.js` dans votre projet :

    ```html
    <script src="pieChart.js"></script>
    ```

2. Créer une instance de `PieChart` pour dessiner et animer un graphique en camembert :

    ```javascript
    const pieChart = new PieChart(document.querySelector('.piechart'), [30, 70, 100], ["#ff0000", "#00ff00", "#0000ff"]);
    ```

3. Utiliser les méthodes de `PieChart` pour dessiner et animer le graphique :

    ```javascript
    pieChart.drawChart();

    document.querySelector('.chartStart button').addEventListener('click', () => {
        pieChart.animateChart();
    });
    ```

## API

### Classe `CurvesSVGCreator`

#### Constructeur

```javascript
new CurvesSVGCreator(parentNode)
parentNode (HTMLElement) : L'élément parent auquel le conteneur SVG sera ajouté.
Méthodes
createPath(pathPoints, fillBol, fillColor, strokeColor, strokeWidth, dashArray)

Crée un chemin (path) dans le conteneur SVG.

createLine(startX, startY, endX, endY, strokeColor, strokeWidth)

Crée une ligne dans le conteneur SVG.

Classe PieChart
Constructeur
javascript
Copier le code
new PieChart(parentNode, data, colors)
parentNode (HTMLElement) : L'élément parent auquel le graphique en camembert sera ajouté.
data (Array<number>) : Les valeurs représentant les segments du camembert.
colors (Array<string>) : Les couleurs des segments du camembert.
Méthodes
drawChart()

Dessine le graphique en camembert en utilisant les données et les couleurs fournies.

animateChart()

Anime le graphique en camembert en augmentant progressivement les segments jusqu'à leur taille finale.

rust
Copier le code

Ce fichier README comprend des instructions d'installation, d'utilisation, une description de l'API et des exemples d'utilisation. Si vous avez besoin de plus d'informations ou d'aide, n'hésitez pas à demander !