import { createGlobalStyle } from "styled-components";
import "../fonts/Pretendard.css";
import "../style/reset.css";

const GlobalStyle = createGlobalStyle`
  

  :root {
    --vh: 100%;
    margin: 0 auto;
    
    box-sizing: border-box;
    font-family: 'Pretendard';
    background-color: #fafafa;
    min-width: 390px;
  }
`;

export default GlobalStyle;
