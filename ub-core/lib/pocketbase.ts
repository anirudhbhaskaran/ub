// lib/pocketbase.ts
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.POCKETBASE_URL); // change if hosted elsewhere

export default pb;
