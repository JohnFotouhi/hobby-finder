import HobbyCardEditor from "@/components/hobbyCardEditor";
import { useEffect, useState } from "react";
import { AuthAction, init, useAuthUser, withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";
import FullPageLoader from "@/components/FullPageLoader";
import HobbyCard from "@/components/hobbyCard";
import { initializeApp } from "firebase-admin";

const Profile = () => {

    //user credentials
    const AuthUser = useAuthUser();
    console.log(AuthUser);

    //user's cards
    const [cards, setCards] = useState<any[]>([]);
    const [cardComponents, setCardComponents] = useState<any[]>([]);

    //Hobby Card States
    const [show, setShow] = useState(false);
    const [newCard, setNewCard] = useState(true);

    const [oldInstrumentId, setOldInstrumentId] = useState(0);
    const [oldGenres, setOldGenres] = useState<any[]>([]);
    const [oldExperience, setOldExperience] = useState("");
    const [oldCommitment, setOldCommitment] = useState("");
    const [oldInfo, setOldInfo] = useState("");

    //get user's hobby cards
    useEffect(() => {
        getCards();
    }, [cards]);

    const getGenreList = (genres : [string]) => {
        let genreList = "Genres: ";
        genres.forEach((genre, i) => {
            if(i==0){
                genreList = genreList + genre;
            }
            else{
                genreList = genreList + ", " + genre;
            }
        });
        return genreList;
    }

    const getCards = () => {
        fetch("/api/hobbyCardRetrieval", { 
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({uid: AuthUser.id})
        })
            .then((res) => res.json())
            .then((data) => {
            console.log(data)
            setCards(data);
        });
        let map = cards.map((card, i) => (
            <HobbyCard uid={AuthUser.id} index={i} instrument={card.instrument} genre={getGenreList(card.genres)} experience={card.experience} commitment={card.commitment} info={card.info} owner={true} editCard={editCard}></HobbyCard>
        ))
        setCardComponents(map);
    }

    function handleCreate(){
        setNewCard(true);

        //empty params so the card starts blank
        setOldInstrumentId(-1);
        setOldGenres([])
        setOldExperience("");
        setOldCommitment("");
        setOldInfo("");

        setShow(true);
    }

    //in future, will likely take parameters of current settings and ID
    function editCard(){
        setNewCard(false);

        //set state of existing parameters
        //setOldInstrumentId(2);

        //show editor modal
        setShow(true);
    }
    
    return(
        <>  
            <Col>
                <Button onClick={handleCreate}>Create New Hobby Card</Button>
                {/* TODO: populate hobby card section from database */}
                <Row>
                {/* {cardComponents} */}
                </Row>
                <HobbyCardEditor uid={AuthUser.id} setShow={setShow} show={show} newCard={newCard} oldInstrument={undefined} oldGenre={undefined} oldExperience={undefined} oldCommitment={undefined} oldInfo={undefined}></HobbyCardEditor>
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