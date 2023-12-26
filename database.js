const {MongoClient} = require('mongodb')
let dbConnection
module.exports = {
    connectDb : (cb) =>{
        MongoClient.connect('mongodb://127.0.0.1:27017/quotesApp')
            .then((response) =>{
                dbConnection = response.db()
                return cb()
            })
            .catch((error) =>{
                console.log(error)
                return cb(error)
            })
    },
    getDb: () => dbConnection
}