import { inBrowser, isWeChatDevTools, supportsPassive } from './ent'

export type safeCSSStyleDeclaration = {
  [propName: string]: string
} & CSSStyleDeclaration

export interface DOMRect {
  left: number
  top: number
  width: number
  height: number
  [propName: string]: number
}

let elementStyle = (inBrowser && document.createElement('div').style as safeCSSStyleDeclaration)

let vendor = (() => {
  if (!inBrowser) return false  
  const transformNames = [
    {
      key: 'standard',
      value: 'transform'
    },
    {
      key: 'webkit',
      value: 'webkitTransform'
    },
    {
      key: 'Moz',
      value: 'MozTransform'
    },
    {
      key: 'O',
      value: 'OTransform'
    },
    {
      key: 'ms',
      value: 'msTransform'
    }
  ] 
  for (let obj of transformNames) {
    if (elementStyle[obj.value] !== undefined) {
      return obj.key
    }
  }
  return false
})()

function prefixStyle(style: string): string {
  if (vendor === false) {
    return style 
  }
  
  if (vendor === 'standard') {
    if (style === 'transitionEnd') {
      return 'transitionend'
    }
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export function getElement(el: HTMLElement | string) {
  return (typeof el === 'string'
    ? document.querySelector(el)
    : el
  )
}

export function addEvent(
  el: HTMLElement,
  type: string,
  fn: EventListenerOrEventListenerObject,
  capture?: AddEventListenerOptions
) {
  const useCapture = supportsPassive
    ? {
        passive: false,
        capture: !!capture
      }
    : !!capture
  el.addEventListener(type, fn, useCapture)
}

export function removeEvent(
  el: HTMLElement,
  type: string,
  fn: EventListenerOrEventListenerObject,
  capture?: EventListenerOptions 
) {
  el.removeEventListener(type, fn, {
    capture: !!capture
  })
}

export function offset(el: HTMLElement | null) {
  let top = 0
  let left = 0

  while (el) {
    top = el.offsetTop
    left = el.offsetLeft
    el = el.offsetParent as HTMLElement
  }

  return {
    top,
    left
  }
}

export function offsetToBody(el: HTMLElement) {
  let rect = el.getBoundingClientRect()

  return {
    left: rect.left + window.pageXOffset,
    top: rect.top + window.pageYOffset
  }
}

export const cssVendo = vendor &&  vendor !== 'standard' ? '-' + vendor.toLowerCase() + '-' : '';

let transform = prefixStyle('transform')
let transition = prefixStyle('transition')

export const hasPerspective = inBrowser && prefixStyle('perspective') in elementStyle

export const hasTouch = inBrowser && ('ontouchstart' in window || isWeChatDevTools)

export const hasTransition = inBrowser && transition in elementStyle

export const style = {
  transform,
  transition,
  transitionTimingFunction: prefixStyle('transitionTimingFunction'),
  transitionDuration: prefixStyle('transitionDuration'),
  transitionDelay: prefixStyle('transitionDelay'),
  transformOrigin: prefixStyle('transformOrigin'),
  transitionEnd: prefixStyle('transitionEnd'),
  transitionProperty: prefixStyle('transitionProperty'),
}

export function getRect(el: HTMLElement): DOMRect {
  /* istanbul ignore if  */
  if (el instanceof (window as any).SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight,
    }
  }
}
