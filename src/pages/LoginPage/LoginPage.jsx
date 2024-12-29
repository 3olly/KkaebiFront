import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import GlobalStyle from "../../style/GlobalStyle";
import LoginKkaebi from "../../images/LoginKkaebi.svg";
import LoginIcon from "../../components/LoginIcon.jsx";

const LoginPage = () => {
  const [adjustedMargin, setAdjustedMargin] = useState(85);
  const navigate = useNavigate();

  const loginKakao = () => {
    window.location.href = process.env.REACT_APP_KAKAO_AUTH_URL;
  };

  useEffect(() => {
    const totalHeight = document.body.scrollHeight;
    const windowHeight = window.innerHeight;
    if (totalHeight > windowHeight) {
      const marginAdjustment = totalHeight - windowHeight;
      setAdjustedMargin(85 - marginAdjustment);
    }
  }, []);

  return (
    <>
      <GlobalStyle />
      <Container>
        <TopSection>
          <Title>
            우리집이
            <br />
            깨끗한 비결,
            <Highlight>깨비</Highlight>
          </Title>
        </TopSection>
        <Bottom>
          <CharacterImage src={LoginKkaebi} alt="깨비 캐릭터" />
        </Bottom>
        <LoginButtons adjustedMargin={adjustedMargin}>
          {/* <NaverLoginButton onClick={() => navigate("/signupintro")}>
            <LoginIcon name="naver" />
            <span>네이버 로그인</span>
          </NaverLoginButton> */}
          <KakaoLoginButton onClick={loginKakao}>
            <LoginIcon name="kakao" />
            <span>카카오 로그인</span>
          </KakaoLoginButton>
          {/* <GoogleLoginButton>
            <LoginIcon name="google" />
            <span>구글 로그인</span>
          </GoogleLoginButton> */}
        </LoginButtons>
      </Container>
    </>
  );
};

export default LoginPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fafafa;
  min-height: 100vh;
  padding-left: 20px;
  padding-right: 20px;
`;

const TopSection = styled.div`
  margin-top: 50px;
`;

const Title = styled.h1`
  color: #000;
  font-family: Pretendard;
  font-size: 32px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.5px;
  display: flex;
  flex-direction: column;
  margin: 0px;
`;

const Highlight = styled.span`
  margin-top: 16px;
  color: #aa91e8;
  font-family: Pretendard;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;
  letter-spacing: -0.5px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CharacterImage = styled.img`
  width: 250.878px;
  height: 165.78px;
  transform: rotate(-10.763deg);
`;

const LoginButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: ${(props) => props.adjustedMargin}px;
  margin-top: 50px;
`;

{
  /* 
const NaverLoginButton = styled.button`
  display: flex;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border-radius: 11px;
  background: #03c75a;
  border: none;
  cursor: pointer;
  color: #fff;
  font-family: Poppins;
  font-size: 16px;
`; */
}

const KakaoLoginButton = styled.button`
  display: flex;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border-radius: 11px;
  background: #fee500;
  border: none;
  cursor: pointer;
  color: #000;
  font-family: Poppins;
  font-size: 16px;
`;

{
  /*
const GoogleLoginButton = styled.button`
  display: flex;
  padding: 16px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border-radius: 11px;
  border: 1px solid #cecece;
  background: #fff;
  cursor: pointer;
  color: #000;
  font-family: Poppins;
  font-size: 16px;
`; */
}
