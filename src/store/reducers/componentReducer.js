import { ADD_COMPONENT, UPDATE_COMPONENT, DELETE_COMPONENT } from '../actions/componentActions';

const initialState = {
  components: []
};

export const componentReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COMPONENT:
      return {
        ...state,
        components: [...state.components, action.payload]
      };

    case UPDATE_COMPONENT:
      return {
        ...state,
        components: state.components.map(component =>
          component.id === action.payload.id
            ? { ...component, ...action.payload.updates }
            : component
        )
      };

    case DELETE_COMPONENT:
      return {
        ...state,
        components: state.components.filter(
          component => component.id !== action.payload.id
        )
      };

    default:
      return state;
  }
}; 