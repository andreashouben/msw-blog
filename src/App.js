import "./App.css";
import Main from "./pages/main";
import ram from "./ram.png";
import styled from "styled-components";

const Background = styled.img`
  height: 200px;
  position: fixed;
  bottom: 1vh;
  right: 10px;
`;

const App = () => (
  <>
    <h1>Magnificent Rick & Morty Character Wheel</h1>
    <Main />
    <Background src={ram} />
  </>
);

export default App;
