import { type ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from 'zod';

type GetMessages = {
  userMessage?: string,
  messageList?: any[], //should be an array of objects but 
}
const getMessages = ({userMessage, messageList}: GetMessages) => {
  // const initialMessage = [{ role: "system", content: "You are a helpful nutrition-focused assistant. Act as though you haven't been asked a question yet" }];
  
  if (userMessage && messageList) {
    return [...messageList, userMessage];
  }
}

 const messagesArray = z.object({
  role: z.string(),
  content: z.string(),
 });

//  const sendUserMessage = 

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

    // console.log('ctx', ctx);
    console.log('input', input);

    const initialMessage: ChatCompletionMessageParam[] = [{ role: "system", content: "You are a helpful nutrition-focused assistant. Act as though you haven't been asked a question yet" }]
    // const chatMessages = getMessages({});
    // console.log('chatMessages', chatMessages);
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
    
    if (!ctx.session || !ctx.session.user) {
      throw new Error('Unauthorized');
    }

    //You dont have to do this on the front end, setQueryData will let you just spread the data and you just add the message. This should just take in messages.
    //and I guess the transforming is done here. And then you jsut reutrn the message. No need to do on the front end. 
    const inputMessage = input;
    // return {role: 'user', content: inputMessage};
    return inputMessage;




    
    // const initialMessage = [{ role: "system", content: "You are a helpful nutrition-focused assistant. Act as though you haven't been asked a question yet" }]
    // const chatMessages = inputMessages.length >= 1 ? [...initialMessage, ...inputMessages]: initialMessage;
   
    // console.log('chatMessages', chatMessages);

    // const completed = await ctx.openai.chat.completions.create({
    //         messages: chatMessages as ChatCompletionMessageParam[],
    //         model: "gpt-3.5-turbo",
    //         stream: true,
    //         max_tokens: 200,
    //       });

    // const chunkOfWordsArray: string[] = [];
    // for await (const chunk of completed) {
    //   const individualMessage = chunk.choices[0]?.delta?.content;
    //   if (individualMessage && individualMessage !== ''){  
    //     chunkOfWordsArray.push(individualMessage);
    //   }
    // }
    // return chunkOfWordsArray;
  }),
});
