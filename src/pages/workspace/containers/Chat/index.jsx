import React from 'react';
import { useEffect, useState } from "react";
import axios from 'axios';
import MessageContainer from './components/MessageContainer';
import style from './style.css';

const socket = io.connect("https://mission-thals-hofhu.run.goorm.io", {
	path: '/socket.io',
	transports: ['websocket'],//순수한 웹소켓만 사용
});

const Chat = () => {
	
	
	const [user, setUser] = useState('');
	const [receiver, setReceiver] = useState('');
	const [receiverSocketId, setReceiverSocketId] = useState('');
	const [messageType, setMessageType] = useState('public');
	const [message, setMessage] = useState('');
	const [messageList, setMessageList] = useState([]);// 이전 메세지들 리스트
	const [userList, setUserList] = useState([]);// {username:xx, socketId:xxxx}로 구성
	const [notice, setNotice] = useState('');
	
	const initChat = () => {
		//현재 user의 id를 가져옴.
		axios.get('/api/account/id').then(({data: username})=>{
			setUser(username);
			//현재 user가 가지고 있었던 이전 chat기록을 가져옴.
			axios.get(`/api/chat/previous?username=${username}`).then(({data: msgList}) => {
				setMessageList(msgList);
			});
			socket.emit('join', ({
				username: username,
			}),userList)
			
		});
		
		//새로 유저가 채팅에 들어와서
		//프론트상에서 emit('join')이후 => 백엔드에서 userList 업데이트 후,
		//프론트로 다시 업데이트 된 arr 전송.
		socket.on('newUserList',(list) => {
			console.log(list,"new userlist");
			setUserList(list);
			console.log(userList);
		});
		
			// 메세지 리스트에 최근 메시지를 업데이트.
		socket.on('getMessage',(msgList)=>{
			console.log(msgList,"check");
			setMessageList(msgList);
		});
		
		socket.on('someoneLeft', (user) => {
			console.log(`${user}님이 방을 나가셨습니다.`);
			setNotice(`${user}님이 방을 나가셨습니다.`);
		});
		
		socket.on('someoneJoin', (user) => {
			setNotice(`${user}님이 방에 들어왔습니다.`);
		});
	};

		
	
	// 어떤 사용자에게 귓속말을 선택시, (타입, 받는사람, 받는사람의 socketId 업데이트)
	const handleChangeSelect = (e) => {
		
		
		if(e.target.value === "default"){
			setMessageType('public');
			
		}
		//귓속말 선택시,
		else{
			if (userList[e.target.value].username === user){
				alert('"나" 에게 귓속말은 할 수 없습니다');
			}
			else{
				const index = e.target.value;
				setMessageType('private');
				setReceiver(userList[index].username);
				setReceiverSocketId(userList[index].socketId);
			}
			
		}
	};
	
	const handleChangeMessage = (e) => {
		setMessage(e.target.value);
	};
	const handleSendMessage = () => {
		const currentMsg = {
			user: user,
			type: messageType,
			message: message,
		};
		console.log("message list",messageList);
		
		if(messageType === 'private'){
			currentMsg.receiver = receiver;
			currentMsg.receiverSocketId = receiverSocketId;
			console.log(receiver, receiverSocketId,"받는사람정보");
		}
		//db상에서 message 저장.
		axios.post('/api/chat/message', currentMsg).then(() => {
			
			socket.emit('sendMessage', messageList,currentMsg);
			setReceiver('');
			setReceiverSocketId('');
			setMessageType('public');
			setMessage('');
			
		}).catch((error) => {
			console.error(error);
		});
	};
	const handleEnterPress = (e) => {
		if (e.key === 'Enter'){
			handleSendMessage();
			// e.target.value = "";
		}
		
	}
	const showPreviousChat = () => {
		const list = messageList.map((chat, i) => {
			
			return (
				<MessageContainer
					key={i}
					me={user}
					oneOfUsers={chat.user}
					message={chat.message}
					type={chat.type}
					receiver={chat.receiver}
					/>
			)
		});
		
		return list;
	};
	const showUserList = () => {
		
		const list = userList.map((oneOfUsers, i) => {
			return(
				<option className="whisper" value={i} key={i}>{oneOfUsers.username}</option>
			)
		});
		return list;
		
	};
	const handleDeleteDB = () => {
		axios.delete('/api/chat/delete').then(()=>{
			console.log('데이터 삭제');
		}).catch((error) => {
			console.error(error);
		});
	}

	useState(()=>{
		initChat();
	},[]);

	return(
		<div className="d-flex justify-content-center">
			<div className="chat w-75 border border-secondary p-3">
				<div className="chat-board bg-light p-3 text-dark bg-opacity-1">
					{showPreviousChat()}
					{notice !== ''? (<div className="notice">{notice}</div>):''}
				</div>
				<div className="chat-input d-flex">
					<select onChange={handleChangeSelect}>
						<option className="whisper" value="default">귓속말</option>
						{showUserList()}
					</select>
					<input className="w-100 message-input" type="text" value={message}
						onChange={handleChangeMessage}
						onKeyPress={handleEnterPress}
						placeholder="메세지를 입력해주세요"/>
					<button className="mt-0 message-submit-btn" type="button" 
						onClick={handleSendMessage}>
						전송
					</button>
				</div>
				<button onClick={handleDeleteDB}>private메세지 삭제</button>
			</div>
		</div>
		
	);
};

export default Chat;