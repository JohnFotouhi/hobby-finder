import { Button, Form } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsSearch, BsFunnelFill } from "react-icons/bs";
import { useState } from "react";
import SearchCard from "@/components/SearchCard";
import FullPageLoader from "@/components/FullPageLoader";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { instruments } from "@/lists";
import SingleselectInput from "@/components/singleselectinput";
import Filters from "@/components/filters";

function Search() {
    const emptyFilters = {
        experienceLevels: [],
        genres: [],
        commitmentLevels: [],
        distance: undefined
    }
    const [filters, setFilters] = useState(emptyFilters);
    const [editFilters, setEditFilters] = useState(false);
    const [instrument, setInstrument] = useState({value: "", label: ""});
    const [users, setUsers] = useState<any[]>([]);
    const instrumentOptions = instruments.map(function(instrument) {
        return {label: instrument, value: instrument};
    });

    function updateFilters(filters){
        setFilters(filters);
    }
    function handleEditFilters(){
        setEditFilters(!editFilters);
    }

    function handleSearch(){
        fetch("/api/search", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({search: instrument.value, filters: filters})
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
                <Form style={{whiteSpace: "nowrap"}}>
                    {/* className="w-50 mx-auto my-0" style={{display:"flex"}} */}
                    <SingleselectInput controlId={"instrumentSearch"} label={""} text={""} options={instrumentOptions} setValue={setInstrument} value={instrument} className={"w-25"} style={{display: "inline-flex"}}/>
                    <Button onClick={handleSearch} style={{float:"left"}}>Search <BsSearch /></Button>
                    <Button onClick={handleEditFilters}style={{height: "40px"}} className="my-auto"><BsFunnelFill /></Button>
                </Form>
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

            <Filters show={editFilters} setShow={setEditFilters} filters={filters} setFilters={updateFilters} />
        </>
    );
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
})(Search)