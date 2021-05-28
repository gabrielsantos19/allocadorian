import * as Vetor from 'src/lib/vetor.js'


export function filtrarSolucao(solucao, vetores, conjuntos) {
  for (let i=0; i<solucao.i.length; ++i) {
    const vetor = vetores[solucao.i[i]]
    const retorno = Vetor.filtrarSolucao(vetor, conjuntos, solucao.compilada)
    if (!retorno.valor) {
      return retorno
    }
  }
  return {
    valor: true,
    erro: '',
  }
}

export async function pontuarSolucao(solucao, vetores, conjuntos) {
  let pontos = 0
  for (let i=0; i<solucao.i.length; ++i) {
    const vetor = vetores[solucao.i[i]]
    pontos += Vetor.pontuarSolucao(vetor, conjuntos, solucao.compilada)
  }
  return pontos
}

export async function filtrarFinal(solucao, vetores, conjuntos) {
  for (let i=0; i<solucao.i.length; ++i) {
    const vetor = vetores[solucao.i[i]]
    if (!Vetor.filtrarFinal(vetor, conjuntos, solucao)) {
      return false
    }
  }
  return true
}


///////////////////////////////////////////////////////////////////////////////


export async function linkar (solucao, vetores) {
  const svetores = []
  for (let i=0; i<solucao.i.length; ++i) {
    svetores.push(vetores[solucao.i[i]])
  }
  return svetores
}

export async function compilar (solucao, vetores) {
  const compilada = []
  for (let i=0; i<solucao.i.length; ++i) {
    compilada.push(vetores[solucao.i[i]].compilado)
  }
  return compilada
}