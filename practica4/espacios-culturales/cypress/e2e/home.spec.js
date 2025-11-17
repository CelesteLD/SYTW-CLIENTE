describe("Página principal - listado de espacios", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Carga la página y muestra tarjetas", () => {
    cy.contains("Portal de espacios culturales").should("be.visible");
    cy.get(".cards").should("exist");
    cy.get("[data-cy=card-link]").its("length").should("be.gte", 1);
  });

  it("La primera tarjeta tiene un link válido a /espacios/:id/", () => {
    cy.get("[data-cy=card-link]").first().should("have.attr", "href").and((href) => {
      expect(href).to.match(/\/espacios\/\d+\/$/);
    });
  });
});
