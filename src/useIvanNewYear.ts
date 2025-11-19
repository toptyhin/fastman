import { useState } from 'react';
import { findIvanNewYearCelebrationTime } from './fastman';

const MIN_YEAR = 2021;
const MAX_YEAR = 9999;

/**
 * Хук для работы с формой расчета времени празднования Нового года Иваном Ивановичем.
 * 
 * @returns Объект с полями формы, обработчиками и результатом вычисления
 */
export function useIvanNewYear() {
  const [year, setYear] = useState<number>(2025);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Валидация года
  const validateYear = (yearValue: number): boolean => {
    if (isNaN(yearValue)) {
      setError('Год должен быть числом');
      return false;
    }
    if (yearValue < MIN_YEAR || yearValue > MAX_YEAR) {
      setError(`Год должен быть в диапазоне от ${MIN_YEAR} до ${MAX_YEAR}`);
      return false;
    }
    setError(null);
    return true;
  };

  // Функция для выполнения расчета
  const calculate = () => {
    // Проверяем валидность перед расчетом
    if (!validateYear(year)) {
      setResult(null);
      return;
    }

    try {
      const calculationResult = findIvanNewYearCelebrationTime(year);
      setResult(calculationResult);
    } catch (error) {
      setResult('Ошибка расчета');
    }
  };

  // Обработчик изменения года из формы
  const handleYearChange = (value: string) => {
    const parsedYear = parseInt(value, 10);
    if (!isNaN(parsedYear)) {
      setYear(parsedYear);
      // Сбрасываем результат при изменении года
      setResult(null);
      // Проверяем валидность при вводе
      if (parsedYear < MIN_YEAR || parsedYear > MAX_YEAR) {
        setError(`Год должен быть в диапазоне от ${MIN_YEAR} до ${MAX_YEAR}`);
      } else {
        setError(null);
      }
    } else if (value === '') {
      // Разрешаем пустое значение для ввода
      setError(null);
    }
  };

  return {
    year,
    setYear,
    handleYearChange,
    result,
    error,
    calculate,
    isValid: error === null && year >= MIN_YEAR && year <= MAX_YEAR,
  };
}

