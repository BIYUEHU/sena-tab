export const QUOTES = {
  yan: 1,
  saohua: 2,
  like: 3,
  life: 4,
  socwords: 5,
  badsoup: 6,
  jokes: 7,
  sadness: 8,
  dog: 10,
  love: 11,
  sign: 12,
  classics: 14,
  ce: 15,
  poetry: 16
} as const

export const ENGINES = [
  {
    key: 'google',
    name: 'Google',
    search_url: 'https://www.google.com/search?q={value}',
    suggest_url: 'https://www.google.com/complete/search?client=chrome&q={value}&callback={callback}'
  },
  {
    key: 'searx',
    name: 'Searx Belgium',
    search_url: 'https://searx.be/search?q={value}'
  },
  {
    key: 'bing',
    name: 'Bing',
    search_url: 'https://www.bing.com/search?q={value}',
    suggest_url: 'https://api.bing.com/osjson.aspx?query={value}&JsonType=callback&JsonCallback={callback}'
  },
  {
    key: 'baidu',
    name: 'Baidu',
    search_url: 'https://www.baidu.com/s?wd={value}'
  },
  {
    key: 'duckduckgo',
    name: 'DuckDuckGo',
    search_url: 'https://duckduckgo.com/?q={value}'
  },
  {
    key: 'qwant',
    name: 'Qwant',
    search_url: 'https://www.qwant.com/?q={value}'
  },
  {
    key: 'ecosia',
    name: 'Ecosia',
    search_url: 'https://www.ecosia.org/search?q={value}'
  },
  {
    key: 'lilo',
    name: 'Lilo',
    search_url: 'https://search.lilo.org/results.php?q={value}'
  },
  {
    key: 'startpage',
    name: 'Startpage',
    search_url: 'https://www.startpage.com/do/search?q={value}'
  },
  {
    key: 'yandex',
    name: 'Яндекс',
    search_url: 'https://yandex.ru/search/?text={value}'
  },
  {
    key: 'mail.ru',
    name: 'Mail.Ru',
    search_url: 'https://go.mail.ru/search?q={value}'
  },
  {
    key: 'metager',
    name: 'MetaGer',
    search_url: 'https://metager.de/meta/meta.ger3?eingabe={value}'
  },
  {
    key: 'brave',
    name: 'Brave',
    search_url: 'https://search.brave.com/search?q={value}'
  },
  {
    key: 'phind',
    name: 'Phind',
    search_url: 'https://phind.com/search?q={value}'
  }
] as const
