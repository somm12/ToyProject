module.exports = (server) =>{
	const io = require('socket.io')(server);
	
	
	io.on('connection', (socket) => {
		let userId = '';
		let userList = [];// {username:xx, socketId:xxx,} 배열로 구성
		
		socket.on('join', (userObj) => {
			
			socket.join(userObj.username);
			
			userId = userObj.username;
			userObj.socketId = socket.id;
			userList.push(userObj);
			
			io.emit('newUserList',userList);
		})
		// 전송한 메세지를 가지고 특정 user에게 전달하고, 최근 메세지 정보를
		// 다시 프론트로 전달하여 messageList를 업데이트한다.
		socket.on('sendMessage', (obj) => {
			if (obj.type === 'private'){
				//귓속말을 보내는 사람과 받는 사람 모두에게 메시지가 보여야함.
				io.to(obj.receiverSocketId).emit('getMessage', obj);
				io.to(socket.id).emit('getMessage',obj);
			}
			else{
				io.emit('getMessage', obj);
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