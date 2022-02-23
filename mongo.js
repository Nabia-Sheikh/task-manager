const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient

const connectionURL = "mongodb://127.0.0.1:27017";
const dbName = "task-manager";

MongoClient.connect(connectionURL,{useNewUrlParser : true},(error  ,conn)=>{
    if(error){
       return  console.log("Unable to connect to DB!");
    }

   const db = conn.db(dbName)
//    db.collection("users").insertOne({
//        name : "abc",
//        age : 22
//    })

   db.collection("tasks").insertMany([{
       description : "learning Mondgo",
       completed : false
   },
   {
    description : "learning react",
    completed : true
},
{
    description : "learning node",
    completed : true
}]).then(result => console.log(result.ops))

// db.collection("tasks").find({completed : true}).toArray((err , tasks)=>{
//     console.log(tasks);
// })

db.collection("users").updateOne({name : "abc"},{
    $inc : {
        age : 1
    }
}).then(result => console.log(result))

})