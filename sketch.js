// cellSize in pixels
let cellSize;
//scene colors
let sunColor = 'RGB(253, 184, 019)';
let skyColor = 'RGB(183, 226, 252)';
let groundColor = 'RGB(212, 123, 74)'

//Main data source for this sketch
let mapInstance;
let actualWidth, actualHeight;

//boolean pause flag- start as unpaused.
let paused = false;

function setup() {
    //It is possible to control FPS, p5js default is 60
    //frameRate(30)

    //How many cells wide this map should be
    let cellsWide = 300; 

    let mapWidth = windowWidth;
    let mapHeight = windowHeight;

    cellSize = Math.floor(mapWidth / cellsWide);
    mapInstance = new WorldMap(mapWidth, mapHeight * 0.5, cellSize);

    actualWidth = mapInstance.mapWidth;
    actualHeight = mapInstance.mapHeight;

    createCanvas(actualWidth, actualHeight);
}

function draw() {

    // If paused, return
    if (paused) return;

    //Draw scene
    drawScene()

    //Update 1 tick on mapInstance.
    //And draw map on canvas
    mapInstance.update();
    drawMap();

    //Add marker texts
    drawTexts();
}
function drawScene(){
    drawGradientSky()
    drawGround()
}
function drawGradientSky(){
    //for each height level, map the range of realtive position and world height
    for (let y = 0; y < actualHeight; y += cellSize) {
        n = map(y, 0, actualHeight, 0, 1);
        // Linear interpolate the scene colors based on n (=where is it in this gradient)
        let newColor = lerpColor(color(sunColor), color(skyColor), n);

        //Draw this light level rectangle in the correct color.
        fill(newColor);
        noStroke();
        rect(0, y, actualWidth, cellSize);
    }
}
function drawGround(){
    let y = (mapInstance.rows) * cellSize
    fill(groundColor);
    noStroke();
    rect(0, y, actualWidth, cellSize);
}
function mouseClicked() {
    paused = !paused;
    if (paused) drawPausedText();
  }

function drawMap() {
    //Refrences only for convienience
    let columns = mapInstance.columns;
    let rows = mapInstance.rows;
    let mapCells = mapInstance.mapCells;

    //For each cell on map, draw it with the right color (but only if they exist)
    for (let column = 0; column < columns; column++) {
        for (let row = rows - 1; row >= 0; row--) {

            let currentCell = mapCells[column][row];
            if (!currentCell) continue;

            //Draw individual cell
            drawCell(column, row, currentCell.colors);
        }
    }
}
function drawTexts(){
    textSize(16);
    fill(0);
    noStroke();
    textStyle(NORMAL);
    text(`Generation: ${mapInstance.worldGeneration}`, 10, 30);
    text(`Trees: ${mapInstance.activeTrees.length}`, 10, 50);
    text(`Record Largest Tree: ${mapInstance.largestTree} cells`, 10, 70);
}
function drawPausedText(){
    textSize(16);
    fill('RGB(255, 00, 00)');
    noStroke();
    textStyle(BOLD);
    text(`⏸ PAUSED`, 10, 100);
}
function drawCell(column, row, color) {
    let x = column * cellSize
    let y = (mapInstance.rows - 1 - row) * cellSize
    let a = cellSize;

    //Radius is for rounded corners
    let radius = cellSize/Math.PI;
    fill(color.fill);
    stroke(color.stroke);
    strokeWeight(1);
    rect(x, y, a, a, radius, radius, radius, radius);
}