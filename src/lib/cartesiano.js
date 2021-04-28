export class Vetor {
  constructor() {
    this.pontos = []
  }

  merge() {
    let merged = {}
    this.pontos.forEach(p => Object.assign(merged, p))
    return merged
  }

  eValida() {
    const merged = {}
    for (let a of this.pontos) {
      Object.assign(merged, a)
    }
    for (let a of this.pontos) {
      if (a.filtrarVetor && a.filtrarVetor(merged) === false) {
        return false
      }
    }
    return true
  }

  filtrarSubSolucao(subSolucao) {
    for (let a of this.pontos) {
      if (a.filtrarSolucao && a.filtrarSolucao(subSolucao) === false) {
        return false
      }
    }
    return true
  }

  push(ponto) {
    this.pontos.push(ponto)
  }
}

export function multiplicar (a, b) {
  const vetores = []
  for (let i of a) {
    for (let x of b) {
      const combinacao = new Vetor()
      if (i instanceof Vetor) {
        i.pontos.forEach(p => combinacao.push(p))
      } else {
        combinacao.push(i)
      }

      if (x instanceof Vetor) {
        x.pontos.forEach(p => combinacao.push(p))
      } else {
        combinacao.push(x)
      }

      // Só adiciona se for uma opção possível
      if (combinacao.eValida()) {
        vetores.push(combinacao)
      }
    }
  }
  return vetores
}