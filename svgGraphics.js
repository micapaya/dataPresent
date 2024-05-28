class CurvesSVGCreator {
    constructor(parentNode) {
        this.svgContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        parentNode.appendChild(this.svgContainer);
    }

    createPath(pathPoints, fillBol, fillColor, strokeColor, strokeWidth, dashArray) {
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathPoints);
        path.setAttribute("fill", fillBol ? fillColor : "none");
        path.setAttribute("stroke", strokeColor);
        path.setAttribute("stroke-width", strokeWidth);
        if (dashArray) {
            path.setAttribute("stroke-dasharray", dashArray);
        }
        this.svgContainer.appendChild(path);
    }

    createLine(startX, startY, endX, endY, strokeColor, strokeWidth) {
        let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", startX);
        line.setAttribute("y1", startY);
        line.setAttribute("x2", endX);
        line.setAttribute("y2", endY);
        line.setAttribute("stroke", strokeColor);
        line.setAttribute("stroke-width", strokeWidth);
        this.svgContainer.appendChild(line);
    }

    createText(x, y, fontSize, fontColor, textAnchor, textContent, transform) {
        let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("font-size", fontSize);
        text.setAttribute("text-anchor", textAnchor);
        text.setAttribute("fill", fontColor);
        text.textContent = textContent;
        if (transform) {
            text.setAttribute("transform", transform);
        }
        this.svgContainer.appendChild(text);
    }

    createRect(x, y, width, height, fillColor, strokeColor, strokeWidth) {
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("fill", fillColor);
        if (strokeColor) {
            rect.setAttribute("stroke", strokeColor);
            rect.setAttribute("stroke-width", strokeWidth);
        }
        this.svgContainer.appendChild(rect);
    }

    createGraphic(config, data, data2 = null) {
        const {
            width,
            height,
            margin,
            xKey,
            yKey,
            fillCurves,
            curveWidth,
            bottomLineColor,
            bottomLineWidth,
            verticalLineColor,
            verticalLineWidth,
            textColor,
            gradationColor,
            gradationWidth,
            rectFillColor,
            rectStrokeColor,
            rectStrokeWidth,
            rect2FillColor,
            rect2StrokeColor,
            rect2StrokeWidth
        } = config;

        this.svgContainer.setAttribute("width", width);
        this.svgContainer.setAttribute("height", height);

        const xValues = data.map(point => point[xKey]);
        const xMax = xValues.length - 1;
        const yMax = Math.max(...data.map(point => point[yKey]));

        const xScale = (width - 2 * margin) / xMax;
        const yScale = (height - 2 * margin) / yMax;

        const controlPoints = data.map((point, index) => ({
            x: (index * xScale) + margin,
            y: height - ((point[yKey] * yScale) + margin)
        }));
        if (data2) {
            const xValues2 = data2.map(point => point[xKey]);
            const xMax2 = xValues2.length - 1;
            const yMax2 = Math.max(...data2.map(point => point[yKey]));
            const yScale2 = (height - 2 * margin) / yMax2;

            data2.forEach((point, index) => {
                const x = (index * xScale) + margin + verticalLineWidth / 2;
                const y = height - ((point[yKey] * yScale2) + margin + bottomLineWidth / 2);
                const rectHeight = (point[yKey] * yScale2);
                this.createRect(x, y, xScale - verticalLineWidth, rectHeight, rect2FillColor, rect2StrokeColor, rect2StrokeWidth);
            });
        }
        let pathData = `M ${controlPoints[0].x},${controlPoints[0].y}`;
        for (let i = 1; i < controlPoints.length - 2; i++) {
            const xc = (controlPoints[i].x + controlPoints[i + 1].x) / 2;
            const yc = (controlPoints[i].y + controlPoints[i + 1].y) / 2;
            pathData += ` Q ${controlPoints[i].x},${controlPoints[i].y} ${xc},${yc}`;
        }
        pathData += ` T ${controlPoints[controlPoints.length - 1].x},${controlPoints[controlPoints.length - 1].y}`;
        this.createPath(pathData, false, "none", fillCurves, curveWidth, "1 .3");

        this.createLine(margin, height - margin, width - margin, height - margin, bottomLineColor, bottomLineWidth);

        xValues.forEach((val, index) => {
            const x = (index * xScale) + margin;
            this.createLine(x, height - margin + bottomLineWidth / 2, x, height - margin - bottomLineWidth / 2, gradationColor, gradationWidth);

            const rotationX = x - 5;
            const rotationY = height - margin + 20;
            const rotationAngle = -30;
            this.createText(x, height - margin + 20, "10px", textColor, "end", data[index][xKey], `rotate(${rotationAngle},${rotationX},${rotationY})`);
        });

        this.createLine(margin, height - margin, margin, margin, verticalLineColor, verticalLineWidth);

        const yValues = [0, yMax / 2, yMax];
        yValues.forEach((val, i) => {
            const y = height - ((val * yScale) + margin);
            this.createLine(margin - gradationWidth, y, margin + verticalLineWidth / 2, y, i !== 0 ? gradationColor : verticalLineColor, gradationWidth);
            this.createText(margin - 10, y, "10px", textColor, "end", val);
        });

        
    }
}

