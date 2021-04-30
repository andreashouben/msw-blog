class CharacterwheelService {
  #lastPage;
  #api;
  #currentCharIndex;
  #currentPage;
  #currentPageResults;

  constructor(api) {
    this.#api = api;
  }

  init = async () => {
    this.#currentCharIndex = 0;
    this.#currentPage = 1;
    this.#lastPage = (await this.#api.counts()).pages;
    await this.#updatePage();
  };

  #updatePage = async () => {
    this.#currentPageResults = await this.#api.fetchResultsOfPage(
      this.#currentPage
    );
  };

  #raisePage = async () => {
    this.#currentPage =
      this.#currentPage === this.#lastPage ? 1 : this.#currentPage + 1;
    await this.#updatePage();
  };

  #lowerPage = async () => {
    this.#currentPage =
      this.#currentPage === 1 ? this.#lastPage : this.#currentPage - 1;
    await this.#updatePage();
  };

  #lastCharIndex = () => this.#currentPageResults.length - 1;

  #raiseCharIndex = async () => {
    let nextCharIndex = this.#currentCharIndex + 1;
    if (nextCharIndex > this.#lastCharIndex()) {
      await this.#raisePage();
      nextCharIndex = 0;
    }
    this.#currentCharIndex = nextCharIndex;
  };

  #lowerCharIndex = async () => {
    let nextCharIndex = this.#currentCharIndex - 1;
    if (nextCharIndex < 0) {
      await this.#lowerPage();
      nextCharIndex = this.#lastCharIndex();
    }
    this.#currentCharIndex = nextCharIndex;
  };

  currentChar = () => {
    return this.#currentPageResults[this.#currentCharIndex];
  };

  nextChar = async () => {
    await this.#raiseCharIndex();

    return this.currentChar();
  };

  prevChar = async () => {
    await this.#lowerCharIndex();

    return this.currentChar();
  };
}

export default CharacterwheelService;
