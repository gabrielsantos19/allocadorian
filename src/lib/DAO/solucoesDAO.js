export async function get () {
  let solucoes = []
  const raw = localStorage.getItem('solucoes')
  if (raw) {
    solucoes = JSON.parse(raw)
  }
  return solucoes
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