Promise.all([
    fetch('results.json').then(response => response.json()),
    fetch('resultsSecund.json').then(response => response.json())
])
    .then(([data, data2]) => {
        const config = {
            width: 1440,
            height: 1000,
            margin: 150,
            xKey: "jour",
            yKey: "visites",
            fillCurves: "purple",
            curveWidth: 3,
            bottomLineColor: "rgb(100,200,255)",
            bottomLineWidth: 10,
            verticalLineColor: "rgb(100,200,255)",
            verticalLineWidth: 10,
            textColor: "grey",
            gradationColor: "rgba(255,255,255,1)",
            gradationWidth: 2,
            rectFillColor: "rgba(55, 55, 155, 0.5)",
            rectStrokeColor: "#000",
            rectStrokeWidth: 10,
            rect2FillColor: "rgba(100,100,255,.2)",
            rect2StrokeColor: "#f00",
            rect2StrokeWidth: 0
        };
        const svgCreator = new CurvesSVGCreator(document.body);
        svgCreator.createGraphic(config, data, data2);
    })
    .catch(error => console.error('Error:', error));


/// goPath here 

class GoPathSVG {
    constructor(linePath, svgContainer, nodeList) {
        this.linePath = linePath;
        this.svgContainer = svgContainer;
        this.nodeList = nodeList;
    }

    addElementsToPath(config) {
        const {
            typePoint,
            radius,
            strokeColorPoint,
            strokeWidth,
            wordSpace,
            dateSpace,
            classDate
        } = config;

        const lengthPath = this.linePath.getTotalLength();
        // Remove initial
        this.nodeList[0].parentNode.style.display = 'none';
        this.nodeList.forEach((element, index) => {
            const interval = (index + 1) * (lengthPath / (this.nodeList.length + 1));
            const points = this.linePath.getPointAtLength(interval);

            if (typePoint === 'circle') {
                this.createCircle(points.x, points.y, radius, strokeColorPoint, strokeWidth);
            }

            let yOffset = wordSpace;
            let dateYOffset = dateSpace;
            const dateText = element.children[0];

            if (dateText) {
                this.createText(points.x, points.y + dateYOffset, "3px", "middle", dateText.textContent, classDate);
            }

            Array.from(element.children).forEach((child, childIndex) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const fontSize = (childIndex === 0) ? "6px" : "5px";
                    const fontWeight = (childIndex === 0) ? "bold" : "normal";
                    const offsetMultiplier = (childIndex === 0) ? 1 : 0.5;
                    const words = child.textContent.split(/\s+/);

                    words.forEach(word => {
                        this.createText(points.x, points.y + yOffset * offsetMultiplier, fontSize, "middle", word, null, fontWeight);
                        yOffset += 10;
                    });
                }
            });
        });
    }

    createCircle(cx, cy, r, stroke, strokeWidth) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        circle.setAttribute("stroke", stroke);
        circle.setAttribute("stroke-width", strokeWidth);
        circle.setAttribute("fill", "none");
        this.svgContainer.appendChild(circle);
    }

    createText(x, y, fontSize, textAnchor, textContent, className, fontWeight = "normal") {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("font-size", fontSize);
        text.setAttribute("text-anchor", textAnchor);
        text.setAttribute("font-weight", fontWeight);
        text.textContent = textContent;
        if (className) {
            text.classList.add(className);
        }
        this.svgContainer.appendChild(text);
    }
}

// Utilisation de la classe GoPathSVG
const linePath = document.querySelector(".linePath");
const svgContainer = document.querySelector(".svgContainer");
const contentSvg = document.querySelectorAll(".elementPointSvg");

const goPathSVG = new GoPathSVG(linePath, svgContainer, contentSvg);

