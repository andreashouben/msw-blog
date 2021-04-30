class RickandmortyApiAdapter {
  static #characterUrl = "https://rickandmortyapi.com/api/character";

  counts = async () => {
    const response = await fetch(RickandmortyApiAdapter.#characterUrl);
    const data = await response.json();
    const { count, pages } = data.info;
    return { pages, characters: count };
  };

  fetchResultsOfPage = async (page) => {
    const params = new URLSearchParams({ page });
    const response = await fetch(
      `${RickandmortyApiAdapter.#characterUrl}?${params}`
    );
    const data = await response.json();
    return data.results;
  };
}
export default RickandmortyApiAdapter;
