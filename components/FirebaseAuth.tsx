import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import { getApp } from 'firebase/app'
import { getAuth, EmailAuthProvider } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { useEffect, useState } from 'react';

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
        signInSuccessWithAuthResult: () => false,
    },
}

export default function FirebaseAuth(){
    const [renderAuth, setRenderAuth] = useState(false);
    useEffect(() => {
        if(typeof window !== 'undefined'){
            setRenderAuth(true);
        }
    })
return(
    <>{
        renderAuth &&
        <StyledFirebaseAuth uiConfig={firebaseAuthConfig} firebaseAuth={getAuth(app)} className="mt-5"/>
    }
    </>
);
}