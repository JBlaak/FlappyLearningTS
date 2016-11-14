FlappyLearning (in Typescript)
==============================

A re-implementation of the original [FlappyLearning project](https://github.com/xviniette/FlappyLearning) 
in Typescript. Just for fun and educational purposes.

Beside re-implementing the whole thing, I've also separated the game logic
from the neural network to make things a lot clearer. They're only
connected inside of `client.ts`.

Installation
------------

```bash
yarn
npm run-script build
```

Now open up `index.html` in the `public` directory in your favorite browser.


