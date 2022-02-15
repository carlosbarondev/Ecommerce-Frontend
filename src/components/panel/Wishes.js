import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Form, Image, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { fetchConToken } from "../../helpers/fetch";
import { productStartAdd } from "../../actions/cart";


export const Wishes = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { uid } = useSelector(state => state.auth);
    const { carrito } = useSelector(state => state.cart);

    const [deseos, setDeseos] = useState();
    const [checking, setChecking] = useState(false);
    const [tab, setTab] = useState(false);
    const [seleccionados, setSeleccionados] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                const resp = await fetchConToken(`usuarios/deseos/${uid}`);
                const body = await resp.json();
                if (body.msg) {
                    return Swal.fire('Error', body.msg, 'error');
                } else {
                    setDeseos(body.deseos.deseos);
                    if (body.deseos.deseos.length > 0)
                        setTab(true);
                    setChecking(true);
                }
            } catch (error) {
                console.log(error);
                return Swal.fire('Error', error, 'error');
            }
        }
        fetchData();
    }, [checking, uid]);

    const handleSelect = (id) => {
        document.getElementById(id).checked ? document.getElementById(id).checked = false : document.getElementById(id).checked = true;
        const checked = document.querySelectorAll('input[type="checkbox"]:checked');
        setSeleccionados(checked.length);
    }

    const handleAdd = async () => {
        const checked = document.querySelectorAll('input[type="checkbox"]:checked');
        if (checked.length === 0) {
            return Swal.fire('Atención', "No ha seleccionado ningún artículo", 'info');
        }
        const ids = Array.from(checked).map(x => x.id);
        const addProduct = deseos.filter(p => ids.find(x => x === p._id));
        addProduct.forEach(wish => {
            const cartProduct = carrito.find(x => x.producto._id === wish._id);
            if (cartProduct) {
                dispatch(productStartAdd(wish, cartProduct.unidades + 1, true));
            } else {
                dispatch(productStartAdd(wish, 1, true));
            }
        });
        navigate("/cart");
    }

    const handleDelete = async () => {

        const checked = document.querySelectorAll('input[type="checkbox"]:checked');
        if (checked.length === 0) {
            return Swal.fire('Atención', "No ha seleccionado ningún artículo", 'info');
        }
        const ids = Array.from(checked).map(x => x.id);

        try {
            const resp = await fetchConToken(`usuarios/deseos/${uid}`, { ids }, 'DELETE');
            const body = await resp.json();
            if (body.msg) {
                return Swal.fire('Error', body.msg, 'error');
            } else {
                setDeseos(body.usuario.deseos);
                setSeleccionados(0);
                if (body.usuario.deseos.length === 0) {
                    setTimeout(function () {
                        setTab(false);
                    }, 400);
                }
            }
        } catch (error) {
            console.log(error);
            return Swal.fire('Error', error, 'error');
        }
    }

    return (
        checking && <div className="animate__animated animate__fadeIn mb-5">
            <h3 className="mt-4 mb-4">Lista de deseos</h3>
            {
                !tab
                    ? <div className="centrar mt-5">
                        <b>No ha añadido ningún  producto a la lista</b>
                        <div>De momento no tienes ningún producto deseado,</div>
                        <div>pero te animamos a ver nuestro catálogo de</div>
                        <div>productos y añadirlos a tu lista de deseados</div>
                        <Button className="mt-3" variant="warning" onClick={() => navigate(`/`)}>Ver el catálogo</Button>
                    </div>
                    : <Form>
                        <span className="d-flex mb-4">
                            <h5 className="mt-auto mb-auto me-auto">Seleccionados: {seleccionados}</h5>
                            <Button
                                className="me-4"
                                onClick={handleAdd}
                            >
                                Añadir al carrito
                            </Button>
                            <Button
                                onClick={handleDelete}
                            >
                                Eliminar de la lista
                            </Button>
                        </span>
                        <Row xs={2} sm={2} md={3} lg={4} xl={4} className="g-0">
                            <TransitionGroup className="todo-list border" component={null}>
                                {
                                    deseos.map(wish => (
                                        <CSSTransition
                                            key={wish._id}
                                            timeout={500}
                                            classNames="item"
                                        >
                                            <Card
                                                className="cardProduct"
                                                style={{ "transform": "none" }}
                                                onClick={() => handleSelect(wish._id)}
                                            >
                                                <Form.Check
                                                    style={{ "pointerEvents": "none", "position": "absolute", "marginTop": "5px", "marginLeft": "12px" }}
                                                    type='checkbox'
                                                    id={wish._id}
                                                    label={``}
                                                />
                                                <div className="d-flex flex-column">
                                                    <div className="border-section">
                                                        <Image className="imagenCentrar" src={wish.img} fluid />
                                                    </div>
                                                    <Card.Body className="d-flex justify-content-center">
                                                        <Card.Text className="cardName"><Link className="linkNormal" to={`/${wish.categoria.nombre}/${wish.subcategoria.nombre}/${wish.nombre.replace(/\s+/g, "-")}`}>{wish.nombre.charAt(0).toUpperCase() + wish.nombre.slice(1)}</Link></Card.Text>
                                                        <Card.Title className="cardPrice"><b>{wish.precio} €</b></Card.Title>
                                                    </Card.Body>
                                                </div>
                                            </Card >
                                        </CSSTransition>
                                    ))
                                }
                            </TransitionGroup>
                        </Row>
                    </Form>
            }
        </div>
    )
};