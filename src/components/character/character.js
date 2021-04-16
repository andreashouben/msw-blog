import React from "react";
import {
  Bio,
  CharacterDiv,
  Image,
  Label,
  LabelKey,
  LabelVal,
} from "./character.elements";

const Character = ({ bio }) => {
  return (
    <CharacterDiv>
      <Image src={bio.image} alt={`${bio.name}`} />
      <Bio>
        <Label>
          <LabelKey>Name:</LabelKey> <LabelVal>{bio.name}</LabelVal>
        </Label>
        <Label>
          <LabelKey>Status:</LabelKey> <LabelVal>{bio.status}</LabelVal>
        </Label>
        <Label>
          <LabelKey>Species:</LabelKey> <LabelVal>{bio.species}</LabelVal>
        </Label>
        <Label>
          <LabelKey>Gender:</LabelKey> <LabelVal>{bio.gender}</LabelVal>
        </Label>
        <Label>
          <LabelKey>Origin:</LabelKey> <LabelVal>{bio.origin.name}</LabelVal>
        </Label>
      </Bio>
    </CharacterDiv>
  );
};

export default Character;
