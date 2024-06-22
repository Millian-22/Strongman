import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from 'zod';

 const messagesArray = z.object({
  role: z.string(),
  content: z.string(),
 });


export const openAIRouter = createTRPCRouter({
  testStream: protectedProcedure.query(async function *() {
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      yield i;
    }
  }),
  getChat: protectedProcedure.input(z.array(messagesArray).optional()).query(async ({ctx, input}) => {
    
    if (!ctx.session || !ctx.session.user) {
      throw new Error('Unauthorized');
    }

    console.log('input', input);
    const inputMessages = input ?? [];
    
    const initialMessage = [{ role: "system", content: "You are a helpful nutrition-focused assistant. Act as though you haven't been asked a question yet" }]
    const chatMessages = inputMessages.length >= 1 ? [...initialMessage, ...inputMessages]: initialMessage;
    console.log('chatMessages', chatMessages);

    const completed = await ctx.openai.chat.completions.create({
            messages: chatMessages as ChatCompletionMessageParam[],
            model: "gpt-3.5-turbo",
            stream: true,
            max_tokens: 100,
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