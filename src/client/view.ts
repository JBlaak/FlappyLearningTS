import {Images} from "./models/images";
import Pipe from "./pipe";
export default class View {
    private _images: Images;
    private _ctx: CanvasRenderingContext2D;

    private _width = 512;
    private _height = 512;

    constructor(ctx: HTMLCanvasElement, images: Images) {
        this._ctx = <CanvasRenderingContext2D> ctx.getContext('2d');
        this._images = images;
    }

    draw(distanceTraveledPx: number, pipes: Array<Pipe>) {
        this._ctx.clearRect(0, 0, this._width, this._height);
        this.background(distanceTraveledPx);
        this.pipes(pipes, distanceTraveledPx);


    }

    private background(distanceTraveledPx: number) {
        for (let i = 0; i < Math.ceil(this._width / this._images.background.width) + 1; i++) {
            this._ctx.drawImage(
                this._images.background,
                i * this._images.background.width - Math.floor(distanceTraveledPx % this._images.background.width),
                0
            )
        }
    }

    private pipes(pipes: Array<Pipe>, distanceTraveledPx: number) {
        for (const key in pipes) {
            this._ctx.drawImage(
                this._images.pipetop,
                pipes[key].x - distanceTraveledPx,
                pipes[key].y - pipes[key].opening - this._images.pipetop.height,
                pipes[key].width,
                this._images.pipetop.height
            );

            this._ctx.drawImage(
                this._images.pipebottom,
                pipes[key].x - distanceTraveledPx,
                pipes[key].y,
                pipes[key].width,
                this._images.pipetop.height
            );
        }
    }
}