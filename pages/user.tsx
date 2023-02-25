import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import HobbyCard from "@/components/hobbyCard";
import { useAuthUser, AuthAction, withAuthUser } from "next-firebase-auth";
import UploadImage from "@/components/uploadImage";
import UserInformation from "@/components/userInformation";
import perry from "@/public/User_images/perry.png";

function User() {

    //user credentials
    const AuthUser = useAuthUser();
    console.log(AuthUser);
    

    function editProfile(){
        //need to fill in
    }

    return(
        <>  
            <UserInformation capacity={"2"} equipment={"a condenser mic and an interface"} schedule = {"Any morning before 11am"} displayName={"Perry the Platypus"} bio={"*chatter*"} owner={false} editProfile={editProfile} profilePicture={perry}></UserInformation>
            <Container fluid className ="bg-light">

                <Col><Button>Reach Out</Button></Col>

                {/* TODO: For each hobby card in the database associated with the user, populate a hobby card component */}
                <HobbyCard uid={AuthUser.id} setCards={null} index={0} instrument={"Bass"} genre={"rock"} experience={"2 years - Beginner"} commitment={"Looking to join a band"} 
                info={"Id really love to join a band, but I dont care if we are trash!"} owner={false} editCard={null}></HobbyCard>

            </Container>
        </>
    );

}
export default withAuthUser({
    whenAuthed: AuthAction.REDIRECT_TO_APP,
    whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
    whenUnauthedAfterInit: AuthAction.RENDER,
  })(User)
