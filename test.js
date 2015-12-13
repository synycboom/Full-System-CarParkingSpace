var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var showInfo = require(__dirname + '/view/show.js');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/view/index.html');
});

io.on('connection', function(socket){
     var i = 0;
     //var refresh = setInterval(function(){
            var res = showInfo.show();
            io.emit('refresh',res);
          
           i++;
    // },1000);
     
    
});

http.listen(3001, function(){
  console.log('listening on *:');
});
