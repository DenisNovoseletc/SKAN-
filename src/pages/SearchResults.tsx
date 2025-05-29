import React, { useState, useRef } from 'react';
import DOMPurify from 'dompurify';
import '../styles/SearchResults.css';
import { SearchResultsData, DocumentOk } from './types';
interface HistogramData {
  date: string;
  value: number;
}

interface HistogramResult {
  data: HistogramData[];
  histogramType: string;
}

interface SearchResultsProps {
  results: { data: HistogramResult[] } | null;
  documents: DocumentOk[];
  loadMoreDocuments: () => void;
  hasMore: boolean;
}

const decodeHtml = (html: string) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const SearchResults: React.FC<SearchResultsProps> = ({ results, documents, loadMoreDocuments, hasMore }) => {
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const handleLoadMore = async () => {
    setLoading(true);
    await loadMoreDocuments();
    setLoading(false);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 133 + 10; // ширина колонки + margin-right
      carouselRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (!results || results.data.length === 0) {
    return <div>Нет доступных данных для отображения.</div>;
  }

  const totalDocumentsObj = results.data.find(r => r.histogramType === 'totalDocuments');
  const riskFactorsObj = results.data.find(r => r.histogramType === 'riskFactors');

  const periods = totalDocumentsObj?.data.map(item => new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })) || [];
  const totalValues = totalDocumentsObj?.data.map(item => item.value) || [];
  const riskValues = riskFactorsObj?.data.map(item => item.value) || [];

  return (
    <div className="search-results">
      <h1 className="summary-title summary-title--margin">Общая сводка</h1>
      <p className="summary-numbers">Найдено {totalValues.reduce((acc, val) => acc + val, 0)} вариантов</p>

      {/* карусель с колонками */}
     <div className="summary-columns-carousel-wrapper">
       <div className="summary-columns-carousel-container">
  <button className="carousel-button left" onClick={() => scrollCarousel('left')} aria-label="Прокрутить влево"><img src='./images/left.png' alt="left" className="summary-carousel__left" /></button>
  <div className="summary-columns-carousel" ref={carouselRef}>
    <div className="summary-column summary-column--header" aria-hidden="true">
      <div className="summary-column-item summary-column-item--period">Период</div>
      <div className="summary-column-item">Всего</div>
      <div className="summary-column-item">Риски</div>
    </div>
    {periods.map((period, idx) => (
      <div key={idx} className="summary-column">
        <div className="summary-column-item summary-column-item--period">{period}</div>
        <div className="summary-column-item">{totalValues[idx]}</div>
        <div className="summary-column-item">{riskValues[idx]}</div>
      </div>
    ))}
  </div>
  <button className="carousel-button right" onClick={() => scrollCarousel('right')} aria-label="Прокрутить вправо"><img src='./images/right.png' alt="right" className="summary-carousel__right" /></button>
</div></div>

      {/* Вывод документов */}
      {documents.length > 0 ? (
        <div className="documents__results">
          <h1 className='summary-title'>Список документов</h1>
          <ul className='documents__list-card'>
        {documents.map((doc) => {
  const { isTechNews, isAnnouncement, isDigest, wordCount } = doc.attributes;

  const decodedMarkup = DOMPurify.sanitize(decodeHtml(doc.content.markup));
  const imageMatch = decodedMarkup.match(/<img[^>]*src=['"]([^'"]+)['"][^>]*>/i);
  const imageUrl = imageMatch ? imageMatch[1] : ''; // Извлечение URL изображения
  const markupWithoutImages = decodedMarkup.replace(/<img[^>]*>/gi, '');

  // Проверка корректности URL
  const isValidUrl = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  return (
    <li key={doc.id} className="documents__item-card">
      <div className="document-card__header">
        <span className="document-card__date">{new Date(doc.issueDate).toLocaleDateString('ru-RU')}</span>
        {' | '}
        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="document-card__source-link">
          {doc.source.name}
        </a>
      </div>

      <h4 className="document-card__title">{doc.title.text}</h4>

      <div className="document-card__tags">
        {isTechNews && <span className="tag tag--tech-news">Технические новости</span>}
        {isAnnouncement && <span className="tag tag--announcement">Анонсы и события</span>}
        {isDigest && <span className="tag tag--digest">Сводки новостей</span>}
      </div>

      {/* Проверка и рендеринг изображения */}
      {isValidUrl(imageUrl) && (
        <img 
          src={imageUrl} 
          alt={doc.title.text} 
          className="document-card__image" 
          onError={(e) => { 
            e.currentTarget.style.display = 'none'; // Скрываем некорректное изображение
          }} 
        />
      )}
      
      <div className="document-card__content" dangerouslySetInnerHTML={{ __html: markupWithoutImages }} />

      <div className="document-card__footer">
        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="button button--read-source">
          Читать в источнике
        </a>
        <span className="document-card__wordcount">{wordCount ?? '—'} Слова</span>
      </div>
    </li>
  );
})}
 <div className="container-documents__load-more">  {hasMore && (
            <button className="documents__load-more" onClick={handleLoadMore} disabled={loading}>
              {loading ? 'Загрузка...' : 'Показать больше'}
            </button>
          )}</div>
          </ul>
       
        </div>
        
      ) : (
        <div>Нет документов для отображения.</div>
      )}
    </div>
  );
};

export default SearchResults;
