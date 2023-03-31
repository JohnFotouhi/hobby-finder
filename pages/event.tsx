import FullPageLoader from "@/components/FullPageLoader";
import { AuthAction, withAuthUser } from "next-firebase-auth";
import { useEffect } from "react";



function Event(){

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('eventId');

    }, [])

    return(
        <>
        </>
    );
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader
  })(Event)
