import React from 'react';

import './Frame.css'

const frame = (props) => {
  const style = {
    backgroundImage: "url('/images/25.jpg')"
  }

  return (
    <div className="frame" style={style}>
      <div className="inner">
        {props.children}
      </div>
    </div>
  )
}

export default frame;
