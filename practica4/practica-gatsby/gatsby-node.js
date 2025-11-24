/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  // 1. Descargar los datos de tu API
  const response = await fetch("https://cdn.jsdelivr.net/gh/celesteld/espacios-culturales-api@main/db.json")
  const data = await response.json()
  
  // El JSON tiene la estructura { "espacios": [...] }, así que accedemos al array
  const espacios = data.espacios

  // 2. Crear un "nodo" de Gatsby por cada espacio cultural
  espacios.forEach(espacio => {
    const node = {
      ...espacio, // Copiamos todos los campos de la API (nombre, id, imagen, etc.)
      
      // Estos campos son obligatorios para Gatsby:
      id: createNodeId(`EspacioCultural-${espacio.id}`), // ID único interno
      parent: null,
      children: [],
      internal: {
        type: "EspacioCultural", // Este será el nombre en GraphQL
        contentDigest: createContentDigest(espacio),
      },
    }

    createNode(node)
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const path = require("path") 

  // 1. Consultar los espacios. 
  // Pedimos el 'id' (interno) y también 'espacio_cultural_id' (el número del JSON)
  const result = await graphql(`
    query {
      allEspacioCultural {
        nodes {
          id 
          espacio_cultural_id 
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const plantilla = path.resolve(`src/templates/plantilla-espacio.js`)

  result.data.allEspacioCultural.nodes.forEach(node => {
    createPage({
      // Usamos el ID del JSON para la URL (ej: /espacio/6)
      path: `/espacio/${node.espacio_cultural_id}`, 
      
      component: plantilla,
      
      // aquí pasamos el ID interno para que la plantilla encuentre los datos rápido
      context: {
        id: node.id, 
      },
    })
  })
}