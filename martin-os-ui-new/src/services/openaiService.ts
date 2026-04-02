import OpenAI from 'openai';

const isPlaceholderKey = (key: string | undefined) => {
  if (!key) return true;
  const k = key.trim();
  return k === 'MY_GEMINI_API_KEY' || k === 'YOUR_API_KEY' || k === 'PASTE_YOUR_KEY_HERE' || k === 'sk-...' || k === 'AIza...';
};

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (isPlaceholderKey(apiKey)) throw new Error('OpenAI API Key not configured or is a placeholder');
  return new OpenAI({ apiKey: apiKey! });
};

export async function generateContentOpenAI(prompt: string, model: string = 'gpt-4o') {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
  });
  return completion.choices[0].message.content;
}
