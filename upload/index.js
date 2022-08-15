const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	//파일이 저장되는 경로
	destination: function(req, file, cb){
		cb(null, path.join(__dirname, '/files/'));
	},
	//저장되는 파일명
	filename: function(req, file, cb){
		cb(null, req.session.id + "_"+ file.originalname);
	}
});

const upload = multer({storage: storage}).single("file");

module.exports = upload;