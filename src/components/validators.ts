export interface ValidationError {
  code: number;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export function validateInn(inn: string | number): ValidationResult {
  let innStr = typeof inn === 'number' ? inn.toString() : (typeof inn === 'string' ? inn : '');
  
  // Проверка на пустое значение
  if (!innStr.length) {
    return { isValid: false, message: 'ИНН пуст' };
  }
  
  // Проверка на наличие нецифровых символов
  if (/[^0-9]/.test(innStr)) {
    return { isValid: false, message: 'ИНН может состоять только из цифр' };
  }
  
  // Проверка длины ИНН
  if (![10, 12].includes(innStr.length)) {
    return { isValid: false, message: 'ИНН может состоять только из 10 или 12 цифр' };
  }

  const checkDigit = (inn: string, coefficients: number[]): number => {
    let n = 0;
    for (let i = 0; i < coefficients.length; i++) {
      n += coefficients[i] * parseInt(inn[i]);
    }
    return (n % 11) % 10;
  };

  let result = false;
  switch (innStr.length) {
    case 10: {
      const n10 = checkDigit(innStr, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
      if (n10 === parseInt(innStr[9])) {
        result = true;
      }
      break;
    }
    case 12: {
      const n11 = checkDigit(innStr, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
      const n12 = checkDigit(innStr, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
      if (n11 === parseInt(innStr[10]) && n12 === parseInt(innStr[11])) {
        result = true;
      }
      break;
    }
  }

  if (!result) {
    return { isValid: false, message: 'Неправильное контрольное число' };
  }

  // Если все проверки пройдены
  return { isValid: true, message: '' };
}
