import { Button, Col, Container, Row, Form } from "react-bootstrap";
import FormInput from "./formInput";
import { BsSearch } from "react-icons/bs";
import { useState } from "react";
import MultiselectInput from "./multiselectInput";

export default function SearchForm(search){
    const [distance, setDistance] = useState();
    const experienceLevels = [{name: "Low: Less than 3 years", id: "XP1"}, {name: "Medium: 3-6 years", id: "XP2"}, {name: "High: more than 6 years", id: "XP3"}];
    const skills = [{name: "Acapella", id: "skill1"}, {name: "Guitar", id: "skill2"}, {name: "Piano", id: "skill3"}, {name: "Other", id: "skill0"}];
    const genre = [{name: "Rock", id: "genre1"}, {name: "Jazz", id: "genre2"}, {name: "Classical", id: "genre3"}, {name: "Other", id: "genre0"}];
    const commitmentLevels = [{name: "Low: Less than 3 hours per week", id: "commit1"}, {name: "Medium: 3-7 hours per week", id: "commit2"}, {name: "High: more than 7 hours per week", id: "commit3"}];    
    return(
        <Form>
            <Container>
                <Form>
                <Row>
                    <Col>
                        <MultiselectInput
                        controlId="skillInput"
                        label="Skills"
                        text=""
                        options={skills}
                        />
                    </Col>
                    <Col>
                        <MultiselectInput
                        controlId="genreInput"
                        label="Genre of Music"
                        text=""
                        options={genre}
                        />
                    </Col>
                    <Col>
                        <MultiselectInput
                        controlId="commitmentInput"
                        label="Time Commitment"
                        text=""
                        options={commitmentLevels}
                        />
                    </Col>
                    <Col>
                        <MultiselectInput
                        controlId="experienceInput"
                        label="Experience Level"
                        text=""
                        options={experienceLevels}
                        />
                    </Col>
                    <Col>
                        <FormInput controlId="distanceInput" label="Distance" type="number" placeholder="" text="Max. distance in miles" value={distance} setValue={setDistance} />
                    </Col>
                    <Col>
                        <Button onClick={search.search} className="mt-4"><BsSearch/></Button>
                    </Col>
                </Row>
                </Form>
            </Container>
        </Form>
    );
}