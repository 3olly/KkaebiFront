import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import GlobalStyle from "../../style/GlobalStyle";
import SignupBackBtn from "../../images/SignupBackBtn.svg";
import KkaebiProfileImg from "../../images/KkaebiProfile.svg";
import RedCImg from "../../images/character/피부미인.png";
import YellowCImg from "../../images/character/머리숱부자.png";
import BlackCImg from "../../images/character/핑크수집가.png";
import GreenCImg from "../../images/character/고민해결사.png";
import BlueCImg from "../../images/character/매듭의달인.png";

const characters = [
  { id: 1, src: RedCImg, label: "피부 미인" },
  { id: 2, src: YellowCImg, label: "머리숱 부자" },
  { id: 3, src: BlackCImg, label: "핑크 수집가" },
  { id: 4, src: GreenCImg, label: "고민 해결사" },
  { id: 5, src: BlueCImg, label: "매듭의 달인" },
];

const SignupNamePage = () => {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const translateXRef = useRef(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    translateXRef.current = e.clientX - startXRef.current;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    handleDragEnd();
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    translateXRef.current = e.touches[0].clientX - startXRef.current;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    handleDragEnd();
  };

  const handleDragEnd = () => {
    if (translateXRef.current > 50) {
      setSelectedCharacter((prev) =>
        prev === 0 ? characters.length - 1 : prev - 1
      );
    } else if (translateXRef.current < -50) {
      setSelectedCharacter((prev) => (prev + 1) % characters.length);
    }
    translateXRef.current = 0;
  };

  return (
    <>
      <GlobalStyle />
      <Header>
        <BackBtn
          src={SignupBackBtn}
          alt="뒤로가기"
          onClick={() => navigate("/signupcodeinput")}
        />
      </Header>
      <Container>
        <Top>
          <Kkaebi>
            <KkaebiProfile src={KkaebiProfileImg} alt="깨비 프로필 이미지" />
            <Comment>캐릭터를 선택해주세요.</Comment>
          </Kkaebi>
          <CarouselContainer
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDragStart={(e) => e.preventDefault()}
          >
            <Character>
              <CharacterImg
                src={characters[selectedCharacter].src}
                alt={characters[selectedCharacter].label}
                onDragStart={(e) => e.preventDefault()}
              />
            </Character>
          </CarouselContainer>

          <IndicatorContainer>
            {characters.map((_, index) => (
              <Indicator
                key={index}
                $isActive={index === selectedCharacter}
              ></Indicator>
            ))}
          </IndicatorContainer>
        </Top>
        <Bottom>
          <NextBtn
            onClick={async () => {
              const token = localStorage.getItem("token");
              const payload = {
                character: characters[selectedCharacter].id.toString(),
              };
              console.log("백엔드로 전달되는 데이터:", payload);

              try {
                const response = await fetch(
                  `${process.env.REACT_APP_SERVER_PORT}user/create/character/`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  }
                );

                if (response.ok) {
                  const data = await response.json();
                  console.log("API 성공:", data);

                  navigate("/signupbestwork", {
                    state: payload,
                  });
                } else {
                  console.error("API 실패:", response.status);
                  alert("캐릭터 변경에 실패했습니다. 다시 시도해주세요.");
                }
              } catch (error) {
                console.error("API 요청 중 오류 발생:", error);
                alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
              }
            }}
          >
            다음
          </NextBtn>
        </Bottom>
      </Container>
    </>
  );
};

export default SignupNamePage;

const Header = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  align-self: stretch;
  background-color: #fafafa;
`;

const BackBtn = styled.button`
  width: 9px;
  height: 18px;
  border: none;
  background: url(${SignupBackBtn}) no-repeat center;
  background-size: contain;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fafafa;
  height: calc(100vh - 132px);
  overflow: hidden;
  padding-bottom: 74px;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
`;

const Kkaebi = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #000;
  font-family: Pretendard, sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`;

const KkaebiProfile = styled.img`
  width: 45px;
  height: 45px;
  margin-right: 16px;
`;

const Comment = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`;

const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 114.5px;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
  width: 100%;
  height: 300px;
  user-select: none;
`;

const Character = styled.div`
  text-align: center;
`;

const CharacterImg = styled.img.attrs({
  draggable: false,
})`
  display: flex;
  padding: 0px 4.035px 9.043px 5px;
  flex-direction: column;
  align-items: center;
  gap: 37px;
  align-self: stretch;

  width: 201px;
  height: 310px;
`;

const IndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 14px;
`;

const Indicator = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => (props.$isActive ? "#AA91E8" : "#BEBEBE")};
`;

const Bottom = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const NextBtn = styled.button`
  width: 100%;
  padding: 16px 20px;
  border: none;
  border-radius: 8px;
  background: var(--key_purple, #aa91e8);
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #fff;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  &:hover {
    background-color: #967bd9;
  }
`;
