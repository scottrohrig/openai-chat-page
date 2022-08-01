# openai-chat-page

A simple interface to send prompts to the OpenAI API. Choose an AI Engine then submit your prompt and see what it comes up with! 

What if Kermit was in Blade?

This shows how different AI Engines responded to that prompt
![kermit in blade](https://media.discordapp.net/attachments/574680807256489991/986381854645059714/unknown.png?width=439&height=468)

## Installation

- Install the dependencies
    npm i
    
- Add your api key

Because this was small practice exercise built on Codesandbox.io, I hardcoded the api key and only inlcuded it when sampling data. I removed it when adding the project to GitHub. You can add dotenv and add your key to a `.env` file. Or simply add your key to the configuration in `openAi.js`
  - create a `.env` file and add your key 
  
  ```
  REACT_APP_OPENAI_API_KEY='your-api-key'
  ``` 

See [create react app docs](https://create-react-app.dev/docs/adding-custom-environment-variables/) for more info.
