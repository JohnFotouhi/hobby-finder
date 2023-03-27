import { Button, Form, InputGroup } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { BsSearch, BsFunnelFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import SearchCard from "../components/SearchCard";
import FullPageLoader from "../components/FullPageLoader";
import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth";
import { instrumentList } from "../lists";
import SingleselectInput from "../components/singleselectinput";
import { useGeolocated } from "react-geolocated";
import Filters from "../components/filters";
import Select from "react-select";
import Image from 'react-bootstrap/Image';
import HeroImage from '@/public/Jam-Hero.png';
import HeroMobile from '@/public/Jam-Hero-mobile.jpg';
import logo from '../public/JAM.png'
import { useMediaQuery } from 'react-responsive';
import globals from '../styles/Home.module.css'

function Search() {
    const emptyFilters = {
        experienceLevels: [],
        genres: [],
        distance: 10,
        commitMax: 0,
        commitMin: 0
    }
    const [filters, setFilters] = useState(emptyFilters);
    const [editFilters, setEditFilters] = useState(false);
    const [instrument, setInstrument] = useState({value: "", label: ""});
    const [users, setUsers] = useState<any[]>([]);
    const [failedSearch, setFailedSearch] = useState(false);
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const AuthUser = useAuthUser();
    //const [coords, setCoords] = useState();
    const { coords } = useGeolocated({
        positionOptions: {
        enableHighAccuracy: true,
        },
        userDecisionTimeout: 5000,
    });
    console.log(coords);

    useEffect( () => {
        doLocation(); 
    }, [coords] );

    function doLocation(){
        if(coords != undefined){
            fetch("/api/getLocation", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({uid: AuthUser.id, lat: coords.latitude, long: coords.longitude})
                })
                .then((res) => res.json())
                .then((data) => {
                    console.log("location setting done");
            }); 
        }
    }

    function updateFilters(filters){
        setFilters(filters);
    }
    function handleEditFilters(){
        setEditFilters(!editFilters);
    }

    function handleSearch(){
        console.log(filters);
        fetch("/api/search", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({search: instrument.value, filters: filters, coordinates: {latitude: coords?.latitude, longitude: coords?.longitude}, uid: AuthUser.id})
          })
        .then((res) => res.json())
        .then((data) => {
            setUsers(data);
            setFailedSearch(data.length === 0);
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
                        <div style={{width: isMobile ? "60%" : '300px'}}>
                            <Select
                                isSearchable={true} 
                                defaultValue={null}
                                onChange={setSearch}
                                options={instrumentList}
                                isMulti={false}
                                className="my-auto"
                                placeholder='Select an Instrument...'
                            />
                        </div>
                        <Button onClick={handleSearch} style={{height: '38px', width: isMobile ? "70px" : ''}} >Search <BsSearch /></Button>
                        <Button onClick={handleEditFilters} style={{height: '38px', width: isMobile ? "70px" : ''}}>Filter<BsFunnelFill /></Button>
                    </InputGroup>
                </Row>
            </Container>
            {users.length === 0 ?
            <Container className="align-items-center mx-auto text-center"> 
                <h1 className="mt-5" >
                    {failedSearch ? "No musicians matched your search" : "Search for musicians near you"}
                </h1>
                {isMobile ? 
                    <Image src={logo.src} className={globals.searchLogo}></Image> :
                    <Image src={logo.src}  className={globals.searchLogo}></Image>
                }
            </Container>
            :
            <Container className="mt-3">
                <Row className='m-auto'>
                    {users.map((user, index )=>(
                        <Col md="4" key={index + "userCard"}>
                            <SearchCard {...user} authId={user.key} />
                        </Col>
                    ))}
                </Row>
            </Container> }

            <Filters show={editFilters} setShow={setEditFilters} filters={filters} setFilters={updateFilters} />
        </>
    );
}

export default withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    LoaderComponent: FullPageLoader,
})(Search)