import { browser, element, by } from 'protractor';

export class ProficientTSPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('pts-root h1')).getText();
  }
}