const config = {
    typePoint: 'circle',
    radius: 2,
    strokeColorPoint: 'black',
    strokeWidth: 0.2,
    wordSpace: 22,
    dateSpace: -10,
    classDate: 'titleItems'
};

goPathSVG.addElementsToPath(config);

// Fonction pour générer des variations de couleur sans changer l'alpha
function rgbaToHsla(rgba) {
    let [r, g, b, a] = rgba.match(/\d+(\.\d+)?/g).map(Number);
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100, a];
}

function generateColorVariations(baseColor, count, factorVariation,variationType = null,line) {
    const variations = [];
    const [h, s, l, a] = rgbaToHsla(baseColor);
    if(line===true){
        factorVariation = factorVariation*.6  ;
    }
    if(variationType === "hue"){
        for (let i = 0; i < count; i++) {
            const newH = l * (1 - (i / count) * factorVariation); // Adjust the factor as needed
            let newColor = `hsla(${newH}, ${s}%, ${l}%, ${a})`;
            variations.push(newColor);
        } 
    }
    
    if(variationType === "sat"){
        for (let i = 0; i < count; i++) {
            const newS = l * (1 - (i / count) * factorVariation); // Adjust the factor as needed
            let newColor = `hsla(${h}, ${newS}%, ${l}%, ${a})`;
            variations.push(newColor);
        } 
    } else if (variationType === "lum") {
        for (let i = 0; i < count; i++) {
            const newL = l * (1 - (i / count) * factorVariation); // Adjust the factor as needed
            let newColor = `hsla(${h}, ${s}%, ${newL}%, ${a})`;
            variations.push(newColor);
        }
    }
    return variations.reverse();
}


class PieChart {
    constructor(config, data) {
        this.colors = generateColorVariations(config.color, data.length,config.factorVariation,config.variationType); // Generate color variations
        this.factorVariation = config.factorVariation,
        this.variationType = config.variationType,
        this.fontSize = config.fontSize;
        this.svgSize = config.svgSize;
        this.circleRadius = config.circleRadius;
        this.fontFamily = config.fontFamily;
        this.strokeVarType == config.strokeVarType
        this.fontColor = config.fontColor;
        this.lineColor = config.lineColor;
        this.data = data.sort((a, b) => b[Object.keys(b)[1]] - a[Object.keys(a)[1]]); // Sort data by the second key (pourcentage)
;
        this.widthPath = config.widthPath;
        this.colorsStrokePath = generateColorVariations(config.color, data.length, config.factorVariation,config.strokeVarType,true);
    }

    createPieChart() {
        const svgNS = "http://www.w3.org/2000/svg";
        const radius = this.circleRadius;
        const colors = this.colors;
        const centerX = this.svgSize / 2;
        const centerY = this.svgSize / 2;
        let startAngle = 0;
        let labelDistance = 40; // Initial label distance

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", this.svgSize);
        svg.setAttribute("height", this.svgSize);
        svg.setAttribute("viewBox", `0 0 ${this.svgSize} ${this.svgSize}`);

        this.data.forEach((item, index) => {
            const sliceAngle = (item.pourcentage / 100) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;

            const x1 = centerX + radius * Math.cos(startAngle);
            const y1 = centerY + radius * Math.sin(startAngle);
            const x2 = centerX + radius * Math.cos(endAngle);
            const y2 = centerY + radius * Math.sin(endAngle);

            const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

            const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                "Z"
            ].join(" ");

            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("d", pathData);
            path.setAttribute("fill", colors[index % colors.length]);
            path.setAttribute("stroke", this.colorsStrokePath[index % colors.length]); console.log(this.colorsStrokePath[index % colors.length])
            path.setAttribute("stroke-width", this.widthPath); // Set the path width
            path.setAttribute("class","segments");

            svg.appendChild(path);

            // Calculate the position for the label
            const midAngle = startAngle + sliceAngle / 2;
            let labelRadius = radius + labelDistance; // Distance from the center for the label

            // Increase label distance for smaller segments
            if (sliceAngle < Math.PI / 9) { // Adjust this threshold as needed
                labelRadius += labelDistance === 80 ? 40 : 100; // Alternating between 50 and 80
            }

            const labelX = centerX + labelRadius * Math.cos(midAngle);
            const labelY = centerY + labelRadius * Math.sin(midAngle);

            // Draw a line from the segment to the label with increased length
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", centerX + radius * Math.cos(midAngle));
            line.setAttribute("y1", centerY + radius * Math.sin(midAngle));
            line.setAttribute("x2", labelX);
            line.setAttribute("y2", labelY);
            line.setAttribute("stroke", this.lineColor); // Utilisation de la couleur des lignes depuis la configuration
            line.setAttribute("stroke-width", .4);
            line.setAttribute("class","pieChartLine");

            // Adjust the position of the label slightly away from the line
            const labelOffsetX = labelX + (labelX - centerX) * 0.09;
            const labelOffsetY = labelY + (labelY - centerY) * 0.09;

            // Create the label
            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", labelOffsetX);
            text.setAttribute("y", labelOffsetY);
            text.setAttribute("font-size", this.fontSize);
            text.setAttribute("text-anchor", "middle"); // Horizontally centered text
            text.setAttribute("alignment-baseline", "middle");
            text.setAttribute("font-family", this.fontFamily);
            text.setAttribute("stroke", this.fontColor);
            text.setAttribute("strok-width", .1);
            text.setAttribute("class","pieChartFlags");

            text.textContent = `${item.activité}: ${item.pourcentage}%`;

            svg.appendChild(line);
            svg.appendChild(text);

            startAngle = endAngle;
            labelDistance = labelDistance === 30 ? 80 : 70; // Alternating between 50 and 80
        });

