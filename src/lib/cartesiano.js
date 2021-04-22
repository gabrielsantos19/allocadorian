export class Vetor extends Array {
  eValida() {
    const merged = {}
    for (let a of this) {
      Object.assign(merged, a)
    }
    for (let a of this) {
      if (a.filtrarProduto && a.filtrarProduto(merged) === false) {
        return false
      }
    }
    return true
  }

  filtrarSubSolucao(subSolucao) {
    for (let a of this) {
      if (a.filtrarSubSolucao && a.filtrarSubSolucao(subSolucao) === false) {
        return false
      }
    }
    return true
  }
}

export function multiplicar (a, b) {
  const combinacoes = []
  for (let i of a) {
    for (let x of b) {
      const combinacao = new Vetor(i, x).flat()

      // Só adiciona se for uma opção possível
      if (combinacao.eValida()) {
        combinacoes.push(combinacao)
      }
    }
  }
  return combinacoes
}