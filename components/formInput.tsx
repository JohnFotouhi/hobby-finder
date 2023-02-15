import { Form } from "react-bootstrap"

export default function FormInput({controlId, label, type, placeholder, text, setValue, value}){

 return(
    <Form.Group className="mb-3" controlId={controlId}>
        <Form.Label>{label}</Form.Label>
        <Form.Control type={type} placeholder={placeholder} onChange={e => setValue(e.target.value)} value={value}/>
        <Form.Text className="text-muted">{text}</Form.Text>
    </Form.Group>
 );
}