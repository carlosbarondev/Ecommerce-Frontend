import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row } from "react-bootstrap"

import { fetchSinToken } from "../../helpers/fetch";
import { SubCategory } from "./SubCategory";


export const SubCategoryList = () => {

    const { CategoriaNombre } = useParams();

    const [subcategorias, setSubcategorias] = useState();
    const [nombre, setNombre] = useState();
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const resp = await fetchSinToken(`categorias/${CategoriaNombre}`);
                const body = await resp.json();
                const { categoria } = body;
                setNombre(categoria.nombre);
                setSubcategorias(categoria.subcategorias);
                setChecking(true);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [CategoriaNombre]);

    return (
        checking && <div className="col animate__animated animate__fadeIn">
            <h3>{nombre}</h3>
            <Row xs={1} sm={2} md={4} lg={8} xl={16} className="g-0">
                {
                    subcategorias.map(subcategoria => (
                        <SubCategory
                            key={subcategoria._id}
                            CategoriaNombre={CategoriaNombre}
                            {...subcategoria}
                        />
                    ))
                }
            </Row>
        </div>
    )
}