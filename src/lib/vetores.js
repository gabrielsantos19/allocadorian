import * as Objeto from 'src/lib/objeto.js'
import * as Vetor from 'src/lib/vetor.js'


export async function linkar (vetores, conjuntos) {
  for (let i=0; i<vetores.length; ++i) {
    const vetor = vetores[i]
    vetor.objetos = Vetor.linkar(vetor, conjuntos)
  }
  return vetores
}

export async function compilar (vetores, conjuntos) {
  for (let i=0; i<vetores.length; ++i) {
    const vetor = vetores[i]
    vetor.compilado = Vetor.compilar(vetor, conjuntos)
  }
  return vetores
}




function vetorXconjunto (conjuntos, vetor, conjunto) {
  let produto = []
  for (let i=0; i<conjunto.objetos.length; ++i) {
    const novo = { i: vetor.i.concat(i) }
    novo.compilado = Vetor.compilar(novo, conjuntos)

    if (Vetor.filtrarVetor(novo, conjuntos)) {
      produto.push(novo)
    }
  }
  return produto
}

function vetoresXconjunto (vetores, conjunto, conjuntos) {
  let produto = []
  for (let i=0; i<vetores.length; ++i) {
    produto.push(vetorXconjunto(conjuntos, vetores[i], conjunto))
  }
  return produto.flat()
}

export async function cartesiano (conjuntos) {
  let vetores = []
  if (conjuntos.length) {
    vetores = [{
      i: []
    }]
    for (let i=0; i<conjuntos.length; ++i) {
      const conjunto = conjuntos[i]
      vetores = vetoresXconjunto(vetores, conjunto, conjuntos)
    }
  }

  for (let i=0; i<vetores.length; ++i) {
    const vetor = vetores[i]
    vetor.p = Vetor.pontuarVetor(vetor, conjuntos)
  }

  return vetores
}





function filtrarVetores (vetores, conjuntoI, objetoI) {
  const filtrados = []
  for (let i=0; i<vetores.length; ++i) {
    const vetor = vetores[i]
    if (vetor.i[conjuntoI] == objetoI) {
      filtrados.push(i)
    }
  }
  return filtrados
}


function gerarObrigatoriedadesConjunto (vetores, conjunto, conjuntoI) {
  const obrigatoriedades = []
  const objetoBase = conjunto.objetoBase
  for (let i=0; i<conjunto.objetos.length; ++i) {
    const objeto = conjunto.objetos[i]
    const retorno = Objeto.obrigatoriedade(objeto, objetoBase)
    if (retorno.n > 0) {
      const filtrados = filtrarVetores(vetores, conjuntoI, i)
      retorno.i = filtrados
      obrigatoriedades.push(retorno)
    }
  }
  return obrigatoriedades
}

export async function gerarObrigatoriedades (vetores, conjuntos) {
  const obrigatoriedades = []
  for (let i=0; i<conjuntos.length; ++i) {
    const conjunto = conjuntos[i]
    const novas = gerarObrigatoriedadesConjunto(vetores, conjunto, i)
    obrigatoriedades.push(novas)
  }
  return obrigatoriedades.flat()
}