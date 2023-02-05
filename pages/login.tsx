import Link from "next/link";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login(){
    function login(email, password){
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    }
    return(
        <>
            <div className="Registration text-center">
                <h1>Login</h1>
                <form>
                    <label className = "container-md">
                        <p>Username</p>
                        <input type="text" name="username" />         
                    </label>
                    <label className = "container-md">
                        <p>Password</p>
                        <input type="text" name="password" />         
                    </label>

                    <div className = "container-sm">
                        <input type="submit" value="Login" />

                    </div>


                </form>               
                <p>Don't yet have an account? Register <Link href="/Registration">here</Link></p>

            </div>
        </>
    );
}