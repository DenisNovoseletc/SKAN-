// Определяем начальное состояние
const initialState = {
    currentIndex: 0,
};

// Определяем редьюсер
const carouselReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'NEXT':
            return {
                ...state,
                currentIndex: (state.currentIndex + 1) % 5, // 5 - количество элементов
            };
        case 'PREV':
            return {
                ...state,
                currentIndex: (state.currentIndex - 1 + 5) % 5, // 5 - количество элементов
            };
        default:
            return state;
    }
};

export default carouselReducer;