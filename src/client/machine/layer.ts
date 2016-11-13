import Neuron from "./neuron";
export default class Layer {

    private _id: number;
    private _neurons: Array<Neuron> = [];

    constructor(id: number) {
        this._id = id;
    }

    populate(nNeurons: number, nInputs: number) {
        this._neurons = [];
        for (let i = 0; i < nNeurons; i++) {
            const neuron = new Neuron();
            neuron.populate(nInputs);
            this._neurons.push(neuron);
        }
    }

    get id(): number {
        return this._id;
    }

    get neurons(): Array<Neuron> {
        return this._neurons;
    }
}