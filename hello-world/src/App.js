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
      <h1 style={{ styleArgument: true }} onClick={changeText}>
        {text}
      </h1>
    </div>
  );
}

export default App;
