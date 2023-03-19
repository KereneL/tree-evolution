class Genome {

    static randomGenome() {
        let rndGenome = new Genome();
        for (let g = 0; g < rndGenome.genes.length; g++) {
            for (let c = 0; c < rndGenome.genes[g].length; c++) {
                rndGenome.genes[g][c] = Genome.randomCode();
            }
        }
        rndGenome.cellColors = Genome.randomColor();
        return rndGenome;
    }
    static randomCode() {
        let gene = Math.floor(Math.random() * 32);
        return gene;
    }
    static randomColor() {
        let rnd = Math.random() * 360;
        let h = Math.floor(rnd);
        let color = {
            'seed': { 'fill': `hsl(${h},10%,10%)`, 'stroke': `hsl(${h},0%,0%)` },
            'offshoot': { 'fill': `hsl(${h},100%,100%)`, 'stroke': `hsl(${h},0%,0%)` },
            'ordinary': { 'fill': `hsl(${h},50%,50%)`, 'stroke': `hsl(${h},25%,25%)` }
        }
        return color;
    }

    constructor() {
        this.cellColors;

        this.genes = new Array(16);
        for (let g = 0; g < this.genes.length; g++) {
            this.genes[g] = new Array(4);
        }

        return this;
    }

    copyGenome() {
        let newGenome = new Genome();
        newGenome.genes = this.copyGenes();
        newGenome.cellColors = this.copyColor();
        return newGenome;
    }

    copyGenes() {
        let newGenes = new Array(16);
        for (let g = 0; g < newGenes.length; g++) {
            newGenes[g] = new Array(4);
            for (let c = 0; c < newGenes[g].length; c++) {
                newGenes[g][c] = this.genes[g][c];
            }
        }
        return newGenes;
    }
    copyColor() {
        let seedCol = this.cellColors.seed;
        let offshootCol = this.cellColors.offshoot;
        let ordinaryCol = this.cellColors.ordinary;

        let newColor = {
            'seed': { 'fill': seedCol.fill, 'stroke': seedCol.stroke },
            'offshoot': { 'fill': offshootCol.fill, 'stroke': offshootCol.stroke },
            'ordinary': { 'fill': ordinaryCol.fill, 'stroke': ordinaryCol.stroke }
        };
        return newColor;
    }

    mutate() {
        let chance = 0.50;
        if (Math.random() < chance)
            return false;

        let affectedGene = Math.floor(Math.random() * this.genes.length)
        let affectedCode = Math.floor(Math.random() * this.genes[affectedGene].length)

        this.genes[affectedGene][affectedCode] = Genome.randomCode();

        return true;
    }
}