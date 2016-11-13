import * as Express from 'express';

const server = Express();

server.use(Express.static('public'));

server.listen(3000);
