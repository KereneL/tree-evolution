class Tree {
    constructor(worldMap, initX, initY,genome) {

        //Worldmap refrence
        this.worldMap = worldMap;
        this.genome = genome;
        let deviationSize = 2;
        let deviation = Math.floor(Math.random() * (deviationSize * 2)) - deviationSize;
        this.lifeExpectancy = this.worldMap.lifeExpectancy + deviation;
        this.matureFactor = 0.2;
        this.age = 0;
        this.energy = 300;
        this.energyCostPerCell = 13;
        this.energyForNewCell = 18;

        //list of all the cells of this tree
        this.cells = [];
        this.didSeedSprout = false;

        let firstCell = new Cell(this, initX, initY, 0, 0, 0)
        this.firstCell = firstCell;
        this.cells.push(firstCell)

        return (this)
    }
    calcEnergy() {
        let energyCost = 0;
        if (this.didSeedSprout)
            energyCost = this.cells.length * this.energyCostPerCell;
        return energyCost;
    }

    update() {
        // After sketch.worldmapInstance finishes applySunrays(), there's energy for the tree to 'collect' in ordinary cells.
        // The energy is not absorbed in seed cells, and is not collected from offshoots.
        // Instead, the energy is accumulated in each offshoot until it has enough to sprout.
        // Excess energy is not distributed;
        //not from the tree's energy not from extra energy in offshoots just before they sprout.
        let energyCost = this.calcEnergy();
        this.energy -= energyCost;

        // during update, cells are sometimes added to cells[].
        // this causes a feedback loop that executes all possible growth at once, which is to be avoided.
        // A copy of cells[] iterates, while adding new said cells in the original cells[].
        // That sets the order for each tick.
        let activeCellsForThisTurn = [...this.cells]
        for (let i = 0; i < activeCellsForThisTurn.length; i++) {
            activeCellsForThisTurn[i].update()
        }

        // if this tree is not just a seed anymore,
        // check if there's enough energy for this tree,
        // if not, kill() this tree.
        // If it did not die, advance in age (🎉)
        if (this.firstCell.stage != 0) {
            if (this.energy <= 0 || this.age >= this.lifeExpectancy) {
                this.kill()
                return;
            }
        }
        this.age++;
    }

    kill() {
        // kill() all the cells for this tree, if they are mature enough, let the offshoots become seeds.
        let matured = (this.age >= this.lifeExpectancy * this.matureFactor)
        this.cells.forEach((cell) => {
            cell.kill(matured)
        })

        //check for record breaking
        this.worldMap.largestTree = Math.max(this.worldMap.largestTree, this.cells.length);

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
    // //TODO
    // alternativeKill(energyRatioInOffshootToBecomeASeed) {
    //     let r = energyRatioInOffshootToBecomeASeed;

    //     // kill() all the cells for this tree
    //     this.cells.forEach((cell) => {
    //         if (cell.energy >= (cell.tree.energyForNewCell * r)) {
    //             cell.kill(true);
    //         } else {
    //             cell.kill(false);
    //         }
    //     })
    //     // reset cells[] 
    //     this.cells = [];

    //     this.removeFromActiveTrees();
    // }
}