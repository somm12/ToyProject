module.exports = (server) =>{
	const io = require('socket.io')(server, { path: '/socket.io'});
	
	
	io.on('connection', (socket) => {
		let userId = '';
		let userList = [];// {username:xx, socketId:xxx,} 배열로 구성
		
		socket.on('join', (newUser, userList) => {
			
			socket.join(newUser.username);
			
			userId = newUser.username;
			newUser.socketId = socket.id;
			userList.push(newUser);
			console.log("새로운 유저가 참가했어요 socket id:",socket.id);
			io.emit('newUserList',userList);
		})
		// 전송한 메세지를 가지고 특정 user에게 전달하고, 최근 메세지 정보를
		// 다시 프론트로 전달하여 messageList를 업데이트한다.
		socket.on('sendMessage', (msgList, addedObj) => {
			const newList = msgList;
			newList.push(addedObj);
			console.log(addedObj,"<-추가된 메세지 정보");

			if (addedObj.type === 'private'){
				//귓속말을 보내는 사람과 받는 사람 모두에게 메시지가 보여야함.
				
				console.log("받는이: ", addedObj.receiverSockectId);
				io.to(addedObj.receiverSocketId).emit('getMessage', newList);
				io.to(socket.id).emit('getMessage',newList);
			}
			else{
				io.emit('getMessage', newList);
				
			}
			
		});
		
		socket.on('disconnect', () => {
			//현재 socket에서 leave
			socket.leave(userId);
			//userList에서 삭제
			
			userList = userList.filter((user)=> {
				return user.username !== userId;
			});
			io.emit('newUserList',userList);
		});
		
		socket.on('error', (error) =>{
			console.error(error);
		})

	});
}