class WorldMap {
    constructor(mapWidth, mapHeight, cellSize) {
        this.columns = Math.floor(mapWidth / cellSize);
        this.rows = Math.floor(mapHeight / cellSize);

        //Pixel Perfect
        this.mapWidth = mapWidth - (mapWidth % (this.columns * cellSize));
        this.mapHeight = mapHeight - (mapHeight % (this.rows * cellSize));
        this.rows--;

        //remove one row for ground, which IS calculated for the sizing of the canvas
        this.sunPower = 6;
        this.sunHits = 3;
        this.lifeExpectancy = 90;

        this.worldAge = 0;
        this.worldGeneration = 0;
        this.worldGenerationLength = 90;
        this.activeTrees = [];
        this.mapCells;

        //Init Map
        this.mapCells = new Array(this.columns);
        for (let arrayColumn = 0; arrayColumn < this.mapCells.length; arrayColumn++) {
            this.mapCells[arrayColumn] = new Array(this.rows);
            for (let arrayRow = 0; arrayRow < this.mapCells[arrayColumn].length; arrayRow++) {
                this.mapCells[arrayColumn][arrayRow] = null;
            }
        }
        this.seedWorldWithNrandomTrees(10);

    }
    newRandomTree(gap) {
        let x = gap || Math.floor(Math.random() * this.columns);
        let y = 10; //Math.random()*this.rows;
        this.newTree(x, y);
    }

    newTree(x, y) {
        let tree = new Tree(this, x, y);
        this.mapCells[x][y] = tree.firstCell
        this.activeTrees.push(tree)

        return tree;
    }

    seedWorldWithNrandomTrees(n) {
        let initialTrees = n;
        let gap = Math.round(this.columns / (initialTrees + 1));
        for (let i = 0; i < initialTrees; i++) {
            this.newRandomTree(gap * (i + 1))
        }
    }

    update() {
        this.worldAge++;
        this.applySunrays();
        this.updateTrees();
        this.checkForNoAction();

        // console.log(`${this.activeTrees[0].cells.length}: ${this.activeTrees[0].energy}`);

        return this.mapCells;
    }
    checkForNoAction() {
        if (this.activeTrees.length < 1) {
            this.seedWorldWithNrandomTrees(5);
        }
    }
    applySunrays() {
        let sunray = this.sunPower;

        for (let col = 0; col < this.columns; col++) {
            let hits = this.sunHits;
            for (let row = this.rows; row >= 0; row--) {
                if (hits === 0) break;
                if (!this.mapCells[col][row]) continue;

                let energy = (row + sunray) * hits;
                this.mapCells[col][row].giveEnergy(energy);
                hits--;
            }
        }
    }
    updateTrees() {
        for (let t = 0; t < this.activeTrees.length; t++) {
            if (this.activeTrees[t]) this.activeTrees[t].update();
        }
    }
}