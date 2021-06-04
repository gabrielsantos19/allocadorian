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

filtrarSolucao (solucao) {
  return {
    valor: true,
    erro: '',
  }
},

pontuarSolucao (solucao) {
  return {
    p: 0,
  }
},
}`

export const objeto = 
`{
}`