import {useState} from "react"
import { getStorage, ref, uploadBytes} from "firebase/storage";
import { initializeApp } from "firebase-admin";
// import { firebaseApp } from "@/"
// Create a root reference
// const app = initializeApp(firebaseCongi)
// const storage = getStorage(A);

// Create a reference to 'mountains.jpg'
const mountainsRef = ref(storage, 'mountains.jpg');

// Create a reference to 'images/mountains.jpg'
const mountainImagesRef = ref(storage, 'images/mountains.jpg');

// While the file names are the same, the references point to different files
mountainsRef.name === mountainImagesRef.name;           // true
mountainsRef.fullPath === mountainImagesRef.fullPath;   // false

const storageRef = ref(storage, 'some-child');




export default function UploadImage(image) {
    const [file, setFile] = useState("");

    // Handles input change event and updates state
    function handleChange(event) {
        setFile(event.target.files[0]);
    }

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
    });



    return (
        <div>
            <input type="file" accept="image/*" onChange={handleChange}/>
            <button>Upload to Firebase</button>
        </div>
    );
}



