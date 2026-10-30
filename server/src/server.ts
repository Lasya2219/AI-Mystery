import 'dotenv/config';
import app from './app.js';
import { connectMongo } from './store.js';
const port=Number(process.env.PORT||5000);
if(process.env.NODE_ENV==='production'){
  const missing=['MONGODB_URI','GEMINI_API_KEY','CLIENT_ORIGIN'].filter(name=>!process.env[name]?.trim());
  if(missing.length)throw new Error(`Missing required production configuration: ${missing.join(', ')}`);
}
await connectMongo(process.env.MONGODB_URI);
app.listen(port,'0.0.0.0',()=>console.info(`AI Mystery Room API listening on ${port}`));
