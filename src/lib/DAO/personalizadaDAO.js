export async function get () {
  let personalizada = {i: [], p: 0}
  const raw = localStorage.getItem('personalizada')
  if (raw) {
    personalizada = JSON.parse(raw)
  }
  return personalizada
}

export async function post (solucoes) {
  const solucoesRaw = []
  for (let i=0; i<solucoes.length; ++i) {
    solucoesRaw.push({
      i: solucoes[i].i,
      p: solucoes[i].p
    })
  }
  const raw = JSON.stringify(solucoesRaw)
  localStorage.setItem('solucoes', raw)
}