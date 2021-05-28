import CharacterwheelService from "./index";
import RickandmortyApiAdapter from "../../adapters/rickandmortyapiadapter";

describe("CharacterWheel", () => {
  const characterWheel = new CharacterwheelService(
    new RickandmortyApiAdapter()
  );

  describe("after initializing", () => {
    beforeEach(async () => {
      await characterWheel.init();
    });

    it("returns the character with id 1 when callling current() ", () => {
      const currentChar = characterWheel.currentChar();

      expect(currentChar).toEqual(characterWithId1);
    });

    it("returns the next character when calling next()", async () => {
      const nextChar = await characterWheel.nextChar();

      expect(nextChar).toEqual(characterWithId2);
    });

    it("returns the third character when calling next() twice", async () => {
      await characterWheel.nextChar();
      const thirdChar = await characterWheel.nextChar();

      expect(thirdChar).toEqual(characterWithId3);
    });

    it("returns the last character when calling prev()", async () => {
      let lastChar = await characterWheel.prevChar();

      expect(lastChar).toEqual(characterWithId6);
    });

    it("returns the first character when caling prev() and next()", async () => {
      await characterWheel.prevChar();
      const firstChar = await characterWheel.nextChar();

      expect(firstChar).toEqual(characterWithId1);
    });
  });
});

const characterWithId1 = {
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
};

const characterWithId2 = {
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
};

const characterWithId3 = {
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
};

const characterWithId6 = {
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
};
