import { useIvanNewYear } from './useIvanNewYear'
// @ts-ignore - luxon types may not be available, but it's installed
import { DateTime } from 'luxon'
import './App.css'

function App() {
  const { year, result, error, isValid, calculate, handleYearChange } = useIvanNewYear()

  const printTime = () => {
    try {
      const date = DateTime.fromFormat(result, 'yyyy-MM-dd HH:mm:ss', { zone: 'Europe/Moscow' });
      return date.toLocaleString(DateTime.DATETIME_FULL);
    } catch {
      return result;
    }
  }

  return (
    <>
      <h1>Расчет времени празднования Нового года</h1>
      <p>Иван Иванович работает пилотом. Ровно в полдень 1 января 2020 года он вылетел из Москвы и с тех пор всю жизнь живет по одному и тому же графику: он за 2 часа совершает полет на запад на 3 часовых пояса. Затем 6 часов отдыхает и снова летит на запад на 3 часовых пояса (в этот раз тоже за 2 часа). Иван Иванович никогда не спит, потому что он отличный пилот. </p>
      <p>Напишите функцию на любом современном языке, которая принимает в качестве параметра номер года и возвращает значение, сколько в Москве будет времени, когда Иван Иванович отпразднует наступление того года, который был передан в качестве параметра. Если новый год застает Ивана Ивановича в полете — он празднует его сразу после приземления, потому что он отличный пилот.</p>
      <div className="card">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (isValid) {
            calculate();
          }
        }}>
          <p>У пилота на часах Новый {year} год. Давайте посмотрим что сейчас в Москве</p>
          <label htmlFor="year-input">
            Введите год (от 2021 до 9999):
          </label>
          <input
            id="year-input"
            type="number"
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            min={2021}
            max={9999}
            style={{
              margin: '1rem',
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: error ? '1px solid #ff4444' : '1px solid #ccc',
            }}
          />
          {error && (
            <div style={{ color: '#ff4444', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={!isValid}
            style={{
              margin: '1rem',
              padding: '0.5rem 1.5rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #646cff',
              backgroundColor: isValid ? '#646cff' : '#ccc',
              color: 'white',
              cursor: isValid ? 'pointer' : 'not-allowed',
            }}
          >
            Рассчитать
          </button>
        </form>
        <div 
          style={{ 
            marginTop: '2rem',
            minHeight: '80px',
            opacity: result ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          {result && (
            <>
              <h2>Результат:</h2>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              А в Москве сейчас: {printTime()}
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App
