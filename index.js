const express = require('express')
const app = express()
const bodyParser = require("body-parser")

const server = app.listen(process.env.PORT || 3004,()=> console.log("servidor corriendo"))
const socketio= require('socket.io')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const {addUsers,getUser,users,deleteUser, getUsersById,checkUserExistence,deleteUserByName} = require('./entity')

const io = socketio(server,{
    cors: {
        origin: "*"
      }
})

app.get('/',(req,res)=> {
    res.write("hello")
    res.end()
})
app.post('/user-existence',async (req,res)=>{
    const {user} = req.body

    const response = await checkUserExistence(user)
    if(response) {
        console.log("oye, el usuario, ya existe")
        res.json({existence:true})
        return res.end()
    }
    if(!response){
        console.log("el usuario aun no existe")
        res.json({existence:false})
        return res.end()
    }
    res.end()
})
app.get('/get-user',(req,res)=>{
    res.json(users)
    res.end()
})

app.delete('/delete-user-by-name',async (req,res)=>{
    const user = req.body.user
    try{
        const response = await deleteUserByName(user)
        res.json(response)
        return res.end()
    } catch(err){
        console.log(err)
        return res.end()
    }
})
const chat_room = io.of('/chat-room')
const login = io.of('/')

io.on('connection',(socket)=>{
    console.log(socket.id, " bienvenido!")
    console.log(socket.rooms)
    socket.join("room1")
    // socket.on('join-room',(data)=>{
    //     const response = addUsers(data.user,data.room,socket.id)
    //     if(response){
        // socket.join("room1")
    //         const usersInRoom = getUsersById(data.room)
    //         return io.in(data.room).emit('users',usersInRoom)
    //     }
    //     return console.log("al parecer ya estás conectado")
    // })

    socket.on('msg:send', async (msg) =>{
        console.log(msg)
        try{
            console.log("done!")
            return socket.to("room1").emit('msg:broadcast',msg)
    }catch(e){
        console.log(e)
    }
        
        // const socketId = socket.id
        // const {data,res} = getUser(socketId)
        // if(res === false) return;
        // if(res){
        //     try{
        //         const {room} = await data[0]
        //         const username = data[0].name
        //         msg.user = username
        //         msg.sender = false
        //         const msgOutput = msg
                // return socket.to(room).emit('msg:broadcast',msgOutput)
        //     } catch(err){
        //         console.log(err)
        //         return;
        //     }
        // }
     
    })

    socket.on('msg:typing', async (e) => {
        return socket.to("room1").emit('msg:typing',e)
    })

    socket.on('leave-room',async ()=>{
        const socketId = socket.id
        const {data,res} = getUser(socketId)
        if(res === false || data[0] === undefined) return;
            try{
                const {room} = data[0]
                await socket.leave(room)
                deleteUser(socket.id)
                io.to(room).emit('users',users)
            }catch(err){
                console.log(err)
                return
            }
        

    })

    socket.on('disconnect',async ()=>{
        const socketId = socket.id
        const {data,res} = await getUser(socketId)
        if(res === false || data[0] === undefined) return;
        try{
            const {room} = data[0]
            socket.leave(room)
            deleteUser(socket.id)
            io.to(room).emit('users',users)
            return console.log(socket.id, " se ha ido")
        }catch(err){
            console.log(err)
        }

    })
})
