describe('Landing page', () => {
  it('shows hero CTA', () => {
    cy.visit('/');
    cy.contains('Schedule smarter pickups').should('be.visible');
  });
});
