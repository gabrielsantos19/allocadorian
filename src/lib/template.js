export const descricao = 
`{
nome: 'Conjunto'
}`

export const objetoBase = 
`{
filtrarVetor (objeto, vetor) {
  return true
},

pontuarVetor (objeto, vetor) {
  return 0
},

obrigatoriedade (objeto) {
  return {
    valor: 0,
    erro: '',
  }
},

filtrarSolucao (objeto, solucao) {
  return {
    valor: false,
    erro: '',
  }
},

pontuarSolucao (objeto, solucao) {
  return 0
},
}`

export const objeto = 
`{
}`