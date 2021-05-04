function filtrarVetor (vetor, conjuntos) {
  const merged = merge(vetor, conjuntos)
  for (let i=0; i<vetor.i.length; ++i) {
    const objeto = conjuntos[i][vetor.i[i]]
    if (objeto.filtrarVetor && objeto.filtrarVetor(merged) === false) {
      return false
    }
  }
  return true
}

function pontuarVetor (conjuntos, vetor) {
  let pontos = 0
  for (let i=0; i<vetor.i.length; ++i) {
    const objeto = conjuntos[i][vetor.i[i]]
    pontos += objeto.pontuarVetor(vetor.merged)
  }
  return pontos
}

export function filtrarSolucao (vetor, conjuntos, solucao) {
  for (let i=0; i<vetor.i.length; ++i) {
    const objeto = conjuntos[i][vetor.i[i]]
    if (objeto.filtrarSolucao && objeto.filtrarSolucao(solucao) === false) {
      return false
    }
    if (objeto.baseFiltrarSolucao && objeto.baseFiltrarSolucao(solucao) === false) {
      return false
    }
  }
  return true
}

export function pontuarSolucao (vetor, conjuntos, solucao) {
  let pontos = 0
  for (let i=0; i<vetor.i.length; ++i) {
    const objeto = conjuntos[i][vetor.i[i]]
    if (objeto.pontuarSolucao) {
      pontos += objeto.pontuarSolucao(solucao)
    }
  }
  return pontos
}

export function filtrarFinal (vetor, conjuntos, solucao) {
  for (let i=0; i<vetor.i.length; ++i) {
    const objeto = conjuntos[i][vetor.i[i]]
    if (objeto.filtrarFinal && objeto.filtrarFinal(solucao) === false) {
      return false
    }
    if (objeto.baseFiltrarFinal && objeto.baseFiltrarFinal(solucao) === false) {
      return false
    }
  }
  return true
}


////////////////////////////////////////////////////////////////////////


function merge (vetor, conjuntos) {
  const merged = {}
  vetor.i.forEach((ponto, index) => {
    Object.assign(merged, conjuntos[index][ponto])
  })
  vetor.merged = merged
  return merged
}

function vetorXconjunto (conjuntos, vetor, conjunto) {
  let produto = []
  conjunto.forEach((e, index) => {
    const novo = {
      i: vetor.i.concat(index),
      merged: {}
    }

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
      i: [],
      merged: {}
    }]
    conjuntos.forEach((conjunto) => {
      vetores = vetoresXconjunto(conjuntos, vetores, conjunto)
    })
  }

  vetores.forEach(vetor => {
    vetor.p = pontuarVetor(conjuntos, vetor)
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