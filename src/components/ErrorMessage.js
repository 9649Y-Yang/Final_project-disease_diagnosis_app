import {Alert} from 'react-bootstrap';

const ErrorMessage = ({error}) => {
    console.log(error)
    return(
        <Alert variant='warning'>
            {error}
        </Alert>
    )
}

export default ErrorMessage