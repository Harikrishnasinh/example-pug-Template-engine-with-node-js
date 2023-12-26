const express = require('express')
const { connectDb, getDb } = require('./database')
const { ObjectId } = require('mongodb')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
// app.use(express)
let data = {}


app.set("view engine", "pug")
app.use(express.static('styles'));



// app.post('/add',(req,res) =>{
//     console.log(req)
//     data = req.body
// })


// app.use(express.json())
let db
connectDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log("Connected to database")
            console.log("Port is Listening on 3000")
        })
        db = getDb()
    }
})



// app.get('/:_id', (request,response)=>{
//     db.collection('users-data')
//     // .find({name:'bookUpdated'})
//     // .find()
//     .findOne({_id: new ObjectId(request.params._id)}).then((dot => response.json(dot).status(200))).catch(err => console.log(err))
//     // .insertOne(book)
//     // .sort({name:1})
//     // .forEach((d) =>{
//     //     data.push(d)
//     //     console.log(d)
//     // }).then(() => response.status(200).json({result: "data got"})).catch(err => console.log(err))
// })

// app.get('/getall',(request,response) =>{
//     const page = parseInt(request.query.p) || 0
//     const BooksPerPage = 2
//     db.collection('users-data')
//         .find()
//         .skip(page * BooksPerPage)
//         .limit(BooksPerPage)
//         .forEach((d) =>{
//             // data.push(d)
//             console.log(d)
//         })
//         .then((result) => response.json(data).status(200))
//         .catch((error) => console.log(error))
// })

app.get('/', (req, res) => {
    res.render('register')
})
app.delete('/deleteUser/:id',(request,response) =>{
    console.log(request.body)
    db.collection('quotesData').deleteOne({_id: new ObjectId(request.params.id)}).then((doc) => response.json(doc)).catch(err => conasole.log(err))
})
app.get('/getall', (req, res) => {
    const allUsers = []
    db.collection('quotesData')
        .find()
        .forEach((d) => {
            allUsers.push(d)
        })
        .then(() =>{
            res.json(allUsers)
            res.render('home')
            res.redirect('/dashboard')
        })
        .catch((err) => console.log(err))
})

app.get('/login', (request, response) => {
    response.render('login')
})

app.post('/login', (request, response) => {
    let book = request.body
    db.collection('usersData')
        .findOne(book)
        .then((d) => {
            if (!d) {
                db.collection('usersData')
                    .insertOne(book).then(() => response.render('login')).catch(err => console.log(err))
            } else {
                response.redirect('/')
            }
        })
})

app.post('/dashboard', (request, response) => {
    let username_book = request.body
    console.log(request.body)
    db.collection('usersData')
        .findOne(username_book)
        .then((d) => {
            // console.log(d)
            if (!d) {
                response.redirect('/')
            } else {
                response.render('home', { rs: request.body.username })
            }
        })
        .catch(err => console.log(err))
})

app.get('/dashboard', (request, response) =>{
    // response.redirect('/dashboard')
    response.render('home')
})

app.post('/addquote', (request, response) => {
    let user = request.body.username
    console.log({body:request.body})
    console.log({user}, user.length)
    db.collection('usersData')
        .findOne({username:user})
        .then((doc) => {
            if(!doc){
                response.json({result:"sorry"})
            }else{
                db.collection('quotesData')
                    .insertOne(request.body).then((data) => response.json(data)).catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
})

app.post('/deleteuser',(request, respone) =>{
    console.log(request.body)
    respone.redirect('/')
    // db.collection('usersData')
    // .deleteOne({username:request.body.username})
    // .then((result) => respone.json({status:"done"}))
    // .catch(err => console.log(err))
})

app.post('/getUser',(request,response) =>{
    console.log(request.body)
    db.collection('usersData').findOne({username:request.body.username}).then((doc) => response.json(doc)).catch(err => response.json({status:"sorry"}))
})

app.post('/updateUser/:id',(request,response) =>{
    console.log(request.body)
    db.collection('usersData').updateOne({_id: new ObjectId(request.params.id)},{$set: request.body}).then((doc) => response.json(doc)).catch(err => console.log(err))
})

// app.post('/update/:_id',(request,respone) =>{
//     db.collection('users-data')
//     .updateMany({_id:new ObjectId(request.params._id)},{$set: request.body})
//     .then(result => respone.json({status:"done"}))
//     .catch(err => console.log(err))
// })