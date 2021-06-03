import * as Vetor from 'src/lib/vetor.js'
import * as Objeto from 'src/lib/objeto.js'


export function filtrarSolucao(solucao, vetores, conjuntos) {
  for (let i=0; i<conjuntos.length; ++i) {
    const conjunto = conjuntos[i]
    const objetoBase = conjunto.objetoBase
    const retorno = Objeto.filtrarSolucao(null, objetoBase, solucao)
    if (!retorno.valor) {
      return retorno
    }
  }
  return {
    valor: true,
    erro: '',
  }
}

export async function pontuarSolucao(solucao, vetores, conjuntos) {
  let p = {p: 0}

  for (let i=0; i<solucao.i.length; ++i) {
    p.p += vetores[solucao.i[i]].p
  }
  
  for (let i=0; i<conjuntos.length; ++i) {
    const conjunto = conjuntos[i]
    const base = conjunto.objetoBase
    const novo = Objeto.pontuarSolucao(null, base, solucao)
    somarObjetos(p, novo)
  }
  return p
}

export async function filtrarFinal(solucao, vetores, conjuntos) {
  for (let i=0; i<solucao.i.length; ++i) {
    const vetor = vetores[solucao.i[i]]
    if (!Vetor.filtrarFinal(vetor, conjuntos, solucao)) {
      return false
    }
  }
  return true
}


///////////////////////////////////////////////////////////////////////////////


export async function linkar (solucao, vetores) {
  const svetores = []
  for (let i=0; i<solucao.i.length; ++i) {
    svetores.push(vetores[solucao.i[i]])
  }
  return svetores
}

export async function compilar (solucao, vetores) {
  const compilada = []
  for (let i=0; i<solucao.i.length; ++i) {
    compilada.push(vetores[solucao.i[i]].compilado)
  }
  return compilada
}

function somarObjetos (objeto1, objeto2) {
  for (let i in objeto2) {
    if (objeto1.hasOwnProperty(i)) {
      objeto1[i] = objeto1[i] + objeto2[i]
    } else {
      objeto1[i] = objeto2[i]
    }
  }
  return objeto1
}