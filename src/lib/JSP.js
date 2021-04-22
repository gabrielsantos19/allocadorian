// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
export function parse (obj) {
  return Function('"use strict";return (' + obj + ')')()
}