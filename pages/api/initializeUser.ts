// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, GeoPoint } from "firebase/firestore";
import firebaseApp from '../../config';
import { valueContainerCSS } from 'react-select/dist/declarations/src/components/containers';

const database = getFirestore(firebaseApp);

type Day = {
  morn: boolean,
  aft: boolean,
  eve: boolean,
  night: boolean,
}

export default async function writeData(req, res){
  try{
    var emptyDay = {morn: false, aft: false, eve: false, night: false}
    const avail : [Day, Day, Day, Day, Day, Day, Day] = [emptyDay,emptyDay,emptyDay,emptyDay,emptyDay,emptyDay,emptyDay];
    const docRef = await addDoc(collection(database, 'users'), {
      key: req.body.uid,
      name: req.body.displayName,
      email: req.body.email,
      availability: avail,
      bio: "",
      pronouns: "",
      host: 0,
      equipment: "",
      relationships: [{key: "", status: ""}]
    });
    docRef.id
    console.log(docRef);
    console.log("good!");
    res.status(200).json({ref: docRef});
    //const hobbyRef = await addDoc(collection(docRef, 'hobbies'), {});
    //console.log(hobbyRef);
  }catch(e){
    console.error("Error adding document: ", e);
    res.status(450).end({error: e});
  }
}

