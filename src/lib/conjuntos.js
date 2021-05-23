import * as Conjunto from 'src/lib/conjunto.js'


export async function parse (conjuntos) {
  let conjuntosParsed = []
  for (let i=0; i<conjuntos.length; ++i) {
    const parsed = Conjunto.parse(conjuntos[i])
    conjuntosParsed.push(parsed)
  }
  return conjuntosParsed
}