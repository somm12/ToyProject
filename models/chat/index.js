const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types: {ObjectId}} = Schema;// account user 스키마 참조.

const chatSchema = new Schema({
	user: {
		type: ObjectId,
		require: true,
		ref: 'account',
	},
	type: {
		type: String,
		require: true,
		default: 'public',
	},
	receiver:{
		type: ObjectId,
		ref: 'account',
	}
	,
	message: {
		type: String,
		require: true,
	},
	created: {
		type: Date,
		require: true,
		default: Date.now,
	}

});

module.exports = mongoose.model('chat', chatSchema);