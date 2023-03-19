class WorldMap {
    constructor(mapWidth, mapHeight, cellSize) {
        //Give maximal number of COMPLETE rows/columns according to cellSize;
        this.columns = Math.floor(mapWidth / cellSize);
        this.rows = Math.floor(mapHeight / cellSize);

        //Make the canvas pixel perfect
        this.mapWidth = mapWidth - (mapWidth % (this.columns * cellSize));
        this.mapHeight = mapHeight - (mapHeight % (this.rows * cellSize));
        //Remove one row from calculations (this will be the ground floor, which is always static)
        this.rows--;

        //Set rules for this world
        //The sun power, and how many times can it hit something in each column
        this.sunPower = 6;
        this.sunHits = 3;
        //Set a basic life expectancy for trees.
        this.lifeExpectancy = 90;

        //Initialise this world
        this.worldAge = 0;
        this.worldGeneration = 0;
        this.worldGenerationLength = this.lifeExpectancy;
        this.activeTrees = [];

        //Flag for record size tree
        this.largestTree = 0;

        //This array will contain all the cells that are on the map
        this.mapCells;
        //Initialise map[][] according to size;
        this.mapCells = new Array(this.columns);
        for (let arrayColumn = 0; arrayColumn < this.mapCells.length; arrayColumn++) {
            this.mapCells[arrayColumn] = new Array(this.rows);
            for (let arrayRow = 0; arrayRow < this.mapCells[arrayColumn].length; arrayRow++) {
                this.mapCells[arrayColumn][arrayRow] = null;
            }
        }

        return this;
    }
    //This is the Tick Loop, called every sketch.js() and advances the map one stage forward.
    update() {
        //Age this world by 1
        //And approximate the generation it's at
        this.worldAge++;
        this.worldGeneration = Math.floor(this.worldAge / this.worldGenerationLength);

        //apply sun rays to map cells
        this.applySunrays();

        //update all active trees
        this.updateTrees();

        //make sure something is happening on map, so the simulation isn't empty (=boring)
        this.checkForNoAction();

        //return this mapCells[][] for sketch.js to use as data refrence
        return this.mapCells;
    }
    //If there are no trees on map (=boring), spawn n trees.
    checkForNoAction() {
        if (this.activeTrees.length < 1) {
            this.seedWorldWithNrandomTrees(10);
        }
    }
    newRandomTree(left) {
        //Get x from args or randomize along X axis
        //New trees are always created with a randomized y value of 10±3
        //x and y are to be floored, cellMaps[][] indices are natural numbers

        let x = left || Math.random() * this.columns;
        let y = 10; y += (Math.random() * 6) - 3;
        this.newTree(Math.floor(x), Math.floor(y), Genome.randomGenome());
    }
    newTree(x, y, genome) {
        //creates a new tree object at [x][y] (pass this tree as first argument)
        let tree = new Tree(this, x, y, genome);
        //inject it's first cell into mapCells
        this.mapCells[x][y] = tree.firstCell
        //and into activeTrees[].
        this.activeTrees.push(tree)
        //return newly created tree for the option of chaining
        return tree;
    }
    //Create n random trees, distribute them evenly across the x axis.
    seedWorldWithNrandomTrees(n) {
        let treesToCreate = n;
        let gap = Math.floor(this.columns / (treesToCreate + 1));
        for (let i = 0; i < treesToCreate; i++) {
            this.newRandomTree(gap * (i + 1))
        }
    }
    //the sun in this world gives it's rays
    applySunrays() {
        //this sun has a predetermined power;
        const sunray = this.sunPower;

        //for each column on this map,
        for (let col = 0; col < this.columns; col++) {
            //start a new ray, with a limited amount of cell hits possible
            let hits = this.sunHits;

            //start from the top cell, and go down
            for (let row = this.rows; row >= 0; row--) {

                if (hits === 0) break;
                if (!this.mapCells[col][row]) continue;

                //Only if there are still more hits to go, and we hit a cell,
                //calculate the energy given energy by the ray and give it to the relevant cell;
                //Count one hit down.
                let energy = (row + sunray) * hits;
                this.mapCells[col][row].recieveEnergy(energy);
                hits--;
            }
        }
    }
    //Go over all active trees and update() them
    updateTrees() {
        for (let t = 0; t < this.activeTrees.length; t++) {
            if (this.activeTrees[t]) this.activeTrees[t].update();
        }
    }
}