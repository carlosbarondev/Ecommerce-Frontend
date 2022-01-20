import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, ListGroup } from 'react-bootstrap';

import { shippingModalChange, shippingModalElegir, stepChange } from '../../../actions/ui';
import { ShippingModal } from './ShippingModal';
import { shippingSetActive, shippingStartDelete, shippingStartDeleteBilling } from '../../../actions/shipping';
import Swal from 'sweetalert2';
import { useEffect } from 'react';


export const ShippingList = () => {
    console.log('ShippingList');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { shippingModal } = useSelector(state => state.ui);
    const { nombre } = useSelector(state => state.auth);
    const { carrito } = useSelector(state => state.cart);
    const { envio, facturacion, predeterminado } = useSelector(state => state.shipping);

    useEffect(() => {
        dispatch(stepChange(2));
        localStorage.setItem('step', 2);
    }, [dispatch]);

    const handleSave = () => {
        if (document.querySelector("input[name=check_envio]:checked")) {
            const id = document.querySelector("input[name=check_envio]:checked").id;
            const enviar = envio.find(element => element._id === id);
            dispatch(stepChange(3));
            localStorage.setItem('step', 3);
            navigate("/payment", {
                state: {
                    direccion: enviar,
                    facturacion: facturacion
                }
            });
        } else {
            Swal.fire('Error', "No ha elegido una dirección de envío", 'error');
        }
    }

    const activar = (id, e) => {
        e.preventDefault();
        document.getElementById(id).checked = true;
    }

    const handleDelete = (idEnvio) => {
        if (idEnvio) {
            dispatch(shippingStartDelete(idEnvio));
        } else {
            dispatch(shippingStartDeleteBilling());
        }
    }

    const handleEdit = (idEnvio) => {
        if (idEnvio) {
            dispatch(shippingModalElegir(true));
            const enviar = envio.find(element => element._id === idEnvio);
            dispatch(shippingSetActive(enviar));
        } else {
            dispatch(shippingModalElegir(false));
        }
        dispatch(shippingModalChange(true));
    }

    const handleHide = () => {
        dispatch(shippingModalChange(false));
        dispatch(shippingSetActive());
    }

    return (
        <>
            <div className="row">
                <div className="col-md-8">
                    <h4 className='mb-3'>Dirección de envío</h4>
                    <Form>
                        {
                            envio.map(direccion => (
                                <div className="row mt-1" key={direccion._id}>
                                    <div className="col-md-8">
                                        <ListGroup>
                                            <ListGroup.Item className="border-0" action onClick={(e) => activar(direccion._id, e)}>
                                                {
                                                    predeterminado === direccion._id &&
                                                    <Form.Check
                                                        defaultChecked
                                                        type="radio"
                                                        id={direccion._id}
                                                        label={direccion.nombre}
                                                        name="check_envio"
                                                        style={{ "fontWeight": "bold", "pointerEvents": "none" }}
                                                    />
                                                }
                                                {
                                                    predeterminado !== direccion._id &&
                                                    <Form.Check
                                                        type="radio"
                                                        id={direccion._id}
                                                        label={direccion.nombre}
                                                        name="check_envio"
                                                        style={{ "fontWeight": "bold", "pointerEvents": "none" }}
                                                    />
                                                }
                                                <div className="mb-3">{direccion.direccion.calle} {direccion.direccion.numero}, {direccion.direccion.codigo}, {direccion.direccion.poblacion}, {direccion.direccion.provincia}, {direccion.direccion.pais}</div>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                    <div className="col-md-4" style={{ "display": "flex", "alignItems": "center" }}>
                                        <Button
                                            className="me-1"
                                            style={{ "width": "80px" }}
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleEdit(direccion._id)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            style={{ "width": "80px" }}
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleDelete(direccion._id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                    <hr />
                                </div>
                            ))
                        }
                    </Form>
                    <Button variant="primary" onClick={() => {
                        dispatch(shippingModalElegir(true));
                        dispatch(shippingModalChange(true));
                    }}
                    >
                        Añadir otra dirección
                    </Button>
                    <h4>Dirección de facturación</h4>
                    {
                        facturacion
                            ? <Form>
                                <div className="row mt-1" key={facturacion._id}>
                                    <div className="col-md-8">
                                        <ListGroup>
                                            <ListGroup.Item className="border-0" action onClick={(e) => activar(facturacion._id, e)}>
                                                <Form.Check
                                                    defaultChecked
                                                    type="radio"
                                                    id={facturacion._id}
                                                    label={nombre}
                                                    name="check_facturacion"
                                                    style={{ "fontWeight": "bold", "pointerEvents": "none" }}
                                                />
                                                <div className="mb-3">{facturacion.calle} {facturacion.numero}, {facturacion.codigo}, {facturacion.poblacion}, {facturacion.provincia}, {facturacion.pais}</div>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                    <div className="col-md-4" style={{ "display": "flex", "alignItems": "center" }}>
                                        <Button
                                            className="me-1"
                                            style={{ "width": "80px" }}
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleEdit()}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            style={{ "width": "80px" }}
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleDelete()}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                            : <Button variant="primary" onClick={() => {
                                dispatch(shippingModalElegir(false));
                                dispatch(shippingModalChange(true));
                            }}
                            >
                                Añadir dirección
                            </Button>
                    }
                </div>
                <div className="col-md-4">
                    <Card className='sticky-top'>
                        <Card.Header as="h5" className="text-center">TOTAL</Card.Header>
                        <Card.Body className="text-center">
                            <Card.Title>{carrito.reduce((n, { unidades, producto }) => n + unidades * producto.precio, 0).toFixed(2)} €</Card.Title>
                            <div className="mt-4 d-grid gap-2">
                                <Button
                                    className="mt-1"
                                    variant="warning"
                                    size="lg"
                                    onClick={handleSave}
                                >
                                    Guardar y continuar
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <ShippingModal
                show={shippingModal}
                onHide={handleHide}
            />
        </>
    );
}