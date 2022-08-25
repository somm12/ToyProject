import React from 'react';
import { useEffect, useState } from "react";
import style from './style.css';

const MessageContainer = 
	  ({me, oneOfUsers, message, type, receiver}) => {
	
		  return(
			  <div className={style.message_box} className={me === oneOfUsers ? style.my_message : style.other_message}>
				  <div className={style.message_box}>
					  <div className="message-user-name">{oneOfUsers}</div>
					  <div className={me === oneOfUsers ? style.msg_mine: (type === 'public'? style.msg_public : style.msg_private)}>
						  {type === 'public'? message : `👂 to ${receiver} : ` + message}
					  </div>
				  </div>
			  </div>
		  );
};

export default MessageContainer;