import { createGlobalStyle } from "styled-components";
import "../fonts/Pretendard.css";
import "../style/reset.css";

const GlobalStyle = createGlobalStyle`
  

  :root {
    --vh: 100%;
    margin: 0 auto;
    /*max-width: 390px;*/
    box-sizing: border-box;
    font-family: 'Pretendard';
    background-color: #fafafa;
  }
`;

export default GlobalStyle;
