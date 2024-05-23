const { MongoClient } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const mongoose = require('mongoose');
const Message = require('./models/Message.js');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 8000;

const dontenv = require('dotenv');
dontenv.config();

// Increase the payload size limit to 20MB
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
});

// Set up middleware
app.use(bodyParser.json());
app.use(cors());

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
.then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
})

app.post('/askAI', async (req, res) => {
  const { msg, selectedModel, imageData } = req.body;
  try {
    // Retrieve all messages from the database
    const allMessages = await Message.find({}, { _id: 0, content: 1, role: 1 });

    // Convert messages to the format expected by OpenAI
    const chats = allMessages.map(({ role, content }) => ({ role, content }));
    chats.push({ content: msg, role: "user" });
    
    // Get latest response
    let chatResponse;
    let responseMessage;
    if (selectedModel.includes("gpt-4-turbo") || selectedModel.includes("vision-preview")) {
      let myChats = [...chats];
      if (imageData) {
        myChats = [...myChats, {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageData } }
          ]
        }];
      }
      
      chatResponse = await openai.chat.completions.create({
        model: selectedModel,
        messages: myChats,
      });
      responseMessage = chatResponse.choices[0].message.content;
    } else if (selectedModel.includes("gpt")) {
      chatResponse = await openai.chat.completions.create({
        model: selectedModel,
        messages: chats,
      });
      responseMessage = chatResponse.choices[0].message.content;
    } else if (selectedModel === "dall-e-2" || selectedModel === "dall-e-3") {
      chatResponse = await openai.images.generate({
        prompt: msg,
        n: 1,
        size: "512x512",
      });
      responseMessage = chatResponse.data[0].url;
    } else {
      chatResponse = await openai.completions.create({
        model: selectedModel,
        prompt: msg,
      });
      responseMessage = chatResponse.choices[0].text;
    }

    // Save messages to database
    await Message.create([
        { content: msg, role: "user" },
        { content: responseMessage, role: "assistant" }
    ]);

    return res.status(200).json({ responseMessage });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

app.get('/chats', async (req, res) => {
  try {
    const chats = await Message.find();
    return res.status(200).json({ message: "OK", chats: chats});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

app.delete('/delete', async (req, res) => {
  try {
    await Message.deleteMany();
    return res.status(200).json({ message: "All messages deleted successfully."});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
