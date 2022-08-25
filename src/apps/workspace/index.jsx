import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Workspace from 'pages/workspace';
import Header from 'pages/workspace/containers/Header';
import File from 'pages/workspace/containers/File';
import Chat from 'pages/workspace/containers/Chat';
const App = props => (
	<Switch>
		<Route exact path={['/', '/workspace']} render={() => <Workspace {...props} />} />
		<Route path="/chat">
			<Header/>
			<Chat/>
		</Route>
		<Route path="/file">
			<File/>
		</Route>
	</Switch>
);
export default App;