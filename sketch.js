//let mapWidth = 1500; //px
//let mapHeight = 404;  //px
let cellsWide = 420;
let cellSize;  //px
let sunColor = 'RGB(253, 184, 019)';
let skyColor = 'RGB(183, 226, 252)';
let mapInstance;

function setup() {
    frameRate(60)

    let actualWidth = windowWidth * 0.92;
    let actualHeight = windowHeight * 0.92;

    cellSize = Math.round(actualWidth / cellsWide);
    mapInstance = new WorldMap(actualWidth, actualHeight * 0.5, cellSize);

    mapWidth = mapInstance.mapWidth;
    mapHeight = mapInstance.mapHeight;

    createCanvas(mapWidth, mapHeight);
}

function draw() {

    //  Draw gradient sky
    for (let y = 0; y < height; y += cellSize) {
        n = map(y, 0, height, 0, 1);
        let newc = lerpColor(color(sunColor), color(skyColor), n);
        fill(newc);
        noStroke();
        rect(0, y, width, cellSize);
    }
    //Draw Ground
    let y = (mapInstance.rows) * cellSize
    fill('RGB(212, 123, 74)');
    noStroke();
    rect(0, y, mapWidth, cellSize);
    //Update 1 tick
    mapInstance.update();
    //Draw on canvas
    drawMap();
}

function drawMap() {
    //Refrences only
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
function drawCell(column, row, color) {
    let x = column * cellSize
    let y = (mapInstance.rows - 1 - row) * cellSize
    let a = cellSize;
    let radius = 1;
    fill(color.fill);
    stroke(color.stroke);
    strokeWeight(1);
    rect(x, y, a, a, radius, radius, radius, radius);
}