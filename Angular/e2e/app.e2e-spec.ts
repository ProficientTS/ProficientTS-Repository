import { ProficientTSPage } from './app.po';

describe('proficient-ts App', () => {
  let page: ProficientTSPage;

  beforeEach(() => {
    page = new ProficientTSPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('pts works!');
  });
});
