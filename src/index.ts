import express from 'express'

const SERVER_PORT = '8080'

const app = express()

app.use(express.urlencoded({extended:true}))

app.get('/', (req,res) => {
  res.status(200).json('Hello!!!!')
})

app.listen(SERVER_PORT, () => {
  console.log(`server is started at port: ${SERVER_PORT}`)
})
