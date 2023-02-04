// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase, ref, set } from "firebase/database";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCDDJwfuw48sXBlh86e4_Q6upEous9Gbx8",
  authDomain: "swe-jam-e48be.firebaseapp.com",
  databaseURL: "https://swe-jam-e48be-default-rtdb.firebaseio.com",
  projectId: "swe-jam-e48be",
  storageBucket: "swe-jam-e48be.appspot.com",
  messagingSenderId: "426619974603",
  appId: "1:426619974603:web:111db4a801f2797f3e3c4e",
  measurementId: "G-4CWH6WGMW8"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function writeData(){
  set(ref(database, 'test/'), {
    hello: "Hello World!"
  });
}

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  writeData();
  res.status(200).json({ name: 'John Doe' })
}
