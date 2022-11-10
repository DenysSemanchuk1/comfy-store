import {
  ADD_TO_CART,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
} from "../actions";

const cart_reducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
      let tempItems = [...state.total_items];
      let tempItem = {};

      const { id, color, product, amount } = action.payload;
      const checkItemExists = tempItems.find((i) => i.id === id + color);
      const index = tempItems.indexOf(checkItemExists);
      if (index !== -1) {
        tempItem = {
          ...tempItems[index],
          amount: amount <= product.stock ? amount : product.stock,
        };
        tempItems[index] = tempItem;
      } else {
        tempItem = {
          id: id + color,
          name: product.name,
          price: product.price,
          image: product.images[0].url,
          amount: amount <= product.stock ? amount : product.stock,
          max: product.stock,
          color,
        };
        tempItems.push(tempItem);
      }
      return { ...state, total_items: tempItems };
    }

    case CLEAR_CART: {
      return {
        ...state,
        total_items: [],
      };
    }

    case REMOVE_CART_ITEM: {
      const tempCart = state.total_items.filter(
        (item) => item.id !== action.payload
      );
      return {
        ...state,
        total_items: tempCart,
      };
    }

    case TOGGLE_CART_ITEM_AMOUNT: {
      const { id, type } = action.payload;
      const tempCart = state.total_items.map((item) => {
        if (item.id === id) {
          if (type === "inc") {
            let newAmount = item.amount + 1;
            if (newAmount >= item.max) {
              newAmount = item.max;
            }
            return {
              ...item,
              amount: newAmount,
            };
          }
          if (type === "dec") {
            let newAmount = item.amount - 1;
            if (newAmount <= 1) {
              newAmount = 1;
            }
            return {
              ...item,
              amount: newAmount,
            };
          }
        }
        return item;
      });
      return {
        ...state,
        total_items: tempCart,
      };
    }

    case COUNT_CART_TOTALS: {
      const { total_price, amount } = state.total_items.reduce(
        (total, cartItem) => {
          const { amount, price } = cartItem;
          total.total_price += price * amount;
          total.amount += amount;
          return total;
        },
        { total_price: 0, amount: 0 }
      );
      return { ...state, total_price, amount };
    }
    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default cart_reducer;
