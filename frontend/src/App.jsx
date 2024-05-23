import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import './App.css';
import toast from "react-hot-toast";
import { sendMsgToOpenAI, getChats, deleteChats } from './helpers';
import { renderMessage } from './utils';
import modelsList from './models';
import gptLogo from './assets/chatgpt.svg';
import sendBtn from './assets/send.svg';
import rocket from './assets/rocket.svg';
import userIcon from './assets/user-icon.jpg';
import imgIcon from './assets/image.png';
import gptImgLogo from './assets/chatgptLogo.svg';

function App() {
  const msgEnd = useRef(null);


  const [input, setInput] = useState("");
  const [chatMessages, setChatMessages] = useState([{content: "How can I help you today?", role: 'assistant'}]);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState(modelsList); 
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [imageData, setImageData] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [lastUserMessage, setLastUserMessage] = useState("");
  

  const handleSend = async () => {
    const msg = input;
    setLastUserMessage(input); 
    setInput("");
    setImagePreview(null);
    
    setLoading(true);
    const response = await sendMsgToOpenAI(msg, selectedModel, imageData);

    const responseMessage = response.responseMessage;

    setChatMessages(prev => [
      ...prev,
      { content: msg, role: "user" },
      { content: responseMessage, role: "assistant" }
    ]);
    setLoading(false);
  }
  
  const handleEnter = async (e) => {
    if (e.key === 'Enter') await handleSend();
  }

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  setImagePreview(URL.createObjectURL(file));
  const reader = new FileReader();
  reader.readAsDataURL(file);

    reader.onload = () => {
      const dataURL = reader.result;
      setImageData(dataURL);
    };

  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.error(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  useLayoutEffect(() => {
    toast.loading("Loading Chats", { id: "loadchats" });
    getChats()
      .then((data) => {
        setChatMessages([...data.chats]);
        toast.success("Successfully loaded chats", { id: "loadchats" });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Loading Failed", { id: "loadchats" });
      });
  }, []);

  useEffect(() => {
    msgEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, loading]);

  return (
    <div className="App">
      <div className="sideBar">
        <div className="upperSide">

          <div className="upperSideTop"></div>

          <div className="upperSideBottom"> 
            <p className="infoTxt">Model</p>
            <select className="modelSelect" value={selectedModel} onChange={handleModelChange}>
              {models.map((model, index) => (
                <option key={index} value={model}>{model}</option>
              ))}
            </select>
            <span className='box' onClick={() => setSelectedModel('gpt-3.5-turbo')}>GPT 3.5</span>
            <span className='box' onClick={() => setSelectedModel('dall-e-2')}>DALL-E</span>
            <span className='box' onClick={() => setSelectedModel('gpt-4-vision-preview')}>GPT 4 Vision</span>
            <span className='txt'>The model parameter controls the engine used to generate the response. You can use standard model GPT 3.5 for general tasks. For generating images, use DALL-E. And for uploading images, use GPT 4 Turbo or GPT 4 Vision.</span>
          </div>
          
          <div className="lowerSide">
            <button className="newChat" onClick={handleDeleteChats}>Clear Chat</button>

            <div className="listItems"><img src={rocket} alt="Upgrade" className="listItemsImg" />
                <a href="https://github.com/MoazIrfan/Any-LLM" target="_blank" rel="noopener noreferrer"> Star the Repo</a><br />
              </div>
          </div>

        </div>
      </div>
      <div className="main">
        <div className="chats">
          {chatMessages.map((message, index) => 
            <div key={index} className={`chat ${message.role === 'assistant' ? "bot" : ""}`}>
              <img className="chatImg" src={message.role === 'assistant' ? gptLogo : userIcon} alt="" /> 
                {!message.content.startsWith("http") ? (
                  renderMessage(message.content)
                ) : (
                  <img className="result-image" src={message.content} alt="result" />
                )}
            </div>
          )}
          {loading && (
            <>
            <div className="chat">
              <img className="chatImg" src={userIcon} alt="" /> 
              {lastUserMessage}
            </div>
            <div className="chat bot">
              <img className="chatImg" src={gptLogo} alt="" /> 
              AI is Typing...
            </div>
            </>
          )}
          <div ref={msgEnd} />
        </div> 
        {imagePreview &&
          <div className="imgView">
            <img src={imagePreview} alt="Preview" />
            <a href="#" className="clearImg" onClick={() => setImagePreview("")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-circle-x"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#838383"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <circle cx="12" cy="12" r="9"/>
                <path d="M10 10l4 4m0 -4l-4 4"/>
              </svg>
            </a>
          </div>
        }
        <div className="chatFooter">
          <div className="inp">
            {selectedModel == 'gpt-4-turbo' || selectedModel == 'gpt-4-vision-preview' ? ( 
              <label htmlFor="fileInput" className="customFileUpload">
                <img src={imgIcon} alt="Upload" />
                <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
            ) : null}
            <input type="text" placeholder='Send a message' value={input} onKeyDown={handleEnter} onChange={e => {setInput(e.target.value)}} />
            <button className="send" onClick={handleSend}><img src={sendBtn} alt="send" /></button>
          </div>
          <p>ChatGPT can make mistakes. Consider checking important information.</p>
        </div>
      </div>

    </div>
  )
}
export default App
