import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

*{
    margin:0;
    padding:0;
    box-sizing: border-box;
    outline: none;
    text-decoration: none;   
    font-family: 'Press Start 2P', sans-serif;
    list-style-type: none;
}
body {    
    color: yellow;
      }`;

export default GlobalStyles;
