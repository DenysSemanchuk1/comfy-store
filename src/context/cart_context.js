import React, { useEffect, useContext, useReducer } from "react";
import reducer from "../reducers/cart_reducer";
import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
  CLEAR_CART,
  COUNT_CART_TOTALS,
} from "../actions";

function getLocalStorage() {
  let data = localStorage.getItem("cart");
  if (data) {
    return JSON.parse(localStorage.getItem("cart"));
  } else {
    return [];
  }
}

const initialState = {
  total_items: getLocalStorage(),
  amount: 0,
  total_price: 0,
  shipping_fee: 543,
};

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const addCartItem = (id, color, product, amount) => {
    dispatch({ type: ADD_TO_CART, payload: { id, color, product, amount } });
  };
  const removeItem = (id) => {
    dispatch({ type: REMOVE_CART_ITEM, payload: id });
  };
  const toggleAmount = (id, type) => {
    dispatch({ type: TOGGLE_CART_ITEM_AMOUNT, payload: { id, type } });
  };
  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  useEffect(() => {
    dispatch({ type: COUNT_CART_TOTALS });
    localStorage.setItem("cart", JSON.stringify(state.total_items));
  }, [state.total_items]);
  return (
    <CartContext.Provider
      value={{ ...state, addCartItem, removeItem, toggleAmount, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
// make sure use
export const useCartContext = () => {
  return useContext(CartContext);
};