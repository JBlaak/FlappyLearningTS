export default class Neuron {

    private _value = 0;
    private _weights: Array<number> = [];


    constructor(weights: Array<number> = []) {
        this._weights = weights;
    }

    static populated(n: number) {
        const weights: Array<number> = [];
        for (var i = 0; i < n; i++) {
            weights.push(Neuron.randomClamped());
        }

        return new Neuron(weights);
    }

    private static randomClamped(): number {
        return Math.random() * 2 - 1;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }

    get weights(): Array<number> {
        return this._weights;
    }

}