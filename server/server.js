const express = require('express')
const app = express()
const port = 5000


//by part Axios
app.use((req,res,next) =>{
    res.header("Access-Control-Allow-Origin" , '*')
    res.header("Access-Control-Allow-Headers" , 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

app.get('/',(req,res) =>{
    res.send('Data from Backend server');
})

app.get('/num',(req,res) =>{
    res.send({num:6});
})

app.listen(port, () =>{
    console.log(`Example server listen port ${port}`)
})