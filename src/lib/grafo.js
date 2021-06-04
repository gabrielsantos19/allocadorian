import * as Solucao from 'src/lib/solucao.js'
import * as Obrigatoriedades from 'src/lib/obrigatoriedades.js'


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