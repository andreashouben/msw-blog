import RickandmortyApiAdapter from "./index";

describe("Rick and Morty Api Adapter", () => {
  it("should give an object containing the count of pages and characters", async () => {
    const rickandmortyapiadapter = new RickandmortyApiAdapter();

    const numberOfPages = await rickandmortyapiadapter.counts();

    expect(numberOfPages).toEqual({
      pages: 2,
      characters: 6,
    });
  });

  it("should fetch the results for a page", async () => {
    const rickandmortyapiadapter = new RickandmortyApiAdapter();

    const page2 = await rickandmortyapiadapter.fetchResultsOfPage(2);

    expect(page2).toEqual(resultsOfPage2);
  });
});

const resultsOfPage2 = [
  {
    id: 4,
    name: "Morty’s Girlfriend",
    status: "Alive",
    species: "Human",
    gender: "Female",
    origin: {
      name: "Near-Duplicate Reality",
      url: "https://rickandmortyapi.com/api/location/104",
    },
    image: "https://rickandmortyapi.com/api/character/avatar/661.jpeg",
  },
  {
    id: 5,
    name: "Gaia",
    status: "Alive",
    species: "Planet",
    gender: "Female",
    origin: {
      name: "Gaia",
      url: "https://rickandmortyapi.com/api/location/106",
    },
    image: "https://rickandmortyapi.com/api/character/avatar/662.jpeg",
  },
  {
    id: 6,
    name: "Reggie",
    status: "Dead",
    species: "Mythological Creature",
    gender: "Male",
    location: {
      name: "Gaia",
      url: "https://rickandmortyapi.com/api/location/106",
    },
    image: "https://rickandmortyapi.com/api/character/avatar/663.jpeg",
  },
];
