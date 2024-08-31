import express, {Request, Response} from 'express';

const server = express();
const PORT = 5000;

server.use('/', (req: Request, res: Response) => {
    res.send('Hello, world')
})

server.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)
})