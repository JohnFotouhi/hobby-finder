// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from '@/config';

const database = getFirestore(firebaseApp);

export default async function writeData(req, res){
  try{
    const docRef = await addDoc(collection(database, 'users'), {
      key: req.body.uid,
      name: req.body.displayName,
      availability: {},
      bio: "",
      pronouns: "",
      host: 0,
      equipment: ""
    });
    docRef.id
    console.log(docRef);
    const hobbyRef = await addDoc(collection(docRef, 'hobby'), {});
    console.log(hobbyRef);
  }catch(e){
    console.error("Error adding document: ", e);
  }
}

