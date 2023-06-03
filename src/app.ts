import express, { Application, Request, Response } from 'express'
import cors from 'cors'
const app: Application = express()

//use cors
app.use(cors())
//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//welcome route
app.get('/', (req: Request, res: Response) => {
  res.json('Welcome to Auth Service!')
})

export default app
