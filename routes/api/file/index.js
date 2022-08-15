const express = require('express');
const router = express.Router();
const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const rmrf = require('rimraf');
const path = require('path');
// multer: 파일을 업로드하기 위해 사용되는 multipart/form-data를 다루기 위한 미들웨어
// adm-zip: zip 파일 압축해제 라이브러리
// rimraf: rm --rf 명령어(파일/폴더 삭제)를 윈도에서도 사용할 수 있게 해주는 패키지
const upload = require('../../../upload');
//파일 저장 & unzip
router.post('/upload', async (req, res, next)=>{
	try{
		//upload.js 로 가서 파일저장
		upload(req, res, (err)=> {
			if (err instanceof multer.MulterError){
				return next(err);
			}
			else if(err){
				return next(err);
			}
			// unzip
			const filePath = req.file.path;
			console.log(filePath);
			const location = path.join(__dirname, '../../../upload/unzip/') + req.session.user.id;
			const fileExtension = filePath.substr(filePath.length-3);
			
			//unzip .tar file
			if (['tar'].includes(fileExtension)){
				const zlib = require('zlib');
				const tar = require('tar');
				// user id 폴더 안에 압축 푼 파일 저장 될 수 있도록함.
				if(!fs.existsSync(location)){
					fs.mkdirSync(location);
				}
				tar.x({ C: location, file: filePath }, undefined, (err) => {  
			   	// Error handling code here
					console.log(err);
				});
			}
			else{
				//unzip .zip file
				const zip = new AdmZip(filePath);
				rmrf.sync(location);
				zip.extractAllTo(location, true);
			}
			
			return res.json(true);
			
		});
	} catch(err){
		console.error(err);
	} 
});
module.exports = router;