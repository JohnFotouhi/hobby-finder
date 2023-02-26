import { Button, Form, Stack, Alert, Navbar } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsSearch, BsFunnelFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import SearchForm from "@/components/searchForm";
import SearchCard from "@/components/SearchCard";
import FullPageLoader from "@/components/FullPageLoader";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import FormInput from "@/components/formInput"; 

function Search() {
    const [editFilters, setEditFilters] = useState(false);
    const [instrument, setInstrument] = useState("");
    const [users, setUsers] = useState<any[]>([]);

    function handleEditFilters(){
        setEditFilters(!editFilters);
    }
    function handleSearch(){
        fetch("/api/search", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({search: instrument})
          })
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
          });
        setEditFilters(false);
    }

    return(
        <>  
            <Container fluid className='bg-light pb-3 mt-0' >
                <div className="w-50 mx-auto my-0" style={{display:"flex"}}>
                    <div className="w-50">
                        <FormInput class="mx-2" label="" text="" controlId={"instrumentSearch"} type="text" placeholder={"Search for musicians by instrument..."} setValue={setInstrument} value={instrument} />
                    </div>
                    <Button onClick={handleSearch}>Search <BsSearch /></Button>
                </div>
                <Button onClick={handleEditFilters}><BsFunnelFill /></Button>
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