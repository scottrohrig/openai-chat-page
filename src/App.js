import React, { useState, useEffect } from 'react';
import { getEngines, postPrompt } from './openAi';
import './styles.css';

const load = () => {
  const storage = localStorage.getItem('replies')
  return JSON.parse(storage)
}

/**
 * Renders the chat's text input form. Handles submitting Prompts
 * @param {{model:String, replies:Array<{text}>, setReplies}} param0 
 * @returns 
 */
function Prompt({ model = 'curie', replies, setReplies }) {
  const [prompt, setPrompt] = useState('');
  const [rows, setRows] = useState(1);
  const styles = { waiting: 'b-l-gr', active: 'b-l-g', error: 'b-l-r' };
  const [bStyle, setBStyle] = useState(styles.waiting);

  const updatePromptStyle = () => {
    setBStyle(prompt.length > 0 ? styles.active : styles.waiting);
  };

  /** sends prompt text to `OpenAi`, 
   * then adds the data to the array of replies */
  const addReply = async () => {
    const response = await postPrompt(model, prompt);
    console.log('replied', model, response.choices); // [{finish_reason, index, logprobs, text, Prototype}]
    await setReplies([{ model, prompt, text: response.choices[0].text }, ...replies]);
  };

  // save replies to local storage
  useEffect(() => {
    (async () => {
      if(replies.length) localStorage.setItem('replies', JSON.stringify(replies))
    })()
  }, [replies])

  return (
    <form
      className="pad"
      type='submit'
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
          setRows(prompt.length > 0 ? (prompt.split('\n').length) + 1 : 0);
          updatePromptStyle();
        }}
        onKeyUp={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) return          
          else if (e.key === 'Enter' && e.shiftKey) e.preventDefault()
        }}
      />
      <button className="b-0 bg-0 b-l-b text-start pad w-full pointer" type="submit">
        Send
      </button>
    </form>
  );
}

/**
 * Returns an option with the engine name as the value and textContent
 * @param {{object: 'engine', id: String, owner: String, ready:Boolean}} param0 
 * @returns 
 */
function EngineDetail({ engine }) {
  return <option value={engine.id}>{engine.id}</option>;
}

export default function App() {
  const [engines, setEngines] = useState([]);
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

  useEffect(() => {
    (async () => {
      const response = await getEngines();
      // sort engines in reverse alphabetical order
      // `.sort((a,b) => a.id - b.id)` didn't work as expected for some reason...
      const data = response.data.sort((a, b) => (a.id <= b.id) ? 1 : -1)
      setEngines(data);
    })();

    setReplies(load());
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
              {/* List all the available OpenAi Engines */}
              {engines.map((engine, i) => (
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
              let shaveFront = reply.text.split('\n')
              let text = shaveFront.slice(2, shaveFront.length)
              return (
                <React.Fragment key={i}>
                  <h3 className='italic mt-1'>{replies.length - i}: {reply.prompt}</h3>


                  <div className="ai-reply pad">
                    {text.map((r, j) => !r ? <br /> : <p key={j}>{r}</p>)}
                  </div>
                  <h5 style={{ textAlign: 'right' }}>– {reply.model}</h5>
                </React.Fragment>
              );
            })}
          </section>
        )}
      </main>
      <footer className="bg-g"></footer>
    </div>
  );
}
