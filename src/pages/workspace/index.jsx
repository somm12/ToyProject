import React from 'react';
import Header from './containers/Header';
import File from './containers/File';
import Chat from './containers/Chat';
const Workspace = () => {
	
	return (
		<div>
			<Header />
			<File />
			<Chat />
		</div>
	);
}

export default Workspace;