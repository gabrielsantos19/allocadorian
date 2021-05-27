export async function get () {
  let solucoes = []
  const raw = localStorage.getItem('solucoes')
  if (raw) {
    solucoes = JSON.parse(raw)
  }
  return solucoes
}

export async function post (solucoes) {
  const raw = JSON.stringify(solucoes, ['i', 'p'])
  localStorage.setItem('solucoes', raw)
}