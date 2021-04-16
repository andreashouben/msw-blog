import { CharacterWheel } from "./characterWheel";

export default {
  title: "CharacterWheel",
  component: CharacterWheel,
};

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

const Template = (args) => <CharacterWheel {...args} />;

export const Default = Template.bind({});
Default.args = {
  currentCharacter: morty,
  onClickNext: () => console.log("Next was clicked"),
  onClickPrev: () => console.log("Previous was clicked"),
};
