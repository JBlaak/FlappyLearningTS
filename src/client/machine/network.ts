import Layer from "./layer";
import {NetworkData} from "./models/network_data";

export default class Network {

    private _layers: Array<Layer>;

    constructor(layers: Array<Layer> = []) {
        this._layers = layers;
    }

    generatePerceptrons(input: number, hiddens: Array<number>, output: number) {
        let index = 0;
        let previousNeurons = 0;

        const inputLayer = new Layer(index);
        inputLayer.populate(input, previousNeurons);
        this._layers.push(inputLayer);
        index++;

        previousNeurons = input;
        for (var i in hiddens) {
            const layer = new Layer(index);
            layer.populate(hiddens[i], previousNeurons);
            previousNeurons = hiddens[i];
            this._layers.push(layer);
            index++;
        }

        let layer = new Layer(index);
        layer.populate(output, previousNeurons);
        this._layers.push(layer);
    }

    getData(): NetworkData {
        const data: NetworkData = {
            neurons: [],
            weights: []
        };
        for (let i in this._layers) {
            data.neurons.push(this._layers[i].neurons.length);
            for (let j in this._layers[i].neurons) {
                for (let k in this._layers[i].neurons[j].weights) {
                    data.weights.push(this._layers[i].neurons[j].weights[k]);
                }
            }
        }
        return data;
    }

    static fromData(data: NetworkData): Network {
        let previousNeurons = 0;
        let index = 0;
        let indexWeights = 0;
        const layers: Array<Layer> = [];

        for (const i in data.neurons) {
            var layer = new Layer(index);
            layer.populate(data.neurons[i], previousNeurons);
            for (let j in layer.neurons) {
                for (let k in layer.neurons[j].weights) {
                    layer.neurons[j].weights[k] = data.weights[indexWeights];
                    indexWeights++;
                }
            }
            previousNeurons = data.neurons[i];
            index++;
            layers.push(layer);
        }

        return new Network(layers);
    }

    compute(inputs: number[]): Array<number> {
        /* Set the input values on the first (input) layer */
        for (const i in inputs) {
            if (this._layers[0] && this._layers[0].neurons[i]) {
                this._layers[0].neurons[i].value = inputs[i];
            }
        }

        /* Go through all of the layers with the activation function */
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
        const ap = (-a) / 1;
        return (1 / (1 + Math.exp(ap)))
    }
}