import Link from "next/link";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import FormInput from "./../components/formInput";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { useState } from "react";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";

export default function Registration(){
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    function createUser(){
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
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(userCredential);
            console.log(user);

            //add new user info to users db collection
            const data = {
                name: displayName,
                hobbyCards: [],
                availability: {},
                bio: "",
                pronouns: "",
                host: false,
                equipment: ""
            }
            const userRef = collection(database, "users")
            setDoc(doc(userRef, user.uid), {data});
            
        })
        .catch((error) => {
            console.log(error);
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
    }

    return(
        <>
        <Form className="w-25 mx-auto mt-3">
            <h1>Register</h1>

            <FormInput controlId="displayName" label="Display Name" type="text" placeholder="Display Name" text="" setValue={setDisplayName} value={displayName}/>
            <FormInput controlId="email" label="Email" type="email" placeholder="youremail@example.com" text="" setValue={setEmail} value={email}/>
            <FormInput controlId="password" label="Password" type="password" placeholder="" text="" setValue={setPassword} value={password}/>
            <FormInput controlId="passwordVal" label="Re-type Password" type="password" placeholder="" text="" setValue={setPasswordConfirm} value={passwordConfirm}/>
            <Button onClick={createUser} className="mt-4">Create Account</Button>
            
            <p>Already have an account? Login <Link href="/Login">here</Link></p>

        </Form>
    </>
    );
}