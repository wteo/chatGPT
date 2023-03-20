import { config } from 'dotenv';
config();

import { Configuration, OpenAIApi } from 'openai';
import readline from 'readline';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAI = new OpenAIApi(configuration);

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

userInterface.prompt();
userInterface.on('line', async (input) => {
  const res = await openAI.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: 'You are a helpful asistant who teaches junior developers and checks on their code for optimization.'}, { role: 'user', content: input }],
  });
  console.log('AI Asistant');
  console.log(`AI Asistant: ${res.data.choices[0].message.content}`);
});






