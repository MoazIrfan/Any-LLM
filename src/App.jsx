import { useState, useRef, useEffect } from 'react';
import './App.css';
import { sendMsgToOpenAI } from './openai';
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

  const handleTemperatureChange = (event) => {
    const inputValue = event.target.value;
    // Check if the input value is a valid number between 0 and 1
    const allowedValues = ["0", "0.1", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "1"];
    if (allowedValues.includes(inputValue)) {
      setTemperature(inputValue);
    }
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
              <span className='box'>Text - Davinci, GPT 3, GPT 4</span>
              <span className='box'>Image - DALL-E</span>
              <span className='txt'>The model parameter controls the engine used to generate the response. For text, you can use models like Davinci, versions of GPT-3 and GPT-4. For generating images, you can use DALL-E.</span>
              
              <p className="infoTxt">Temperature</p>
              <input
                className='temperatureInput'
                type="text"
                placeholder={0.7}
              />
              <span className='box'>0 - Logical</span>
              <span className='box'>0.5 - Balanced</span>
              <span className='box'>1 - Creative</span>
              <span className='txt'>The temperature parameter controls the randomness of the model. 0 is the most logical, 1 is the most creative.</span>
            </div>
            
            <div className="lowerSide">
              <div className="listItems"><img src={rocket} alt="Upgrade" className="listItemsImg" />
                <a href="https://github.com/MoazIrfan/Any-LLM" target="_blank" rel="noopener noreferrer">Star the repo</a>
              </div>
            </div>

          </div>
        </div>
        <div className="main">
          <div className="chats">
            {messages.map((message, index) => 
                <div key={index} className={` ${message.isBot ? "chat bot" : "chat"}`}>
                <img className="chatImg" src={message.isBot ? gptLogo : userIcon} alt="" /> 
                  {!message.msg.includes("http") ? (
                    <p className="txt">{message.msg}</p>
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
