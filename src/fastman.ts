import { DateTime } from 'ts-luxon';

interface IvanEvent {
  /** Длительность события в часах по UTC. */
  duration: number;
  /** Сдвиг часового пояса пилота за событие (отрицательное значение - на запад). */
  timezoneShift: number;
}

/**
 * Расписание Ивана на один полный цикл.
 * Порядок важен: полет, отдых, полет, отдых.
 */
const IVAN_SCHEDULE: IvanEvent[] = [
  { duration: 2, timezoneShift: -3 }, // Полет на запад
  { duration: 6, timezoneShift: 0 },  // Отдых
  { duration: 2, timezoneShift: -3 }, // Полет на запад
  { duration: 6, timezoneShift: 0 },  // Отдых
];

/**
 * Общая длительность одного цикла в часах UTC.
 */
const CYCLE_DURATION_UTC_HOURS = IVAN_SCHEDULE.reduce((sum, event) => sum + event.duration, 0); // 16

/**
 * Сколько "местных" часов проживает пилот за один цикл.
 */
const LOCAL_HOURS_PER_CYCLE = IVAN_SCHEDULE.reduce(
  (sum, event) => sum + event.duration - event.timezoneShift,
  0
); // 22


// =====================================================================================
// ОСНОВНАЯ ФУНКЦИЯ
// =====================================================================================

/**
 * Определяет время в Москве, когда Иван Иванович отпразднует наступление Нового года.
 * Использует гибридный подход: прыжок к близкой дате + короткая точная симуляция.
 *
 * @param {number} year Год, для которого нужно найти время празднования.
 * @returns {string} Время в Москве в формате 'YYYY-MM-DD HH:mm:ss'.
 */
export function findIvanNewYearCelebrationTime(year: number): string {
  // --- Инициализация ---
  const startUtcTime = DateTime.fromISO('2020-01-01T09:00:00', { zone: 'utc' }); // 12:00 МСК
  const startTimezoneOffset = 3; // Начинаем в Москве (UTC+3)

  // Цель: "показание часов" Ивана в момент празднования
  const targetLocalMidnight = DateTime.fromISO(`${year}-01-01T00:00:00`);
  const startLocalTime = startUtcTime.setZone(`utc${startTimezoneOffset >= 0 ? '+' : ''}${startTimezoneOffset}`);

  // --- Прыжок (быстрый расчет) ---
  
  // 1. Сколько всего "местных" часов нужно прожить Ивану до цели?
  const totalLocalHoursToLive = targetLocalMidnight.diff(startLocalTime, 'hours').hours;

  // 2. Сколько полных циклов он может прожить, чтобы максимально приблизиться к цели?
  const fullCyclesToJump = Math.max(0, Math.floor(totalLocalHoursToLive / LOCAL_HOURS_PER_CYCLE));

  // 3. Мгновенно "перепрыгиваем" вперед на это количество циклов.
  let currentUtcTime = startUtcTime.plus({ hours: fullCyclesToJump * CYCLE_DURATION_UTC_HOURS });
    
  // --- Финальная точная симуляция (короткий цикл) ---

  // 1. Сколько "местных" часов еще осталось "прожить" после прыжка?
    const localHoursLivedAfterJump = fullCyclesToJump * LOCAL_HOURS_PER_CYCLE;
  const remainingLocalHours = totalLocalHoursToLive - localHoursLivedAfterJump;

  let localHoursPassedInFinalStretch = 0;

  // 2. Симулируем оставшийся путь, пока не найдем точный момент празднования.
  let iteration_count = 0;

  while (true) {
    for (const event of IVAN_SCHEDULE) {
      iteration_count++;
      const localHoursForThisEvent = event.duration - event.timezoneShift;
      const localHoursAfterThisEvent = localHoursPassedInFinalStretch + localHoursForThisEvent;

      // Проверяем, наступит ли целевой момент в рамках текущего события
      if (remainingLocalHours > localHoursPassedInFinalStretch && remainingLocalHours <= localHoursAfterThisEvent) {
        
        // Мы нашли событие! Теперь вычисляем точное время празднования в UTC.
        let celebrationUtcTime: DateTime;

        if (event.timezoneShift !== 0) { // Нет сдвига пояса - это полет
          // Он празднует ПОСЛЕ приземления, то есть в конце события.
          celebrationUtcTime = currentUtcTime.plus({ hours: event.duration });
        } else { // Это отдых
          // Он празднует в точности в момент местной полуночи.
          const localHoursIntoEvent = remainingLocalHours - localHoursPassedInFinalStretch;
          celebrationUtcTime = currentUtcTime.plus({ hours: localHoursIntoEvent });
        }
        
        // Возвращаем результат, переведенный в московское время.
        console.log(iteration_count)        
        return celebrationUtcTime.setZone('Europe/Moscow').toFormat('yyyy-MM-dd HH:mm:ss');
      }

      // Если не в этом событии, обновляем состояние для следующей итерации
      console.log(iteration_count)
      localHoursPassedInFinalStretch = localHoursAfterThisEvent;
      currentUtcTime = currentUtcTime.plus({ hours: event.duration });
    }
  }
}

