import * as Objeto from 'src/lib/objeto.js'


export function filtrarVetor (vetor, conjuntos) {
  const compilado = vetor.compilado
  for (let i=0; i<vetor.i.length; ++i) {
    const conjunto = conjuntos[i]
    const objeto = conjunto.objetos[vetor.i[i]]
    if (!Objeto.filtrarVetor(objeto, conjunto.objetoBase, compilado)) {
      return false
    }
  }
  return true
}

export function pontuarVetor (vetor, conjuntos) {
  const compilado = vetor.compilado
  let pontos = 0
  for (let i=0; i<vetor.i.length; ++i) {
    const conjunto = conjuntos[i]
    const objeto = conjunto.objetos[vetor.i[i]]
    pontos += Objeto.pontuarVetor(objeto, conjunto.objetoBase, compilado)
  }
  return pontos
}

export function filtrarSolucao (vetor, conjuntos, solucao) {
  for (let i=0; i<vetor.i.length; ++i) {
    const conjunto = conjuntos[i]
    const objeto = conjunto.objetos[vetor.i[i]]
    if (!Objeto.filtrarSolucao(objeto, conjunto.objetoBase, solucao)) {
      return false
    }
  }
  return true
}

export function pontuarSolucao (vetor, conjuntos, solucao) {
  let pontos = 0
  for (let i=0; i<vetor.i.length; ++i) {
    const conjunto = conjuntos[i]
    const objeto = conjunto.objetos[vetor.i[i]]
    pontos += Objeto.pontuarSolucao(objeto, conjunto.objetoBase, solucao)
  }
  pontos += vetor.p
  return pontos
}

export function filtrarFinal (vetor, conjuntos, solucao) {
  for (let i=0; i<vetor.i.length; ++i) {
    const conjunto = conjuntos[i]
    const objeto = conjunto.objetos[vetor.i[i]]
    if (!Objeto.filtrarFinal(objeto, conjunto.objetoBase, solucao)) {
      return false
    }
  }
  return true
}

export function linkar (vetor, conjuntos) {
  const objetos = []
  for (let i=0; i<vetor.i.length; ++i) {
    objetos.push(conjuntos[i].objetos[vetor.i[i]])
  }
  return objetos
}

export function compilar (vetor, conjuntos) {
  const compilado = {}
  for (let i=0; i<vetor.i.length; ++i) {
    const objeto = conjuntos[i].objetos[vetor.i[i]]
    Object.assign(compilado, objeto)
  }
  return compilado
}