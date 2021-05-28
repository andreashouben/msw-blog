import { rest } from "msw";

export const handlers = [
  rest.get("https://rickandmortyapi.com/api/character", (req, res, ctx) => {
    const page = Number.parseInt(req.url.searchParams.get("page")) - 1 || 0;

    return res(ctx.status(200), ctx.json(pages[page]));
  }),
];

const pages = [
  {
    info: {
      pages: 2,
      count: 6,
      next: "https://rickandmortyapi.com/api/character?page=2",
      prev: null,
    },
    results: [
      {
        id: 1,
        name: "Rick Sanchez",
        status: "Alive",
        species: "Human",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
      },
      {
        id: 2,
        name: "Morty Smith",
        status: "Alive",
        species: "Human",
        gender: "Male",
        origin: {
          name: "Earth (C-137)",
          url: "https://rickandmortyapi.com/api/location/1",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
      },
      {
        id: 3,
        name: "Summer Smith",
        status: "Alive",
        species: "Human",
        type: "",
        gender: "Female",
        origin: {
          name: "Earth (Replacement Dimension)",
          url: "https://rickandmortyapi.com/api/location/20",
        },
        image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
      },
    ],
  },

  {
    info: {
      pages: 2,
      count: 6,
      next: null,
      prev: "https://rickandmortyapi.com/api/character?page=2",
    },
    results: [
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
    ],
  },
];
