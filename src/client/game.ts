import preload from "./game/preload";
import View from "./game/view";
import {Images} from "./game/models/images";
import Pipe from "./game/pipe";
import Bird from "./game/bird";
import Timer = NodeJS.Timer;

export default class Game {

    private sprites = {
        bird: "./img/bird.png",
        background: "./img/background.png",
        pipetop: "./img/pipetop.png",
        pipebottom: "./img/pipebottom.png"
    };

    private _loaded = false;

    private _started = false;

    private _view: View|null = null;

    private _canvas: HTMLCanvasElement;

    /* Duration of a frame */
    private _frameDuration = 1000 / (60 * 10);

    /* Should we draw anything */
    private _drawing: boolean = false;

    /* Current location of the background */
    private _distanceTraveledPx = 0;

    /* Speed the background is moving in px */
    private _speed = 2;

    /* Interval at which new pipes spawn */
    private _spawnInterval = 240;

    /* Generated pipes */
    private _pipes: Array<Pipe> = [];

    /* Active birds */
    private _birds: Array<Bird> = [];

    /* Our timer running everything */
    private _interval: Timer|null = null;

    /* On tick listeners */
    private _tickListeners: Array<() => any> = [];

    /* On die listeners */
    private _dieListeners: Array<(bird: Bird) => any> = [];

    /* On terminate listeners */
    private _terminateListeners: Array<() => any> = [];

    constructor(canvas: HTMLCanvasElement, drawing: boolean = false) {
        this._canvas = canvas;
        this._drawing = drawing;
    }

    start(birds: Array<Bird>): void {
        this._birds = birds;
        if (!this._loaded) {
            this.preload().then(
                images => {
                    this._loaded = true;
                    this._view = new View(this._canvas, images);

                    this.attach();
                }
            );
        } else {
            this.attach();
        }
    }

    onTick(listener: () => any) {
        this._tickListeners.push(listener);
    }

    onDie(listener: (bird: Bird)=>any) {
        this._dieListeners.push(listener);
    }

    onTerminate(listener: ()=>any) {
        this._terminateListeners.push(listener);
    }

    get distanceTraveledPx(): number {
        return this._distanceTraveledPx;
    }

    get pipes(): Array<Pipe> {
        return this._pipes;
    }

    private terminate(): void {
        this.detach();
        this._terminateListeners.forEach(listener => listener());
        this._distanceTraveledPx = 0;
        this._pipes = [];
        this._birds = [];
    }

    private attach() {
        this._started = true;
        /* Add initial pipes */
        let offset = this._spawnInterval;
        do {
            this._pipes.push(new Pipe(
                offset,
                this._canvas.height
            ));
            offset += this._spawnInterval;
        } while (offset < this._canvas.width);

        if (this._view !== null && this._drawing) {
            this._view.draw(0, this._pipes, this._birds);
        }

        if (!this._drawing) {
            while (this._started) {
                this.step();
            }
        } else {
            this._interval = setInterval(() => {
                this.step();
            }, this._frameDuration);
        }
    }

    private detach() {
        this._started = false;
        if (this._interval !== null) {
            clearInterval(this._interval)
        }
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

        /* Flap the birds */
        this._birds.forEach(bird => bird.update());

        /* Determine if they killed themselves */
        this._birds
            .filter(bird => bird.alive)
            .forEach(bird => {
                this._pipes.forEach(pipe => {
                    //TODO fix this so that the "ass" of the bird also is hit
                    if (
                        (
                            /* Top pipe */
                            bird.x + bird.width > pipe.x - this._distanceTraveledPx
                            && bird.y < pipe.y - pipe.opening
                            && bird.x + bird.width < pipe.x + pipe.width - this._distanceTraveledPx
                        )
                        || (
                            /* Bottom pipe */
                            bird.x + bird.width > pipe.x - this._distanceTraveledPx
                            && bird.x + bird.width < pipe.x + pipe.width - this._distanceTraveledPx
                            && bird.y + bird.height > pipe.y
                        )
                        || bird.y > this._canvas.height
                        || bird.y + bird.height <= 0) {
                        bird.alive = false;
                        this._dieListeners.forEach(listener => listener(bird));
                    }
                });
            });

        /* Pass to the view to render */
        if (this._view != null && this._drawing) {
            this._view.draw(
                this._distanceTraveledPx,
                this._pipes,
                this._birds
            );
        }

        this._tickListeners.forEach(listener => listener());

        if (!this._birds.some(bird => bird.alive)) {
            this.terminate();
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