import React, { useState, useRef, useEffect } from 'react';
import Chevron from '../Chevron.js';

function LogCard(props) {

  const [active, setActive] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    contentRef.current.style.maxHeight = active
      ? `${contentRef.current.scrollHeight}px`
      : "0px";
  }, [contentRef, active]);

  const toggleActive = () => {
    setActive(!active);
  }

  return (
    <div className="card-section">
      <button className={active ? "card active" : "card"} onClick={toggleActive}>
        <p className="card-title">{props.title}</p>
        <Chevron className={active ? 'card-icon rotate' : "card-icon"}
          width={10} fill={"#777"} />
      </button>
      <div 
        ref={contentRef}
        className="card-content">
        <div 
          ref={contentRef}
          className="card-text"
        >
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default LogCard;