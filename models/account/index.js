const mongoose = require('mongoose');

const {Schema} = mongoose;

const schema = new Schema({
	id: String,
	pw: String
});

module.exports = mongoose.model('account', schema);