import FullPageLoader from "@/components/FullPageLoader";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { useEffect } from "react";
import { Row, Col, Button, Container } from "react-bootstrap";



function Event(){

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('eventId');
        console.log(eventId)
    }, [])

    return(
        <>
        <Row>
            <h1>EVENT!</h1>
        </Row>
        </>
    );
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader
  })(Event)
