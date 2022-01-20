import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { Button, FormControl, FormGroup, FormLabel, FormText } from 'react-bootstrap';

import { startLogin } from '../../actions/auth';

const MyTextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <FormGroup className="mb-2">
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <FormControl {...field} {...props} />
            {meta.touched && meta.error ? (
                <FormText className='text-danger'>{meta.error}</FormText>
            ) : null}
        </FormGroup>
    );
};


export const LoginScreen = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate("/registro");
    }

    const handleLogin = (values) => {
        dispatch(startLogin(values.email, values.password, navigate));
    }

    return (
        <div className='auth-main'>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validationSchema={Yup.object({
                    email: Yup.string()
                        .email('Invalid email address')
                        .required('Required'),
                    password: Yup.string()
                        .max(20, 'Must be 20 characters or less')
                        .required('Required'),
                })}
                onSubmit={handleLogin}
            >
                <Form className="auth-box-container d-grid gap-2 border rounded">

                    <h1>Iniciar sesión</h1>

                    <MyTextInput
                        label="E-mail"
                        name="email"
                        type="text"
                        placeholder="E-mail"
                    />

                    <MyTextInput
                        label="Contraseña"
                        name="password"
                        type="text"
                        placeholder="Contraseña"
                    />

                    <Button type="submit" variant="primary" size="lg">Iniciar sesión</Button>
                    <div className="position-relative my-2 text-center">
                        <hr />
                        <p className="position-absolute top-50 start-50 translate-middle bg-white px-3">
                            ¿Eres nuevo cliente?
                        </p>
                    </div>
                    <Button type="button" variant="outline-primary" size="lg" onClick={handleRegister}>Crear cuenta</Button>
                </Form>
            </Formik>
        </div>
    );
};