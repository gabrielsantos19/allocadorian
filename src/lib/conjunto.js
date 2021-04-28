import * as JSP from 'src/lib/JSP.js'
var Parallel = require('paralleljs')

function parseConjunto (obj) { 
  return {
    descricao: JSP.parse(obj.descricao),
    objetoBase: JSP.parse(obj.objetoBase),
    objetos: obj.objetos.map(r => JSP.parse(r))
  }
}

export function getConjuntosParsed () {
  const conjuntos = getConjuntos()
  let conjuntosParsed = []
  if (conjuntos) {
    conjuntosParsed = conjuntos.map(c => parseConjunto(c))
  }
  return conjuntosParsed
}

export function getConjuntos () {
  const conjuntosRaw = localStorage.getItem('tabelas')
  return JSON.parse(conjuntosRaw)
}

function compilarConjunto (conjunto) {
  return conjunto
}

export async function getConjuntosCompilados () {
  const conjuntos = getConjuntosParsed()
  let compilados = null
  
  let p = new Parallel(conjuntos)
  function set () {
    compilados = arguments[0]
  }
  await p.map(compilarConjunto).then(set)
  
  return compilados
}