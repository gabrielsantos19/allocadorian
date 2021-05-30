function intersecao (conjunto1, conjunto2) {
  const inter = []
  let i1 = 0
  let i2 = 0
  while (i1 < conjunto1.length && i2 < conjunto2.length) {
    const o1 = conjunto1[i1]
    const o2 = conjunto2[i2]
    if (o1 < o2) {
      i1 += 1
    } else if (o1 > o2) {
      i2 += 1
    } else {
      inter.push(o1)
      i1 += 1
      i2 += 1
    }
  }
  return inter
}

export async function filtrarParcial (nova, obrigatoriedades) {
  const superiorNova = nova.i[nova.i.length - 1]
  const inferiorNova = nova.i[0]

  for (let i=0; i<obrigatoriedades.length; ++i) {
    const obrigatoriedade = obrigatoriedades[i]
    const superiorObrigatoriedade = obrigatoriedade.i[obrigatoriedade.i.length - 1]
    const inferiorObrigatoriedade = obrigatoriedade.i[0]

    if (inferiorNova <= inferiorObrigatoriedade 
    && superiorObrigatoriedade <= superiorNova) {
      const inter = intersecao(nova.i, obrigatoriedade.i)
      if (inter.length < obrigatoriedade.n) {
        return {
          valor: false,
          i: obrigatoriedade.i,
          erro: obrigatoriedade.erro,
        }
      }
    }
  }
  return { valor: true }
}

export async function filtrar (solucao, obrigatoriedades) {
  for (let i=0; i<obrigatoriedades.length; ++i) {
    const obrigatoriedade = obrigatoriedades[i]
    const inter = intersecao(solucao.i, obrigatoriedade.i)
    if (inter.length < obrigatoriedade.n) {
      return {
        valor: false,
        i: obrigatoriedade.i,
        erro: obrigatoriedade.erro,
      }
    }
  }
  return {
    valor: true,
  }
}