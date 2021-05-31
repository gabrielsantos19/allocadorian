export async function get() {
  let conjuntos = []
  const raw = localStorage.getItem('conjuntos')
  if (raw) {
    conjuntos = JSON.parse(raw)
  }
  return conjuntos
}

export async function post(conjuntos) {
  const raw = JSON.stringify(conjuntos)
  localStorage.setItem('conjuntos', raw)
}

export async function apagar() {
  localStorage.removeItem('conjuntos')
}