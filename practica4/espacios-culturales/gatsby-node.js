const path = require("path");

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, reporter }) => {
  const { createNode } = actions;
  const apiUrl = process.env.SPACES_API || "https://cdn.jsdelivr.net/gh/celesteld/espacios-culturales-api@main/db.json";

  reporter.info(`Fetching espacios from ${apiUrl}`);
  const res = await fetch(apiUrl);
  if (!res.ok) {
    reporter.panicOnBuild(`Error fetching ${apiUrl}: ${res.statusText}`);
    return;
  }

  const json = await res.json();
  // Según tu db.json la raíz contiene { "espacios": [...] }
  const spaces = json.espacios || json.spaces || [];

  spaces.forEach(space => {
    // conserva el id original en espacio_id para evitar colisiones con el node id
    const nodeData = {
      ...space,
      espacio_id: String(space.id ?? space.espacio_cultural_id ?? ""),
      // crea un id de nodo único
      id: createNodeId(`espacio-${space.id || space.espacio_cultural_id}`),
      parent: null,
      children: [],
      internal: {
        type: "Espacio",
        content: JSON.stringify(space),
        contentDigest: createContentDigest(space)
      }
    };
    createNode(nodeData);
  });
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const template = path.resolve(`src/templates/espacio-template.js`);

  const result = await graphql(`
    query {
      allEspacio {
        nodes {
          espacio_id
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Error consultando Espacios", result.errors);
    return;
  }

  const nodes = result.data.allEspacio.nodes;
  nodes.forEach(n => {
    createPage({
      path: `/espacios/${n.espacio_id}`,
      component: template,
      context: { espacio_id: n.espacio_id }
    });
  });
};

