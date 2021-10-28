export const shouldBeVisible = element => element.should('be.visible');

export const shouldNotExist = element => element.should('not.exist');

export const visit = url => cy.visit(url);