        return svg;
    }
    dynamics(event,transitionDuration){
        const allSegments = document.querySelectorAll('.segments');
        const allFlags = document.querySelectorAll('.pieChartFlags');
        const linesFlags = document.querySelectorAll('.pieChartLine');
        allFlags.forEach((el) => { el.style.opacity = 0; el.style.transition = transitionDuration + 's' })
        linesFlags.forEach((el) => { el.style.opacity = 0; el.style.transition = transitionDuration + 's'})
        allSegments.forEach((segment,index)=>{
            segment.style.filter = 'drop-shadow(0px 0px ' + 1 + 'px rgba(0,0,0,1)) saturate(0%)';
            segment.style.transition = '.6s ease-out';
            segment.addEventListener(event,(e)=>{
                allFlags.forEach((el) => { el.style.opacity = 0; el.style.transition = '1s ease';})
                linesFlags.forEach((el) => { el.style.opacity = 0; el.style.transition = '1s ease'; })
                allFlags[index].style.opacity = 1;
                allFlags[index].style.filter = 'drop-shadow(20px 20px ' + this.fontSize/2 +  'px rgba(0,0,0,.3)) ';
                allSegments[index].style.filter = 'drop-shadow(0px 3px ' + 10 + 'px rgba(0,0,0,1)) saturate(100%)';
                linesFlags[index].style.opacity = 1;
                
            })
        })
        if(event === "mouseout"){
            allSegments.forEach((segment, index) => {
                segment.addEventListener(event, (e) => {
                    allFlags.forEach((el) => { el.style.opacity = 0; })
                    linesFlags.forEach((el) => { el.style.opacity = 0; })
                    // allSegments.forEach((el) => { el.style.filter = ''; })
                    allFlags[index].style.opacity = 0;
                    linesFlags[index].style.opacity = 0;
                    segment.style.filter = 'drop-shadow(0px 0px ' + 1 + 'px rgba(0,0,0,1)) saturate(0%)';
                })
            })
        }


    }
}

// Configuration pour le camembert
const configPie = {
    color: "rgba(55,255,255,1)", // Couleur de base avec alpha
    factorVariation: 1.5,
    variationType: "hue",
    fontSize: 16,
    svgSize: 900,
    circleRadius: 130,
    widthPath: .1,
    fontFamily: "Helvetica",
    strokeVarType : "sat",
    lineColor: "rgb(100,100,100)",
    fontColor: "rgb(100,100,100)"
};

fetch('activ.json')
    .then(response => response.json())
    .then(data => {
        const pieChart = new PieChart(configPie, data);
        document.querySelector(".piechart").appendChild(pieChart.createPieChart());
        pieChart.dynamics('mouseenter',.3);
        pieChart.dynamics('mouseout',.3);
        const histogram = new Histogram3D(configu, data);
        const svg = histogram.createHistogram();

        document.getElementById("chart").appendChild(svg);
        document.querySelector('.chartStart').addEventListener('click',()=>{
            histogram.startAnimation();
        })
    })
    .catch(error => console.error('Error loading JSON data:', error));


