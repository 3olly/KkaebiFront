import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useLevelStore from "../stores/LevelStore";
import { useNavigate } from "react-router-dom";

import GlobalStyle from "../style/GlobalStyle";
import Header from "../components/Header";

import instance from "axios";
import useImageStore from "../stores/ImageStore";

import Modal from "../components/Modal";
import X from "../images/X.svg";

import Exit from "../images/Exit.svg";
import Premium from "../images/Premium.svg";
import Ranking from "../images/Ranking.svg";
import People from "../images/People.svg";
import RightArrow from "../images/RightArrow.svg";
import Ask from "../images/Ask.svg";
import award from "../images/award.svg";

import userCharacter1Img from "../images/character/없피부미인.svg";
import userCharacter2Img from "../images/character/없머리숱부자.svg";
import userCharacter3Img from "../images/character/없핑크수집가.svg";
import userCharacter4Img from "../images/character/없고민해결사.svg";
import userCharacter5Img from "../images/character/없매듭의달인.svg";

import profile1Img from "../images/character/프사피부미인.svg";
import profile2Img from "../images/character/프사머리숱부자.svg";
import profile3Img from "../images/character/프사핑크수집가.svg";
import profile4Img from "../images/character/프사고민해결사.svg";
import profile5Img from "../images/character/프사매듭의달인.svg";

const characterImages = {
  1: userCharacter1Img,
  2: userCharacter2Img,
  3: userCharacter3Img,
  4: userCharacter4Img,
  5: userCharacter5Img,
};

const profileImages = {
  1: profile1Img,
  2: profile2Img,
  3: profile3Img,
  4: profile4Img,
  5: profile5Img,
};

const MyPage = () => {
  const token = localStorage.getItem("token");
  const [noticeVisible, setNoticeVisible] = useState(false);

  const navigate = useNavigate();
  const {
    completionRate,
    setCompletionRate,
    activeLevel,
    setActiveLevel,
    characterImg,
    setCharacterImg,
  } = useLevelStore();

  const [nickname, setNickname] = useState("");

  const [imageNumber, setImageNumber] = useState(null);
  const [userLevel, setUserLevel] = useState("");
  const fetchImageNumber = async () => {
    try {
      const response = await instance.get(
        `${process.env.REACT_APP_SERVER_PORT}mypage/user/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("API 요청 성공:", response.data);
        setImageNumber(response.data.userCharacter);
        setNickname(response.data.nickname);
      } else {
        console.error("API 요청 실패:", response.status);
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  useEffect(() => {
    fetchImageNumber();
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_PORT}home/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const { level, weekly_completion_rate } = data.tasks;
        setUserLevel(level);

        const levelMap = {
          "Lv7. 빛": 7,
          "Lv6. 청소 마법사": 6,
          "Lv5. 향기 탐험가": 5,
          "Lv4. 먼지 사냥꾼": 4,
          "Lv3. 티끌 수집가": 3,
          "Lv2. 먼지": 2,
          "Lv1. 미세먼지": 1,
        };
        setActiveLevel(levelMap[level]);

        setCompletionRate(weekly_completion_rate);
        setCharacterImg(characterImages[levelMap[level]]);
      })
      .catch((error) => console.error("Error fetching home data:", error));
  }, [token, setCompletionRate, setActiveLevel, setCharacterImg]);

  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };

  const goExit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.delete(
        `${process.env.REACT_APP_SERVER_PORT}mypage/remove-account/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("housecode");
      localStorage.removeItem("housename");
      localStorage.removeItem("nickname");
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("계정 삭제 중 오류가 발생했습니다.");
    }
  };

  const toggleNotice = () => {
    setNoticeVisible(!noticeVisible);
  };

  const closeNotice = () => {
    setNoticeVisible(false);
  };

  return (
    <>
      <GlobalStyle />
      {modal ? <Modal setModal={setModal} goExit={goExit} /> : null}
      <Header title="마이페이지" />
      <Container>
        <Top>
          <ProfileContainer>
            <ProfileInfo>
              <LevelName>{nickname}</LevelName>
              <LevelBadge>{userLevel}</LevelBadge>
              <CharacterIcon
                src={characterImages[imageNumber]}
                alt={`선택된 캐릭터 ${imageNumber}`}
              />
            </ProfileInfo>
          </ProfileContainer>

          <LevelContainer>
            <TopContainer>
              <img src={Ranking} alt="Ranking" />
              <Label>이번 주 나의 레벨</Label>

              <NoticeWrapper2>
                <Notice onClick={toggleNotice}>
                  <img src={Ask} alt="?" />
                  {noticeVisible && (
                    <NoticeExplain>
                      <NoticeWrapper>
                        <NoticeWrapper3>
                          <img src={award} alt="award" />
                          <NoticeTitle>레벨 등급</NoticeTitle>
                        </NoticeWrapper3>

                        <NoticeX onClick={closeNotice}>
                          <img src={X} alt="Close" />
                        </NoticeX>
                      </NoticeWrapper>
                      <NoticeContent>
                        Lv1. 미세먼지 : 0% 완료 <br />
                        Lv2. 먼지 : 20% 완료 <br />
                        Lv3. 티끌 수집가 : 40% 완료 <br />
                        Lv4. 먼지 사냥꾼 : 60% 완료 <br />
                        Lv5. 향기 탐험가 : 80% 완료 <br />
                        Lv6. 청소 마법사 : 99% 완료 <br />
                        Lv7. 빛 : 100% 완료
                      </NoticeContent>
                    </NoticeExplain>
                  )}
                </Notice>
              </NoticeWrapper2>
            </TopContainer>

            <ProgressBar>
              {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                <ProgressItem key={level} isActive={level === activeLevel}>
                  {level === activeLevel && (
                    <ProfileImage
                      src={profileImages[imageNumber]}
                      alt="User Character"
                      active={true}
                    />
                  )}
                </ProgressItem>
              ))}
            </ProgressBar>
          </LevelContainer>
        </Top>

        <Bottom>
          <ButtonContainer>
            <ActionButton onClick={() => navigate("/family")}>
              <BtnContainer>
                <img src={People} alt="Ranking" />
                <Label>우리집 관리하기</Label>
              </BtnContainer>
              <img src={RightArrow} alt="Next Month" />
            </ActionButton>
            <UpgradeButton onClick={() => navigate("/upgrade")}>
              <img src={Premium} alt="Ranking" />
              <Label>플랜 업그레이드</Label>
            </UpgradeButton>
            <ExitButton onClick={openModal}>
              <img src={Exit} alt="Ranking" />
              <Label>탈퇴하기</Label>
            </ExitButton>
          </ButtonContainer>
        </Bottom>
      </Container>
    </>
  );
};

