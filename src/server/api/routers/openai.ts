// should be a util 
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: "org-VN07EVILyxzNxI8fqT7SOId5",
  project: "proj_Nc7nKJvXGEUiMD0sbiKhNrkB",
})
