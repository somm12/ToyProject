import React from 'react';
import { useEffect, useState } from "react";
import axios from 'axios';
import MessageContainer from './components/MessageContainer';

const socket = io.connect("https://mission-thals-hofhu.run.goorm.io", {
	path: '/socket.io',
	transports: ['websocket'],//순수한 웹소켓만 사용
});

const Chat = () => {
	
	const [user, setUser] = useState('');
	const [receiver, setReceiver] = useState('');
	const [receiverSockectId, setReceiverSocketId] = useState('');
	const [messageType, setMessageType] = useState('public');
	const [message, setMessage] = useState('');
	const [messageList, setMessageList] = useState([]);// 이전 메세지들 리스트
	const [userList, setUserList] = useState([]);// {username:xx, socketId:xxxx}로 구성
	
	const initChat = () => {
		//현재 user의 id를 가져옴.
		axios.get('/api/account/id').then(({data})=>{
			setUser(data);
			//현재 user가 가지고 있었던 이전 chat기록을 가져옴.
			axios.get(`/api/chat/previous?username=${user}`).then(({data}) => {
				setMessageList(data);
			});

			socket.emit('join', ({
				username: user,
			}))
			
		});
		
		//새로 유저가 채팅에 들어와서
		//프론트상에서 emit('join')이후 => 백엔드에서 userList 업데이트 후,
		//프론트로 다시 업데이트 된 arr 전송.
		socket.on('newUserList',(list) => {
			setUserList(list);
		});
	};
	// 메세지 리스트에 최근 메시지를 업데이트.
	socket.on('getMessage',(obj)=>{
		const temp = messageList;
		temp.push(obj);
		setMessageList(temp);
	});
	
	// 어떤 사용자에게 귓속말을 선택시, (타입, 받는사람, 받는사람의 socketId 업데이트)
	const handleChangeSelect = (e) => {
		console.log(e.target.value);
		if(userList[e.target.value].username === user){
			alert('"나" 에게 귓속말은 할 수 없습니다');
		}
		
		if(e.target.value === "default"){
			setMessageType('public');
			
		}
		else{
			const index = e.target.value;
			setMessageType('private');
			setReceiver(userList[index].username);
			setReceiverSocketId(userList[index].socketId);
		}
	};
	
	const handleChangeMessage = (e) => {
		setMessage(e.target.value);
	};
	const handleSendMessage = () => {
		const currentState = {
			user: user,
			type: messageType,
			message: message;
		};
		
		if(messageType === 'private'){
			currentState.receiver = receiver;
			currentState.receiverSockectId = receiverSockectId;
		}
		//db상에서 message 저장.
		axios.post('/api/chat/message').then(() => {
			
			socket.emit('sendMessage', currentState);
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
		}
	}
	const showPreviousChat = () => {
		return(
			{
				messageList.map((chat, i) => {
					<MessageContainer
						key={i}
						me={user}
						oneOfUsers={chat.user}
						message={chat.message}
						type={chat.type}
						receiver={chat.receiver}
						/>
				})
			}
		)
	};
	const showUserList = () => {
		
		const list = userList.map((oneOfUsers, i)) => {
			return(
				{(oneOfUsers !== user) && 
				(<option className="whisper" value={i} key={i}>{user.username}</option>)}
			)
		};
		return list;
		
	};

	useState(()=>{
		initChat();
	},[]);

	return(
		<div className="chat-wrapper">
			<div className="chat-board">
				
			</div>
			<div className="chat-input">
				<select onChange={handleChangeSelect}>
					<option className="whisper" value="default">귓속말</option>
					{showUserList()}
				</select>
				<input className="message-input" type="text"
					onChange={handleChangeMessage}
					onKeyPress={handleEnterPress}
					placeholder="메세지를 입력해주세요"/>
				<button className="message-submit-btn" type="button" 
					onClick={handleSendMessage}>
					전송
				</button>
			</div>
		</div>
		
	);
};

export default Chat;