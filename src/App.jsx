import React, { useState } from 'react'

const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]
const MONTHS_RU_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
]
const WEEKDAYS_RU = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота'
]
const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

function getToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

// Детерминированный список занятых слотов для конкретного дня
function getBookedSlots(date) {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  const hash = (day * 7 + month * 13 + year) % TIME_SLOTS.length
  const booked = []
  for (let i = 0; i < 2; i++) {
    booked.push(TIME_SLOTS[(hash + i * 3) % TIME_SLOTS.length])
  }
  return booked
}

export default function App() {
  const today = getToday()

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(new Date(today))
  const [selectedTime, setSelectedTime] = useState(null)

  const handlePrevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1)
        return 11
      }
      return m - 1
    })
  }

  const handleNextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1)
        return 0
      }
      return m + 1
    })
  }

  const handleDayClick = (day) => {
    const date = new Date(viewYear, viewMonth, day)
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleTimeClick = (time) => {
    setSelectedTime(time)
  }

  // Построение сетки календаря
  const calendarCells = []
  const firstDay = new Date(viewYear, viewMonth, 1)
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
  const totalDays = daysInMonth(viewYear, viewMonth)
  const prevMonthDays = daysInMonth(viewYear, viewMonth - 1)

  for (let i = startOffset - 1; i >= 0; i--) {
    calendarCells.push(
      <button key={`prev-${i}`} className="day muted" disabled>
        {prevMonthDays - i}
      </button>
    )
  }

  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(viewYear, viewMonth, d)
    const isPast = date < today
    const isSelected = selectedDate && isSameDay(date, selectedDate)

    calendarCells.push(
      <button
        key={d}
        className={`day${isPast ? ' muted' : ''}${isSelected ? ' selected' : ''}`}
        disabled={isPast}
        onClick={() => !isPast && handleDayClick(d)}
      >
        {d}
      </button>
    )
  }

  const totalCells = startOffset + totalDays
  const remainder = totalCells % 7
  if (remainder !== 0) {
    for (let i = 1; i <= 7 - remainder; i++) {
      calendarCells.push(
        <button key={`next-${i}`} className="day muted" disabled>
          {i}
        </button>
      )
    }
  }

  // Слоты времени
  const booked = selectedDate ? getBookedSlots(selectedDate) : []

  // Сводка внизу
  let summaryDateText = '—'
  let summaryTimeText = 'время не выбрано'
  if (selectedDate) {
    const wd = WEEKDAYS_RU[selectedDate.getDay()]
    summaryDateText = `${wd}, ${selectedDate.getDate()} ${MONTHS_RU_GENITIVE[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    if (selectedTime) summaryTimeText = selectedTime
  }

  return (
    <>
      {/* Шапка */}
      <header className="header">
        <div className="header-container">
          <a href="#" className="logo">
            <img src="/logo.png" alt="Barbershop" />
          </a>
          <nav className="navigation">
            <a href="#">Услуги</a>
            <a href="#">Галерея</a>
            <a href="#">Команда</a>
            <a href="#">Отзывы</a>
            <a href="#">Контакты</a>
          </nav>
        </div>
      </header>

      {/* Индикатор этапов */}
      <div className="steps">
        <div className="steps-container">
          <div className="step">
            <div className="step-number completed">1</div>
            <div className="step-line"></div>
          </div>
          <div className="step">
            <div className="step-number completed">2</div>
            <div className="step-line"></div>
          </div>
          <div className="step">
            <div className="step-number active">3</div>
            <div className="step-line"></div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-line"></div>
          </div>
          <div className="step">
            <div className="step-number">5</div>
          </div>
        </div>
      </div>

      {/* Основная часть */}
      <section className="booking">
        <div className="booking-container">
          <div className="booking-title">
            <a href="#" className="back-button">‹</a>
            <h1>Дата и время</h1>
          </div>

          <div className="booking-content">
            {/* Календарь */}
            <div className="calendar">
              <div className="calendar-header">
                <h2>{MONTHS_RU[viewMonth]} {viewYear}</h2>
                <div className="calendar-controls">
                  <button className="calendar-arrow" onClick={handlePrevMonth}>‹</button>
                  <button className="calendar-arrow" onClick={handleNextMonth}>›</button>
                </div>
              </div>
              <div className="calendar-grid">
                {WEEKDAYS_SHORT.map((wd) => (
                  <div key={wd} className="weekday">{wd}</div>
                ))}
                {calendarCells}
              </div>
            </div>

            {/* Время */}
            <div className="time-section">
              <h2>Доступное время</h2>
              <div className="time-grid">
                {TIME_SLOTS.map((time) => {
                  const isBooked = booked.includes(time)
                  const isSelected = selectedTime === time && !isBooked
                  return (
                    <button
                      key={time}
                      className={`time-slot${isBooked ? ' booked' : ''}${isSelected ? ' selected' : ''}`}
                      disabled={isBooked}
                      onClick={() => !isBooked && handleTimeClick(time)}
                    >
                      {time}
                      {isBooked && <span>Занято</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Нижняя панель сводки */}
          <div className="booking-summary">
            <div className="booking-summary-info">
              <span className="booking-summary-date">{summaryDateText}</span>
              <span className="booking-summary-time">{summaryTimeText}</span>
            </div>
          </div>

          {/* Кнопка Далее */}
          <div className="booking-actions">
            <button className="next-button">Далее</button>
          </div>
        </div>
      </section>

      {/* Подвал */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-logo">
              <img src="/logo-footer.png" alt="Barbershop" />
            </div>
            <div className="footer-contacts">
              <h2>Контакты</h2>
              <p><span className="contact-icon">⌖</span> ул. Садовая, 15, Москва</p>
              <p><span className="contact-icon">☎</span> +7 (495) 123-45-67</p>
            </div>
            <div className="footer-hours">
              <h3>Режим работы</h3>
              <p>Пн–Пт: 9:00 – 21:00</p>
              <p>Сб–Вс: 10:00 – 19:00</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026. Все права защищены.</p>
            <a href="#">Политика конфиденциальности</a>
          </div>
        </div>
      </footer>
    </>
  )
}