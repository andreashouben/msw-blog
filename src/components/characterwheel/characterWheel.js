import React from "react";
import Character from "../character/character";
import {
  Button,
  ButtonGroup,
  CharacterWheelDiv,
} from "./characterWheel.elements";

export const CharacterWheel = ({
  currentCharacter,
  onClickNext,
  onClickPrev,
}) => {
  return (
    <CharacterWheelDiv>
      <Character bio={currentCharacter} />
      <ButtonGroup alignRight={!onClickPrev}>
        {onClickPrev && <Button onClick={() => onClickPrev()}>Previous</Button>}
        {onClickNext && <Button onClick={() => onClickNext()}>Next</Button>}
      </ButtonGroup>
    </CharacterWheelDiv>
  );
};
