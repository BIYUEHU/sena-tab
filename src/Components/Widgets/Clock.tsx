interface ClockProps {
  showMinutes: boolean
  showSeconds: boolean
  time: Date
}

const Clock: React.FC<ClockProps> = ({ time, showMinutes, showSeconds }) => {
  const hoursAngle = time.getHours() * 30 + time.getMinutes() * 0.5
  const minutesAngle = time.getHours() * 360 + time.getMinutes() * 6
  const secondsAngle = time.getHours() * 360 + time.getMinutes() * 360 + time.getSeconds() * 6

  return (
    <div className="clock">
      {/* biome-ignore lint: */}
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" strokeWidth="3" fill="transparent" />

        <line x1="50" y1="50" x2="50" y2="30" strokeWidth="3" style={{ transform: `rotate(${hoursAngle}deg)` }} />

        {showMinutes && (
          <line x1="50" y1="50" x2="50" y2="15" strokeWidth="2" style={{ transform: `rotate(${minutesAngle}deg)` }} />
        )}

        {showSeconds && (
          <line x1="50" y1="50" x2="50" y2="10" strokeWidth="1" style={{ transform: `rotate(${secondsAngle}deg)` }} />
        )}

        <circle cx="50" cy="50" r="2" fill="transparent" />
      </svg>
    </div>
  )
}

export default Clock
