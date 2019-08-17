/// <reference types="cypress" />>
// @ts-check

before(() => {
  cy.visit('http://localhost:4200/login');
});

describe('A login screen', () => {

  beforeEach(() => {
    // create alias for login route
    cy.server().route('POST', '/api/login').as('loginRoute');
  });

  it('should fill an incorrect login details and show error message.', () => {
    // type email
    cy.get('form mat-form-field input')
      .first()
      .type('Ferko@mrkvicka.com');

    // type password
    cy.get('form mat-form-field input')
      .last()
      .type('1234');

    // submit a form
    cy.get('form').submit();

    // wait until login request finishes
    cy.wait(['@loginRoute']);

    // error message should be visible
    cy.get('.error').should('be.visible');
  });

  it('should fill a login details redirect to dashboard page', () => {
    // type email
    cy.get('form mat-form-field input')
      .first()
      .clear()
      .type('xvyskoca');

    // type password
    cy.get('form mat-form-field input')
      .last()
      .clear()
      .type('RbR4j1en546713.');

    // submit a form
    cy.get('form').submit();

    // wait until login request finishes
    cy.wait(['@loginRoute']);

    // check if I am redirected on dashboard
    // TODO
  });

});
