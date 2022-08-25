module.exports = (server) =>{
	const io = require('socket.io')(server, { path: '/socket.io'});
	let users = [];
	
	io.on('connection', (socket) => {
		let userId = '';
		
		// {username:xx, socketId:xxx,} 배열로 구성
		
		socket.on('join', (newUser, userList) => {
			socket.join(socket.id);
			console.log("userList: ",userList);
			// console.log(io.sockets.adapter.rooms,"<-접속상황");
			userId = newUser.username;
			newUser.socketId = socket.id;
			users.push(...userList, newUser);
			
			io.emit('newUserList', users);
			io.emit('someoneJoin',userId);
		})
		// 전송한 메세지를 가지고 특정 user에게 전달하고, 최근 메세지 정보를
		// 다시 프론트로 전달하여 messageList를 업데이트한다.
		socket.on('sendMessage', (msgList, addedObj) => {
			const newList = [...msgList];
			newList.push(addedObj);
			console.log("receive message @@@@@@@@");
			if (addedObj.type === 'private'){
				//귓속말을 보내는 사람과 받는 사람 모두에게 메시지가 보여야함.
				
				io.to(addedObj.receiverSocketId).emit('getMessage', newList);
				io.to(socket.id).emit('getMessage',newList);
			}
			else{
				io.emit('getMessage', newList);
				
			}
			
		});
		
		socket.on('disconnect', () => {
			users = users.filter((user)=> {
				return user.username !== userId;
			});
			io.emit('someoneLeft',userId);
			io.emit('newUserList',users);
		});
		
		socket.on('error', (error) =>{
			console.error(error);
		})

	});
}