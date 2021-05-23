import * as JSP from 'src/lib/JSP.js'


export function parse (obj) {
  return {
    descricao: JSP.parse(obj.descricao),
    objetoBase: JSP.parse(obj.objetoBase),
    objetos: obj.objetos.map(r => JSP.parse(r))
  }
}