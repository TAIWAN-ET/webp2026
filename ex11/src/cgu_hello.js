import React, { useState } from 'react';
const styleArgument = {
    fontSize: '100px',
    color: 'red',
};

const CGUHello = () => {
  const [text, setText] = useState('hello CGU!!');

  return (
    <div>
      <h1 style={styleArgument}>{text}</h1>
    </div>
  );
};

export default CGUHello;