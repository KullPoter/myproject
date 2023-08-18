const mongoose = require("mongoose");
const express = require("express");
const { Console } = require("console");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();
const userScheme = new Schema({
    email: String,
    name: String,
    age: Number,
    password: String
}, {versionKey: false})
const urlencodedParser = express.urlencoded({extended: false});
const User = mongoose.model('User', userScheme)
app.use(express.static(__dirname + '/public'))

async function main(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/usersdb");
        app.listen(3000);
        console.log("Сервер ожидает подключения...");
    }
    catch(err){
        console.log(err)
    }
}
app.get('/api/users', async(req,res)=>{
    const users = await User.find({})
    res.send(users);
})
app.get('/api/users/:id', async(req,res)=>{
    const id = req.params.id
    const user = await User.findById(id)
    if(user){
        res.send(user)
    }
})
app.post('/api/users', jsonParser, async(req,res)=>{
    if(!req.body) return res.sendStatus(400);
    const userEmail = req.body.email;
    const userName = req.body.name;
    const userAge = req.body.age;
    const userPassword = req.body.password;
    const user =  new User ({
        email: userEmail,
        name: userName,
        age: userAge,
        password: userPassword
    })
    console.log(user)
    await user.save()
    res.send(user)
})


main()

process.on("SIGINT", async() => {
      
    await mongoose.disconnect();
    console.log("Приложение завершило работу");
    process.exit();
});