import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from "../trpc";

type GetMessages = {
  userMessage?: string,
  messageList?: any[], 
}
const getMessages = ({userMessage, messageList}: GetMessages) => {
  
  if (userMessage && messageList) {
    return [...messageList, userMessage];
  }
}

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
    
    // if (!ctx.session || !ctx.session.user) {
    //   throw new Error('Unauthorized');
    // }

    const initialMessage: ChatCompletionMessageParam[] = [{ role: "system", content: "You are a helpful nutrition-focused assistant. Act as though you haven't been asked a question yet" }]
    const chatMessages = input as ChatCompletionMessageParam[];

    const completed = await ctx.openai.chat.completions.create({
            messages: chatMessages.length > 0 ? chatMessages : initialMessage,
            model: "gpt-3.5-turbo",
            stream: true,
            max_tokens: 200,
          });

    const chunkOfWordsArray: string[] = [];
    for await (const chunk of completed) {
      const individualMessage = chunk.choices[0]?.delta?.content;
      if (individualMessage && individualMessage !== ''){  
        chunkOfWordsArray.push(individualMessage);
      }
    }
    return chunkOfWordsArray;
  }),
  sendChatMessage: protectedProcedure.input(z.array(messagesArray)).mutation(async ({ctx, input}) => {
    
    // if (!ctx.session || !ctx.session.user) {
    //   throw new Error('Unauthorized');
    // }

    const inputMessage = input;
    return inputMessage;

  }),
});
