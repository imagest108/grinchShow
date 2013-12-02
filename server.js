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
var ctr = 0;

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', function (socket){



	console.log("We have a new client: " + socket.id);
	socket.on('register', function(data){


		if( data === "display1"){
			ctr++;
			console.log(ctr);
			 
			//if(displaygroup.length < 3){				
				var tempData = { 
					id: socket.id, 
					index: 1,
					role: data 
				};
				
				displaygroup[0] = tempData;
				io.sockets.socket(displaygroup[0].id).emit('render', tempData);


		} else if( data === "display2"){
			ctr++;
			console.log(ctr);
			var tempData = { 
					id: socket.id, 
					index: 2,
					role: data 
			};
				
			displaygroup[1] = tempData;
			io.sockets.socket(displaygroup[1].id).emit('render', tempData);


		} else if( data === "display3"){
			ctr++;
			console.log(ctr);
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
				console.log(usergroup1[usergroup1.length -1 ]);

				io.sockets.socket(displaygroup[0].id).emit('render', tempData);
				
			}else{
				//make socket disconnect!
			}

		} else if(data === "user_group2"){
			
			if(usergroup2.length < 55){								
				tempData = { 
					id: socket.id, 
					index: usergroup2.length+1,
					role: data 
				};
				usergroup2.push(tempData);
				console.log(usergroup2[usergroup2.length -1 ]);

				io.sockets.socket(displaygroup[1].id).emit('render', tempData);
				
			}else{
				//make socket disconnect!
			}
		} else if(data === "user_group3"){
			
			if(usergroup3.length < 30){								
				tempData = { 
					id: socket.id, 
					index: usergroup3.length+1,
					role: data 
				};
				usergroup3.push(tempData);
				console.log(usergroup3[usergroup3.length -1 ]);

				io.sockets.socket(displaygroup[2].id).emit('render', tempData);
				
			}else{
				//make socket disconnect!
			}
		} else if(data === "grinch"){
                        
            console.log("grinch found in server side");            
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
                //make socket disconnect!
            }

        }

        if(ctr>=3){
        	io.sockets.socket(displaygroup[0].id).emit('clock');
        	io.sockets.socket(displaygroup[1].id).emit('clock');
        	io.sockets.socket(displaygroup[2].id).emit('clock');
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

	
	socket.on('disconnect', function() {
		console.log("Client has disconnected");
	});

	socket.on('attack', function (data){
		io.sockets.socket(displaygroup[data.section-1].id).emit('renderThrow', data);
	});

	socket.on('hide', function (data){

		if(data.section == 1){
			for(var i=0; i<usergroup1.length; i++){
				if(usergroup1[i].id == data.id){
					io.sockets.socket(usergroup1[i].id).emit('hideOn');
				}
			}


		} else if(data.section == 2){
			for(var i=0; i<usergroup2.length; i++){
				if(usergroup2[i].id == data.id){
					io.sockets.socket(usergroup2[i].id).emit('hideOn');
				}
			}
		} else if(data.section == 3){
			for(var i=0; i<usergroup3.length; i++){
				if(usergroup3[i].id == data.id){
					io.sockets.socket(usergroup3[i].id).emit('hideOn');
				}
			}
		}
		io.sockets.socket(displaygroup[data.section-1].id).emit('renderHide', data);

	});

	socket.on('hideTrigger', function (data){
		if(data.section == 1){
			for(var i =0; i<usergroup1.length; i++){
				if(usergroup1[i].id == data.id){
					io.sockets.socket(usergroup1[i].id).emit('hideOff');
				}
			}
		} else if(data.section == 2){
			for(var i =0; i<usergroup2.length; i++){
				if(usergroup2[i].id == data.id){
					io.sockets.socket(usergroup2[i].id).emit('hideOff');
				}
			}
		} else if(data.section == 3){
			for(var i =0; i<usergroup3.length; i++){
				if(usergroup3[i].id == data.id){
					io.sockets.socket(usergroup3[i].id).emit('hideOff');
				}
			}
		}
	});

	socket.on('killUsers', function (data){

		if(data.section == 1){

			for(var i = 0; i <usergroup1.length; i++){

            	io.sockets.socket(usergroup1[i].id).emit('killUsers', data.section);

        	}  
        	      
    	} else if(data.section == 2){

			for(var i = 0; i <usergroup2.length; i++){

            	io.sockets.socket(usergroup2[i].id).emit('killUsers', data.section);
        	}  
        	      
    	} else if(data.section == 3){

			for(var i = 0; i <usergroup3.length; i++){

            	io.sockets.socket(usergroup3[i].id).emit('killUsers', data.section);
        	}        
        	
    	}
		
	});

	socket.on('kill', function (data){
		if(data.section == 1){
			io.sockets.socket(displaygroup[0].id).emit('kill', data.section);
		} else if(data.section == 2){
			io.sockets.socket(displaygroup[1].id).emit('kill', data.section);
		} else if(data.section ==3){
			io.sockets.socket(displaygroup[2].id).emit('kill', data.section);
		}
	});
});