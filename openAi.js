import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  organization: 'org-tKbSt4ZPkZkLU2DKLm6k3Lgm',
  apiKey: process.env.OPENAI_API_KEY || '',
});
const openai = new OpenAIApi(configuration);

const completionOptions = {
  prompt,
  temperature: 0.7,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

const getEngines = async () => {
  try {
    const response = await openai.listEngines();
    return response.data;
  } catch (err) {
    console.log(err);
    return { data: [{ id: 'add your OPENAI_API_KEY' }] };
  }
};

const postPrompt = async (model, prompt) => {
  if (!configuration.apiKey) {
    return {
      choices: [{ text: 'You must add your OpenAi API Key to openAi.js' }],
    };
  }
  const response = await openai.createCompletion(model, completionOptions);
  return response.data;
};

export { getEngines, postPrompt, completionOptions };
