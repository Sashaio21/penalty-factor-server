import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import checkAutharization from './utilites/checkAutharization.js';
import mongoose from 'mongoose';
import Solution from './model/SolutionModel.js';
import User from './model/User.js';
import bodyParser from 'body-parser';

import cors from 'cors';


const app = express()
app.use(express.json());

mongoose.connect("mongodb+srv://usersdata:0hZzN9CAxapArcxI@cluster0.0fae0es.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0")
        .then(()=>console.log("Db ok"))
        .catch((err)=>{console.log(`error db ${err}`)})

app.get('/',(req, res)=>{
    res.json({
        success: "success",
    })
});

app.options('*', cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
// Увеличьте максимальный размер до нужного значения, например, 10 МБ
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));




//----------------------------------------Работа с пользователями---------------------------------------------------
//Регистрация
app.post('/auth/signin', async (req, res)=>{
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Пользователь с таким email уже существует' 
            });
        }
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(req.body.password, salt)
        
        const dataForSignin = {
            firstName: req.body.firstName,
            name: req.body.name,
            email: req.body.email,
            password: passwordHash
        }
        console.log(dataForSignin)
        const doc = new User(dataForSignin)
        const newUser = await doc.save()
        return res.json(newUser)   
    } catch (error) {
        return res.json({
            message:`ошибка ${error}`
        })
    }
})


//Авторизация
app.post('/auth/login', async(req,res)=>{
    try {
        const user = await User.findOne({email: req.body.email})
        if(user){
            const passwordHashTest = user.password
            const isValuePass = await bcrypt.compare(req.body.password, passwordHashTest)
            console.log(isValuePass)
            if (isValuePass) {
                const token = jwt.sign({
                    _id: user._id
                }, 'secret123', {expiresIn: '30d'})  
                return res.json({
                    token
                })        
            }
            else{
                return res.status(404).json({
                    message: "Неверный логин или пароль",
                });
            }
        }else{
            return res.status(404).json({
                message: "Неверный логин или пароль",
            });
        }
    } catch (error) {
        return res.json({
            message:`ошибка ${error}`
        })
    }
})


//Проверка пользователя
app.get('/auth/me', checkAutharization, async(req, res)=>{
    try {
        console.log(req.userId)
        const authUser = await User.findOne({
            _id: req.userId
        })

        return res.json(
            authUser
        )
    } catch (error) {
        return res.json({"оgшибка": error});
    }
})

//-----------------------------------------Работа с решениями---------------------------------------------------------------
//Получить все решения
app.get('/solution/getall', checkAutharization, async (req,res)=>{
    try {
        const listSolutions = await Solution.find({
            userId:req.userId
        })
        return res.json (listSolutions)
    } catch (error) {
        return res.json({"error": "не удалось получить все решения"})
    }
})


//Добавить новое решение
app.post('/solution/add', checkAutharization, async (req,res)=>{
    try {
        const dataSolution = {
            userId: req.userId,
            ...req.body
        }
        console.log(dataSolution)
        const doc = new Solution(dataSolution)
        const newSolution = await doc.save()
        return res.json(newSolution)    

    } catch (error) {
        print(error)
        return res.json({"error": "ошибка сохранения решения"})
    }
})


//Получить решение по id
app.get('/solution/get/:idSolution', async (req,res)=>{
    try {
        const oneSolution = await Solution.findById({
            _id: req.params.idSolution
        })   
        console.log(oneSolution)
        return res.json(oneSolution)     
    } catch (error) {
        return res.json({"error": error})
    }
})


//Изменить решение
app.patch('/solution/edit:idSolution', (req,res)=>{
    try {
        
    } catch (error) {
        return res.json({"error": error})
    }
})



app.listen(4444,(err)=>{
    if(err){
        return console.log(`Произошла ошибка ${err}`)
    }
    console.log("Сервер запустился")
})    