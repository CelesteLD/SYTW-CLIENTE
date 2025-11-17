describe("Navegación: listado → detalle", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Al clicar la primera tarjeta se muestra la página de detalle con título y horario", () => {
    // Asegurarse de que existe al menos una tarjeta
    cy.get("[data-cy=card-link]").should("have.length.gte", 1);

    // Clicar y navegar
    cy.get("[data-cy=card-link]").first().click();

    // La url debe contener /espacios/
    cy.url().should("include", "/espacios/");

    // El título y el horario deben mostrarse
    cy.get("[data-cy=espacio-title]").should("be.visible").and((el) => {
      expect(el.text().length).to.be.greaterThan(3);
    });

    cy.get("[data-cy=espacio-horario]").should("be.visible");
  });
});
