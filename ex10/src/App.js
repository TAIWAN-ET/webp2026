import { useState } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('hello CGU!!');

  const changeText = (event) => {
    console.log(event.target);
    event.target.innerText = event.target.innerText + '被點了';
  };

  return (
    <div className="App">
      <button onClick={changeText}>{text}</button>
    </div>
  );
}

export default App;
