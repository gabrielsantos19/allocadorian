export function filtrarVetor (objeto, vetorCompilado) {
  if (objeto.filtrarVetor && objeto.filtrarVetor(vetorCompilado) === false) {
    return false
  }
  if (objeto.baseFiltrarVetor && objeto.baseFiltrarVetor(vetorCompilado) == false) {
    return false
  }
  return true
}
  
export function pontuarVetor (objeto, vetor) {
  let pontos = 0
  if (objeto.pontuarVetor) {
    pontos += objeto.pontuarVetor(vetor)
  }
  if (objeto.basePontuarVetor) {
    pontos += objeto.basePontuarVetor(vetor)
  }
  return pontos
}

export function filtrarSolucao (objeto, solucao) {
  if (objeto.filtrarSolucao && objeto.filtrarSolucao(solucao) === false) {
    return false
  }
  if (objeto.baseFiltrarSolucao && objeto.baseFiltrarSolucao(solucao) === false) {
    return false
  }
  return true
}

export function pontuarSolucao (objeto, solucao) {
  let pontos = 0
  if (objeto.pontuarSolucao) {
    pontos += objeto.pontuarSolucao(solucao)
  }
  if (objeto.basePontuarSolucao) {
    pontos += objeto.basePontuarSolucao(solucao)
  }
  return pontos
}

export function filtrarFinal (objeto, solucao) {
  if (objeto.filtrarFinal && objeto.filtrarFinal(solucao) === false) {
    return false
  }
  if (objeto.baseFiltrarFinal && objeto.baseFiltrarFinal(solucao) === false) {
    return false
  }
  return true
}

export function obrigatoriedade (objeto) {
  let n = 0
  if (objeto.obrigatoriedade) {
    n += objeto.obrigatoriedade()
  }
  if (objeto.baseObrigatoriedade) {
    n += objeto.baseObrigatoriedade()
  }
  return n
}