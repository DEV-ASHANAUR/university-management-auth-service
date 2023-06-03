import dotenv from 'dotenv'
import path from 'path'

//join path
dotenv.config({ path: path.join(process.cwd(), '.env') })

//export
export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  default_user_pass: process.env.DEFAULT_USER_PASS,
}
