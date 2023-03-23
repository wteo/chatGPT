import { config } from 'dotenv';
config();

import { Configuration, OpenAIApi } from 'openai';
import readline from 'readline';

const openAI = new OpenAIApi(new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
}));

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

userInterface.prompt();
userInterface.on('line', async (input) => {
  const res = await openAI.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: 'You are a helpful asistant who teaches junior developers and checks on their code for optimization.'}, 
    { role: 'user', content: input }],
  });
  console.log('AI Asistant:');
  console.log(res.data.choices[0].message.content);
  console.log(' ');
});