import React from "react";
import Character from "../character/character";
import {
  Button,
  ButtonGroup,
  CharacterWheelDiv,
  NavButtons,
} from "./characterWheel.elements";

export const CharacterWheel = ({
  currentCharacter,
  onClickNext,
  onClickPrev,
}) => {
  return (
    <CharacterWheelDiv>
      <Character bio={currentCharacter} />
      <ButtonGroup>
        <Button onClick={() => onClickPrev()}>Previous</Button>
        <Button onClick={() => onClickNext()}>Next</Button>
      </ButtonGroup>
    </CharacterWheelDiv>
  );
};
