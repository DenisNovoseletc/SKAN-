import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/Carousel.css';

const Carousel: React.FC = () => {
    const dispatch = useDispatch();
    const currentIndex = useSelector((state: any) => state.carousel.currentIndex);
    
    const items = [
        { id: 1, content: 'Высокая и оперативная скорость обработки заявки', icon: './images/carousel1.svg' },
        { id: 2, content: 'Огромная комплексная база данных, обеспечивающая объективный ответ на запрос', icon: './images/carousel2.svg' },
        { id: 3, content: 'Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству', icon: './images/carousel3.svg' },
    ];

    // Состояние для количества видимых карточек
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        const updateVisibleCount = () => {
            const width = window.innerWidth;
            if (width <= 700) {
                setVisibleCount(1);
            } else if (width <= 990) {
                setVisibleCount(2);
            } else {
                setVisibleCount(3);
            }
        };

        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    const next = () => {
        dispatch({ type: 'NEXT' });
    };

    const prev = () => {
        dispatch({ type: 'PREV' });
    };

    if (items.length === 0) {
        return <div>No items available</div>;
    }

    // Получаем видимые элементы в зависимости от visibleCount
    const visibleItems = [];
    for (let i = 0; i < visibleCount; i++) {
        const index = (currentIndex + i) % items.length;
        visibleItems.push(
            <div key={items[index].id} className="carousel-item">
                <img src={items[index].icon} alt={`Icon for ${items[index].content}`} className="carousel-icon" />
                <p>{items[index].content}</p>
            </div>
        );
    }

    return (
        <div className="carousel">
            <button onClick={prev} className="carousel-button__left">
                <img src='./images/left.png' alt="left" className="carousel__left" />
            </button>
            <div className="carousel-items">
                {visibleItems}
            </div>
            <button onClick={next} className="carousel-button__right">
                <img src="./images/right.png" alt="right" className="carousel__right" />
            </button>
        </div>
    );
};

export default Carousel;
