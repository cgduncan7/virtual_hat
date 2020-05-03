import * as express from 'express'
import { Request, Response } from 'express'

const app = express()

app.get('/', (_: Request, res: Response) => {
  res.sendStatus(200)
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`I'm listenin on ${port}!`))