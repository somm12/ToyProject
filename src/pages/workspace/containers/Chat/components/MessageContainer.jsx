import React from 'react';
import { useEffect, useState } from "react";

const MessageContainer = 
	  ({me, oneOfUsers, message, type, receiver}) => {
		  const messageClassName = () => {
			  if (me === oneOfUsers){// 유저가 나 자신일때
				  return 'my-message'
			  }
			  else{
				  if (type === 'public'){// 받은 메세지 중 public
					  return 'message-public'
				  }
				  else{// 받은 메세지 중 귓속말
					  return 'message-private'
				  }
			  }
		  }
		  
		  return(
			  <div className="message-wrapper">
				  <div className="message-user-name">{oneOfUsers}</div>
				  <div className={messageClassName()}>
					  {type === 'public'? message : `👂 to ${receiver} : ` + message}
				  </div>
			  </div>
		  );
};

export default MessageContainer;