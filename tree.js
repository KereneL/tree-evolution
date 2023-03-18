class Tree {
    constructor(worldMap, initX, initY) {
        this.worldMap = worldMap;
        this.genome = new Genome().randomGenome();
        let deviationSize = 2;
        let deviation = Math.floor(Math.random() * (deviationSize * 2)) - deviationSize;
        this.lifeExpectancy = this.worldMap.lifeExpectancy + deviation;
        this.age = 0;
        this.energy = 200;
        this.energyCostPerCell = 13;
        this.energyForNewCell = 18;

        this.cells = [];
        //this.originType = 0;
        this.didSeedSprout = false;

        let firstSeed = new Cell(this, initX, initY, 0, 0, 0)
        this.firstCell = firstSeed;
        this.cells.push(firstSeed)

        return (this)
    }
    calcEnergy() {
        let output = 0;
        if (this.firstCell.stage > 0) {
            output = this.cells.length * this.energyCostPerCell;
        }
        return (output);

    }

    update() {

        // After sketch.worldmapInstance finishes applySunrays(), there's energy to 'collect' in ordinary cells.
        // The energy is not absorbed in seed cells, and is not collected from offshoots.
        // Instead, the energy is accumulated in each offshoot until it has enough to sprout.
        // Excess energy is not distributed;
        //not from the tree's energy not from extra energy in offshoots just before they sprout.


        // if this tree is not just a seed anymore,
        // check if there's enough energy for this tree,
        // if not, kill() this tree.
        // If it did not die, advance in age (🎉)

        // during update, cells are sometimes added to cells[].
        // this causes a feedback loop that executes all possible growth at once,
        // which is to be avoided. A copy of cells[] iterates,
        // while adding new said cells in the original cells[]
        //console.log(this.energy);

        let energyCost = this.calcEnergy();
        this.energy -= energyCost;

        let activeCellsForThisTurn = [...this.cells]
        for (let i = 0; i < activeCellsForThisTurn.length; i++) {
            activeCellsForThisTurn[i].update()
        }

        if (this.firstCell.stage != 0) {
            if (this.energy <= 0 || this.age >= this.lifeExpectancy) {
                this.kill()
                return;
            }
        }
        this.age++;
    }

    kill() {
        // kill() all the cells for this tree
        let aged = (this.age >= this.lifeExpectancy / 2)
        this.cells.forEach((cell) => {
            cell.kill(aged)
        })
        // reset cells[] 
        this.cells = [];

        this.removeFromActiveTrees();
    }

    alternativeKill(energyRatioInOffshootToBecomeASeed) {
        let r = energyRatioInOffshootToBecomeASeed;

        // kill() all the cells for this tree
        this.cells.forEach((cell) => {
            if (cell.energy >= (cell.tree.energyForNewCell * r)) {
                cell.kill(true);
            } else {
                cell.kill(false);
            }
        })
        // reset cells[] 
        this.cells = [];

        this.removeFromActiveTrees();
    }
    removeFromActiveTrees() {
        // Remove self from worldMap.Instance.activeTrees[]
        let activeTrees = this.worldMap.activeTrees;
        let index = activeTrees.indexOf(this);
        activeTrees = activeTrees.splice(index, 1);
    }
}