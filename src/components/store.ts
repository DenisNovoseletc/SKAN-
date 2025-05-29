import { combineReducers, createStore } from 'redux';
import carouselReducer from './carouselReducer';

const rootReducer = combineReducers({
    carousel: carouselReducer,
    
});

const store = createStore(rootReducer);

export default store;
