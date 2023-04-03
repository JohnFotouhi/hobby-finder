import { Card, Row, Col, Button } from "react-bootstrap";
import globals from '../styles/Home.module.css'
import { BsPencil } from "react-icons/bs";
import { useRouter } from "next/router";


export default function eventCard({owner, id, title, description}){

    const router = useRouter();

    function visitEvent(){
        //visit profile of user
        //console.log(props);
        router.push({
            pathname: "/event",
            query: {eventId: id}
        });
    }

    return(
        <>
        <Card onClick={visitEvent}>
            <Card.Body>
                <Card.Title>
                    <Row>
                        <Col>
                            {title}
                        </Col>
                        <Col align="right">
                            {owner ? <Button className={globals.btn} onClick={visitEvent} style={{margin:1}}><BsPencil /></Button> : null}
                        </Col>
                    </Row>
                </Card.Title>
                <Row>{description} </Row>
            </Card.Body>
        </Card>
        </>
    )
}