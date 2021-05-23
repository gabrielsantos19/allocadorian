import * as Solucao from 'src/lib/solucao.js'
import * as Vetores from 'src/lib/vetores.js'


export async function linkar (solucoes, vetores) {
  for (let i=0; i<solucoes.length; ++i) {
    const solucao = solucoes[i]
    solucao.vetores = await Solucao.linkar(solucao, vetores)
  }
  return solucoes
}





async function filtrarNova (nova, vetores, conjuntos) {
  nova.compilada = await Solucao.compilar(nova, vetores)
  if (Solucao.filtrarSolucao(nova, vetores, conjuntos)) {
    return true
  }
  return false
}

function intersecao (conjunto1, conjunto2) {
  const inter = []
  let i1 = 0
  let i2 = 0
  while (i1 < conjunto1.length && i2 < conjunto2.length) {
    const o1 = conjunto1[i1]
    const o2 = conjunto2[i2]
    if (o1 < o2) {
      i1 += 1
    } else if (o1 > o2) {
      i2 += 1
    } else {
      inter.push(o1)
      i1 += 1
      i2 += 1
    }
  }
  return inter
}

function filtrarObrigatoriedade (nova, obrigatoriedades) {
  const superiorNova = nova.i[nova.i.length - 1]
  const inferiorNova = nova.i[0]

  for (let i=0; i<obrigatoriedades.length; ++i) {
    const obrigatoriedade = obrigatoriedades[i]
    const superiorObrigatoriedade = obrigatoriedade.i[obrigatoriedade.i.length - 1]
    const inferiorObrigatoriedade = obrigatoriedade.i[0]

    if (inferiorNova <= inferiorObrigatoriedade 
    && superiorObrigatoriedade <= superiorNova) {
      const inter = intersecao(nova.i, obrigatoriedade.i)
      if (inter.length < obrigatoriedade.n) {
        return false
      }
    }
  }
  return true
}

export async function gerarArvore (vetores, conjuntos) {
  const obrigatoriedades = await Vetores.gerarObrigatoriedades(vetores, conjuntos)

  const arvore = []
  for (let i=0; i<vetores.length; ++i) {
    const lista = []
    for (let a=i+1; a<vetores.length; ++a) {
      const nova = {i: [i, a]}
      
      if (await filtrarNova(nova, vetores, conjuntos) && 
          filtrarObrigatoriedade(nova, obrigatoriedades)) {
        lista.push(a)
      }
    }
    lista.sort((a, b) => vetores[b].p - vetores[a].p)
    arvore.push(lista)
  }

  return arvore
}

function obrigatoriedadeCompleta (solucao, obrigatoriedades) {
  for (let i=0; i<obrigatoriedades.length; ++i) {
    const obrigatoriedade = obrigatoriedades[i]
    const inter = intersecao(solucao.i, obrigatoriedade.i)
    if (inter.length < obrigatoriedade.n) {
      return false
    }
  }
  return true
}

function proximo (conjunto, ultimo) {
  if (conjunto.length == 0) {
    return null
  }

  if (ultimo == null) {
    return conjunto[0]
  }

  let d = 0
  while (conjunto[d] != ultimo) ++d
  ++d

  if (d < conjunto.length) {
    return conjunto[d]
  } else {
    return null
  }
}

export async function solucao (vetores, conjuntos) {
  const solucoes = []

  const obrigatoriedades = await Vetores.gerarObrigatoriedades(vetores, conjuntos)
  const arvore = await gerarArvore(vetores, conjuntos)

  let poped = null
  const pilha = [0]
  let contador = 0

  while (pilha.length > 0 && solucoes.length < 10) {
    contador += 1
    const nova = {i: pilha.slice()}

    if (await filtrarNova(nova, vetores, conjuntos) 
    && filtrarObrigatoriedade(nova, obrigatoriedades)) {
      
      if (filtrarFinal(nova, vetores, conjuntos)
      && obrigatoriedadeCompleta(nova, obrigatoriedades)) {
        solucoes.push(nova)
      }

      const atual = pilha[pilha.length - 1]
      const destinos = arvore[atual]
      const destino = proximo(destinos, poped)
      if (destino == null) {
        poped = pilha.pop()
      } else {
        poped = null
        pilha.push(destino)
      }
    } else {
      poped = pilha.pop()
    }
  }

  for (let i=0; i<solucoes.length; ++i) {
    const solucao = solucoes[i]
    solucao.p = await Solucao.pontuarSolucao(solucao, vetores, conjuntos)
  }

  return solucoes
}


///////////////////////////////////////////////////////////////////////////////


function sortFunction (solucao1, solucao2) {
  return solucao2.p - solucao1.p
}

export async function sort (solucoes) {
  return solucoes.sort(sortFunction)
}