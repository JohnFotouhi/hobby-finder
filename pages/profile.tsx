import HobbyCardEditor from "@/components/hobbyCardEditor";
import { Button, Col, Container, Row, Form, Stack, Alert, Navbar } from "react-bootstrap";

export default function Profile() {
    
    return(
        <>  
            <div>

            <HobbyCardEditor instrument={undefined} genre={undefined} experience={undefined} commitment={undefined} info={undefined} clip={undefined}></HobbyCardEditor>
            </div>
            
        </>
    );

}
