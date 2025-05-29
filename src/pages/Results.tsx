import React from 'react';
import SearchResults from './SearchResults';
import '../styles/search.css';


const Results: React.FC<{ results: any; documents: any[]; loadMoreDocuments: () => void; hasMore: boolean }> = ({ results, documents, loadMoreDocuments, hasMore }) => {
  return (
    <div className="search__container">
        <section className="search-section">
      <h1 className="search-section__title">
        Ищем. Скоро <br></br>будут результаты
        <img className="search__image4" src='./images/search4.png' alt="Изображение страницы поиска" />     
      </h1>
      <p className="search-section__description">
         Поиск может занять некоторое время,<br></br> просим сохранять терпение.
      </p>       
    </section>
   
       <SearchResults
        results={results}
        documents={documents}
        loadMoreDocuments={loadMoreDocuments}
        hasMore={hasMore}
      />
    </div>
  );
};

export default Results;