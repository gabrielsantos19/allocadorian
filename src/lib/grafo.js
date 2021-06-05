import * as Solucao from 'src/lib/solucao.js'
import * as Obrigatoriedades from 'src/lib/obrigatoriedades.js'
const Parallel = require('paralleljs')


export async function gerar (obrigatoriedades, vetores, conjuntos) {
  const grafo = []
  for (let i=0; i<vetores.length; ++i) {
    const lista = []
    for (let a=i+1; a<vetores.length; ++a) {
      const nova = {i: [i, a]}
      nova.compilada = await Solucao.compilar(nova, vetores)
      
      const retorno1 = await Solucao.filtrarSolucao(nova, vetores, conjuntos)
      const retorno2 = await Obrigatoriedades.filtrarParcial(nova, obrigatoriedades)
      if (retorno1.valor && retorno2.valor) {
        lista.push(a)
      }
    }
    lista.sort((a, b) => vetores[b].p - vetores[a].p)
    grafo.push(lista)
  }
  return grafo
}

// Função para gerar o grafo de maneira paralela
export async function Parallel_gerar (obrigatoriedades, vetores, conjuntos) {
  const obrigatoriedadesRaw = JSON.stringify(obrigatoriedades)
  const vetoresRaw = JSON.stringify(vetores)
  const conjuntosRaw = JSON.stringify(conjuntos, ['raw'])
  const particoes = [
    [0,4, obrigatoriedadesRaw, vetoresRaw, conjuntosRaw],
    [1,4, obrigatoriedadesRaw, vetoresRaw, conjuntosRaw],
    [2,4, obrigatoriedadesRaw, vetoresRaw, conjuntosRaw],
    [3,4, obrigatoriedadesRaw, vetoresRaw, conjuntosRaw]
  ]

  let p = new Parallel(particoes)

  let retorno = [[]]
  function sucesso (s) {
    retorno = s.flat()
  }
  function erro (e) {
    retorno = e
  }

  await p.map(gerarContido)
  .then(sucesso, erro)

  console.debug('Grafo: ', retorno)
  return retorno
}

// Essa função existe para possibilitar a geração do grafo em paralelo.
// Ela precisa ser um função sem dependências, por isso, funções que
// estão modularizadas em diversos arquivos foram copiadas e coladas
// como funções internas.
function gerarContido (data) {
  const obrigatoriedades = JSON.parse(data[2])
  const vetores = JSON.parse(data[3])
  const conjuntos = JSON.parse(data[4])
  
  for (let i=0; i<conjuntos.length; ++i) {
    const conjunto = conjuntos[i]
    conjuntos[i] = Conjuntoparse(JSON.parse(conjunto.raw))
  }

  const grafo = []

  const tamanhoParticao = Math.round(vetores.length / data[1])
  const inicial = data[0] * tamanhoParticao
  let final = inicial + tamanhoParticao
  if (final > vetores.length) {
    final = vetores.length
  }

  for (let i=inicial; i<final; ++i) {
    const lista = []
    for (let a=i+1; a<vetores.length; ++a) {
      const nova = {i: [i, a]}
      nova.compilada = compilar(nova, vetores)
      
      const retorno1 = filtrarSolucao(nova, vetores, conjuntos)
      const retorno2 = filtrarParcial(nova, obrigatoriedades)
      if (retorno1.valor && retorno2.valor) {
        lista.push(a)
      }
    }
    lista.sort((a, b) => vetores[b].p - vetores[a].p)
    grafo.push(lista)
  }

  return grafo




  // Funções de solucao.js
  function compilar (solucao, vetores) {
    const compilada = []
    for (let i=0; i<solucao.i.length; ++i) {
      compilada.push(vetores[solucao.i[i]].compilado)
    }
    return compilada
  }

  function filtrarSolucao(solucao, vetores, conjuntos) {
    for (let i=0; i<conjuntos.length; ++i) {
      const conjunto = conjuntos[i]
      const objetoBase = conjunto.objetoBase
      const retorno = ObjetofiltrarSolucao(null, objetoBase, solucao)
      if (!retorno.valor) {
        return retorno
      }
    }
    return {
      valor: true,
      erro: '',
    }
  }

  // Funções de objeto.js
  function ObjetofiltrarSolucao (objeto, base, solucao) {
    if (base.filtrarSolucao) {
      const retorno = base.filtrarSolucao(solucao)
      if (retorno !== undefined) {
        return {
          valor: retorno.valor,
          erro: retorno.erro,
        }
      }
    }
    return {
      valor: true,
      erro: '',
    }
  }

  // Funções de obrigatoriedades.js
  function filtrarParcial (nova, obrigatoriedades) {
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

  // Funções de conjunto.js
  function Conjuntoparse (obj) {
    return {
      descricao: JSPparse(obj.descricao),
      objetoBase: JSPparse(obj.objetoBase),
      objetos: obj.objetos.map(r => JSPparse(r)),
    }
  }

  // Funções de JSP.js
  function JSPparse (obj) {
    return Function('"use strict";return (' + obj + ')')()
  }
}