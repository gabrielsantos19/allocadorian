export async function get () {
  let personalizada = {i: [], p: 0}
  const raw = localStorage.getItem('personalizada')
  if (raw) {
    personalizada = JSON.parse(raw)
  }
  return personalizada
}

export async function post (personalizada) {
  const raw = JSON.stringify(personalizada, ['i', 'p'])
  localStorage.setItem('personalizada', raw)
}

export async function apagar() {
  localStorage.removeItem('personalizada')
}