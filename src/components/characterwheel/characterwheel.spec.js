import { render, screen } from "@testing-library/react";
import { CharacterWheel } from "./characterWheel";
import Character from "../character/character";
import userEvent from "@testing-library/user-event";

describe("Character Wheel", () => {
  const morty = {
    id: 2,
    name: "Morty Smith",
    status: "Alive",
    species: "Human",
    gender: "Male",
    origin: {
      name: "Earth",
      url: "https://rickandmortyapi.com/api/location/1",
    },
    image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
  };

  it("should display the passed character", () => {
    render(<CharacterWheel currentCharacter={morty} />);

    expect(
      screen.getByRole("figure", { name: "Avatar of Morty Smith" })
    ).toBeVisible();
  });

  it("should show a next button", () => {
    render(<CharacterWheel currentCharacter={morty} />);

    expect(screen.getByRole("button", { name: "Next" })).toBeVisible();
  });

  it("should show a previous button", () => {
    render(<CharacterWheel currentCharacter={morty} />);

    expect(screen.getByRole("button", { name: "Previous" })).toBeVisible();
  });

  it("should fire an event when the 'Next' Button was presssed", () => {
    const onClickNext = jest.fn();
    render(
      <CharacterWheel currentCharacter={morty} onClickNext={onClickNext} />
    );

    userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(onClickNext).toHaveBeenCalled();
  });

  it("should fire an event when the 'Previous' Button was presssed", () => {
    const onClickPrev = jest.fn();
    render(
      <CharacterWheel currentCharacter={morty} onClickPrev={onClickPrev} />
    );

    userEvent.click(screen.getByRole("button", { name: "Previous" }));

    expect(onClickPrev).toHaveBeenCalled();
  });
});
