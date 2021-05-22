export async function get () {
  let vetores = []
  const raw = localStorage.getItem('vetores')
  if (raw) {
    vetores = JSON.parse(raw)
  }
  return vetores
}

export async function post (vetores) {
  const vetoresRaw = vetores.map(vetor => { 
    return {
      i:vetor.i,
      p: vetor.p
    }
  })
  const raw = JSON.stringify(vetoresRaw)
  localStorage.setItem('vetores', raw)
}