const express = require('express');
const router = express.Router();
const User = require('../../../models/account');
const Chat = require('../../../models/chat');

const findAllMessage = async (user) => {
	const preMessageList = [];
	
	const me = await User.findOne({id: user});
	//전체 채팅 or 내가 받은 귓속말 or 내가 보낸 메세지를 가져옴.
	const foundChats = await Chat
		.find()
		.or([{user: me}, {receiver: me}, {type: 'public'}])
		.populate(['user','receiver'])
		.sort('created');
	foundChats.forEach((arr) => {
		const receiverId = (arr.type === 'public') ? '': arr.receiver.id;
		
		preMessageList.push({
			user: arr.user.id,
			message: arr.message,
			type: arr.type,
			receiver: receiverId
		});
	});
	
	return preMessageList;
};

const appendMessageToDB = async (req) => {
	const data = req.body;
	const user = await User.findOne({id: data.user});
	
	data.user = user._id;//
	if(data.type === "private"){
		const receiver = await User.findOne({id: data.receiver});
		data.receiver = receiver._id;
	}
	
	const newMessageInfo = new Chat(data);
	await newMessageInfo.save();
	// const newMessageInfo = await Chat.create(data);
	
	
	return true;
};

router.get('/previous', async(req, res, next) => {
	try {
		const pastChats = await findAllMessage(req.query.username);
		res.send(pastChats);
	} catch(err){
		console.error(err);
	}
	
});

router.post('/message', async(req, res, next) => {
	try{
		const data = await appendMessageToDB(req);
		res.send(data);
	} catch(err){
		console.error(err);
	}
});
// 실험용으로 메시지들을 보냈을 때 잘 작동하는지 확인후,
//앞전에 쌓인 불필요한 메세지들을 삭제하는 api.
router.delete('/delete', async(req, res, next) => {
	const cb = await Chat.deleteMany({ type: 'private', type: 'public' });
	console.log(cb.deletedCount);
});
module.exports = router;