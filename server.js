var http = require("http");
var fs = require("fs");
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler (req, res){

        fs.readFile(__dirname + '/index.html',
                function (err, data) {
                        if (err) {
                                res.writeHead(500);
                                return res.end('Error loading index.html');
                        }

                        res.writeHead(200);
                        res.end(data);
                });
}

var displaygroup = new Array();
var usergroup1 = [];
var usergroup2 = [];
var usergroup3 = [];
var grinch = null;
var totalscore = 0;
var totalhats = 0;
var totalnum = 0;
var num1 = 0;
var num2 = 0;
var num3 = 0; 
var score1 = 0;
var score2 = 0; 
var score3 = 0;
var hats1 = 0;
var hats2 = 0;
var hats3 =0; 

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function (socket){



	console.log("We have a new client: " + socket.id);
	socket.on('register', function(data){


		if( data === "display1"){
			 
				var tempData = { 
					id: socket.id, 
					index: 1,
					role: data 
				};
				
				displaygroup[0] = tempData;
				io.sockets.socket(displaygroup[0].id).emit('render', tempData);


		} else if( data === "display2"){
	
			var tempData = { 
					id: socket.id, 
					index: 2,
					role: data 
			};
				
			displaygroup[1] = tempData;
			io.sockets.socket(displaygroup[1].id).emit('render', tempData);


		} else if( data === "display3"){
	
			var tempData = { 
					id: socket.id, 
					index: 3,
					role: data 
			};
				
			displaygroup[2] = tempData;
			io.sockets.socket(displaygroup[2].id).emit('render', tempData);

		}

		else if(data === "user_group1"){
			
			if(usergroup1.length < 45){				
				tempData = { 
					id: socket.id, 
					index: usergroup1.length+1,
					role: data 
				};
				usergroup1.push(tempData);
				//console.log("usergroup1 length: "+ usergroup1.length);

				io.sockets.socket(displaygroup[0].id).emit('render', tempData);
				
			}else{
				//Can't play game! 
				io.sockets.socket(socket.id).emit('error',tempData);
		
			}

		} else if(data === "user_group2"){
			
			if(usergroup2.length < 55){								
				tempData = { 
					id: socket.id, 
					index: usergroup2.length+1,
					role: data 
				};
				usergroup2.push(tempData);
				//console.log("usergroup2 length: "+ usergroup2.length);

				io.sockets.socket(displaygroup[1].id).emit('render', tempData);
				
			}else{
				//Can't play game! 
				io.sockets.socket(socket.id).emit('error',tempData);
	
			}
		} else if(data === "user_group3"){
			
			if(usergroup3.length < 30){								
				tempData = { 
					id: socket.id, 
					index: usergroup3.length+1,
					role: data 
				};
				usergroup3.push(tempData);
				//console.log("usergroup3 length: "+ usergroup3.length);

				io.sockets.socket(displaygroup[2].id).emit('render', tempData);
				
			}else{
				//Can't play game! 
				io.sockets.socket(socket.id).emit('error',tempData);
	
			}
		} else if(data === "grinch"){
                        
            //console.log("grinch found in server side");   
            io.sockets.socket(displaygroup[0].id).emit('clock');
        	io.sockets.socket(displaygroup[1].id).emit('clock');
        	io.sockets.socket(displaygroup[2].id).emit('clock');         
            
        	
            if(grinch == null){                                                                
                tempData = { 
                    id: socket.id, 
                    index: 999,
                    role: data
                };
	            grinch = tempData;
	                                
	            for(var i = 0; i < displaygroup.length; i++){
	            	io.sockets.socket(displaygroup[i].id).emit('render', {role: tempData.role, section: i+1});
	            }
        
            }
		
        	else{
				//Can't play game! 
				io.sockets.socket(socket.id).emit('error',tempData);

            }

        }		

	});

	socket.on('renderPlayerImage', function (data){
        io.sockets.socket(data.id).emit('renderPlayerImage', data);
        if(data.section === 1){
        	io.sockets.socket(displaygroup[0].id).emit('displayPlayer',data);
       		
        }else if(data.section === 2){
        	io.sockets.socket(displaygroup[1].id).emit('displayPlayer',data);
       		
        }else if(data.section === 3){	
	        io.sockets.socket(displaygroup[2].id).emit('displayPlayer',data);
	    }    
    });

	socket.on('attack', function (data){
		io.sockets.socket(displaygroup[data.section-1].id).emit('renderThrow', data);
	});

	socket.on('hide', function (data){
		io.sockets.socket(displaygroup[data.section-1].id).emit('renderHide', data);

	});

	socket.on('killGui', function (data){

        io.sockets.socket(data).emit('pause');
        	      
		
	});

	socket.on('displayStatus', function (data) {
		if(data.section === 1){
			score1 = data.score;
			hats1 = data.hats;
		} else if(data.section === 2){
			score2 = data.score;
			hats2 = data.hats;
		} else if(data.section === 3){
			score3 = data.score;
			hats3 = data.hats;
		}

		totalscore = score1 + score2 + score3;
		totalhats = hats1 + hats2 + hats3;
		//console.log("totalscore: " + totalscore + ", totalhats: "+ totalhats);
		io.sockets.socket(displaygroup[0].id).emit('statustotal', {score: totalscore, hats: totalhats});
		io.sockets.socket(displaygroup[1].id).emit('statustotal', {score: totalscore, hats: totalhats});
		io.sockets.socket(displaygroup[2].id).emit('statustotal', {score: totalscore, hats: totalhats});



	});

	socket.on('closeBrowser', function() {
		for(var i=0; i<usergroup1.length; i++){
			io.sockets.socket(usergroup1[i].id).emit('closing');

		}

		for(var j=0; j<usergroup2.length; j++){
			io.sockets.socket(usergroup2[j].id).emit('closing');

		}
		for(var k=0; k<usergroup3.length; k++){
			io.sockets.socket(usergroup3[k].id).emit('closing');

		}
	});

	socket.on('countBalls', function (data) {

		io.sockets.socket(data.id).emit('guiBalls', {balls: data.balls});

	});

	socket.on('disconnect', function() {
		/*
		var index = -1;
		var section1 = false;
		var section2 = false;
		var section3 = false;
            for(var i=0; i<usergroup1.length; i++) {
             	if(usergroup1[i].id == socket.id){
             		index = i;
             		section1 = true;
             		section2 = false;
             		section3 = false;
             	}
            }
            for(var i=0; i<usergroup2.length; i++) {
             	if(usergroup2[i].id == socket.id){
             		index = i;
             		section2 = true;
             		section1 = false;
             		section3 = false;
             	}
            }
            for(var i=0; i<usergroup3.length; i++) {
             	if(usergroup3[i].id == socket.id){
             		index = i;
             		section3 = true;
             		section1 = false;
             		section2 = false;
             	}
            }
            if(index != -1 && section1 === true) {
             	usergroup1.splice(index,1);
            } else if (index != -1 && section2 === true) {
             	usergroup2.splice(index,1);
            } else if(index != -1 && section3 === true) {
             	usergroup3.splice(index,1);
            }
		//console.log("Client has disconnected");
		*/
	});



	socket.on('kill', function (data){
		if(data.section === 1){
			io.sockets.socket(displaygroup[0].id).emit('kill', {section: 1});
		} else if(data.section === 2){
			io.sockets.socket(displaygroup[1].id).emit('kill', {section: 2});
		} else if(data.section ===3){
			io.sockets.socket(displaygroup[2].id).emit('kill', {section: 3});
		}
	});

	socket.on('playerListLen', function (data){
		if(data.section === 1){
			num1 = data.len;
		} else if(data.section === 2){
			num2 = data.len;
		} else if(data.section === 3){
			num3 = data.len;
		}

		totalnum = num1 + num2 + num3;
		console.log("playerList length: " + totalnum);
	});
});