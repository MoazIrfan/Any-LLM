import {Configuration, OpenAIApi} from 'openai';
const configuration = new Configuration({apiKey: import.meta.env.VITE_OPENAI_API_KEY})
const openai = new OpenAIApi(configuration);

export async function sendMsgToOpenAI(msg, selectedModel) {
  try{
    let response;
    if (selectedModel.includes("gpt")) {
      response = await openai.createChatCompletion({
      model: selectedModel,
      temperature: 0.7,
      max_tokens: 250,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages: [
        {role: 'system', content: 'You are a helpful assistant.'},
        {role: 'user', content: msg}
      ]
    });
      return response.data.choices[0].message.content;
    } else if (selectedModel === "dall-e-2" || selectedModel === "dall-e-3") {
        response = await openai.createImage({
            prompt: msg,
            n: 1,
            size: "512x512",
          });
        return response.data.data[0].url;
      } else {
          response = await openai.createCompletion({
          model: selectedModel,
          prompt: msg,
          temperature: 0.7,
          max_tokens: 100,
          });
          return response.data.choices[0].text;
        }
  } catch (error) {
    return 'Error processing request';
  }
   
}