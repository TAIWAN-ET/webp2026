import React from 'react';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmIcon from '@mui/icons-material/Alarm';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const MultiButton = ({ count = 1 } = {}) => {
    var output = [];
    for(var i = 0; i < count; i++){
      output.push(<IconButton color="primary" aria-label="add to shopping cart" onClick={changeText}>
        <AddShoppingCartIcon /></IconButton>);
      output.push(<IconButton color="primary" aria-label="delete" onClick={changeText}>
        <DeleteIcon /></IconButton>);
      output.push(<IconButton color="primary" aria-label="alarm" onClick={changeText}>
        <AlarmIcon /></IconButton>);
    }
    return output;
  }

const changeText = (event) => {
    console.log(event.currentTarget);
    event.currentTarget.innerText = event.currentTarget.innerText + '被點了';
  };
  export default MultiButton;
