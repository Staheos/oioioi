/// <reference types="cypress" />

const PUBLIC_PAGES = ["/", "/problemset/"];
const ADMIN_PAGES = ["/", "/admin/"];

context("JavaScript errors", () => {
  PUBLIC_PAGES.forEach((url) => {
    it(`does not report errors on ${url}`, () => {
      visitAndCheckForJavaScriptErrors(url);
    });
  });

  context("as admin", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.hideDjangoToolbar();
      cy.fixture("credentials").then((data) => {
        cy.login(data.admin);
      });
    });

    ADMIN_PAGES.forEach((url) => {
      it(`does not report errors on ${url}`, () => {
        visitAndCheckForJavaScriptErrors(url);
      });
    });
  });
});

const visitAndCheckForJavaScriptErrors = (url: string) => {
  cy.visit(url, {
    onBeforeLoad(window) {
      cy.spy(window.console, "error").as("consoleError");
    },
  });
  cy.get("@consoleError").should("not.have.been.called");
};