export default MyPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  background-color: #fafafa;
  height: calc(100vh - 132px);
  overflow-y: auto;
  padding-bottom: 74px;
`;

const Top = styled.div`
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: -0.268px;
  align-self: stretch;
  border-radius: 21px;
  background: var(--key_purple, #aa91e8);
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileImage = styled.img`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  visibility: ${(props) => (props.active ? "visible" : "hidden")};
  width: 27px;
  height: 27px;
`;

const CharacterIcon = styled.img`
  width: 98px;
  margin-bottom: -5px;
`;

const TopContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: stretch;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const LevelName = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 600;
`;

const LevelBadge = styled.div`
  display: flex;
  padding: 10px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  background: #fff;
  color: #aa91e8;
  font-family: Pretendard;
  font-size: 12px;
`;

const LevelContainer = styled.div`
  display: flex;
  align-self: stretch;
  padding: 14px 20px;
  flex-direction: column;
  align-items: center;
  gap: 17px;
  border-radius: 21px;
  background: #fff;
`;

const Label = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 3px;
`;

const ProgressItem = styled.div`
  height: 45px;
  width: 100%;
  box-shadow: 0px 2px 1px 0px rgba(0, 0, 0, 0.25);
  background-color: ${(props) => (props.isActive ? "#AA91E8" : "#f5f5f6")};
  position: relative;
`;

const Bottom = styled.div`
  margin-top: 16px;
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-self: stretch;
`;
const ActionButton = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 11px;
  background: #fff;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #eaeaea;
  }
`;
const UpgradeButton = styled.div`
  padding: 20px 22px;
  gap: 8px;
  align-self: stretch;

  border-radius: 11px;
  background: var(--key_purple, #aa91e8);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  Label {
    color: white;
  }

  &:hover {
    background-color: #967bd9;
  }
`;
const ExitButton = styled.div`
  display: flex;
  padding: 20px 22px;
  align-self: stretch;
  align-items: center;
  align-self: stretch;
  border-radius: 11px;
  background: #fff;
  cursor: pointer;
  gap: 8px;

  &:hover {
    background-color: #eaeaea;
  }
`;
const BtnContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NoticeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;

  img {
    width: 10px;
  }
`;

const NoticeWrapper2 = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoticeWrapper3 = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3px;
`;

const Notice = styled.div`
  position: relative;
  cursor: pointer;
`;

const NoticeExplain = styled.div`
  border-radius: 8px;
  background: #fff;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.1);
  width: 130px;
  top: 30px;
  z-index: 30;
  position: absolute;
  padding: 20px;
`;

const NoticeTitle = styled.div`
  font-weight: bold;
  font-size: 12px;
  color: #222222;
`;

const NoticeX = styled.div``;

const NoticeContent = styled.div`
  font-weight: 400;
  font-size: 11px;
  line-height: 15px;
  color: #222222;
`;
