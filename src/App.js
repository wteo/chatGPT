import React, { useState, useEffect } from 'react';
import { Configuration, OpenAIApi } from 'openai';

const openAI = new OpenAIApi(new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
}));


function App() {

  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');

  const userInputHandler = (event) => {
    setUserInput(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    // setUserInput('');
  };

  useEffect(() => {
    let timeoutId;
  
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        clearTimeout(timeoutId);
        fetchData();
      }
    };
  
    const handleClick = () => {
      clearTimeout(timeoutId);
      fetchData();
    };
  
    const fetchData = async () => {
      const res = await openAI.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant who teaches junior developers and checks on their code for optimization.'}, 
          { role: 'user', content: userInput }
        ],
      });
      const message = res.data.choices[0].message.content;
      setResponse(message);
    };
  
    document.addEventListener('keydown', handleKeyPress);
    const button = document.querySelector('button');
    button.addEventListener('click', handleClick);
  
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      button.removeEventListener('click', handleClick);
      clearTimeout(timeoutId);
    };
  }, [userInput]);
  
  

  return (
    <div id="chat">
      <ul>
        <li>{ response  }</li>
      </ul>
      <form onSubmit={ submitHandler} id="user-input">
        <input onChange={ userInputHandler } value={ userInput } type="text" />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}

export default App;
