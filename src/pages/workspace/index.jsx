import React from 'react';
import {
	Switch,
	Route,
	Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Header from './containers/Header';
import style from './style.css';

const Workspace = () => {
	
	return (
		<div>
			<Header />
			<div className={style.homePage}>
				<Link to='/file' className={style.to_file}>To Edit File 💾</Link>
				<Link to='/chat' className={style.to_chat}>To Chat 💬</Link>	
			</div>	
		</div>
	);
}

export default Workspace;