export class Solucao extends Array {
  merge () {
    let solucaoMerged = []
    for (let vetor of this) {
      const merged = vetor.merge()
      solucaoMerged.push(merged)
    }
    return solucaoMerged
  }

  eValida() {
    const merged = this.merge()
    for (let vetor of this) {
      if (!vetor.filtrarSubSolucao(merged)) return false
    }
    return true
  }

  multiplicar(solucao) {
    return this.concat(solucao)
  }
}
