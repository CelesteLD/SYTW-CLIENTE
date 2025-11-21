describe('Test de Espacios Culturales', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:8000/')
  })

  it('Prueba 1: La portada carga correctamente', () => {
    cy.get('h1').should('contain', 'Espacios Culturales')
    cy.get('main').find('img').should('have.length.at.least', 1)
  })

  it('Prueba 2: Navegación a un detalle e interacción', () => {
    // 1. Navegar
    cy.contains('Ver detalles').first().click()

    // 2. Verificar URL y Título
    cy.url().should('include', '/espacio/')
    cy.get('h1').should('exist')
     
    // Buscamos el texto inicial del componente de valoración
    cy.contains('Haz clic en las estrellas para valorar').should('be.visible')

    // Buscamos la primera estrella y hacemos clic en ella
    cy.get('div').contains('★').click()

    // Verificamos que el texto cambia para dar las gracias
    // Esto confirma que tu useState y localStorage están funcionando
    cy.contains('Gracias por tu voto').should('be.visible')
  })
})