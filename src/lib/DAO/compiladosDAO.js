export async function get () {
  let compilados = []
  const raw = localStorage.getItem('compilados')
  if (raw) {
    compilados = JSON.parse(raw)
  }
  return compilados
}

export async function post (compilados) {
  const raw = JSON.stringify(compilados)
  localStorage.setItem('compilados', raw)
}