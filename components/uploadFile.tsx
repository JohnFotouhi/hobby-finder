import { useState } from "react"
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes} from "firebase/storage";
import { initializeApp } from "firebase-admin";
import { Button } from 'react-bootstrap';
import globals from '../styles/Home.module.css'
import { BsUpload} from "react-icons/bs";
import firebaseApp from "../config";
import { useAuthUser } from "next-firebase-auth";


export default function UploadFile({setImage}) {

    const storage = getStorage(firebaseApp);
    const AuthUser = useAuthUser();

    // Handles input change event and updates state
    function handleChange(event) {
        console.log(event.target.files)
        console.log(event.target.files[0])

        const image = event.target.files[0];

        if (image == null) {
            alert("image is null");
            return;
        }
        else {
            const imageRef = ref(storage, `Profile Pictures/${AuthUser.id}`);

            deleteObject(imageRef).then(() => {
                    console.log('successful deletion')
                }).catch((error) => {
                    console.log(error)
              });  
              
            uploadBytes(imageRef, image).then(() => {
                alert("Image uploaded");
                listAll(imageRef).then((res) => {
                    res.items.forEach((item) => {
                        getDownloadURL(item).then((url) => {
                            console.log('successful upload')
                            setImage(url)
                        })
                    })
                })
            })
        }
    }


    return (
        <div>
            <input id="getFile" type="file" accept="image/*" className={globals.upload} onChange={handleChange}/>
            <Button onClick={() => document.getElementById('getFile')!.click()}><BsUpload/></Button>
            {/* <Button>Upload Image</Button> */}
        </div>
    );
}



