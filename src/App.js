import "./App.css";
import Main from "./pages/main";
import ram from "./ram.png";
import styled from "styled-components";

const Background = styled.img`
  height: 200px;
  position: absolute;
  bottom: 1vh;
  right: 10px;
  transition: bottom 0.1s,right 0.1s;
  @media(max-width:1000px) and (max-height:850px){
    right: -150px;
    bottom: -200px;
    transition: right 0.1s, bottom 0.1s;   
 } 
`;

const App = () => (
    <>
        <h1>Magnificent Rick & Morty Character Wheel</h1>
        <Main/>
        <Background src={ram}/>
    </>
);

export default App;
