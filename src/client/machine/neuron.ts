export default class Neuron {

    private _value = 0;
    private _weights: Array<number> = [];

    populate(n: number) {
        this._weights = [];
        for (var i = 0; i < n; i++) {
            this._weights.push(Neuron.randomClamped());
        }
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