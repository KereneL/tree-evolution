class Cell {
    constructor(tree, x, y, activeGene, stage, energy) {
        this.tree = tree;
        this.x = x;
        this.y = y;
        this.stage = stage;
        this.activeGene = activeGene;
        //0 = seed
        //1 = offshoot
        //2 = ordinary
        this.energy = energy;
        this.colors;
        this.getColors();
    }

    getColors() {
        switch (this.stage) {
            case 0:
                this.colors = this.tree.genome.cellColors.seed;
                break;
            case 1:
                this.colors = this.tree.genome.cellColors.offshoot;
                break;
            case 2:
            default:
                this.colors = this.tree.genome.cellColors.ordinary;
                break;
        }
    }

    update() {
        //console.log(this.stage)
        switch (this.stage) {
            case 0:
                this.applyGravity();
                break;
            case 1:
                if (this.energy >= this.tree.energyForNewCell) {

                    this.energy -= this.tree.energyForNewCell;
                    this.activateOffshoot();
                    return;
                }
                break;
            case 2:
                // This should call giveEnergy()

                this.tree.energy += this.energy;
                this.energy = 0;
                break;
        }

    }

    applyGravity() {
        if (this.y === 0) { this.activateSeed(); return }

        if (!this.tree.worldMap.mapCells[this.x][this.y - 1]) {

            this.tree.worldMap.mapCells[this.x][this.y - 1] = this.tree.worldMap.mapCells[this.x][this.y];
            this.tree.worldMap.mapCells[this.x][this.y] = null;

            this.y--;
        }
        else {
            this.tree.kill(false);
        }

    }

    activateSeed() {
        this.stage = 1; //offshoot
        this.getColors();
        this.tree.didSeedSprout = true;
        this.tree.energy += this.energy;
        this.energy = 0;
    }

    giveEnergy(energy) {

        if (this.stage === 0)
            return;
        if (this.stage === 1) {
            this.energy += energy;
            return;
        }
        if (this.stage === 2) {
            this.energy += energy;
            return;
        }

    }
    activateOffshoot() {
        this.stage = 2; //ordinary
        this.getColors();
        this.tree.energy += this.energy;
        this.energy = 0;

        let genomeRef = this.tree.genome.genes;
        let geneRef = genomeRef[this.activeGene];

        // Clock-wise from "12": Top, Right, Bottom, Left, when origin is bottom-left
        if (geneRef[0] < genomeRef.length) this.growCell(0, 1, geneRef[0])
        if (geneRef[1] < genomeRef.length) this.growCell(1, 0, geneRef[1])
        if (geneRef[2] < genomeRef.length) this.growCell(0, -1, geneRef[2])
        if (geneRef[3] < genomeRef.length) this.growCell(-1, 0, geneRef[3])

        //let activeCellsRef = this.tree.activeCells;
        //let index = activeCellsRef.indexOf(this);
        //activeCellsRef = activeCellsRef.splice(index, 1);
    }

    growCell(xOffset, yOffset, gene) {
        let mapRef = this.tree.worldMap.mapCells;
        let xRef = this.x + xOffset;
        let yRef = this.y + yOffset;

        let columns = this.tree.worldMap.columns;
        xRef += columns; xRef = (xRef) % (columns);

        let boundaryCheck = (xRef < 0 || xRef >= this.tree.worldMap.mapCells.length ||
            yRef < 0 || yRef >= this.tree.worldMap.mapCells[xRef].length);
        if (boundaryCheck) return;

        let isCellOccupied = mapRef[xRef][yRef];
        if (isCellOccupied) {
            if (isCellOccupied.stage != 0) return;
        }

        let newCell = new Cell(this.tree, xRef, yRef, gene, 1, 0);
        mapRef[xRef][yRef] = newCell;
        this.tree.cells.push(newCell)
    }
    //TODO
    kill(turnOffShootsToSeeds) {
        this.tree.worldMap.mapCells[this.x][this.y] = null;

        if (this.stage != 1) return;

        if (!turnOffShootsToSeeds) return;
        let newSeed = this.tree.worldMap.newTree(this.x, this.y)
        let newGenome = this.tree.genome.copyGenome();

        let cellColors;
        let mutated = newGenome.mutate();
        if (mutated) newGenome.cellColors = newGenome.randomColor();
        else newGenome.cellColors = this.tree.genome.copyColor();

        newSeed.genome = newGenome;
        newSeed.cellColors = cellColors;
    }
}