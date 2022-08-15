import React from 'react';
import { useEffect, useState } from "react";
import axios from 'axios';

const File = () =>{
	
	const JSZip = require("jszip");
	//state
	const [uploadFile, setUploadFile] = useState('');
	const [fileList, setFileList] = useState([]);
	//state
	
	const handleFileUpload = (e) => {
		const fileDetail = e.target.files[0];
		//file name 확장자 .zip or .tar 뽑아내기.
		const fileExtension = fileDetail.name.substr(fileDetail.name.length-3);
		
		if(['zip','tar'].includes(fileExtension)){
			setUploadFile(fileDetail);
		}
		else{
			e.target.value = '';
			alert('.zip, .tar 파일만 업로드 할 수 있습니다.');
		}
		
		
	};
	const getFileList = (e) => {
		const file = uploadFile;
		const reader = new FileReader();
		
		reader.onload = (e) => {
			JSZip.loadAsync(e.target.result).then((obj) =>{
				setFileList(Object.values(obj.files));
				console.log(Object.values(obj.files));
			})
			
			reader.error = (e) => {
				alert('fail to open file');
			}
			reader.readAsArrayBuffer(file);
		}
		
	};
	// 파일 제출 후, axios 통신을 통해 api post로 파일을 저장.
	const handleFileSubmit = (e) => {
		if(!uploadFile){
			alert('파일을 먼저 선택해 주세요');
		}
		else{
			const formData = new FormData();
			formData.append('file', uploadFile);
			
			axios.post('api/file/upload', formData).then(({data}) => {
				if (data){
					getFileList(e);
				}
			})
			
		}
		
	};
	const handleEditContents = () => {
		
	};
	const handleContentsSave = () => {
		
	};
	
	return(
		<div className="file-managing">
				<div className="file-upload">
					<input type="file" name="file" onChange={handleFileUpload}></input>
					<button type="button" className="file-upload-btn" onClick={handleFileSubmit}>업로드</button>
				</div>
				<div className="file-list-container">
					<ul>
						
						
					</ul>
				</div>
				<div className="file-edit-container">
					<textarea onChange={handleEditContents}>
					</textarea>
					<button type="button" onClick={handleContentsSave}>
						저장
					</button>
				</div>
			</div>
	);
}

export default File;