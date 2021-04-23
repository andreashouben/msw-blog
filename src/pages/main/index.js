import React, { useCallback, useEffect, useState } from "react";
import { CharacterWheel } from "../../components/characterwheel/characterWheel";
import Characterwheel from "../../model/characterwheel";

const Main = () => {
  const [wheel] = useState(new Characterwheel());
  const [currentChar, setCurrentChar] = useState(undefined);

  const init = useCallback(async () => {
    await wheel.init();
    setCurrentChar(await wheel.currentChar());
  }, [setCurrentChar]);

  useEffect(() => {
    init();
  }, [init]);

  const next = async () => {
    setCurrentChar(await wheel.nextChar());
  };
  const prev = async () => {
    setCurrentChar(await wheel.prevChar());
  };

  return (
    <>
      {currentChar && (
        <CharacterWheel
          currentCharacter={currentChar}
          onClickNext={() => next()}
          onClickPrev={() => prev()}
        />
      )}
    </>
  );
};

export default Main;
