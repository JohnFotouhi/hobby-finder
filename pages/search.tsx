import { Button, Form, Stack, Alert, Navbar } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsSearch } from "react-icons/bs";
import { useEffect, useState } from "react";
import SearchForm from "@/components/searchForm";
import SearchCard from "@/components/SearchCard";
import FullPageLoader from "@/components/FullPageLoader";
import { withAuthUser, AuthAction } from "next-firebase-auth";

function Search() {
    const [editFilters, setEditFilters] = useState(false);
    // const [users, setUsers] = useState<any[]>([]);

    function handleEditFilters(){
        setEditFilters(!editFilters);
    }
    function handleSearch(){
        fetch("/api/search", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({data: "Some Data"})
          })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // setUsers(data.users);
          });
        setEditFilters(false);
    }

    const exampleUser = {
        id: "asdf79sadf0a2834ijsdakf",
        key: "89401324asdfjhasklfha",
        name: "John Doe",
        skills: [
            {
                id: "12342351312523",
                name: "guitar",
                experience: "Intermediate",
                genre: [
                    "folk",
                    "Other - Norwegian Underwater Square Dance"
                ],
                commitment: "low"
            },
            {
                id: "asdf780253",
                name: "Electric Guitar",
                experience: "Novice",
                genre: [
                    "rock"
                ],
                commitment: "moderate"
            },
            {
                id: "asdfsadf798",
                name: "Acapella",
                experience: "Expert",
                genre: [
                    "pop"
                ],
                commitment: "high"
            }
        ],
        availability: {
            monday: [
                "night"
            ],
            friday: [
                "afternoon",
                "night"
            ]
        },
        bio: "I'm a really cool guy who likes music.",
        pronouns: "he/him",
        host: false,
        equipment: "I have my own guitar and electric guitar, as well as amps. I also know a park where we could go with good acoustics but I don't want to host anything at my apartment."
    }

    const users = Array(12).fill(exampleUser);

    return(
        <>  
            <Container fluid className='bg-light' >
                {!editFilters && <Row className='m-auto' >
                    <Col className="text-center">
                        <Button variant="light outline-primary" size="lg" onClick={handleEditFilters}> <BsSearch/> Instrument | Genre | Experience</Button>
                    </Col>
                </Row>}
                {editFilters && <Row className='m-auto'>
                    <Col className="text-center">
                        <SearchForm search={handleSearch}/>
                    </Col>
                </Row>}
            </Container>
            
            <Container className="mt-3">
                <Row className='m-auto'>
                    {users?.map((user, index )=>(
                        <Col md="4" key={index + "userCard"}>
                            <SearchCard {...user} />
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
})(Search)