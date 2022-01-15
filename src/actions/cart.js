import { types } from "../types/types"
import { backdropChange, canvasChange } from "./ui"


export const cartInit = (carro) => {
    return {
        type: types.cartInit,
        payload: carro.carrito
    }
}

export const productStartAdd = (product, cantidad, buy = false) => {
    return (dispatch, getState) => {
        const { carrito } = getState().cart;
        const productIndex = carrito.findIndex(pid => pid.producto._id === product._id);
        let productCart = {};
        if (productIndex === -1) { // No existe el producto en el carrito y se agrega el producto entero
            productCart = {
                unidades: cantidad,
                producto: product
            }
        } else { // El producto existe en el carrito y se actualizan las unidades del producto
            productCart = {
                unidades: carrito[productIndex].unidades + cantidad
            }
        }
        dispatch(productAdd(productCart, productIndex));
        if (!buy) {
            dispatch(backdropChange(false));
            dispatch(canvasChange());
            const timer = setInterval(() => {
                dispatch(canvasChange());
                dispatch(backdropChange(true));
                clearInterval(timer);
            }, 1500);
        }
    }
}

export const productAdd = (product, productIndex) => {
    return {
        type: types.cartAdd,
        payload: { product, productIndex }
    }
}

export const cartClear = () => ({ type: types.cartClear })