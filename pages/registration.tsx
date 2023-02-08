import Link from "next/link";
import { Button } from "react-bootstrap";
import FormInput from "./../components/formInput";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function Registration(){
    // function createUser(email, password, username, location){
    //     const auth = getAuth();
    //     createUserWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //         // Signed in 
    //         const user = userCredential.user;
    //         // ...
    //     })
    //     .catch((error) => {
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         // ..
    //     });
    // }
    
    return(
        <>
        <div className="Registration text-center">
            <h1>Register</h1>

            <FormInput controlId="displayName" label="Display Name" type="text" placeholder="Display Name" text=""/>
            <FormInput controlId="email" label="Email" type="email" placeholder="youremail@example.com" text=""/>
            <FormInput controlId="password" label="Password" type="password" placeholder="" text=""/>
            <FormInput controlId="passwordVal" label="Re-type Password" type="password" placeholder="" text=""/>
            {/* <Button onClick={createUser} className="mt-4">Create Account</Button> */}
            
            <p>Already have an account? Login <Link href="/Login">here</Link></p>

        </div>


    </>
    );
}