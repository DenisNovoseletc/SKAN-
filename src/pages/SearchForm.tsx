import React, { useState } from 'react';
import { validateInn, ValidationError } from '../components/validators';
import '../styles/SearchForm.css';
import { useAuth } from '../components/AuthProvider';
import SearchInputs from './SearchInputs';
import Results from './Results'; 
import { SearchResultsData, DocumentOk } from './types';
import '../styles/search.css';

const SearchForm = () => {  
  const [inn, setInn] = useState('');
  const [tone, setTone] = useState('');
  const [docCount, setDocCount] = useState(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<ValidationError>({ code: 0, message: '' });
  const [results, setResults] = useState<SearchResultsData | null>(null);
  const [documents, setDocuments] = useState<DocumentOk[]>([]);
  const [allDocuments, setAllDocuments] = useState<DocumentOk[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({ code: 0, message: '' });
    setShowResults(false); // Скрываем результаты при новом поиске

    // Используем validateInn для проверки ИНН
    const validationResult = validateInn(inn);
    if (!validationResult.isValid) {
      setError({ code: 2, message: validationResult.message });
      return;
    }

    const fixedLimit = 1000; // Максимум документов для загрузки
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > today || end > today) {
      setError({ code: 5, message: 'Даты не должны быть в будущем' });
      return;
    }
    if (start > end) {
      setError({ code: 6, message: 'Дата начала не может быть позже даты конца' });
      return;
    }

  const token = localStorage.getItem('accessToken');

  try {
    // Запрос гистограмм
    const histogramResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        issueDateInterval: {
          startDate: startDate + 'T00:00:00+03:00',
          endDate: endDate + 'T23:59:59+03:00',
        },
        searchContext: {
          targetSearchEntitiesContext: {
            targetSearchEntities: [
              {
                type: 'company',
                inn,
                maxFullness: true,
              },
            ],
            onlyMainRole: true,
            tonality: 'any',
            onlyWithRiskFactors: false,
            riskFactors: { and: [], or: [], not: [] },
            themes: { and: [], or: [], not: [] },
          },
          themesFilter: { and: [], or: [], not: [] },
        },
        searchArea: {
          includedSources: [],
          excludedSources: [],
          includedSourceGroups: [],
          excludedSourceGroups: [],
        },
        attributeFilters: {
          excludeTechNews: false,
          excludeAnnouncements: false,
          excludeDigests: false,
        },
        similarMode: 'none',
        limit: fixedLimit,
        sortType: 'sourceInfluence',
        sortDirectionType: 'desc',
        intervalType: 'month',
        histogramTypes: ['totalDocuments', 'riskFactors'],
      }),
    });

    if (!histogramResponse.ok) {
      throw new Error('Ошибка сети');
    }

    const histogramData = await histogramResponse.json();
    setResults(histogramData);

    // Запрос ID документов
    const searchResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        issueDateInterval: {
          startDate: startDate + 'T00:00:00+03:00',
          endDate: endDate + 'T23:59:59+03:00',
        },
        searchContext: {
          targetSearchEntitiesContext: {
            targetSearchEntities: [
              {
                type: 'company',
                inn,
                maxFullness: true,
              },
            ],
            onlyMainRole: true,
            tonality: tone,
            onlyWithRiskFactors: false,
            riskFactors: { and: [], or: [], not: [] },
            themes: { and: [], or: [], not: [] },
          },
          themesFilter: { and: [], or: [], not: [] },
        },
        searchArea: {
          includedSources: [],
          excludedSources: [],
          excludedSourceGroups: [],
          includedSourceGroups: [],
        },
        attributeFilters: {
          excludeTechNews: false,
          excludeAnnouncements: false,
          excludeDigests: false,
        },
        similarMode: 'duplicates',
        limit: fixedLimit,
        sortType: 'sourceInfluence',
        sortDirectionType: 'desc',
      }),
    });

    if (!searchResponse.ok) {
      throw new Error('Ошибка получения ID документов');
    }

    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      setDocuments([]);
      setAllDocuments([]);
      setHasMore(false);
      setShowResults(true);
      return;
    }

    const ids = searchData.items.map((item: { encodedId: string }) => item.encodedId);

    // Запрос документов по ID
    const docsResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });

    if (!docsResponse.ok) {
      throw new Error('Ошибка получения документов');
    }

    const docsData = await docsResponse.json();

    if (!Array.isArray(docsData)) {
      throw new Error('Некорректный формат данных документов');
    }

    const validDocuments = docsData
      .filter((doc: any) => doc.ok && doc.ok.attributes)
      .map((doc: any) => doc.ok);

    console.log('Полученные документы:', docsData);
    console.log('Отфильтрованные документы:', validDocuments);

    setAllDocuments(validDocuments);
    setDocuments(validDocuments.slice(0, docCount));
    setHasMore(validDocuments.length > docCount);
    setShowResults(true); // Показываем результаты
  } catch (error) {
    console.error('Ошибка при запросе:', error);
    setError({ code: 7, message: 'Ошибка при выполнении запроса' });
  }
};

  const handleInnChange = (value: string) => {
    setInn(value);
    // Проверяем валидность ИНН и сбрасываем ошибку, если валидно
    if (error.code === 2) {
      const validationResult = validateInn(value);
      if (validationResult.isValid) {
        setError({ code: 0, message: '' });
      }
    }
  };

  const handleDateChange = (date: string, isStartDate: boolean) => {
    if (isStartDate) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    // Сбрасываем ошибки при изменении даты
    setError({ code: 0, message: '' });
  };
  const isSearchDisabled = !inn || !tone || !docCount || !startDate || !endDate || error.code !== 0;

  const loadMoreDocuments = () => {
    const nextDocuments = allDocuments.slice(documents.length, documents.length + 10);
    setDocuments((prevDocs) => {
      const updatedDocs = [...prevDocs, ...nextDocuments];
      setHasMore(updatedDocs.length < allDocuments.length);
      return updatedDocs;
    });
  };

  return (
      <div className='search__container'>
    {!showResults ? (
      <>
        <section className="search-section">
          <h1 className="search-section__title">
            Найдите необходимые данные в пару кликов.
            <img className="search__image1" src='./images/search1.png' alt="Изображение страницы поиска" />
            <img className="search__image2" src='./images/search2.png' alt="Изображение страницы поиска" />
            <img className="search__image3" src='./images/search3.png' alt="Изображение страницы поиска" />
          </h1>
          <p className="search-section__description">
            Задайте параметры поиска.<br /> Чем больше заполните, тем точнее поиск.
          </p>
        </section>

        <div className="search-form">
          <form onSubmit={handleSubmit} className="search-form__custom-form">
           <SearchInputs
                inn={inn}
                tone={tone}
                docCount={docCount}
                startDate={startDate}
                endDate={endDate}
                error={error}
                setInn={handleInnChange}
                setTone={setTone}
                setDocCount={setDocCount}
                setStartDate={(date) => handleDateChange(date, true)}
                setEndDate={(date) => handleDateChange(date, false)}
                isSearchDisabled={isSearchDisabled}
              />
            {/* чекбоксы и кнопка */}
            <div className="search-form__checkboxes">
               <label className="search-form__checkbox">
          <input type="checkbox" />
          Признак максимальной полноты
        </label>
        <label className="search-form__checkbox">
          <input type="checkbox" />
          Упоминания в бизнес-контексте
        </label>
        <label className="search-form__checkbox">
          <input type="checkbox" />
          Главная роль в публикации
        </label>
        <label className="search-form__checkbox">
          <input type="checkbox" />
          Публикации только с риск-факторами
        </label>
        <label className="search-form__checkbox">
          <input type="checkbox" />
          Включать технические новости рынков
        </label>
        <label className="search-form__checkbox">
          <input type="checkbox" />
          Включать анонсы и календари
        </label>
        <label className="search-form__checkbox">
          <input type="checkbox" />
          Включать сводки новостей
        </label>
              <button className={`search-form__button ${isSearchDisabled ? '' : 'active'}`} disabled={isSearchDisabled}>
                Поиск
              </button>
              <p className='search-form__inform'>* Обязательные к заполнению поля</p>
            </div>
          </form>
        </div>
      </>
    ) : (
      <Results
        results={results}
        documents={documents}
        loadMoreDocuments={loadMoreDocuments}
        hasMore={hasMore}
      />
    )}
  </div>
);
 
};

export default SearchForm;
