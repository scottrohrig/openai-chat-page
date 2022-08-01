import React, { useState, useEffect } from 'react';
import { getEngines, postPrompt } from '../openAi';
import './styles.css';

function Prompt({ model = 'curie', replies, setReplies }) {
  const [prompt, setPrompt] = useState('');
  const [rows, setRows] = useState(4);
  const styles = { waiting: 'b-l-gr', active: 'b-l-g', error: 'b-l-r' };
  const [bStyle, setBStyle] = useState(styles.waiting);

  const updatePromptStyle = () => {
    setBStyle(prompt.length > 0 ? styles.active : styles.waiting);
  };

  const addReply = async () => {
    const response = await postPrompt(model, prompt);
    console.log('replied', model, response.choices);
    setReplies([...response.choices, ...replies]);
  };

  return (
    <form
      className="pad"
      onSubmit={(e) => {
        e.preventDefault();
        console.log('submitted', model, prompt);
        addReply();
      }}>
      <textarea
        rows={rows}
        className={`${bStyle} pad`}
        value={prompt}
        onInput={(e) => {
          setPrompt(e.target.value);
          // setRows(10);
          updatePromptStyle();
        }}
      />
      <button class="b-0 bg-0 b-l-b text-start pad w-full" type="submit">
        Send
      </button>
    </form>
  );
}

function EngineDetail({ engine }) {
  return <option value={engine.id}>{engine.id}</option>;
}

export default function App() {
  const [res, setRes] = useState([]);
  const [model, setModel] = useState('curie');
  const [replies, setReplies] = useState([]);
  const [theme, setTheme] = useState('moon');

  const toggleTheme = () => {
    let bodyClasses = document.body.classList
    if (bodyClasses.contains('light')) {
      bodyClasses.replace('light', 'dark')
      setTheme('sun')
    }
    else if (bodyClasses.contains('dark')) {
      bodyClasses.replace('dark', 'light')
      setTheme('moon')
    }
  }
  }, []);

  return (
    <div className="App">
      <header className="bg-g c-bg">
        <h1 className="">Chatbot</h1>
        <h2>Select an engine and type in a prompt</h2>
        {/* <i className="fa-solid fa-moon"></i> */}
        <i className={`fa-solid fa-${theme}`} onClick={toggleTheme}></i>
        {/* <i className="fa-solid fa-bars"></i>
        <i className="fa-solid fa-times"></i> */}
      </header>
      <main>
        <section id="enginesSection" className="bg-b pad rnd">
          <div className="wrap">
            <label className="c-bg">Choose an AI Engine</label>
            <select
              className="b-0 bg-bg pad rnd"
              defaultValue=""
              onChange={(e) => setModel(e.target.value)}>
              <option value="" disabled>
                Select an Engine
              </option>
              {res.map((engine, i) => (
                <React.Fragment key={engine.id}>
                  <EngineDetail engine={engine} />
                </React.Fragment>
              ))}
            </select>
          </div>
        </section>
        <section className="prompt pad">
          <Prompt model={model} replies={replies} setReplies={setReplies} />
        </section>
        {replies.length > 0 && (
          <section className="bg-r rnd pad c-bg">
            {replies.map((reply, i) => {
              return (
                <p className="b-l-gr pad" key={i}>
                  <p>Reply {replies.length - i}:</p>
                  {reply.text}
                </p>
              );
            })}
          </section>
        )}
      </main>
      <footer className="bg-g"></footer>
    </div>
  );
}
