import View from "./game/view";
import {Snake} from './game/models/snake';
import {Cherry} from './game/models/cherry';

export default class Game {

    private _view: View;

    public static width = 100;
    public static height = 100;

    private constructor(
        public snake: Snake,
        public cherry: Cherry,
        private canvas: HTMLCanvasElement
    ) {
        this._view = new View(canvas)
    }

    public static create(canvas: HTMLCanvasElement): Game {
        const snake = {
            isAlive: true,
            coordinates: [
                (this.randomCoordinate())
            ]
        };

        const cherry = this.randomCoordinate();

        return new Game(snake, cherry, canvas);
    }


    public setNextCoordinate(x: number, y: number) {
        //Out of bounds
        if (x > Game.width || x < 0 || y > Game.height || y < 0) {
            this.snake.isAlive = false;
            this._view.draw(this);
            return;
        }
        //Bites in its tail
        if (this.snake.coordinates.some(coordinate => coordinate.x === x && coordinate.y === y)) {
            this.snake.isAlive = false;
            this._view.draw(this);
            return;
        }
        //If cherry just push the new coordinate
        if (this.cherry.x === x && this.cherry.y === y) {
            this.cherry = Game.randomCoordinate();
            this.snake.coordinates.push({
                x: x,
                y: y
            });
            this._view.draw(this);
            return;
        }
        //If no cherry, push new coordinate but pop tail
        this.snake.coordinates.push({
            x: x,
            y: y
        });
        this.snake.coordinates.shift();
        this._view.draw(this)
    }

    public kill() {
        this.snake.isAlive = false;
    }


    private static randomCoordinate() {
        return {
            x: Math.floor(Math.random() * Game.width),
            y: Math.floor(Math.random() * Game.height)
        };
    }
}