class Histogram3D {
    constructor(config, data) {
        this.width = config.width;
        this.height = config.height;
        this.depth = config.depth;
        this.barWidth = config.barWidth;
        this.spacing = config.spacing;
        this.colors = config.colors;
        this.fontSize = config.fontSize;
        this.fontFamily = config.fontFamily;
        this.data = data;
        this.margin = { top: 200, right: 90, bottom: 50, left: 50 }; // Ajout des marges
        this.colorLine = config.colorLine;
        this.lineDash = config.lineDash;
        this.fontColor = config.fontColor;
        this.fontShadow = config.fontShadow;
        this.animate = config.animate;
        this.timerAnim = config.timerAnim;
    }

    createHistogram() {
        const svgNS = "http://www.w3.org/2000/svg";
        this.svg = document.createElementNS(svgNS, "svg");
        this.svg.setAttribute("width", this.width + this.margin.left + this.margin.right);
        this.svg.setAttribute("height", this.height + this.margin.top + this.margin.bottom);

        this.maxDataValue = Math.max(...this.data.map(item => Object.values(item)[1]));
        this.scaleFactor = this.height / this.maxDataValue;

        this.data.forEach((item, index) => {
            const keys = Object.keys(item);
            const label = item[keys[0]]; // Première clé pour l'étiquette
            const value = item[keys[1]]; // Deuxième clé pour la valeur
            const barHeight = value * this.scaleFactor;
            const x = this.margin.left + index * (this.barWidth + this.spacing);
            const y = this.margin.top + (this.height - barHeight);
            const depth = this.depth;

            // Définir la hauteur initiale en fonction de l'animation
            const initialHeight = this.animate ? 0.01 : barHeight;
            const initialY = this.animate ? this.margin.top + this.height : y;

            // Initial front face
            const front = this.createRect(svgNS, x, initialY, this.barWidth, initialHeight, this.colors[index % this.colors.length]);
            front.setAttribute('data-target-height', barHeight);
            front.setAttribute('data-target-y', y);
            this.svg.appendChild(front);

            // Top face
            const top = this.createPolygon(svgNS, [
                { x: x, y: y },
                { x: x + depth, y: y - depth },
                { x: x + this.barWidth + depth, y: y - depth },
                { x: x + this.barWidth, y: y }
            ], this.adjustColor(this.colors[index % this.colors.length], 0.7));
            this.svg.appendChild(top);

            // Side face
            const side = this.createPolygon(svgNS, [
                { x: x + this.barWidth, y: y },
                { x: x + this.barWidth + depth, y: y - depth },
                { x: x + this.barWidth + depth, y: y + barHeight - depth },
                { x: x + this.barWidth, y: y + barHeight }
            ], this.adjustColor(this.colors[index % this.colors.length], 0.6));
            this.svg.appendChild(side);

            // Label
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", x + this.barWidth);
            line.setAttribute("y1", y - 68); // Sommet de la barre
            line.setAttribute("x2", x + this.barWidth);
            line.setAttribute("y2", y - this.depth / 2); // Position du texte
            line.setAttribute("stroke", this.colorLine);
            if(this.lineDash[0] === true){
                line.setAttribute("stroke-dasharray",this.lineDash[1])
            }
            line.setAttribute("stroke-width", "1");
            line.style.filter = `drop-shadow(0px 0px 1px white)`;
            this.svg.appendChild(line);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", x + this.barWidth + 30);
            text.setAttribute("y", y - 50 ); // Positionner le texte légèrement au-dessus de la barre
            text.setAttribute("font-size", this.fontSize);
            text.style.fontFamily =  this.fontFamily;
            text.setAttribute("stroke", this.fontColor);
            text.setAttribute("text-anchor", "start");
            text.setAttribute("transform", `rotate(-30, ${x + this.barWidth / 2}, ${y - 10})`); // Rotation autour du nouveau point
            text.textContent = `${label.toUpperCase()}: ${value}%`; // Afficher l'étiquette et la valeur
            text.style.filter = `drop-shadow(1px 1px 0px ${this.fontShadow})`;
            this.svg.appendChild(text);
        });

        if (this.animate === true) {
            this.animateBars();
        }

        return this.svg;
    }

