import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import confetti from "canvas-confetti";

import GlobalStyle from "../../style/GlobalStyle";
import SignupIntroComment from "../../images/SignupKkaebiComment.svg";
import SignupIntroKkaebi from "../../images/SignupIntroKkaebi.svg";

const SignupKkaebiCommentPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  // 컨페티 효과 실행 함수
  const fireConfetti = () => {
    if (canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, { resize: true });
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      console.error("Canvas is not initialized.");
    }
  };

  // 컨페티 실행 및 3초 후 페이지 전환
  useEffect(() => {
    fireConfetti();

    const timer = setTimeout(() => {
      navigate("/homemain");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Canvas ref={canvasRef} />
        <Comment src={SignupIntroComment} alt="깨비 말풍선" />
        <Character src={SignupIntroKkaebi} alt="깨비 캐릭터" />
      </Container>
    </>
  );
};

export default SignupKkaebiCommentPage;

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

const Canvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
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
