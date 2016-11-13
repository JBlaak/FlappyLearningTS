export default class Bird {
    private _x = 80;
    private _y = 250;
    private _width = 40;
    private _height = 30;

    private _alive = true;
    private _gravity = 0;
    private _velocity = 0.3;
    private _jump = -6;

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get alive(): boolean {
        return this._alive;
    }

    get gravity(): number {
        return this._gravity;
    }

    get velocity(): number {
        return this._velocity;
    }

    get jump(): number {
        return this._jump;
    }

    update() {
        this._gravity += this._velocity;
        this._y += this._gravity;
    }

    flap() {
        this._gravity = this._jump;
    }
}