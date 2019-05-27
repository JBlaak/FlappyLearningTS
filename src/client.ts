import Game from './client/game';
import Machine from "./client/machine";

const run = async (onTerminate: () => any, machine: Machine) => {

    const canvas = document.querySelector("#snake") as HTMLCanvasElement;
    const networks = machine.nextGeneration();

    // for (let i = 0; i < networks.length; i++) {
    for (let i = 0; i < 1; i++) {
        const network = networks[i];

        //Play the game using this network
        const game = Game.create(canvas);

        console.log(game.snake);
        console.log(game.cherry);
        do {
            const head = game.snake.coordinates[game.snake.coordinates.length - 1];
            const tail = game.snake.coordinates[game.snake.coordinates.length - 1];
            const inputs = [
                head.x,
                head.y,
                Game.width - head.x,
                Game.height - head.y,
                Math.floor(Math.sqrt(Math.pow(tail.x + head.x, 2) + Math.pow(tail.y + head.y, 2)))
            ];

            const [up, down, left, right] = network.compute(inputs);

            if (
                //Invalid move, just kill
                (up === 1 && down === 1)
                || (left === 1 && right === 1)
            ) {
                game.kill();
            } else {
                let x = head.x;
                let y = head.y;
                if (up === 1) {
                    y++;
                }
                if (down === 1) {
                    y--;
                }
                if (left === 1) {
                    x--;
                }
                if (right === 1) {
                    x++;
                }
                game.setNextCoordinate(x, y);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        } while (game.snake.isAlive);

        machine.setScoreOfNetwork(network, game.snake.coordinates.length);
    }

    setTimeout(() => {
        onTerminate();
    }, 100)
};

window.onload = () => {

    const machine = new Machine();

    const start = () => {
        run(start, machine);
    };

    start();
};
