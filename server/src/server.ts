import 'dotenv/config';
import app from './app.js';
import { connectMongo } from './store.js';
const port=Number(process.env.PORT||5000);
await connectMongo(process.env.MONGODB_URI);
app.listen(port,()=>console.info(`AI Mystery Room API listening on ${port}`));
