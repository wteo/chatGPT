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
  const res = await openAI.createCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: input }],
    temperature: 0,
    max_tokens: 7,
  });
  console.log(res.data);
  // console.log(res.data.choices[0].message.content);
  userInterface.prompt();
});






