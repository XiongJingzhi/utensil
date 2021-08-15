export const inBrowser = typeof window !== 'undefined' 
export const ua = inBrowser && navigator.userAgent.toLocaleLowerCase()
export const isWeChatDevTools = !!(ua && /wechatdevtools/.test(ua))
export const isAndroid = ua && ua.indexOf('android') > 0
export const isIOS = ua && ua.indexOf('ios') > 0

export const isIOSBadVersion = (() => {
  if (typeof ua === 'string') {
    const regex = /os (\d\d?_\d(_\d)?)/
    const matches = regex.exec(ua)
    if (!matches) return false
    const parts = matches[1].split('_').map(item => {
      return parseInt(item, 10)
    })
    return !!(parts[0] > 13 && parts[1] >= 4)
  }
})()

export let supportsPassive = false

if (inBrowser) {
  const EventName = 'test-passive'
  try {
    const ops = {}
    Object.defineProperty(ops, 'passive', {
      get() {
        supportsPassive = true
      }
    })
    window.addEventListener(EventName, () => {}, ops)
  } catch (error) {}
}
