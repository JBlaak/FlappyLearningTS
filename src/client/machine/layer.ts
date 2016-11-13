import Neuron from "./neuron";
export default class Layer {

    private _id: number;
    private _neurons: Array<Neuron> = [];

    constructor(id: number, neurons: Array<Neuron> = []) {
        this._id = id;
        this._neurons = neurons;
    }

    static populated(id: number, nNeurons: number, nInputs: number): Layer {
        const neurons: Array<Neuron> = [];
        for (let i = 0; i < nNeurons; i++) {
            const neuron = Neuron.populated(nInputs);
            neurons.push(neuron);
        }

        return new Layer(id, neurons);
    }

    get id(): number {
        return this._id;
    }

    get neurons(): Array<Neuron> {
        return this._neurons;
    }
}