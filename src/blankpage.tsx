import qs from 'query-string'

const { faviconUrl, title } = qs.parse(location.search)

document.title = decodeURIComponent((title as string) ?? '')
document
  .querySelector('link[rel="icon"]')
  ?.setAttribute('href', decodeURIComponent((faviconUrl as string) ?? ''))
