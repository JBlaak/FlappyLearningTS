import Game from './client/game';
import Bird from "./client/game/bird";
import Machine from "./client/machine";

const run = (onTerminate: (result: number) => any, machine: Machine, drawing: boolean) => {

    const canvas = document.querySelector("#flappy") as HTMLCanvasElement;
    const game = new Game(canvas, drawing);
    const networks = machine.proceed();

    /* Add the birds based on how many generations we have */
    const birds: Array<Bird> = [];
    for (let i = 0; i < networks.length; i++) {
        birds.push(new Bird());
    }

    /* On each tick propagate conclusions of the network on what to do */
    game.onTick(() => {
        if (birds.filter(bird => bird.alive).length > 0) {

            /* Get the next pipe height as an input */
            let nextPipeHeightPx: number|null = null;
            for (let i = 0; i < game.pipes.length; i++) {
                if (game.pipes[i].x + game.pipes[i].width - game.distanceTraveledPx > birds[i].x) {
                    nextPipeHeightPx = game.pipes[i].y;
                    break;
                }
            }

            /* Compute using the network */
            for (let i = 0; i < networks.length; i++) {
                const res: Array<number> = networks[i].compute([birds[i].y / canvas.height, nextPipeHeightPx / canvas.height]);

                /* Take the output of the first neuron for the flapping */
                if (res[0] > 0.5) {
                    birds[i].flap();
                }
            }
        }
    });

    game.onDie(bird => {
        for (let i = 0; i < birds.length; i++) {
            if (birds[i] === bird) {
                machine.networkScore(networks[i], game.distanceTraveledPx);
            }
        }
    });

    game.onTerminate(() => {
        onTerminate(game.distanceTraveledPx)
    });

    game.start(birds);
};

window.onload = () => {

    const machine = new Machine();

    let drawing = true;
    const start = (result: number|null = null) => {

        /* Start drawing after first bird has hit 4000 */
        if (result !== null && result > 4000) {
            drawing = true;
        }
        run(start, machine, drawing);
    };

    start();
};
