export function filtrarVetor (objeto, base, vetor) {
  if (base.filtrarVetor && base.filtrarVetor(objeto, vetor) === false) {
    return false
  }
  return true
}
  
export function pontuarVetor (objeto, base, vetor) {
  let pontos = 0
  if (base.pontuarVetor) {
    pontos += base.pontuarVetor(objeto, vetor)
  }
  return pontos
}

export function obrigatoriedade (objeto, base) {
  let n = 0
  if (base.obrigatoriedade) {
    n += base.obrigatoriedade(objeto)
  }
  return n
}

export function filtrarSolucao (objeto, base, solucao) {
  if (base.filtrarSolucao && base.filtrarSolucao(objeto, solucao) === false) {
    return false
  }
  return true
}

export function pontuarSolucao (objeto, base, solucao) {
  let pontos = 0
  if (base.pontuarSolucao) {
    pontos += base.pontuarSolucao(objeto, solucao)
  }
  return pontos
}

export function filtrarFinal (objeto, base, solucao) {
  if (base.filtrarFinal && base.filtrarFinal(objeto, solucao) === false) {
    return false
  }
  return true
}