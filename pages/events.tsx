import FullPageLoader from "@/components/FullPageLoader";
import firebaseApp from "@/config";
import { getEventListeners } from "events";
import { getStorage } from "firebase/storage";
import { AuthAction, useAuthUser, withAuthUser } from "next-firebase-auth";
import { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import globals from '../styles/Home.module.css'
import { BsFunnelFill, BsSearch } from "react-icons/bs";


const Events = () => {

    //user credentials
    const AuthUser = useAuthUser();
    const storage = getStorage(firebaseApp);

    //event status
    const [events, setEvents] = useState([]);

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = () => {
        //get eventId, title, description
        
    }


    function handleSearch(){
       
    }

    function handleEditFilters(){
       
    }

    return(
        <>
        <Row style={{marginTop:"15px"}}>
            <Col>
                <h1>Events</h1>                
            </Col>
            <Col style={{alignContent:"right"}}>
                <Button className={globals.btn} onClick={handleEditFilters} style={{marginRight: "5px"}}><BsFunnelFill/></Button>
                <Button className={globals.btn} style={{marginLeft: "5px"}}>Add an Event</Button>
            </Col>
        </Row>
        
        </>
    );
}


export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
  })(Events)

