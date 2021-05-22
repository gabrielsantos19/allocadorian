import * as JSP from 'src/lib/JSP.js'
var Parallel = require('paralleljs')


function parseCompilado (conjunto) {
  return conjunto.map(o => JSP.parse(o))
}

export async function parseCompilados (conjuntos) {
  let conjuntosParsed = conjuntos.map(c => parseCompilado(c))
  return conjuntosParsed
}

function parseConjunto (obj) {
  return {
    descricao: JSP.parse(obj.descricao),
    objetoBase: JSP.parse(obj.objetoBase),
    objetos: obj.objetos.map(r => JSP.parse(r))
  }
}

export async function parseConjuntos (conjuntos) {
  let conjuntosParsed = []
  conjuntosParsed = conjuntos.map(c => parseConjunto(c))
  return conjuntosParsed
}

function compilarConjunto (conjunto) {
  const objetoBase = conjunto.objetoBase.slice(0, -1)
  return conjunto.objetos.map(o => objetoBase + o.slice(1))
}

export async function compilarConjuntos (conjuntos) {
  let compilados = null

  let p = new Parallel(conjuntos)
  function set () {
    compilados = arguments[0]
  }
  await p.map(compilarConjunto).then(set)

  localStorage.setItem('compilados', JSON.stringify(compilados))

  return compilados
}