import * as Objeto from 'src/lib/objeto.js'

function filtrarVetor (vetor, conjuntos) {
  const compilado = vetor.compilado
  for (let i=0; i<vetor.i.length; ++i) {
    const objeto = conjuntos[i][vetor.i[i]]
    if (!Objeto.filtrarVetor(objeto, compilado)) {
      return false
    }
  }
  return true
}

function pontuarVetor (vetor, conjuntos) {
  const compilado = vetor.compilado
  let pontos = 0
  for (let i=0; i<vetor.i.length; ++i) {
    const objeto = conjuntos[i][vetor.i[i]]
    pontos += Objeto.pontuarVetor(objeto, compilado)
  }
  return pontos
}

export function filtrarSolucao (vetor, conjuntos, solucao) {
  for (let i=0; i<vetor.i.length; ++i) {
    const objeto = conjuntos[i][vetor.i[i]]
    if (!Objeto.filtrarSolucao(objeto, solucao)) {
      return false
    }
  }
  return true
}

export function pontuarSolucao (vetor, conjuntos, solucao) {
  let pontos = 0
  for (let i=0; i<vetor.i.length; ++i) {
    const objeto = conjuntos[i][vetor.i[i]]
    pontos += Objeto.pontuarSolucao(objeto, solucao)
  }
  pontos += vetor.p
  return pontos
}

export function filtrarFinal (vetor, conjuntos, solucao) {
  for (let i=0; i<vetor.i.length; ++i) {
    const objeto = conjuntos[i][vetor.i[i]]
    if (!Objeto.filtrarFinal(objeto, solucao)) {
      return false
    }
  }
  return true
}


///////////////////////////////////////////////////////////////////////////////


function linkar (vetor, conjuntos) {
  const objetos = []
  for (let i=0; i<vetor.i.length; ++i) {
    objetos.push(conjuntos[i][vetor.i[i]])
  }
  return objetos
}

export async function linkarVetores (vetores, conjuntos) {
  for (let i=0; i<vetores.length; ++i) {
    const vetor = vetores[i]
    vetor.objetos = linkar(vetor, conjuntos)
  }
  return vetores
}

function compilar (vetor, conjuntos) {
  const merged = {}
  vetor.i.forEach((ponto, index) => {
    Object.assign(merged, conjuntos[index][ponto])
  })
  return merged
}

export async function compilarVetores (vetores, conjuntos) {
  for (let i=0; i<vetores.length; ++i) {
    const vetor = vetores[i]
    vetor.compilado = compilar(vetor, conjuntos)
  }
  return vetores
}

function vetorXconjunto (conjuntos, vetor, conjunto) {
  let produto = []
  conjunto.forEach((e, index) => {
    const novo = { i: vetor.i.concat(index) }
    novo.compilado = compilar(novo, conjuntos)

    if (filtrarVetor(novo, conjuntos)) {
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
      i: []
    }]
    conjuntos.forEach((conjunto) => {
      vetores = vetoresXconjunto(conjuntos, vetores, conjunto)
    })
  }

  vetores.forEach(vetor => {
    vetor.p = pontuarVetor(vetor, conjuntos)
  })

  setVetores(vetores)
  return vetores
}

export async function getVetores () {
  const vetores = JSON.parse(localStorage.getItem('vetores'))
  return vetores
}

function setVetores (vetores) {
  const vetoresRaw = vetores.map(vetor => { 
    return {
      i:vetor.i,
      p: vetor.p
    }
  })
  localStorage.setItem('vetores', JSON.stringify(vetoresRaw))
}


///////////////////////////////////////////////////////////////////////////////


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