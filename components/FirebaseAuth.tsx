import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { getAuth, EmailAuthProvider, sendEmailVerification } from 'firebase/auth'
import { useEffect, useState } from 'react';
import { getFirestore, collection, updateDoc, query, where, getDocs, doc } from 'firebase/firestore';
import { Modal } from 'react-bootstrap';
import { useAuthUser } from 'next-firebase-auth';
import firebaseApp from '../config';

const database = getFirestore(firebaseApp);

export default function FirebaseAuth(){
    const [renderAuth, setRenderAuth] = useState(false);
    const [emailVerifyMessage, setEmailVerifyMessage] = useState(false);
    useEffect(() => {
        if(typeof window !== 'undefined'){
            setRenderAuth(true);
        }
    })
    const AuthUser = useAuthUser();
    const usersCollection = collection(database, "users");

    async function handleNoEmailVerification(){
        setEmailVerifyMessage(true);
        setRenderAuth(false);
        // await AuthUser.signOut();
    }

    // https://github.com/gladly-team/next-firebase-auth/blob/v1.x/example/components/FirebaseAuth.js
    const firebaseAuthConfig = {
        signInFlow: 'popup',
        signInOptions: [
            {
                provider: EmailAuthProvider.PROVIDER_ID,
                requireDisplayName: true,
            },
        ],
        signInSuccessUrl: '/search',
        credentialHelper: 'none',
        callbacks: {
            signInSuccessWithAuthResult: (signInData) => {
                console.log("SIGN IN DATA")
                console.log(signInData);
                const user = signInData.user;
                if(signInData.additionalUserInfo.isNewUser){
                    console.log("add");
                    if(user !== null){
                        sendEmailVerification(user)
                        .then(() => {
                            console.log("Sent email verification!");
                        });
                    }
                    fetch("/api/initializeUser", {
                        method: "POST",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({uid: user.uid, displayName: user.displayName})
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log("done");
                    });

                }
                else{
                    if(! signInData.user.emailVerified){
                        console.log("IM HERE");
                        
                        // handleNoEmailVerification();
                    }
                    else{
                        // they verified email
                    }
                }              

                return true;
            },
            
        },
    }

return(
    <>{
        renderAuth &&
        <StyledFirebaseAuth uiConfig={firebaseAuthConfig} firebaseAuth={getAuth(firebaseApp)} className="mt-5"/>
    }
    {   emailVerifyMessage &&
        <Modal>
            <Modal.Header>Please Check your email for verification link</Modal.Header>
        </Modal>
    }
    </>
);
}