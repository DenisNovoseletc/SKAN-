import React from 'react';

interface SearchInputsProps {
  inn: string;
  tone: string;
  docCount: number;
  startDate: string;
  endDate: string;
  error: { code: number; message: string };
  setInn: (value: string) => void;
  setTone: (value: string) => void;
  setDocCount: (value: number) => void;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  isSearchDisabled: boolean;
}

const SearchInputs: React.FC<SearchInputsProps> = ({
  inn,
  tone,
  docCount,
  startDate,
  endDate,
  error,
  setInn,
  setTone,
  setDocCount,
  setStartDate,
  setEndDate,
  isSearchDisabled,
}) => {
  return (
    <div className="search-form__inputs">
      <label className="search-form__label">ИНН компании*</label>
      <input
        className="search-form__input"
        type="text"
        placeholder="10 цифр"
        value={inn}
        onChange={(e) => setInn(e.target.value)}
      />
      {error.code === 2 && <p className="error-message">{error.message}</p>}

      <label className="search-form__label">Тональность*</label>
      <select
        className="search-form__select"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
      >
        <option value="">Выберите тональность</option>
        <option value="positive">Позитивная</option>
        <option value="neutral">Нейтральная</option>
        <option value="negative">Негативная</option>
      </select>

      <label className="search-form__label">Количество документов в выдаче*</label>
      <input
        className="search-form__input"
        type="number"
        min="1"
        max="1000"
        value={docCount}
        onChange={(e) => setDocCount(Number(e.target.value))}
      />

      <label className="search-form__label">Диапазон поиска*</label>
      <div className="search-form__date-range">
        <input
          className="search-form__input search-form__input--date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          className="search-form__input search-form__input--date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      {error.code === 5 && <p className="error-message">{error.message}</p>}
      {error.code === 6 && <p className="error-message">{error.message}</p>}
    </div>
  );
};

export default SearchInputs;
