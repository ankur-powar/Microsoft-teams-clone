const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    res.render('login'); 
})

app.get('/home', (req, res) => {
    res.render('chat'); 
})

app.get('/signup', (req, res) => {
    res.render('signup'); 
})

app.get('/meet/:room', (req, res) => {
    res.render('room', {roomId: req.params.room })
})


io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        
        socket.join(roomId);
        console.log("User:" + userId + "  Joined Room:" + roomId);

        socket.to(roomId).emit('user-connected', userId);
        
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId);
        })
        
        socket.on('videoBorder', (hvalue, mvalue, id) => {
            io.to(roomId).emit('setVideoBorder', hvalue, mvalue, id);
        })
    })
})

server.listen(process.env.PORT || 3030);
