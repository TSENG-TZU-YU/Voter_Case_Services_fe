import React, { useState } from 'react';
import { BsFillPersonFill } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';
import '../../styles/caseDetail/_chatPage.scss';

function ChatPage() {
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMsgTrue, setSubmitMsgTrue] = useState(false);

  // message submit
  const handleSubmit = () => {
    if (submitMsgTrue) {
      console.log('msg', submitMessage);
    }
  };
  return (
    <>
      <div className="userName">
        <BsFillPersonFill className="userIcon" /> 林鈺珊
      </div>
      <div className="chatContainer">
        {/* left */}
        <div className="leftMsgContain">
          <div className="userMsg">
            時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點
          </div>
          <div className="msgTime">2022/01/01 14:30</div>
        </div>
        {/* right */}
        <div className="rightMsgContain">
          <div className="msgTime">2022/01/01 14:30</div>
          <div className="userMsg">
            時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點
          </div>
        </div>
        <div className="rightMsgContain">
          <div className="msgTime">2022/01/01 14:30</div>
          <div className="userMsg">
            時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點
          </div>
        </div>
        <div className="rightMsgContain">
          <div className="msgTime">2022/01/01 14:30</div>
          <div className="userMsg">
            時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點
          </div>
        </div>
        <div className="rightMsgContain">
          <div className="msgTime">2022/01/01 14:30</div>
          <div className="userMsg">
            時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點
          </div>
        </div>
        <div className="rightMsgContain">
          <div className="msgTime">2022/01/01 14:30</div>
          <div className="userMsg">
            時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點時間太趕了喔!要晚一點
          </div>
        </div>
      </div>
      {/* chatBar */}
      <div className="chatBarContain">
        <textarea
          className="submitMsg"
          placeholder="請輸入訊息..."
          name="ttt"
          // cols="100"
          rows="2"
          onChange={(e) => {
            let msg = e.target.value;
            setSubmitMessage(msg);
            //   console.log(msg);
            if (msg !== '') {
              setSubmitMsgTrue(true);
            } else {
              setSubmitMsgTrue(false);
            }
          }}
        ></textarea>
        <FaTelegramPlane
          className={`subnitIcon ${submitMsgTrue ? 'submitTrue' : ''}`}
          onClick={() => {
            handleSubmit();
          }}
        />
      </div>
    </>
  );
}

export default ChatPage;
