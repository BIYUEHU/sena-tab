import { ENGINES, QUOTES } from '@/constants/mapping'
import type { Settings } from '@/store/schema'
import { Fragment, useEffect, useState } from 'react'
import Clock from './Widgets/Clock'
import { f, t } from '@/i18n'

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
          case 'search':
            // biome-ignore lint:
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
          case 'quote':
            if (!isSetQuote) {
              setIsSetQuote(true)
              const quoteType: number = QUOTES[widget.quote as 'yan']
              if (quoteType) {
                fetch(
                  quoteType === 15
                    ? 'https://api.hotaru.icu/api/ce?format=text&type=english'
                    : `https://api.hotaru.icu/api/words?format=text&msg=${quoteType}`
                )
                  .then((res) => res.text())
                  .then((res) => setQuote(res))
              } else {
                fetch('https://hotaru.icu/api/hitokoto/v2/')
                  .then((res) => res.json())
                  .then((res) => {
                    setQuote(
                      /* html */ `<a href="https://hotaru.icu/hitokoto.html?id=${btoa(String(res.data.id))}" target="_blank">${res.data.msg.length > 100 ? `${res.data.msg.substring(0, 100)}...` : res.data.msg}${res.data.from ? ` — ${res.data.from}` : ''}</a>`
                    )
                  })
              }
            }
            // biome-ignore lint:
            element = <div className="quote" dangerouslySetInnerHTML={{ __html: quote }} />
            break
          default:
            // TODO: more types of widgets
            element = <div>Unknown widget type: {widget.type}</div>
        }
        return <Fragment key={index.toFixed()}>{element}</Fragment>
      })}
    </>
  )
}

export default Widgets
