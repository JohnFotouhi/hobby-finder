import HobbyCardEditor from "@/components/hobbyCardEditor";
import { useState } from "react";
import { AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import FullPageLoader from "@/components/FullPageLoader";
import HobbyCard from "@/components/hobbyCard";

const Profile = () => {

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
    
    const AuthUser = useAuthUser();
    console.log(AuthUser);
    return(
        <>  
            <Col>
                <Button onClick={handleCreate}>Create New Hobby Card</Button>
                {/* TODO: populate hobby card section from database */}
                <Row>
                <HobbyCard instrument={"Drums"} genre={"rock"} experience={"2 years - Beginner"} commitment={"2-5 hours weekly"} 
                    info={"Looking to join a chill band!"} owner={true}></HobbyCard>
                <HobbyCard instrument={"Voice"} genre={"jazz"} experience={"7 years - Expererienced"} commitment={"1-2 hours weekly"} 
                    info={"Looking to sing standards with any jazz group that happens to be gathering"} owner={true}></HobbyCard>
                </Row>
                <HobbyCardEditor setShow={setShow} show={show} newCard={true} oldInstrument={"Voice"} oldGenre={"Rock"} oldExperience={"Beginner"} oldCommitment={"2 hours weekly"} oldInfo={"I dont care"}></HobbyCardEditor>
            </Col>
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