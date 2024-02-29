require('dotenv').config()

export const PORT = process.env.PORT
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_api'
export const SECRET = process.env.SECRET || 'olamellamorussel'
