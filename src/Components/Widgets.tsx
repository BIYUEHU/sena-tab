import { Fragment, useEffect, useState } from 'react'
import { ENGINES } from '@/constants/mapping'
import { f, t } from '@/i18n'
import type { Settings } from '@/store/schema'
import Clock from './Widgets/Clock'

interface WidgetsProps {
  widgets: Settings['widgets']
  language: Settings['language']
}

const Widgets: React.FC<WidgetsProps> = ({ widgets, language }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greetingNum, setGreetingNum] = useState(0)
  const [quote, setQuote] = useState('')
  const [isSetQuote, setIsSetQuote] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTime(new Date())
      clearTimeout(timer)
    }, 1000)

    setGreetingNum(
      (() => {
        const hour = currentTime.getHours()
        if (hour >= 0 && hour < 3) return 0
        if (hour >= 3 && hour < 6) return 1
        if (hour >= 6 && hour < 10) return 2
        if (hour >= 10 && hour < 14) return 3
        if (hour >= 14 && hour < 18) return 4
        if (hour >= 18 && hour < 22) return 5
        return 6
      })()
    )
  }, [currentTime])

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>, url: string) => {
    if (event.key === 'Enter') {
      const value = encodeURIComponent((event.target as HTMLInputElement).value)
      window.location.href = url.replaceAll('{value}', value)
    }
  }

  return (
    <>
      {widgets.map((widget, index) => {
        let element: JSX.Element
        switch (widget.type) {
          case 'time':
            element = (
              <>
                {widget.format === 'clock' ? (
                  <Clock time={currentTime} showMinutes={widget.showMinutes} showSeconds={widget.showSeconds} />
                ) : (
                  <h1 className="time">
                    {new Intl.DateTimeFormat(language.replaceAll('_', '-'), {
                      hour: 'numeric',
                      minute: widget.showMinutes ? 'numeric' : undefined,
                      second: widget.showSeconds ? 'numeric' : undefined,
                      hour12: widget.format === '12h'
                    }).format(currentTime)}
                  </h1>
                )}
                {widget.showDate && (
                  <>
                    <hr />
                    <h2 className="date">
                      {' '}
                      {new Intl.DateTimeFormat(language.replaceAll('_', '-'), {
                        // year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        weekday: 'long'
                      }).format(currentTime)}
                    </h2>
                  </>
                )}
              </>
            )

            break
          case 'greeting':
            element = (
              <h1 className="greeting">
                {f(
                  widget.name ? `greeting.withName.${greetingNum}` : `greeting.withoutName.${greetingNum}`,
                  widget.name
                )}
              </h1>
            )
            break
          case 'search': {
            const result = ENGINES.find((el) => el.key === widget.engine)
            element = (
              <div className="search-box">
                <input
                  type="text"
                  placeholder={result?.name ? f('search.placeholder.0', result.name) : t`search.placeholder.1`}
                  onKeyPress={(event) => handleSearch(event, result?.search_url ?? widget.engine)}
                />
              </div>
            )
            break
          }
          case 'quote':
            if (!isSetQuote) {
              setIsSetQuote(true)
              if (widget.quote === 'custom') {
                setQuote(widget.code)
              } else if (widget.quote === 'hitokoto') {
                fetch('https://i.arimuraromi.com/api/hitokoto')
                  .then((res) => res.json())
                  .then((res) => {
                    const who = res.fromWho ? `${res.fromWho}「${res.from}」` : `「${res.from}」`
                    const attribution = res.from ? ` — ${who}` : res.fromWho ? ` — ${res.fromWho}` : ''
                    setQuote(
                      /* html */ `<a href="https://i.arimuraromi.com/hitokoto/${res.uuid}" target="_blank">${res.msg.length > 100 ? `${res.msg.substring(0, 100)}...` : res.msg}${attribution}</a>`
                    )
                  })
              } else {
                fetch(`https://i.arimuraromi.com/api/utils/words/${widget.quote}`)
                  .then((res) => res.json())
                  .then((res) => setQuote(res.text ?? `${res.chinese ?? ''}${res.english ? ` — ${res.english}` : ''}`))
              }
            }
            // biome-ignore lint: *
            element = <div className="quote" dangerouslySetInnerHTML={{ __html: quote }} />
            break
          default:
            element = <div>{f('widget.unknown', widget.type)}</div>
        }
        return <Fragment key={index.toFixed()}>{element}</Fragment>
      })}
    </>
  )
}

export default Widgets
