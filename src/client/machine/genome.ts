import {NetworkData} from "./models/network_data";
export default class Genome {
    private _score: number;
    private _network: NetworkData;

    constructor(score: number, network: NetworkData) {
        this._score = score;
        this._network = network;
    }

    get score(): number {
        return this._score;
    }

    get network(): NetworkData {
        return this._network;
    }

    copy(): Genome {
        return new Genome(
            this._score,
            JSON.parse(JSON.stringify(this._network))
        )
    }
}