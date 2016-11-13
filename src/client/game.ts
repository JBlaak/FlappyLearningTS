import preload from "./preload";
import View from "./view";
import {Images} from "./models/images";
import Pipe from "./pipe";

export default class Game {

    private sprites = {
        bird: "./img/bird.png",
        background: "./img/background.png",
        pipetop: "./img/pipetop.png",
        pipebottom: "./img/pipebottom.png"
    };

    private _view: View|null;

    private _canvas: HTMLCanvasElement;

    /* Duration of a frame */
    private _frameDuration = 1000 / 120;

    /* Current location of the background */
    private _distanceTraveledPx = 0;

    /* Speed the background is moving in px */
    private _speed = 0.5;

    /* Interval at which new pipes spawn */
    private _spawnInterval = 240;

    /* Generated pipes */
    private _pipes: Array<Pipe> = [];

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
    }

    start(): void {
        this.preload().then(
            images => {
                this._view = new View(this._canvas, images);

                /* Add initial pipes */
                let offset = this._spawnInterval;
                do {
                    this._pipes.push(new Pipe(
                        offset,
                        this._canvas.height
                    ));
                    offset += this._spawnInterval;
                } while (offset < this._canvas.width);

                setInterval(() => {
                    this.step();
                }, this._frameDuration);
            }
        );
    }

    private step() {
        this._distanceTraveledPx += this._speed;

        /* Add new pipe every spawn interval */
        if (this._distanceTraveledPx % this._spawnInterval === 0) {
            this._pipes.push(new Pipe(
                this._distanceTraveledPx + this._canvas.width,
                this._canvas.height
            ));
        }

        /* Remove pipes that are out of view */
        for (let i = 0; i < this._pipes.length; i++) {
            const pipe = this._pipes[i];
            if (pipe.x - this._distanceTraveledPx < 0) {
                this._pipes.splice(i, 1);
            }
        }
       
        /* Pass to the view to render */
        if (this._view != null) {
            this._view.draw(
                this._distanceTraveledPx,
                this._pipes
            );
        }
    }

    private preload(): Promise<Images> {
        return new Promise((resolve, reject) => {
            Promise.all<HTMLImageElement>([
                preload(this.sprites.bird),
                preload(this.sprites.background),
                preload(this.sprites.pipetop),
                preload(this.sprites.pipebottom),
            ]).then(
                images => {
                    resolve({
                        bird: images[0],
                        background: images[1],
                        pipetop: images[2],
                        pipebottom: images[3]
                    });
                }
            );
        });
    }

}