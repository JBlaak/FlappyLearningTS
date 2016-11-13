import Game from './client/game';

window.onload = () => {
    const game = new Game(document.querySelector("#flappy") as HTMLCanvasElement);

    game.start();
};
