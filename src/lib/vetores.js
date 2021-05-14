import 'src/lib/vetor.js'

export async function linkarVetores (vetores, conjuntos) {
  for (let i=0; i<vetores.length; ++i) {
    const vetor = vetores[i]
    vetor.objetos = linkar(vetor, conjuntos)
  }
  return vetores
}

export async function compilarVetores (vetores, conjuntos) {
  for (let i=0; i<vetores.length; ++i) {
    const vetor = vetores[i]
    vetor.compilado = compilar(vetor, conjuntos)
  }
  return vetores
}

function vetorXconjunto (conjuntos, vetor, conjunto) {
  let produto = []
  conjunto.forEach((e, index) => {
    const novo = { i: vetor.i.concat(index) }
    novo.compilado = compilar(novo, conjuntos)

    if (filtrarVetor(novo, conjuntos)) {
      produto.push(novo)
    }
  })
  return produto
}

function vetoresXconjunto (conjuntos, vetores, conjunto) {
  let produto = []
  vetores.forEach(v => {
    produto.push(vetorXconjunto(conjuntos, v, conjunto))
  })
  return produto.flat()
}

export async function cartesiano (conjuntos) {
  let vetores = []
  if (conjuntos.length) {
    vetores = [{
      i: []
    }]
    conjuntos.forEach((conjunto) => {
      vetores = vetoresXconjunto(conjuntos, vetores, conjunto)
    })
  }

  vetores.forEach(vetor => {
    vetor.p = pontuarVetor(vetor, conjuntos)
  })

  setVetores(vetores)
  return vetores
}

export async function getVetores () {
  const vetores = JSON.parse(localStorage.getItem('vetores'))
  return vetores
}

function setVetores (vetores) {
  const vetoresRaw = vetores.map(vetor => { 
    return {
      i:vetor.i,
      p: vetor.p
    }
  })
  localStorage.setItem('vetores', JSON.stringify(vetoresRaw))
}

// filtra os vetores que contêm o objetoI do conjuntoI
function filtrarVetores (vetores, conjuntoI, objetoI) {
  const filtrados = []
  for (let i=0; i<vetores.length; ++i) {
    const vetor = vetores[i]
    if (vetor.i[conjuntoI] == objetoI) {
      filtrados.push(i)
    }
  }
  return filtrados
}

function gerarObrigatoriedadesConjunto (vetores, conjunto, conjuntoI) {
  const obrigatoriedades = []
  for (let i=0; i<conjunto.length; ++i) {
    const objeto = conjunto[i]

    const n = Objeto.obrigatoriedade(objeto)
    if (n > 0) {
      const filtrados = filtrarVetores(vetores, conjuntoI, i)
      obrigatoriedades.push({
        i: filtrados,
        n: n
      })
    }
  }
  return obrigatoriedades
}

export async function gerarObrigatoriedades (vetores, conjuntos) {
  const obrigatoriedades = []
  for (let i=0; i<conjuntos.length; ++i) {
    const conjunto = conjuntos[i]
    const novas = gerarObrigatoriedadesConjunto(vetores, conjunto, i)
    obrigatoriedades.push(novas)
  }
  return obrigatoriedades.flat()
}