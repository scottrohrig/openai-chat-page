import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-tKbSt4ZPkZkLU2DKLm6k3Lgm",
  apiKey: process.env.OPENAI_API_KEY || ""
});

const openai = new OpenAIApi(configuration);

const getEngines = async () => {
  const response = await openai.listEngines();
  return response.data;
};

const postPrompt = async (model, prompt) => {
  const response = await openai.createCompletion(model, {
    prompt,
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });
  return response.data;
};

export { getEngines, postPrompt };
