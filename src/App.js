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
  const [messages, setMessages] = useState([{ role: 'system', content: 'You are a helpful assistant who teaches junior developers and checks on their code for optimzation.' }]);

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
    // Reset AI's current respons
    setResponse('');
    setIsSubmitted(true);
    // console.log(messages);
  }

  useEffect(() => {
    
    const fetchData = async() => {
      const res = await openAI.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
      })

      const message = res.data.choices[0].message.content;
      setResponse(message); // Captures AI's generated response to user's input
    };
  
    if (isSubmitted && userInput !== '') {
      setResponse('Generating messages...');
      setMessages(messages => [...messages, { role: 'user', content: userInput }]); // Captures user's input and adds to messages array
      fetchData(); // Fetching AI API's reponse
    }
  }, [userInput, isSubmitted, messages, response]);

  const filteredMessages = messages.filter(message => message.role !== 'system'); // Filtered to remove first content in the array
  const contents = filteredMessages.map(message => message.content); 
  /* 
  Currently, API doesn't work as intended. As per OpenAI documentation, the arrangement of message array after first item should 
  have the roles 'user' and 'assistant' (a.k.a AI) in a continuing exchange.
  Hence, array should go like [user, assistant, user, assistant, user, assistant, etc...]. 
  From previous testing with this array, the AI would be prompted to generate the same message twice in a row.
  After several testing, I managed to resolve this by duplicating the user's input after the initial input. 
  Thus, the array arrangement becomes [user, user, assistant, user, user, assistant, etc...].
  However, this would still print every user's input twice in a row. Hence, I used Set to remove any duplications in the exchange.
  The downside to this is that the app will not print any user's subsequent inputs that are similar to previous inputs.
  Until I can find a more permanent solution, this current solution is only a quick fix. 
  */  
  const uniqueContents = [...new Set(contents)]; // Currently, API doesn't work as intended. The messages array
  
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
