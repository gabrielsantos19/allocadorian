import * as JSP from 'src/lib/JSP.js'
var Parallel = require('paralleljs')

function parseConjunto (obj) {
  return {
    descricao: JSP.parse(obj.descricao),
    objetoBase: JSP.parse(obj.objetoBase),
    objetos: obj.objetos.map(r => JSP.parse(r))
  }
}

function parseCompilado (conjunto) {
  return conjunto.map(o => JSP.parse(o))
}

export async function parseCompilados (conjuntos) {
  let conjuntosParsed = conjuntos.map(c => parseCompilado(c))
  return conjuntosParsed
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
  const conjuntosRaw = localStorage.getItem('conjuntos')
  if (conjuntosRaw) {
    return JSON.parse(conjuntosRaw)
  }
  else {
    return []
  }
}

function compilarConjunto (conjunto) {
  const objetoBase = conjunto.objetoBase.slice(0, -1)
  return conjunto.objetos.map(o => objetoBase + o.slice(1))
}

export async function compilarConjuntos () {
  const conjuntos = getConjuntos()
  let compilados = null

  let p = new Parallel(conjuntos)
  function set () {
    compilados = arguments[0]
  }
  await p.map(compilarConjunto).then(set)

  localStorage.setItem('compilados', JSON.stringify(compilados))

  return compilados
}

export async function getConjuntosCompilados () {
  const compilados = localStorage.getItem('compilados')
  if (compilados) {
    return JSON.parse(compilados)
  }
  else {
    return []
  }
}