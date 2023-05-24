import openAi from "./chatGpt";

const query = async (prompt: string, chatId: string, model: string) => {
  const res = await openAi
    .createCompletion({
      model,
      prompt,
      temperature: 0.9,
      max_tokens: 1000,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
    .then((res) => res.data.choices[0].text)
    .catch(
      (err) => `ChatGPT was unable to find an answer for that! ${err.message}`
    );
  return res;
};

export default query;
