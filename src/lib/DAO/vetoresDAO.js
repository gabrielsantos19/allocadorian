export async function get () {
  let vetores = []
  const raw = localStorage.getItem('vetores')
  if (raw) {
    vetores = JSON.parse(raw)
  }
  return vetores
}

export async function post (vetores) {
  const raw = JSON.stringify(vetores, ['i', 'p'])
  localStorage.setItem('vetores', raw)
}