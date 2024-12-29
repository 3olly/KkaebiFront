import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import GlobalStyle from "../../style/GlobalStyle";
import SignupIntroComment from "../../images/SignupIntroComment.svg";
import SignupIntroKkaebi from "../../images/SignupIntroKkaebi.svg";

const SignupIntroPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signupname");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Comment src={SignupIntroComment} alt="깨비 말풍선" />
        <Character src={SignupIntroKkaebi} alt="깨비 캐릭터" />
      </Container>
    </>
  );
};

export default SignupIntroPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  background: #fafafa;
  position: relative;
  overflow: hidden;
`;

const Character = styled.img`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: auto;
  max-height: 100vh;
  object-fit: contain;

  @media (min-height: 800px) {
    bottom: 0px;
  }
`;

const Comment = styled.img`
  margin: 0;
  padding: 0;
  z-index: 1;
  margin-top: 233px;
  position: relative;
`;
