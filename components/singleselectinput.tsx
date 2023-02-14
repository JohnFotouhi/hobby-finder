import { useState } from "react";
import { Form } from "react-bootstrap"
import Select from "react-select"


export default function SingleselectInput({controlId, label, text, options}){
    const [selectedOption, setSelectedOption] = useState(null);

    return(
        <Form.Group className="mb-3" controlId={controlId}>
            <Form.Label>{label}</Form.Label>
            <Select
                isSearchable={true} 
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
                />
            <Form.Text className="text-muted">{text}</Form.Text>
        </Form.Group>
    );
}