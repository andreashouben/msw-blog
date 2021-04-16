import styled from "styled-components";

export const CharacterDiv = styled.div.attrs((props) => ({
  role: "figure",
  "aria-label": `Avatar of ${props.name}`,
}))`
  display: flex;
`;
export const Image = styled.img`
  width: 250px;
  height: 250px;
`;
export const Bio = styled.ul`
  list-style-type: none;
`;
export const Label = styled.li``;
export const LabelKey = styled.div`
  font-weight: bold;
  width: 100px;
  display: inline-block;
`;
export const LabelVal = styled.span``;
