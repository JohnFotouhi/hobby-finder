import HobbyCardEditor from "@/components/hobbyCardEditor";
import { useState } from "react";
import { AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import FullPageLoader from "@/components/FullPageLoader";

export default function Profile() {

    fetch("/api/hobbyCardCreation", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data: "Some Data"})
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
      });

    //Hobby Card Functions
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);

    function handleCreate(){
        handleShow();

    }
    
const Profile = () =>  {
    const AuthUser = useAuthUser();
    console.log("");
    console.log(AuthUser);
    return(
        <>  
            <Button onClick={handleCreate}>Create New Hobby Card</Button>
            <HobbyCardEditor setShow={setShow} show={show} newCard={true} instrument={"Voice"} genre={"Rock"} experience={"Beginner"} commitment={"2 hours weekly"} info={"I dont care"}></HobbyCardEditor>
        </>
    );

}

// export const getServerSideProps = withAuthUserTokenSSR({
//     whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
// })(async ({AuthUser, req}) => {
//     console.log(AuthUser);
//     return{
//         props: {
//             test: "hello"
//         }
//     }
// })

// export default withAuthUser({
//     whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN
// })(Profile)

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
  })(Profile)