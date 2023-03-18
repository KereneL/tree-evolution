class Genome {

    constructor() {
        this.cellColors;

        this.genes = new Array(16);
        for (let i = 0; i < 16; i++) {
            this.genes[i] = new Array(4);
        }

        return this;
    }

    copyGenome() {
        let newGenes = new Genome();
        newGenes.genes = new Array(16);
        for (let i = 0; i < newGenes.genes.length; i++) {
            newGenes.genes[i] = new Array(4);
            for (let j = 0; j < newGenes.genes[i].length; j++) {
                newGenes.genes[i][j] = this.genes[i][j];
            }
        }
        return newGenes;
    }

    randomGenome() {
        this.genes = new Array(16);
        for (let g = 0; g < 16; g++) {
            this.genes[g] = new Array(4);

            for (let i = 0; i < 4; i++) {

                this.genes[g][i] = this.randomCode();
            }
        }

        this.cellColors = this.randomColor();
        return this;
    }
    randomCode() {
        let gene = Math.floor(Math.random() * 32);
        return gene;
    }
    copyColor() {
        let seedCol = this.cellColors.seed;
        let offshootCol = this.cellColors.offshoot;
        let ordinaryCol = this.cellColors.ordinary;
        let col = {
            'seed': { 'fill': seedCol.fill, 'stroke': seedCol.stroke },
            'offshoot': { 'fill': offshootCol.fill, 'stroke': offshootCol.stroke },
            'ordinary': { 'fill': ordinaryCol.fill, 'stroke': ordinaryCol.stroke }
        };
        return col;
    }
    randomColor() {
        let rnd = Math.random() * 360;
        let h = Math.floor(rnd);
        let col = {
            'seed': { 'fill': `hsl(${h},10%,10%)`, 'stroke': `hsl(${h},0%,0%)` },
            'offshoot': { 'fill': `hsl(${h},100%,100%)`, 'stroke': `hsl(${h},0%,0%)` },
            'ordinary': { 'fill': `hsl(${h},50%,50%)`, 'stroke': `hsl(${h},25%,25%)` }
        }
        return col;
    }

    mutate() {
        let chance = 0.25;
        if (Math.random() < chance)
            return false;

        let affectedGene = Math.floor(Math.random() * this.genes.length)
        let affectedCode = Math.floor(Math.random() * this.genes[affectedGene].length)

        this.genes[affectedGene][affectedCode] = this.randomCode();

        return true;
    }
}