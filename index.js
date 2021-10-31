const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan')

const routerMap = require('./routes/map')
// app.use(cors())

app.use(express.urlencoded({ extended: true }))

app.use(morgan('combined'))

app.set("view engine", "ejs")
app.set("views", "./views")

app.use(express.static(path.join(__dirname, 'public')))

console.log('path: ', path.join(__dirname, 'public'));

app.use('/', routerMap);

const PORT = 5000

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT} `)
})