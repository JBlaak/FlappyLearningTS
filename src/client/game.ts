import preload from "./preload";
import View from "./view";
import {Images} from "./models/images";
import Pipe from "./pipe";
import Bird from "./bird";

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
    private _frameDuration = 1000 / 80;

    /* Current location of the background */
    private _distanceTraveledPx = 0;

    /* Speed the background is moving in px */
    private _speed = 0.5;

    /* Interval at which new pipes spawn */
    private _spawnInterval = 240;

    /* Generated pipes */
    private _pipes: Array<Pipe> = [];

    /* Active birds */
    private _birds: Array<Bird> = [];

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        
        /* Just to manually be able to flap all birds, note that you should do this when training the system */
        canvas.addEventListener('click', () => {
            this._birds.forEach(bird => bird.flap());
        });
    }

    start(): void {
        this.preload().then(
            images => {
                this._view = new View(this._canvas, images);

                this.attach();
            }
        );
    }

    private attach() {
        /* Add bird */
        //TODO move to neural network
        const bird = new Bird();
        this._birds.push(bird);

        /* Add initial pipes */
        let offset = this._spawnInterval;
        do {
            this._pipes.push(new Pipe(
                offset,
                this._canvas.height
            ));
            offset += this._spawnInterval;
        } while (offset < this._canvas.width);

        if (this._view !== null) {
            this._view.draw(0, this._pipes, this._birds);
        }
        setTimeout(() => {
            setInterval(() => {
                this.step();
            }, this._frameDuration);
        }, 2000);
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

        this._birds.forEach(bird => bird.update());

        /* Pass to the view to render */
        if (this._view != null) {
            this._view.draw(
                this._distanceTraveledPx,
                this._pipes,
                this._birds
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