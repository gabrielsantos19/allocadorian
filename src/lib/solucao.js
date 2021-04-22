export class Solucao extends Array {
  merge () {
    let solucaoMerged = []
    for (let vetor of this) {
      const merged = {}
      for (let p of vetor) {
        Object.assign(merged, p)
      }
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
}
