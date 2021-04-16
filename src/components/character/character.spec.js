import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Character from "./character";

describe("Character", () => {
  describe("given a single Character", () => {
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

    beforeEach(() => {
      render(<Character bio={morty} />);
    });

    it("should display the image of the character with the character name as alt text", () => {
      const image = screen.getByAltText(/Morty Smith/i);

      expect(image.src).toEqual(morty.image);
    });

    test.each([
      ["Name", "Morty Smith"],
      ["Status", "Alive"],
      ["Species", "Human"],
      ["Gender", "Male"],
      ["Origin", "Earth"],
    ])("should show a label %s with value %s", (label, value) => {
      const text = screen.getByText((content, node) => {
        const hasText = (node) => node.textContent === `${label}: ${value}`;
        const nodeHasText = hasText(node);
        const childrenDontHaveText = Array.from(node.children).every(
          (child) => !hasText(child)
        );

        return nodeHasText && childrenDontHaveText;
      });

      expect(text).toBeVisible();
    });

    it('should have the aria role "figure" labeled with "Avatar of Morty Smith"', () => {
      screen.getByRole("figure", { name: "Avatar of Morty Smith" });
    });
  });
});
