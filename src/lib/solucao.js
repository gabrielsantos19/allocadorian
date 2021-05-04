import * as Vetor from 'src/lib/vetor.js'

function filtrarSolucao(solucao, vetores, conjuntos) {
  for (let i=0; i<solucao.i.length; ++i) {
    const vetor = vetores[solucao.i[i]]
    if (Vetor.filtrarSolucao(vetor, conjuntos, solucao) === false) {
      return false
    }
  }
  return true
}

function pontuarSolucao(solucao, vetores, conjuntos) {
  let pontos = 0
  for (let i=0; i<solucao.i.length; ++i) {
    const vetor = vetores[solucao.i[i]]
    pontos += Vetor.pontuarSolucao(vetor, conjuntos, solucao)
  }
  return pontos
}

function filtrarFinal(solucao, vetores, conjuntos) {
  for (let i=0; i<solucao.i.length; ++i) {
    const vetor = vetores[solucao.i[i]]
    if (Vetor.filtrarFinal(vetor, conjuntos, solucao) === false) {
      return false
    }
  }
  return true
}


///////////////////////////////////////////////////////////


function solucaoXsolucao (solucao1, solucao2) {
  return {
    i: [solucao1.i, solucao2.i].flat(),
    p: 0
  }
}

function solucaoXsolucoes (solucao, solucoes, vetores, conjuntos) {
  let produto = []
  for (let solucao2 of solucoes) {
    const nova = solucaoXsolucao(solucao, solucao2)
    if (filtrarSolucao(nova, vetores, conjuntos)) {
      nova.p = pontuarSolucao(nova, vetores, conjuntos)
      produto.push(nova)
    }
  }
  return produto
}

function solucoesXsolucoes (solucoes1, solucoes2, vetores, conjuntos) {
  let produto = []
  for (let solucao of solucoes1) {
    produto.push(solucaoXsolucoes(solucao, solucoes2, vetores, conjuntos))
  }
  return produto.flat()
}

function combinar (solucoes1, solucoes2, vetores, conjuntos) {
  const novas = solucoesXsolucoes(solucoes1, solucoes2, vetores, conjuntos)
  return solucoes1.concat(solucoes2).concat(novas)
}

function resolverArvore (arvore, vetores, conjuntos) {
  for (let i=1; i<arvore.length; i+=2) {
    arvore[i] = combinar(arvore[i-1], arvore[i], vetores, conjuntos)
    arvore[i-1] = []
  }
  return arvore.filter(val => val.length > 0)
}

export async function solucao (vetores, conjuntos) {
  const vazia = {i:[]}
  const unitarias = vetores.map((e, i) => { return {
    i: [i]
  }})
  const base = solucaoXsolucoes(vazia, unitarias, vetores, conjuntos)
  let arvore = base.map(e => [e])

  while (arvore.length > 1) {
    arvore = resolverArvore(arvore, vetores, conjuntos)
  }
  
  if (arvore && arvore[0]) {
    const solucoes = arvore[0].filter(s => filtrarFinal(s, vetores, conjuntos))

    localStorage.setItem('solucoes', JSON.stringify(solucoes))
    return solucoes
  } else {
    return []
  }
}

export async function getSolucoes () {
  const solucoes = localStorage.getItem('solucoes')
  if (solucoes) {
    return JSON.parse(solucoes)
  } else {
    return []
  }
}

function sortFunction (solucao1, solucao2) {
  return solucao2.p - solucao1.p
}

export async function sort (solucoes) {
  return solucoes.sort(sortFunction)
}