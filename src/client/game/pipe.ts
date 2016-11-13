export default class Pipe {

    /* Location on X axis */
    private _x: number;

    /* Location on Y axis */
    private _y: number;
    
    /* Width of the pipe */
    private _width = 50;

    /* Size of opening in the pipe */
    private _opening = 120;

    constructor(x: number, maxHeight: number) {
        this._x = x;
        const space = maxHeight - this._opening;
        this._y = maxHeight - space * Math.random();
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get width(): number {
        return this._width;
    }

    get opening(): number {
        return this._opening;
    }
    
}