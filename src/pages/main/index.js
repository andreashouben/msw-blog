import React, { useCallback, useEffect, useState } from "react";
import { CharacterWheel } from "../../components/characterwheel/characterWheel";

const Main = () => {
  const [characters, setCharacters] = useState([]);
  const [nextPage, setNextPage] = useState(undefined);
  const [prevPage, setPrevPage] = useState(undefined);

  const [index, setIndex] = useState(0);

  const fetchPage = useCallback(
    async (page) => {
      const response = await fetch(page);
      const data = await response.json();
      setCharacters(data.results);
      setNextPage(data.info.next);
      setPrevPage(data.info.prev);
    },
    [setCharacters, setNextPage, setPrevPage]
  );

  useEffect(() => {
    const fetchCharacters = async () => {
      await fetchPage("https://rickandmortyapi.com/api/character");
    };
    fetchCharacters();
  }, [fetchPage]);

  const currentChar = characters[index];

  const next = async () => {
    if (!characters[index + 1]) {
      await fetchPage(nextPage);
      setIndex(0);
    } else {
      setIndex((index) => index + 1);
    }
  };
  const prev = async () => {
    if (index === 0) {
      await fetchPage(prevPage);
      setIndex(characters.length - 1);
    } else {
      setIndex((index) => index - 1);
    }
  };

  const hasNext = characters[index + 1] || nextPage;
  const hasPrev = characters[index - 1] || prevPage;

  return (
    <>
      {currentChar && (
        <CharacterWheel
          currentCharacter={currentChar}
          onClickNext={hasNext && (() => next())}
          onClickPrev={hasPrev && (() => prev())}
        />
      )}
    </>
  );
};

export default Main;
