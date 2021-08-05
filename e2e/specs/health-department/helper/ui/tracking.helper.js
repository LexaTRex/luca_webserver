export const setDatePickerTime = () => {
    cy.get('.ant-picker-dropdown').not('.ant-picker-dropdown-hidden').should('exist').within(() => {
        cy.get('.ant-picker-time-panel-cell').eq(0).click().type('{enter}');
    });
};

export const setDatePickerStartDate = (startDate) => {
    cy.get('#startDate').should('exist').should('be.visible').click().type(`${startDate}{enter}`);
    cy.get('#startTime').should('exist').should('be.visible').click();
    setDatePickerTime();
};

export const setDatePickerEndDate = (endDate) => {
    cy.get('#endDate').should('exist').click({ force: true }).type(`${endDate}{enter}`);
    cy.get('#endTime').should('exist').click();
    setDatePickerTime();
};