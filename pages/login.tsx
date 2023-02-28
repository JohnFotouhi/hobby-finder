import FirebaseAuth from "../components/FirebaseAuth";
import { AuthAction, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";

const Login = () => (
    <>  
        <h3 className="text-center mt-3">Jam</h3>
        <FirebaseAuth />
    </>
)

export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
  })(Login)

// export const getServerSideProps = withAuthUserTokenSSR({
//     whenAuthed: AuthAction.REDIRECT_TO_APP
// })()

// export default withAuthUser({
//     whenAuthed: AuthAction.REDIRECT_TO_APP,
// })(Login)