import Layer from "./layer";
import {NetworkData} from "./models/network_data";

export default class Network {

    private _layers: Array<Layer>;

    constructor(layers: Array<Layer> = []) {
        this._layers = layers;
    }

    /**
     * Generate the perceptrons, so input > hiddens > outputs each with their own number of nNeuronsInLayer
     * @param nInputs
     * @param nHiddens
     * @param nOutputs
     */
    generatePerceptrons(nInputs: number, nHiddens: Array<number>, nOutputs: number) {
        let index = 0;

        /* The input nNeuronsInLayer */
        const inputLayer = Layer.populated(index, nInputs, 0);
        this._layers.push(inputLayer);
        index++;

        /* The hidden nNeuronsInLayer layers */
        let previousNeurons = nInputs;
        for (var i in nHiddens) {
            const layer = Layer.populated(index, nHiddens[i], previousNeurons);
            previousNeurons = nHiddens[i];
            this._layers.push(layer);
            index++;
        }

        /* The output nNeuronsInLayer */
        const outputLayer = Layer.populated(index, nOutputs, previousNeurons);
        this._layers.push(outputLayer);
    }

    /**
     * Generate the concluded data from this network
     * @returns {NetworkData}
     */
    getData(): NetworkData {
        const data: NetworkData = {
            nNeuronsInLayer: [],
            weights: []
        };

        for (let i in this._layers) {
            data.nNeuronsInLayer.push(this._layers[i].neurons.length);
            for (let j in this._layers[i].neurons) {
                for (let k in this._layers[i].neurons[j].weights) {
                    data.weights.push(this._layers[i].neurons[j].weights[k]);
                }
            }
        }
        return data;
    }

    /**
     * Generate network from a set of data
     * @param data
     * @returns {Network}
     */
    static fromData(data: NetworkData): Network {
        let previousNeurons = 0;
        let index = 0;
        let indexWeights = 0;
        const layers: Array<Layer> = [];

        for (const i in data.nNeuronsInLayer) {
            /* Populate with the number of nNeuronsInLayer in this layer */
            const layer = Layer.populated(index, data.nNeuronsInLayer[i], previousNeurons);

            /* From this populated layer, transfer the weights back to the nNeuronsInLayer */
            for (let j in layer.neurons) {
                for (let k in layer.neurons[j].weights) {
                    layer.neurons[j].weights[k] = data.weights[indexWeights];
                    indexWeights++;
                }
            }
            previousNeurons = data.nNeuronsInLayer[i];
            index++;
            layers.push(layer);
        }

        return new Network(layers);
    }

    /**
     * Compute the output based on our input using the network of layers
     * @param inputs
     * @returns {Array<number>}
     */
    compute(inputs: number[]): Array<number> {
        /* Set the input values on the first (input) layer */
        for (const i in inputs) {
            if (this._layers[0] && this._layers[0].neurons[i]) {
                this._layers[0].neurons[i].value = inputs[i];
            }
        }

        /* Go through all of the layers (including the last) with the activation function */
        let prevLayer = this._layers[0];
        for (let i = 1; i < this._layers.length; i++) {
            for (const j in this._layers[i].neurons) {
                let sum = 0;
                for (const k in prevLayer.neurons) {
                    sum += prevLayer.neurons[k].value * this._layers[i].neurons[j].weights[k];
                }
                this._layers[i].neurons[j].value = Network.activation(sum);
            }
            prevLayer = this._layers[i];
        }

        /* Extract data from the last (output) layer */
        const out: Array<number> = [];
        const lastLayer = this._layers[this._layers.length - 1];
        for (const i in lastLayer.neurons) {
            out.push(lastLayer.neurons[i].value);
        }

        return out;
    }

    /**
     * The activation function! This determines something (Joris! Read!)
     * @param a
     * @returns {number}
     */
    private static activation(a: number): number {
        return (1 / (1 + Math.exp(-a)))
    }
}