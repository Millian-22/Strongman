//cant stream in trpc --> FALSE

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const openAIRouter = createTRPCRouter({
  testStream: protectedProcedure.query(async function *() {
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      yield i;
    }
  }),
  getChat: protectedProcedure.query(async ({ctx}) => {
    const completed = await ctx.openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful nutrition-focused assistant." }],
            model: "gpt-3.5-turbo",
            stream: true,
          });

    const chunkOfWordsArray: string[] = [];
    for await (const chunk of completed) {
      // console.log('chunk', chunk);
      const individualMessage = chunk.choices[0]?.delta?.content;
      console.log('individualMessage', individualMessage);
      if (individualMessage && individualMessage !== ''){  
        chunkOfWordsArray.push(individualMessage);
      }
    }
    return chunkOfWordsArray;
  }),
});

// DEV JOURNAL