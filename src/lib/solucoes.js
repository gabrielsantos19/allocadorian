import * as Solucao from 'src/lib/solucao.js'
import * as Vetores from 'src/lib/vetores.js'
import * as Obrigatoriedades from 'src/lib/obrigatoriedades.js'


export async function linkar (solucoes, vetores) {
  for (let i=0; i<solucoes.length; ++i) {
    const solucao = solucoes[i]
    solucao.vetores = await Solucao.linkar(solucao, vetores)
  }
  return solucoes
}





async function filtrarNova (nova, vetores, conjuntos) {
  nova.compilada = await Solucao.compilar(nova, vetores)
  const retorno = Solucao.filtrarSolucao(nova, vetores, conjuntos)
  if (retorno.valor) {
    return true
  }
  return false
}

export async function gerarArvore (vetores, conjuntos) {
  const obrigatoriedades = await Vetores.gerarObrigatoriedades(vetores, conjuntos)

  const arvore = []
  for (let i=0; i<vetores.length; ++i) {
    const lista = []
    for (let a=i+1; a<vetores.length; ++a) {
      const nova = {i: [i, a]}
      
      const retorno1 = await filtrarNova(nova, vetores, conjuntos)
      const retorno2 = await Obrigatoriedades.filtrarParcial(nova, obrigatoriedades)
      if (retorno1 && retorno2.valor) {
        lista.push(a)
      }
    }
    lista.sort((a, b) => vetores[b].p - vetores[a].p)
    arvore.push(lista)
  }

  return arvore
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

  while (pilha.length > 0 && solucoes.length < 40) {
    contador += 1
    const nova = {i: pilha.slice()}

    const retorno1 = await Obrigatoriedades.filtrarParcial(nova, obrigatoriedades)
    const retorno2 = await filtrarNova(nova, vetores, conjuntos)
    if (retorno1.valor && retorno2) {
      const retorno3 = await Obrigatoriedades.filtrar(nova, obrigatoriedades)
      const retorno4 = await Solucao.filtrarFinal(nova, vetores, conjuntos)
      if (poped === null && retorno3.valor && retorno4) {
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