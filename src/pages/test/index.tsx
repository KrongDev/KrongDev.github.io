import {Button} from "react-bootstrap";
import {Input} from "postcss";


const testPage=() => {
    return (
        <div>
            test화면입니다
            <Button variant="primary">Primary</Button>{' '}
            <Button variant="secondary">Secondary</Button>{' '}
            <Button variant="success">Success</Button>{' '}
            <Button variant="warning">Warning</Button>{' '}
            <Button variant="danger">Danger</Button> <Button variant="info">Info</Button>{' '}
            <Button variant="light">Light</Button> <Button variant="dark">Dark</Button>{' '}
            <Button variant="link">Link</Button>
            <input type={'text'}/>
        </div>
    )
}
export default testPage;
