import Link from "next/link";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function Registration(){
    function createUser(email, password, username, location){
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
    }
    return(
        <>
        <div className="Registration text-center">
            <h1>Register</h1>
            <form>
                <label className = "container-md">
                    <p>Username</p>
                    <input type="text" name="username" />         
                </label>
                <label className = "container-md">
                    <p>Email</p>
                    <input type="email" name="email" />         
                </label>
                <label className = "container-md">
                    <p>Location</p>
                    <input type="text" name="location" />         
                </label>
                <label className = "container-md">
                    <p>Password</p>
                    <input type="text" name="password" />         
                </label>
                <label className = "container-md">
                    <p>Verify Password</p>
                    <input type="text" name="verify password" />         
                </label>

                <div className = "container-sm">
                    <input type="submit" value="Create Account" />
                </div>


            </form>               
            <p>Already have an account? Login <Link href="/Login">here</Link></p>

        </div>


    </>
    );
}