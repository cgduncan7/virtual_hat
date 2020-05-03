// modules
import * as http from 'http'
import * as express from 'express'
import * as socketIO from 'socket.io'

// types
import { Server } from 'http'
import { Application, Request, Response } from 'express'

// servers
const app: Application = express()
const server: Server = http.createServer(app)
const io: SocketIO.Server = socketIO(server)

// handlers
import PlayerHandler from './players/handler'
import HatHandler from './hat/handler'

const hh = new HatHandler(io)
const ph = new PlayerHandler(io)

io.on('connection', (socket) => {
  ph.onConnection(socket)
  hh.onConnection(socket)
})

app.get('/', (_: Request, res: Response) => {
  res.sendStatus(200)
})

const port = process.env.PORT || 3000
server.listen(port, () => console.log(`I'm listenin on ${port}!`))