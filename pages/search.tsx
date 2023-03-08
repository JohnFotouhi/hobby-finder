import { Button, Form, InputGroup } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsSearch, BsFunnelFill } from "react-icons/bs";
import { useState } from "react";
import SearchCard from "../components/SearchCard";
import FullPageLoader from "../components/FullPageLoader";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { instrumentList } from "../lists";
import SingleselectInput from "../components/singleselectinput";
import Filters from "../components/filters";
import Select from "react-select"

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

    function setSearch(newInstrument){
        setInstrument(newInstrument);
    }
    return(
        <>  
            <Container fluid className='bg-light pb-3 mt-0' >
                <Row>
                    <InputGroup className="justify-content-center">
                        <div style={{width: '300px'}}>
                            <Select
                                isSearchable={true} 
                                defaultValue={instrument}
                                onChange={setSearch}
                                options={instrumentList}
                                isMulti={false}
                                className="my-auto"
                            />
                        </div>
                        <Button onClick={handleSearch} style={{height: "38px"}}>Search <BsSearch /></Button>
                        <Button onClick={handleEditFilters} style={{height: "38px"}}>Filter<BsFunnelFill /></Button>
                    </InputGroup>
                </Row>
            </Container>
            
            <Container className="mt-3">
                <Row className='m-auto'>
                    {users?.map((user, index )=>(
                        <Col md="4" key={index + "userCard"}>
                            <SearchCard {...user} authId={user.key} />
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