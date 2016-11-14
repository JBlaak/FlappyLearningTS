import Genome from "./genome";
import {NetworkData} from "./models/network_data";

export default class Generation {

    private _genomes: Array<Genome> = [];

    private _population: number;
    private _elitism: number;
    private _randomBehaviour: number;
    private _nbChild: number;
    private _mutationRange: number;
    private _mutationRate: number;

    constructor(population: number,
                elitism: number,
                randomBehaviour: number,
                nbChild: number,
                mutationRange: number,
                mutationRate: number) {
        this._population = population;
        this._elitism = elitism;
        this._randomBehaviour = randomBehaviour;
        this._nbChild = nbChild;
        this._mutationRange = mutationRange;
        this._mutationRate = mutationRate;
    }

    addGenome(genome: Genome) {
        if (this._genomes.length === 0) {
            this._genomes.push(genome);
        }
        /* Add a genome nicely sorted based on score */
        for (let i = 0; i < this._genomes.length; i++) {
            if (genome.score > this._genomes[i].score) {
                this._genomes.splice(i, 0, genome);
                break;
            }
        }
    }

    next(): Array<NetworkData> {
        const nexts: Array<NetworkData> = [];
       
        /* Take the best of the previous networks (since the genomes are sorted) */
        for (let i = 0; i < Math.round(this._elitism * this._population); i++) {
            if (nexts.length < this._population) {
                nexts.push(Generation.copy(this._genomes[i].network));
            }
        }

        /* Add randomness by spawning with new weights */
        for (let i = 0; i < Math.round(this._randomBehaviour * this._population); i++) {
            /* Take a random copy */
            const network: NetworkData = Generation.copy(this._genomes[0].network);

            /* Alter the weights to random numbers */
            for (const k in network.weights) {
                network.weights[k] = Generation.randomClamped();
            }
            if (nexts.length < this._population) {
                nexts.push(network);
            }
        }

        /* Mutate existing genomes till we have a full population again */
        let max = 0;
        while (true) {
            for (let i = 0; i < max; i++) {
                /* Prefer breeding the best genomes; i.e. the first few */
                const children = this.breed(
                    this._genomes[i],
                    this._genomes[max],
                    (this._nbChild > 0 ? this._nbChild : 1)
                );

                for (const c in children) {
                    nexts.push(children[c].network);
                    if (nexts.length >= this._population) {
                        return nexts;
                    }
                }
            }
            max++;
            if (max > this._genomes.length) {
                max = 0;
            }
        }
    }

    /**
     * Breed two genomes, this will transfer certain weights, but also introduce random mutations based on
     * the mutationRate
     * @param genome1
     * @param genome2
     * @param nChilds
     * @returns {Array<Genome>}
     */
    private breed(genome1: Genome, genome2: Genome, nChilds: number): Array<Genome> {
        var result: Array<Genome> = [];

        for (let nb = 0; nb < nChilds; nb++) {
            let data: Genome = genome1.copy();

            /* Transfer weights */
            for (const i in genome2.network.weights) {
                if (Math.random() <= 0.5) {
                    data.network.weights[i] = genome2.network.weights[i];
                }
            }

            /* Mutate whole new weights */
            for (const i in data.network.weights) {
                if (Math.random() <= this._mutationRate) {
                    data.network.weights[i] += Math.random() * this._mutationRange * 2 - this._mutationRange;
                }
            }

            result.push(data);
        }

        return result;
    }

    private static randomClamped(): number {
        return Math.random() * 2 - 1;
    }

    private static copy(network: any) {
        return JSON.parse(JSON.stringify(network));
    }

}