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
  const [messages, setMessages] = useState([{ role: 'system', content: 'You are a helpful asistant who teaches junior developers and checks on their code for optimzation.' }]);

  const userInputHandler = (event) => {
    setUserInput(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(false);
    setUserInput('');
  };

  const clickHandler = () => {
    // Adds AI's previous response to messages
    if (response !== '' && response !== 'Generating messages...') {
      setMessages(messages => [...messages, { role: 'assistant', content: response }, { role: 'user', content: userInput }]);
    }
    setResponse('');
    setIsSubmitted(true);
    console.log(messages);
  }

  useEffect(() => {
    
    const fetchData = async() => {
      const res = await openAI.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
      })

      const message = res.data.choices[0].message.content;
      setResponse(message);
    };
  
    if (isSubmitted && userInput !== '') {
      setResponse('Generating messages...');
      setMessages(messages => [...messages, { role: 'user', content: userInput }]);
      fetchData();
    }
  }, [userInput, isSubmitted, messages, response]);

  const filteredMessages = messages.filter(message => message.role !== 'system');  
  const contents = filteredMessages.map(message => message.content);
  const uniqueContents = [...new Set(contents)];
  
  return (
    <div id="chat">
      <h1>Welcome, Junior Developers</h1>
      <ul>
        { uniqueContents.map((content) => <li>{ content }</li>) }
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
