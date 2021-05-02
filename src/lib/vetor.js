function eValido (conjuntos, vetor) {
  const merged = merge(conjuntos, vetor)
  for (let i=0; i<vetor.pontos.length; ++i) {
    const objeto = conjuntos[i][vetor.pontos[i]]
    if (objeto.filtrarVetor && objeto.filtrarVetor(merged) === false) {
      return false
    }
  }
  return true
}

function pontuarVetor (conjuntos, vetor) {
  let nota = 0
  vetor.pontos.forEach((ponto, index) => {
    nota += conjuntos[index][ponto].pontuarVetor(vetor.merged)
  })
  vetor.nota = nota
  return nota
}

export function filtrarSolucao (vetor, conjuntos, solucao) {
  return true
}

export function pontuarSolucao (vetor, conjuntos, solucao) {
  return 0
}

////////////////////////////////////////////////////////////////////////

function merge (conjuntos, vetor) {
  const merged = {}
  vetor.pontos.forEach((ponto, index) => {
    Object.assign(merged, conjuntos[index][ponto])
  })
  vetor.merged = merged
  return merged
}

function vetorXconjunto (conjuntos, vetor, conjunto) {
  let produto = []
  conjunto.forEach((e, index) => {
    const novo = {
      pontos: vetor.pontos.concat(index),
      merged: {}
    }

    if (eValido(conjuntos, novo)) {
      produto.push(novo)
    }
  })
  return produto
}

function vetoresXconjunto (conjuntos, vetores, conjunto) {
  let produto = []
  vetores.forEach(v => {
    produto.push(vetorXconjunto(conjuntos, v, conjunto))
  })
  return produto.flat()
}

export async function cartesiano (conjuntos) {
  let vetores = []
  if (conjuntos.length) {
    vetores = [{
      pontos: [],
      merged: {}
    }]
    conjuntos.forEach((conjunto) => {
      vetores = vetoresXconjunto(conjuntos, vetores, conjunto)
    })
  }

  vetores.forEach(vetor => {
    pontuarVetor(conjuntos, vetor)
  })

  localStorage.setItem('vetores', JSON.stringify(vetores))
  return vetores
}

export async function getVetores () {
  const vetores = JSON.parse(localStorage.getItem('vetores'))
  return vetores
}





function vetorXconjuntos (conjuntos, vetor) {
  let vetores = [vetor]
  conjuntos.forEach(conjunto => {
    vetores = vetoresXconjunto(conjuntos, vetores, conjunto)
  })
  return vetores
}

export async function cartesianoParallel (conjuntos) {
  var Parallel = require('paralleljs')
  let vetores = vetorXconjunto(conjuntos, [], conjuntos[0])
  let p = new Parallel(vetores, {env: {conjuntos: conjuntos}})
  
  function log () {
    console.log(arguments)
  }
  function logErr () {
    console.log('Vim de erro')
    console.log(arguments)
  }
  await p.map(vetorXconjuntos).then(log, logErr)

  return []
}