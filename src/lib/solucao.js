import * as Vetor from 'src/lib/vetor.js'

function eValida(solucao, vetores, conjuntos) {
  for (let i=0; i<solucao.length; ++i) {
    const vetor = vetores[i]
    if (!Vetor.filtrarSolucao(vetor, conjuntos, solucao)) {
      return false
    }
  }
  return true
}

///////////////////////////////////////////////////////////

function solucaoXsolucao (solucao1, solucao2) {
  return {
    vetores: [solucao1.vetores, solucao2.vetores].flat(),
    nota: 0
  }
}

function solucaoXsolucoes (solucao, solucoes) {
  let produto = []
  for (let solucao2 of solucoes) {
    const nova = solucaoXsolucao(solucao, solucao2)
    //if (nova.vetores.includes(3)) {
      produto.push(nova)
    //}
  }
  return produto
}

function solucoesXsolucoes (solucoes1, solucoes2) {
  let produto = []
  for (let solucao of solucoes1) {
    produto.push(solucaoXsolucoes(solucao, solucoes2))
  }
  return produto.flat()
}

function combinar (solucoes1, solucoes2) {
  const novas = solucoesXsolucoes(solucoes1, solucoes2)
  return solucoes1.concat(solucoes2).concat(novas)
}

function resolverArvore (arvore) {
  for (let i=1; i<arvore.length; i+=2) {
    arvore[i] = combinar(arvore[i-1], arvore[i])
    arvore[i-1] = []
  }
  return arvore.filter(val => val.length > 0)
}

export async function solucao2 (vetores) {
  let arvore = vetores.map((e, i) => [{
    vetores: [i],
    nota: 0
  }])

  while (arvore.length > 1) {
    arvore = resolverArvore(arvore)
  }
  
  localStorage.setItem('solucoes', JSON.stringify(arvore[0]))
  return arvore[0]
}

export async function getSolucoes () {
  const solucoes = localStorage.getItem('solucoes')
  if (solucoes) {
    return JSON.parse(solucoes)
  } else {
    return []
  }
}