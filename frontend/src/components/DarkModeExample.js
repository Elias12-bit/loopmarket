import React, { useState } from 'react';

function DarkModeExample() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleMode = () => {
    setDarkMode(!darkMode);

    document.body.style.backgroundColor = !darkMode ? "#fdfdfdff" : "#0b0808ff";
    document.body.style.color = !darkMode ? "#0d0101ff" : "#f6efefff";
  };

  const styles = {
    padding: '20px',
    textAlign: 'center'
  };

  return (
    <div style={styles}>
      <p>{!darkMode ? 'Dark Mode 🌙' : 'Light Mode ☀️'}</p>
      <button onClick={toggleMode}>Toggle Mode</button>
    </div>
  );
}

export default DarkModeExample;
