import React from 'react';
import { useEffect, useState } from "react";
import axios from 'axios';

import JSZip from "jszip";
import jsUntar from 'js-untar';

import './style.css';

const File = () => {
	//state
	const [uploadFile, setUploadFile] = useState('');
	const [fileList, setFileList] = useState([]);
	const [selectFile, setSelectFile] = useState('');
	const [contents, setContents] = useState('편집할 파일 선택.');
	const [fileExtension, setFileExtension] = useState('');
	//state
	
	const handleFileUpload = (e) => { // 1
		const fileDetail = e.target.files[0];
		//file name 확장자 .zip or .tar 뽑아내기.
		const ext = fileDetail.name.substr(fileDetail.name.length-3);
		
		if(['zip','tar'].includes(ext)){
			setFileExtension(ext);
			setUploadFile(fileDetail);
			//새로 다른 파일을 upload 하려 할 때 이전 값을 초기화시킴.
			setSelectFile('');
			setFileList('');
			setContents('');
		}
		else{
			e.target.value = '';
			alert('.zip, .tar 파일만 업로드 할 수 있습니다.');
		}
		
		
	};
	const handleDirecClick = () =>{
		alert('directory는 편집할 수 없습니다.');
	};
	const handleFileClick = (name) => {
		setSelectFile(name);
		
		axios.get('api/file/contents', {params : {fileName : name}})
			.then(({data}) => {
			setContents(data);
		})
	};
	const showFileList = () =>{
		// let rootFileName = uploadFile.name;
		// if (rootFileName){
		// 	rootFileName = rootFileName.substr(0, rootFileName.length - 4) + '/';
		// }
		const list = fileList.map((file, i) => {
			const handleFileClickWithName = () => handleFileClick(file.name)
			return (
					<li
						key={i}
						className={(selectFile === file.name ? 'text-success' : '')} 
						onClick={file.name.substr(file.name.length-1) === "/" ? handleDirecClick : handleFileClickWithName}>
						{file.name}
					</li>
				)
		})
		return list;
	};
	const getFileList = (e) => { // 3
		const reader = new FileReader();
		
		reader.onload = (e) => {
			console.log(e.target.result);
			
			if (fileExtension === "tar"){
				const list = [];
				jsUntar(e.target.result)
				// .progress(function(extractedFile) {
				// 	console.log(extractedFile);
				// })
				.then(function(extractedFiles) {
					setFileList(extractedFiles);
					console.log(extractedFiles);
				});
				
			}
			else{
				JSZip.loadAsync(e.target.result).then((obj) =>{
					setFileList(Object.values(obj.files));
					console.log("here"+Object.values(obj.files));
				})
				
			}
	
		}
		reader.onerror = (e) => {
			alert('fail to open file');
		}
		reader.readAsArrayBuffer(uploadFile);
		
	};
	// 파일 제출 후, axios 통신을 통해 api post로 파일을 저장.
	const handleFileSubmit = (e) => { // 2
		if(!uploadFile){
			alert('파일을 먼저 선택해 주세요');
		}
		else{
			const formData = new FormData();
			formData.append('file', uploadFile);
			
			axios.post('api/file/upload', formData).then(({ data }) => {
				console.log(data);
				if (data){
					getFileList(e);
				}
			})
			
		}
		
	};
	const handleEditContents = (e) => {
		//setcontents
		setContents(e.target.value);
		
	};
	const handleContentsSave = (e) => {
		// axios post api 호출. + api -> fill 로 가서 edit처리 + db에 저장.
		if(selectFile){
			axios.put('api/file/contents',{
				fileName: selectFile,
				contents: contents,
			}).then(({data})=>{
				if (data){
					alert('저장했습니다!');
					setUploadFile('');
					setSelectFile('');
					setContents('편집할 파일 선택');
				}
				else{
					alert('저장에 실패했습니다.');
				}
				
			})
		}
	};

	
	return(
		<div className="file-managing mt-5">
			
				<div className="file-upload d-flex align-items-center justify-content-center">
					<input type="file" name="file" onChange={handleFileUpload}></input>
					<button type="button" className="file-upload-btn btn btn-info" onClick={handleFileSubmit}>업로드</button>
				</div>
				<div className="file-list-container">
					<ul>
						{fileList.length === 0? '업로드를 해주세요': showFileList()}
					</ul>
				</div>
				<div className="file-edit-container d-flex align-items-center justify-content-center">
					<textarea style={{width:"100%",height:"250px"}} value={contents} onChange={handleEditContents}>
					</textarea>
					<button type="button" className="btn btn-primary" onClick={handleContentsSave}>
						저장
					</button>
				</div>
			</div>
	);
}

export default File;