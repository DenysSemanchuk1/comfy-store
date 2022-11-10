import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      const prices = action.payload.map((p) => p.price);
      const max_price = Math.max(...prices);
      return {
        ...state,
        all_products: [...action.payload],
        filtered_products: [...action.payload],
        filters: {
          ...state.filters,
          price: max_price,
          max_price,
        },
      };

    case SET_GRIDVIEW:
      return { ...state, grid_view: true };
    case SET_LISTVIEW:
      return { ...state, grid_view: false };
    case UPDATE_SORT:
      return { ...state, sort: action.payload };
    case SORT_PRODUCTS: {
      const { sort, filtered_products } = state;
      let tempProducts = [...filtered_products];
      if (sort === "price-lowest") {
        tempProducts = tempProducts.sort((a, b) => a.price - b.price);
      }
      if (sort === "price-highest") {
        tempProducts = tempProducts.sort((a, b) => b.price - a.price);
      }
      if (sort === "name-a") {
        tempProducts = tempProducts.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }
      if (sort === "name-z") {
        tempProducts = tempProducts.sort((a, b) => {
          return b.name.localeCompare(a.name);
        });
      }
      return { ...state, filtered_products: tempProducts };
    }

    case UPDATE_FILTERS: {
      const { name, value } = action.payload;
      return {
        ...state,
        filters: {
          ...state.filters,
          [name]: value,
        },
      };
    }

    case FILTER_PRODUCTS: {
      const { all_products } = state;
      const { text, company, category, color, price, shipping, max_price } =
        state.filters;
      let tempProducts = [...all_products];

      if (text) {
        tempProducts = tempProducts.filter((p) => p.name.startsWith(text));
      }
      if (company !== "all") {
        tempProducts = tempProducts.filter((p) => p.company === company);
      }
      if (category !== "all") {
        tempProducts = tempProducts.filter((p) => p.category === category);
      }
      if (color !== "all") {
        tempProducts = tempProducts.filter((p) =>
          p.colors.find((c) => c === color)
        );
      }
      if (price !== max_price) {
        tempProducts = tempProducts.filter((p) => p.price <= price);
      }
      if (shipping) {
        tempProducts = tempProducts.filter((p) => p.shipping);
      }
      return {
        ...state,
        filtered_products: tempProducts,
      };
    }

    case CLEAR_FILTERS: {
      return {
        ...state,
        filters: {
          ...state.filters,
          text: "",
          company: "all",
          category: "all",
          color: "all",
          shipping: false,
          price: state.filters.max_price,
        },
      };
    }

    default:
      throw new Error(`No Matching "${action.type}" - action type`);
  }
};

export default filter_reducer;
