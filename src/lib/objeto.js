export function filtrarVetor (objeto, base, vetorCompilado) {
  if (base.baseFiltrarVetor && base.baseFiltrarVetor(vetorCompilado) == false) {
    return false
  }
  if (objeto.filtrarVetor && objeto.filtrarVetor(vetorCompilado) === false) {
    return false
  }
  return true
}
  
export function pontuarVetor (objeto, base, vetor) {
  let pontos = 0
  if (base.basePontuarVetor) {
    pontos += base.basePontuarVetor(vetor)
  }
  if (objeto.pontuarVetor) {
    pontos += objeto.pontuarVetor(vetor)
  }
  return pontos
}

export function filtrarSolucao (objeto, base, solucao) {
  if (base.baseFiltrarSolucao && base.baseFiltrarSolucao(solucao) === false) {
    return false
  }
  if (objeto.filtrarSolucao && objeto.filtrarSolucao(solucao) === false) {
    return false
  }
  return true
}

export function pontuarSolucao (objeto, base, solucao) {
  let pontos = 0
  if (base.basePontuarSolucao) {
    pontos += base.basePontuarSolucao(solucao)
  }
  if (objeto.pontuarSolucao) {
    pontos += objeto.pontuarSolucao(solucao)
  }
  return pontos
}

export function filtrarFinal (objeto, base, solucao) {
  if (base.baseFiltrarFinal && base.baseFiltrarFinal(solucao) === false) {
    return false
  }
  if (objeto.filtrarFinal && objeto.filtrarFinal(solucao) === false) {
    return false
  }
  return true
}

export function obrigatoriedade (objeto, base) {
  let n = 0
  if (base.baseObrigatoriedade) {
    n += base.baseObrigatoriedade()
  }
  if (objeto.obrigatoriedade) {
    n += objeto.obrigatoriedade()
  }
  return n
}