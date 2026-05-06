import { useState } from 'react';
import './App.css';
import MultiButton from './cgu_multiButton';
import CGUHello from './cgu_hello';

function App() {
  
  return (
    <div className="App">
      <div>
      {CGUHello()}
      </div>
      <div>
        {MultiButton(10) }
      </div>
    </div>
    
  );
}

export default App;