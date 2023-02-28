// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANQhKbnHwzW2SHI-GTPz3rH0X7InikKDo",
  authDomain: "jamin-9ed6a.firebaseapp.com",
  databaseURL: "https://jamin-9ed6a-default-rtdb.firebaseio.com",
  projectId: "jamin-9ed6a",
  storageBucket: "jamin-9ed6a.appspot.com",
  messagingSenderId: "950884082294",
  appId: "1:950884082294:web:40d61d4452f007c2f07557",
  measurementId: "G-4HTBFDYZ1C"
};
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

export default async function writeData(req, res){
  // req.body
  try{
    const docRef = await addDoc(collection(database, 'users'), {
      key: req.body.uid,
      name: req.body.displayName,
      hobbyCards: [],
      availability: {},
      bio: "",
      pronouns: "",
      host: 0,
      equipment: ""
    });
  }catch(e){
    console.error("Error adding document: ", e);
  }
}

