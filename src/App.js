import React, { useState, useEffect } from 'react';
import { Configuration, OpenAIApi } from 'openai';

const openAI = new OpenAIApi(new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
}));


function App() {

  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Previous messages in conversation with AI is saved in this array
  const [messages, setMessages] = useState([]);

  const userInputHandler = (event) => {
    setUserInput(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(false);
    setUserInput('');
  };

  const clickHandler = () => {
    setIsSubmitted(true);
  }

  useEffect(() => {
    const fetchData = async() => {
      const res = await openAI.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant who teaches junior developers and checks on their code for optimization.'}, 
          { role: 'user', content: `${messages.join(' ')} ${userInput}` }
        ],
      })

      const message = res.data.choices[0].message.content;
      setResponse(message);
    };
  
    if (isSubmitted && userInput !== '') {
      fetchData();
      setMessages([...messages, response, userInput]);
      setResponse('Generating messages...');
      console.log(messages);
    }
  }, [userInput, isSubmitted, messages, response]);
  
  

  return (
    <div id="chat">
      <h1>Welcome, Junior Developers</h1>
      <ul>
        { messages.map((message) => <li>{ message }</li>) }
        <li>{ response  }</li>
      </ul>
      <form onSubmit={ submitHandler} id="user-input">
        <input onChange={ userInputHandler } value={ userInput } type="text" />
        <button onClick={ clickHandler} type="submit">Enter</button>
      </form>
    </div>
  );
}

export default App;
