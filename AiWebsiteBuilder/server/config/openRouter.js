import dotenv from "dotenv";
const openRouterUrl = "https://openrouter.ai/api/v1/chat/completions";
dotenv.config();
const openRouterApiKey = process.env.OPENROUTER_API_KEY;

const model = "deepseek/deepseek-chat";

const generateResponse = async (promt) => {
  console.log("Variable value:", openRouterApiKey);
  console.log("Process value:", openRouterApiKey);
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 2500,
      messages: [
        {
          role: "system",
          content: "You must return ONLY valid raw json",
        },
        {
          role: "user",
          content: promt,
        },
      ],
      temperature: 0.2,
    }),
  });
  console.log(res.ok);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`openRouter Error:::${err}`);
  }
  const data = await res.json();

  return data.choices[0].message.content;
};

export { generateResponse };
