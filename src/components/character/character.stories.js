import Character from "./character";

export default {
  title: "Character",
  component: Character,
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

const Template = (args) => <Character {...args} />;

export const Default = Template.bind({});
Default.args = {
  bio: morty,
};
