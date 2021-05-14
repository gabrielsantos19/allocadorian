
import 'src/lib/solucao.js'

export async function linkarSolucoes (solucoes, vetores) {
  for (let i=0; i<solucoes.length; ++i) {
    const solucao = solucoes[i]
    solucao.vetores = linkar(solucao, vetores)
  }
  return solucoes
}

function compilarSolucoes (solucoes, vetores) {
  for (let i=0; i<solucoes.length; ++i) {
    const solucao = solucoes[i]
    solucao.compilada = compilarSolucao(solucao, vetores)
  }
  return solucoes
}

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
    nova.compilada = compilarSolucao(nova, vetores)
    if (filtrarSolucao(nova, vetores, conjuntos)) {
      nova.p = pontuarSolucao(nova, vetores, conjuntos)
      delete nova.compilada /////////////////////////////////
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
  const produto = solucoesXsolucoes(solucoes1, solucoes2, vetores, conjuntos)
  const combinacao = solucoes1.concat(solucoes2).concat(produto)
  
  return combinacao
}

export function resolverArvore (arvore, vetores, conjuntos) {
  for (let i=1; i<arvore.length; i+=2) {
    arvore[i] = combinar(arvore[i-1], arvore[i], vetores, conjuntos)
    arvore[i-1] = []
  }
  return arvore.filter(val => val.length > 0)
}

export async function gerarArvore(vetores, conjuntos) {
  const arvore = []
  for (let i=0; i<vetores.length; ++i) {
    const nova = {i: [i]}
    nova.compilada = compilarSolucao(nova, vetores)
    if (filtrarSolucao(nova, vetores, conjuntos)) {
      nova.p = pontuarSolucao(nova, vetores, conjuntos)
      delete nova.compilada /////////////////////////////////
      arvore.push([nova])
    }
  }
  return arvore
}

export async function solucao (vetores, conjuntos) {
  let arvore = await gerarArvore(vetores, conjuntos)

  while (arvore.length > 1) {
    arvore = resolverArvore(arvore, vetores, conjuntos)
  }
  
  if (arvore && arvore[0]) {
    const solucoes = arvore[0].filter(s => filtrarFinal(s, vetores, conjuntos))
    sort(solucoes)
    setSolucoes(solucoes)
    return solucoes
  } else {
    setSolucoes([])
    return []
  }
}