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
  if (base.obrigatoriedade) {
    const retorno = base.obrigatoriedade(objeto)
    if (retorno !== undefined)
      return {
        n: retorno.valor,
        erro: retorno.erro,
      }
  }
  return {
    n: 0,
    erro: '',
  }
}

export function filtrarSolucao (objeto, base, solucao) {
  if (base.filtrarSolucao) {
    const retorno = base.filtrarSolucao(objeto, solucao)
    if (retorno !== undefined) {
      return {
        valor: retorno.valor,
        erro: retorno.erro,
      }
    }
  }
  return {
    valor: true,
    erro: '',
  }
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