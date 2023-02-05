import { useState } from "react";
import { Form } from "react-bootstrap"
import Multiselect from "multiselect-react-dropdown";

export default function MultiselectInput({controlId, label, text, options}){
    const [selected, setSelected] = useState<any[]>([]);
    function select(newItem){
        let newSelected = selected;
        newSelected.push(newItem);
        setSelected(newSelected);
    }
    function remove(itemToRemove){
        let itemIndex = selected.indexOf(itemToRemove);
        if(itemIndex != -1){
            let newSelected = selected.splice(itemIndex, 1);
            setSelected(newSelected);
        }
    }
 return(
    <Form.Group className="mb-3" controlId={controlId}>
        <Form.Label>{label}</Form.Label>
        <Multiselect 
            options={options}
            selectedValues={selected}
            onSelect={select}
            onRemove={remove}
            displayValue="name"/>
        <Form.Text className="text-muted">{text}</Form.Text>
    </Form.Group>
 );
}