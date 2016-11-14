import Generation from "./machine/generation";
import Network from "./machine/network";
import {NetworkData} from "./machine/models/network_data";
import Genome from "./machine/genome";
export default class Machine {

    /* Size of the population */
    private _population = 50;

    /* Number of nNeuronsInLayer in each part of the network */
    private _perceptronNetwork = {
        input: 2,
        hiddens: [2],
        output: 1
    };

    /* How many should be preserved */
    private _elitism = 0.2;

    /* How random should the system be */
    private _randomBehaviour = 0.2;

    /* How fast will stuff mutate */
    private _mutationRate = 0.1;

    /* When it mutates, how much */
    private _mutationRange = 0.5;

    /* Size of our generation history */
    private _historic = 0;

    /* Number of childs to be made in each generations */
    private _nbChild = 1;

    private _generations: Array<Generation> = [];

    nextGeneration(): Array<Network> {
        /* Generation creation */
        const networks = this._generations.length === 0
            ? this._firstGeneration()
            : this._nextGeneration();

        /* Transferring information about the generations */
        const nns: Array<Network> = [];
        for (const i in networks) {
            const nn = Network.fromData(networks[i]);
            nns.push(nn);
        }

        /* Prevent infinite growing of generations */
        if (this._generations.length > this._historic + 1) {
            this._generations.splice(0, this._generations.length - (this._historic + 1));
        }

        return nns;
    }

    setScoreOfNetwork(network: Network, score: number) {
        const genome = new Genome(score, network.getData());

        this._generations[this._generations.length - 1].addGenome(genome);
    }

    private _firstGeneration(): Array<NetworkData> {
        const result: Array<NetworkData> = [];

        for (let i = 0; i < this._population; i++) {
            const network = new Network();
            network.generatePerceptrons(
                this._perceptronNetwork.input,
                this._perceptronNetwork.hiddens,
                this._perceptronNetwork.output
            );
            result.push(network.getData());
        }
        this._generations.push(new Generation(
            this._population,
            this._elitism,
            this._randomBehaviour,
            this._nbChild,
            this._mutationRange,
            this._mutationRate
        ));

        return result
    }

    private _nextGeneration(): Array<NetworkData> {
        const gen = this._generations[this._generations.length - 1].next();
        this._generations.push(new Generation(
            this._population,
            this._elitism,
            this._randomBehaviour,
            this._nbChild,
            this._mutationRange,
            this._mutationRate
        ));

        return gen;
    }

}