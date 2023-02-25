import { Form } from "react-bootstrap"

export default function FormInput({controlId, label, type, placeholder, text, setValue, value, ...props}){

 return(
    <Form.Group className={typeof(props.class) !== "undefined" ? props.class : "mb-3"} controlId={controlId}>
        <Form.Label>{label}</Form.Label>
        <Form.Control type={type} placeholder={placeholder} onChange={e => setValue(e.target.value)} value={value} min={(type === "number") ? props.min : undefined}/>
        <Form.Text className="text-muted">{text}</Form.Text>
    </Form.Group>
 );
}