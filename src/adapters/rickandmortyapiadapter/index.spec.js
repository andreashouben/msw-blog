import RickandmortyApiAdapter from "./index";

describe("Rick and Morty Api Adapter", () => {
  it("should give an object containing the count of pages and characters", async () => {
    const rickandmortyapiadapter = new RickandmortyApiAdapter();

    const numberOfPages = await rickandmortyapiadapter.counts();

    expect(numberOfPages).toEqual({
      pages: 34,
      characters: 671,
    });
  });

  it("should fetch the results for a page", async () => {
    const rickandmortyapiadapter = new RickandmortyApiAdapter();

    const page34 = await rickandmortyapiadapter.fetchResultsOfPage(34);

    expect(page34).toEqual(pageContentOfPage34.results);
  });
});
const pageContentOfPage34 = {
  info: {
    count: 671,
    pages: 34,
    next: null,
    prev: "https://rickandmortyapi.com/api/character?page=33",
  },
  results: [
    {
      id: 661,
      name: "Morty’s Girlfriend",
      status: "Alive",
      species: "Human",
      type: "",
      gender: "Female",
      origin: {
        name: "Near-Duplicate Reality",
        url: "https://rickandmortyapi.com/api/location/104",
      },
      location: {
        name: "Merged Universe",
        url: "https://rickandmortyapi.com/api/location/103",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/661.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/39"],
      url: "https://rickandmortyapi.com/api/character/661",
      created: "2020-08-13T11:27:29.357Z",
    },
    {
      id: 662,
      name: "Gaia",
      status: "Alive",
      species: "Planet",
      type: "",
      gender: "Female",
      origin: {
        name: "Gaia",
        url: "https://rickandmortyapi.com/api/location/106",
      },
      location: {
        name: "Gaia",
        url: "https://rickandmortyapi.com/api/location/106",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/662.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/40"],
      url: "https://rickandmortyapi.com/api/character/662",
      created: "2020-08-13T11:43:23.485Z",
    },
    {
      id: 663,
      name: "Reggie",
      status: "Dead",
      species: "Mythological Creature",
      type: "Zeus",
      gender: "Male",
      origin: {
        name: "Mount Olympus",
        url: "https://rickandmortyapi.com/api/location/90",
      },
      location: {
        name: "Gaia",
        url: "https://rickandmortyapi.com/api/location/106",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/663.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/40"],
      url: "https://rickandmortyapi.com/api/character/663",
      created: "2020-08-13T12:17:15.344Z",
    },
    {
      id: 664,
      name: "Ticktock",
      status: "unknown",
      species: "Humanoid",
      type: "Clay-Person",
      gender: "Genderless",
      origin: {
        name: "Gaia",
        url: "https://rickandmortyapi.com/api/location/106",
      },
      location: {
        name: "Gaia",
        url: "https://rickandmortyapi.com/api/location/106",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/664.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/40"],
      url: "https://rickandmortyapi.com/api/character/664",
      created: "2020-08-13T12:36:16.345Z",
    },
    {
      id: 665,
      name: "Florflock",
      status: "Alive",
      species: "Humanoid",
      type: "Clay-Person",
      gender: "Genderless",
      origin: {
        name: "Gaia",
        url: "https://rickandmortyapi.com/api/location/106",
      },
      location: {
        name: "Gaia",
        url: "https://rickandmortyapi.com/api/location/106",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/665.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/40"],
      url: "https://rickandmortyapi.com/api/character/665",
      created: "2020-08-13T12:37:08.881Z",
    },
    {
      id: 666,
      name: "Squeeb",
      status: "Alive",
      species: "Humanoid",
      type: "Clay-Person",
      gender: "Genderless",
      origin: {
        name: "Gaia",
        url: "https://rickandmortyapi.com/api/location/106",
      },
      location: {
        name: "Gaia",
        url: "https://rickandmortyapi.com/api/location/106",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/666.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/40"],
      url: "https://rickandmortyapi.com/api/character/666",
      created: "2020-08-13T12:37:51.742Z",
    },
    {
      id: 667,
      name: "Defiance Beth",
      status: "Alive",
      species: "Human",
      type: "",
      gender: "Female",
      origin: {
        name: "Earth (Replacement Dimension)",
        url: "https://rickandmortyapi.com/api/location/20",
      },
      location: {
        name: "Earth (Replacement Dimension)",
        url: "https://rickandmortyapi.com/api/location/20",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/667.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/41"],
      url: "https://rickandmortyapi.com/api/character/667",
      created: "2020-08-13T12:48:55.885Z",
    },
    {
      id: 668,
      name: "Defiance Squanchette",
      status: "Alive",
      species: "Alien",
      type: "Cat-Person",
      gender: "Female",
      origin: {
        name: "Planet Squanch",
        url: "https://rickandmortyapi.com/api/location/35",
      },
      location: {
        name: "Defiance's Ship",
        url: "https://rickandmortyapi.com/api/location/107",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/668.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/41"],
      url: "https://rickandmortyapi.com/api/character/668",
      created: "2020-08-13T12:52:36.873Z",
    },
    {
      id: 669,
      name: "Defiance Doctor",
      status: "Alive",
      species: "Alien",
      type: "",
      gender: "Male",
      origin: { name: "unknown", url: "" },
      location: {
        name: "Defiance's Base",
        url: "https://rickandmortyapi.com/api/location/108",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/669.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/41"],
      url: "https://rickandmortyapi.com/api/character/669",
      created: "2020-08-13T12:55:37.437Z",
    },
    {
      id: 670,
      name: "New Improved Galactic Federation Guard",
      status: "Dead",
      species: "Alien",
      type: "Gromflomite",
      gender: "Male",
      origin: {
        name: "Gromflom Prime",
        url: "https://rickandmortyapi.com/api/location/19",
      },
      location: {
        name: "NX-5 Planet Remover",
        url: "https://rickandmortyapi.com/api/location/105",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/670.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/41"],
      url: "https://rickandmortyapi.com/api/character/670",
      created: "2020-08-13T12:56:31.130Z",
    },
    {
      id: 671,
      name: "New Improved Galactic Federation Guard",
      status: "Dead",
      species: "Alien",
      type: "Gromflomite",
      gender: "Male",
      origin: {
        name: "Gromflom Prime",
        url: "https://rickandmortyapi.com/api/location/19",
      },
      location: {
        name: "NX-5 Planet Remover",
        url: "https://rickandmortyapi.com/api/location/105",
      },
      image: "https://rickandmortyapi.com/api/character/avatar/671.jpeg",
      episode: ["https://rickandmortyapi.com/api/episode/41"],
      url: "https://rickandmortyapi.com/api/character/671",
      created: "2020-08-13T12:57:08.113Z",
    },
  ],
};
