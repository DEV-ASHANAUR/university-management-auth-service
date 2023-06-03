import express, { Application, Request, Response } from 'express'
import cors from 'cors'
const app: Application = express()

//import end point
import usersRoute from './app/modules/users/users.route'

//use cors
app.use(cors())
//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//welcome route
app.get('/', (req: Request, res: Response) => {
  res.json('Welcome to Auth Service!')
})
//application route
app.use('/api/v1/users', usersRoute)

export default app
