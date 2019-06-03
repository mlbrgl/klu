describe('Projects', () => {
  beforeEach(() => {
    cy.visit('/');
    indexedDB.deleteDatabase('localforage');
  });

  it('Selects focus items from the right project', () => {
    const nbItems = 5;
    for (let projectIdx = 1; projectIdx <= 2; projectIdx += 1) {
      for (let itemIdx = 1; itemIdx <= nbItems; itemIdx += 1) {
        cy.get('[data-test=quick-entry]').type(`Item ${itemIdx} +p${projectIdx}{enter}`);
      }
    }
    cy.contains('Projects').click();
    cy.contains('p1')
      .find('.icon-circle-with-plus')
      .as('p1Inc');

    for (let clickIdx = 1; clickIdx <= nbItems; clickIdx += 1) {
      cy.get('@p1Inc').click();
    }

    cy.contains('next up').click();
    for (let itemIdx = 1; itemIdx <= nbItems; itemIdx += 1) {
      cy.contains('p1');
      cy.contains('did it').click();
    }

    cy.get('[data-test=project]')
      .first()
      .find('.icon-circle-with-plus')
      .should('not.exist');
  });
});