    animateBars() {
        const bars = this.svg.querySelectorAll('rect');
        const sides = this.svg.querySelectorAll('polygon');
        const lines = this.svg.querySelectorAll('line');
        let topSides = [];
        let sideSides = [];
        sides.forEach((e, i) => {
            if (i % 2 === 0) {
                topSides.push(e)
            } else {
                sideSides.push(e)
            }
        })
        const duration = this.timerAnim; // Durée de l'animation en millisecondes
        const startTime = performance.now();
        console.log(topSides)
        const animate = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            bars.forEach((bar, index) => {
                const targetHeight = parseFloat(bar.getAttribute('data-target-height'));
                const targetY = parseFloat(bar.getAttribute('data-target-y'));
                const currentHeight = targetHeight * progress;
                const currentY = this.margin.top + this.height - currentHeight;

                bar.setAttribute('height', currentHeight);
                bar.setAttribute('y', currentY);

                const pointsMapping = {
                    topY: topSides[index].points[2].y,
                    topSecY: topSides[index].points[1].y,
                    bottomSecY: topSides[index].points[0].y,
                    bottomY: topSides[index].points[3].y
                };
                let currentPointTopY = currentY - this.margin.bottom;
                let currentPointTopSecY = currentY - this.margin.bottom;
                let currentbottomSecY = currentY;
                let currentbottomY = currentY;


                // Mise à jour des points du polygone supérieur
                topSides[index].points[0].y = currentbottomSecY;
                topSides[index].points[1].y = currentPointTopY;
                topSides[index].points[2].y = currentPointTopSecY;
                topSides[index].points[3].y = currentbottomY;
                // console.log("topY:"+ currentPointTopY ,  currentY - this.margin.bottom );
                sideSides[index].points[0].y = currentbottomSecY;
                sideSides[index].points[1].y = currentPointTopY;

                lines[index].setAttribute('y2', currentPointTopSecY + this.depth / 2)


            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }
    startAnimation() {
        this.animateBars();
    }


    createRect(svgNS, x, y, width, height, color) {
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("fill", color); 
        rect.setAttribute('stroke', 'rgba(255,255,255,.3)');

        return rect;
    }

    createPolygon(svgNS, points, color) {
        const polygon = document.createElementNS(svgNS, "polygon");
        const pointsStr = points.map(p => `${p.x},${p.y}`).join(" ");
        polygon.setAttribute("points", pointsStr);
        polygon.setAttribute("data-target-points", pointsStr);
        polygon.setAttribute("fill", color);
        polygon.setAttribute('stroke', 'rgba(255,255,255,.3)');
        polygon.setAttribute('stroke-width', "1px")
        return polygon;
    }

    adjustColor(color, factor) {
        let [r, g, b, a] = this.hexToRgba(color);
        r = Math.min(255, r * factor);
        g = Math.min(255, g * factor);
        b = Math.min(255, b * factor);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    hexToRgba(hex) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}([A-Fa-f0-9]{2})?$/.test(hex)) {
            c = hex.substring(1).split('');
            if (c.length === 3) {
                c = [c[0], c[0], c[1], c[1], c[2], c[2], 'F', 'F'];
            } else if (c.length === 6) {
                c = c.concat(['F', 'F']);
            }
            c = '0x' + c.join('');
            return [
                (c >> 24) & 255,
                (c >> 16) & 255,
                (c >> 8) & 255,
                ((c & 255) / 255).toFixed(2) // Convert alpha to a decimal and round to 2 decimal places
            ];
        }
        throw new Error('Bad Hex');
    }

}


function generateColorVariation(baseColor, count) {
    // Helper function to clamp values between 0 and 255
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Helper function to convert RGBA to HEX
    function rgbaToHex(r, g, b, a) {
        return (
            "#" +
            ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase() +
            Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase()
        );
    }

    const variations = [];
    const [r, g, b, a] = baseColor;

    for (let i = 0; i < count; i++) {
        const variationFactor = i / (count - 1); // Range from 0 to 1
        const newR = clamp(Math.round(r * (1 - variationFactor)), 0, 255);
        const newG = clamp(Math.round(g * (1 - variationFactor)), 0, 255);
        const newB = clamp(Math.round(b * (1 - variationFactor)), 0, 255);
        variations.push(rgbaToHex(newR, newG, newB, a));
    }

    return variations;
}
const configu = {
    width: 1200,
    height: 500,
    depth: 50,
    barWidth: 47,
    spacing: 5,
    colors: generateColorVariation([255,250,20,0.8], 20),
    fontSize: 15,
    fontColor: "white",
    fontShadow: 'rgb(0,0,0)',
    colorLine: "white",
    lineDash: [true,"2 3"],
    fontFamily: "Helvetica",
    animate: true,
    timerAnim: 1500
};

