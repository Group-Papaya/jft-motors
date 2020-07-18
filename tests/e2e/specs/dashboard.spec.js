// https://docs.cypress.io/api/introduction/api.html

describe("Dashboard", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
  });

  it("Visits the profile page", () => {
    cy.visit("/profile");
    cy.get("[data-cy=user-full-name]").contains("Alex Johnson");
  });
});
