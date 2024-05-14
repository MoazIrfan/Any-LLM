import { useState, useRef, useEffect } from 'react';
import './App.css';
import { sendMsgToOpenAI } from './openai';
import { renderMessage } from './utils';
import modelsList from './models';
import gptLogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.jpg';
import gptImgLogo from './assets/chatgptLogo.svg';

function App() {
  const msgEnd = useRef(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{msg: "How can I help you today?", isBot: true}]);
  const [models, setModels] = useState(modelsList); 
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [temperature, setTemperature] = useState(0.7);

  const handleSend = async () => {
    const msg = input;
    setInput("");
    setMessages([...messages, {msg, isBot: false}]);

    const response = await sendMsgToOpenAI(msg, selectedModel);
    setMessages([...messages, {msg, isBot: false}, {msg: response, isBot: true}]); 
  }
  
  const handleEnter = async (e) => {
    if (e.key === 'Enter') await handleSend();
  }

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  useEffect(() => {
    msgEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="App">
        <div className="sideBar">
          <div className="upperSide">

            <div className="upperSideTop">
              <button className="newChat" onClick={() => {window.location.reload()}}><img src={addBtn} alt="new chat" className="addBtn" />New Chat</button>
            </div>

            <div className="upperSideBottom"> 
              <p className="infoTxt">Model</p>
              <select className="modelSelect" value={selectedModel} onChange={handleModelChange}>
                {models.map((model, index) => (
                  <option key={index} value={model}>{model}</option>
                ))}
              </select>
              <span className='box' onClick={() => setSelectedModel('davinci-002')}>Davinci</span>
              <span className='box' onClick={() => setSelectedModel('gpt-3.5-turbo')}>GPT 3.5</span>
              <span className='box' onClick={() => setSelectedModel('dall-e-2')}>Dall-e</span>
              <span className='txt'>The model parameter controls the engine used to generate the response. For chat, you can use models like Davinci, versions of GPT 3 and GPT 4. For generating images, you can use DALL-E.</span>
              
            </div>
            
            <div className="lowerSide">
              <div className="listItems"><img src={rocket} alt="Upgrade" className="listItemsImg" />
                <a href="#" target="_blank" rel="noopener noreferrer">Pro Verison</a><br />
              </div>
                <span className='txt'>Enjoy the benefits of GPT 4 with pro version, upload images with your chat, and save your chats in db for later.</span>
            </div>

          </div>
        </div>
        <div className="main">
          <div className="chats">
            {messages.map((message, index) => 
                <div key={index} className={` ${message.isBot ? "chat bot" : "chat"}`}>
                <img className="chatImg" src={message.isBot ? gptLogo : userIcon} alt="" /> 
                  {!message.msg.startsWith("http") ? (
                    renderMessage(message.msg)
                  ) : (
                    <img className="result-image" src={message.msg} alt="result" />
                  )}
              </div>
            )}
            <div ref={msgEnd} />
          </div> 
          <div className="chatFooter">
            <div className="inp">
              <input type="text" placeholder='Send a message' value={input} onKeyDown={handleEnter} onChange={e => {setInput(e.target.value)}} /><button className="send" onClick={handleSend}><img src={sendBtn} alt="send" /></button>
            </div>
            <p>ChatGPT can make mistakes. Consider checking important information.</p>
          </div>
        </div>

    </div>
  )
}
export default App
