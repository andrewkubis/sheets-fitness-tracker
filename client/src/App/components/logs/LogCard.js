import React, { useState, useRef, useEffect } from 'react';
import Chevron from './Chevron.js';

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
    console.log(active);
  }

  return (
    <div className="accordion_section">
      <button className="accordion" onClick={toggleActive}>
        <p className="accordion_title">{props.title}</p>
        <Chevron className={active ? 'accordion_icon rotate' : "accordion_icon"} width={10} fill={"#777"} />
      </button>
      <div 
        ref={contentRef}
        className="accordion_content">
        <div 
          ref={contentRef}
          className="accordion_text"
        >
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default LogCard;