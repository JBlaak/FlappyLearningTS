import Game from '../game';

export default class View {
    private _ctx: CanvasRenderingContext2D;

    private _width = 500;
    private _height = 500;

    constructor(ctx: HTMLCanvasElement) {
        this._ctx = <CanvasRenderingContext2D>ctx.getContext('2d');
    }

    public draw(game: Game) {
        this._ctx.clearRect(0, 0, this._width, this._height);

        const magnificationX = this._width / Game.width;
        const magnificationY = this._height / Game.height;

        this._ctx.fillStyle = "#000000";
        game.snake.coordinates.forEach(coordinate => {
            this._ctx.fillRect(
                coordinate.x * magnificationX,
                coordinate.y * magnificationY,
                magnificationX,
                magnificationY
            );
        });

        this._ctx.fillStyle = "#FF0000";
        this._ctx.fillRect(
            game.cherry.x * magnificationX,
            game.cherry.y * magnificationY,
            magnificationX,
            magnificationY
        );

    }

}