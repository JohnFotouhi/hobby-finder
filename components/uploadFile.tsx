import {useState} from "react"
import { getStorage, ref, uploadBytes} from "firebase/storage";
import { initializeApp } from "firebase-admin";
import {storage} from "@/config";
import {v4} from 'uuid' //Used to randomize names of profile images
import { Button } from 'react-bootstrap';




export default function UploadFile(image) {
    const [imageUpload, setImageUpload] = useState(null);

    // Handles input change event and updates state
    function handleChange(event) {
        setImageUpload(event.target.files[0]);
        uploadImage();
    }

    function uploadImage() {
        if (imageUpload == null) {
            alert("image is null");
            return;
        }

        const imageRef = ref(storage, `Profile Picture/${imageUpload + v4()}`);
        uploadBytes(imageRef, imageUpload).then(() => {
            alert("Image uploaded");
        })
    }




    return (
        <div>
            <input type="file" accept="image/*" onChange={handleChange}/>
            <Button>Upload Image</Button>
        </div>
    );
}



