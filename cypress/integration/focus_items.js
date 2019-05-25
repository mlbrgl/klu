describe('Focus items', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Creates a new focus item from the quick entry', () => {
    cy.get('[data-test=quick-entry]').type('New item{enter}');
    cy.get('[contenteditable]')
      .first()
      .should('have.text', 'New item');
  });

  it('Deletes an item', () => {
    cy.get('[data-test=quick-entry]').type('New item{enter}');
    cy.get('[data-test=quick-entry]').type('Delete me{enter}');
    cy.get('[contenteditable]')
      .contains('Delete me')
      .type('{cmd}{backspace}')
      .type('{enter}');

    cy.get('[contenteditable]')
      .first()
      .should('have.text', 'New item');
  });

  it('Focuses on an item, deletes it then delete the last item', () => {
    cy.get('[contenteditable]')
      .first()
      .as('firstContentEditable')
      .type('Item 1');
    cy.get('[data-test=quick-entry]').type('Item 2{enter}');

    // Focus on Item 2
    cy.get('@firstContentEditable').type('{enter}');
    cy.contains('Item 1').should('not.exist');

    // Delete focused Item 2
    cy.get('@firstContentEditable')
      .type('{cmd}{backspace}')
      .type('{enter}');
    cy.get('@firstContentEditable').should('have.text', 'Item 1');

    // Check still focusing
    cy.get('[data-test=quick-entry]').should('not.exist');

    // Delete the last item
    cy.get('@firstContentEditable')
      .type('{cmd}{backspace}')
      .type('{enter}');

    // Check not focusing
    cy.get('[data-test=quick-entry]');

    // Check no items
    cy.get('[contenteditable]').should('not.exist');
  });
});
