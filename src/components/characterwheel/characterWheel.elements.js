import styled from "styled-components";

export const CharacterWheelDiv = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 650px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  margin-top: 1em;
  justify-content: ${(props) =>
    props.alignRight ? "flex-end" : "space-between"};
`;

export const Button = styled.button`
  width: 10em;
  height: 3em;
  border: 1px solid black;
  border-radius: 0.5em;
  background: none;
  outline: none;
  &:hover {
    background: aliceblue;
  }
  &:active {
    background: lightblue;
  }
`;
