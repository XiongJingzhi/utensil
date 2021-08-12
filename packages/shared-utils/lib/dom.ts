export type safeCSSStyleDeclaration = {
  [propName: string]: String
} & CSSStyleDeclaration

export interface DOMRect {
  left: number
  top: number
  right: number
  bottom: number
  [propName: string]: number
}
