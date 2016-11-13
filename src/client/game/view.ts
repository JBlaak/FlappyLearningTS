import {Images} from "./models/images";
import Pipe from "./pipe";
import Bird from "./bird";
export default class View {
    private _images: Images;
    private _ctx: CanvasRenderingContext2D;

    private _width = 512;
    private _height = 512;

    constructor(ctx: HTMLCanvasElement, images: Images) {
        this._ctx = <CanvasRenderingContext2D> ctx.getContext('2d');
        this._images = images;

        this.draw(0, [], []);
    }

    draw(backgroundOffsetPx: number, pipes: Array<Pipe>, birds: Array<Bird>) {
        this._ctx.clearRect(0, 0, this._width, this._height);
        this.background(backgroundOffsetPx);
        this.pipes(pipes, backgroundOffsetPx);
        this.birds(birds);
    }

    private background(backgroundOffsetPx: number) {
        for (let i = 0; i < Math.ceil(this._width / this._images.background.width) + 1; i++) {
            this._ctx.drawImage(
                this._images.background,
                i * this._images.background.width - Math.floor(backgroundOffsetPx % this._images.background.width),
                0
            )
        }
    }

    private pipes(pipes: Array<Pipe>, backgroundOffsetPx: number) {
        for (const key in pipes) {
            this._ctx.drawImage(
                this._images.pipetop,
                pipes[key].x - backgroundOffsetPx,
                pipes[key].y - pipes[key].opening - this._images.pipetop.height,
                pipes[key].width,
                this._images.pipetop.height
            );

            this._ctx.drawImage(
                this._images.pipebottom,
                pipes[key].x - backgroundOffsetPx,
                pipes[key].y,
                pipes[key].width,
                this._images.pipetop.height
            );
        }
    }

    private birds(birds: Array<Bird>) {
        this._ctx.fillStyle = "#FFC600";
        this._ctx.strokeStyle = "#CE9E00";
        for (var i in birds) {
            if (birds[i].alive) {
                this._ctx.save();
                this._ctx.translate(birds[i].x, birds[i].y);
                this._ctx.translate(birds[i].width, birds[i].height);
                this._ctx.rotate(Math.PI / 2 * birds[i].gravity / 20);
                this._ctx.drawImage(this._images.bird, -birds[i].width, -birds[i].height, birds[i].width, birds[i].height);
                this._ctx.restore();
            }
        }
    }

}