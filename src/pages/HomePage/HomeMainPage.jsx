import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import GlobalStyle from "../../style/GlobalStyle";

import Header from "../../components/HomeHeader.jsx";

import userCharacter1Img from "../../images/character/프사피부미인.svg";
import userCharacter2Img from "../../images/character/프사머리숱부자.svg";
import userCharacter3Img from "../../images/character/프사핑크수집가.svg";
import userCharacter4Img from "../../images/character/프사고민해결사.svg";
import userCharacter5Img from "../../images/character/프사매듭의달인.svg";

const characterImages = {
  1: userCharacter1Img,
  2: userCharacter2Img,
  3: userCharacter3Img,
  4: userCharacter4Img,
  5: userCharacter5Img,
};

const HomeMainPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [familyData, setFamilyData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_PORT}home/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);

          // house 값이 "No House"일 경우 다시 코드 입력 페이지 이동
          if (data.house === "No House") {
            alert(
              "기존에 등록되어 있던 우리집에 접근이 제한되어, 다시 우리집 코드 입력 페이지로 이동합니다."
            );
            navigate("/signupcodeinput");
            return; // 이후 로직 실행 방지
          }

          setUserData(data);
        } else {
          console.error("Failed to fetch user data", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchFamilyData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_PORT}home/family/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setFamilyData(data);
        } else {
          console.error("Failed to fetch family data", response.status);
        }
      } catch (error) {
        console.error("Error fetching family data:", error);
      }
    };

    fetchUserData();
    fetchFamilyData();
  }, []);

  if (!userData || !familyData) {
    return <div></div>;
  }

  const { house, nickname, userCharacter, tasks, selected_tags } = userData;
  const { today_completion_rate, level } = tasks;
  const { family } = familyData;

  return (
    <>
      <GlobalStyle />
      <Header title={`${house} 하우스`} />

      <Top>
        <SemiHeader>
          <StatisticsBtn onClick={() => navigate("/homestatistics")}>
            <BtnComment>
              <TodayComment>
                이번 주 {house} 하우스의 집안일 현황은?
              </TodayComment>
              <Check>통계 확인하기</Check>
            </BtnComment>
            <Arrow>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="9"
                height="17"
                viewBox="0 0 9 17"
                fill="none"
              >
                <path d="M1 1L7 8.5L1 16" stroke="#787878" strokeWidth="1.7" />
              </svg>
            </Arrow>
          </StatisticsBtn>
        </SemiHeader>
      </Top>
      <Container>
        {/* 내 정보 */}
        <ProfileSection>
          <ProfileImage
            src={characterImages[userCharacter]}
            alt="User Character"
          />
          <ProfileInfo>
            <Nickname>{nickname}</Nickname>
            <Level>{level}</Level>
          </ProfileInfo>
          <Tags>
            {selected_tags.map((tag) => (
              <Tag key={tag.id}>{tag.name}</Tag>
            ))}
          </Tags>
          <CompletionBar>
            <CompletionText>
              <CompletionRate>오늘의 할 일</CompletionRate>
              <RateText>
                {today_completion_rate !== "none"
                  ? `${today_completion_rate} 완료`
                  : ""}
              </RateText>
            </CompletionText>
            {today_completion_rate !== "none" ? (
              <ProgressBar>
                <Progress
                  style={{
                    width: today_completion_rate,
                  }}
                />
              </ProgressBar>
            ) : (
              <NoTaskMessage>오늘은 할 일이 없어요.</NoTaskMessage>
            )}
          </CompletionBar>
        </ProfileSection>
        {/* 식구들 정보 */}
        <Bottom>
          <Family>식구들</Family>
          {family.length > 0 ? (
            family.map((member, index) => (
              <FamilyItem key={index}>
                <FamilyProfileImage
                  src={characterImages[member.userCharacter]}
                  alt="Family Character"
                />
                <FamilyGroup>
                  <Info>
                    <FamilyNickname>{member.nickname}</FamilyNickname>
                    <FamilyLevel>{member.level}</FamilyLevel>
                  </Info>
                  <BarGroup>
                    {member.today_completion_rate === "none" ? (
                      <NoTaskText>오늘은 할 일이 없어요.</NoTaskText>
                    ) : (
                      <>
                        <FamilyCompletionBar>
                          <FamilyProgress
                            style={{
                              width: member.today_completion_rate,
                            }}
                          />
                        </FamilyCompletionBar>
                        <FamilyCompletionRate>
                          {member.today_completion_rate}
                        </FamilyCompletionRate>
                      </>
                    )}
                  </BarGroup>
                </FamilyGroup>
              </FamilyItem>
            ))
          ) : (
            <NoFamilyMessage>
              아직 등록된 식구가 없어요.
              <br />
              코드를 공유해 식구를 추가해 보세요.
            </NoFamilyMessage>
          )}
        </Bottom>
      </Container>
    </>
  );
};

export default HomeMainPage;

// 공통 스타일
const Top = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 20px;
  background-color: #fafafa;
  min-height: 85vh;
  overflow: auto;
  padding-bottom: 74px;
`;

// SemiHeader 및 통계 버튼
const SemiHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px 20px 20px;
  border-radius: 0px 0px 21px 21px;
  background: #aa91e8;
`;

const StatisticsBtn = styled.button`
  display: flex;
  padding: 20px 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  border: none;
`;

const BtnComment = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const TodayComment = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 12px;
`;

const Check = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Arrow = styled.div`
  display: flex;
`;

// 내 정보
const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 24px;
  padding: 0 10px;
`;

const ProfileImage = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  margin-bottom: 14.5px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

const Nickname = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-right: 12px;
`;

const Level = styled.div`
  display: flex;
  padding: 10px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 50px;
  background: var(--key_purple, #aa91e8);

  color: #fff;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

const Tag = styled.div`
  display: flex;
  padding: 10px 16px;
  align-items: center;
  border-radius: 8px;
  border: 0.5px solid #cecece;
  background: #fff;

  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const NoTaskMessage = styled.div`
  color: #787878;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  margin-top: 12px;
`;

const CompletionBar = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: center;
`;

const CompletionText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CompletionRate = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const RateText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 3px;
  background: #ebebeb;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: var(--key_purple, #aa91e8);
`;

// 가족 섹션
const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;

const NoFamilyMessage = styled.div`
  color: #787878;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  text-align: center;
  margin-top: 20px;
  line-height: 1.5;
`;

const Family = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const FamilyItem = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px 24px;
  align-items: center;
  align-self: stretch;
  border-radius: 11px;
  background: #fff;
  margin-bottom: 12px;
`;

const FamilyProfileImage = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  margin-right: 12px;
`;

const FamilyGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 19px;
  margin-bottom: 10px;
`;

const FamilyNickname = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-right: 10px;
`;

const FamilyLevel = styled.div`
  color: var(--key_purple, #aa91e8);
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const NoTaskText = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const FamilyCompletionBar = styled.div`
  display: flex;
  height: 7px;
  align-items: center;
  flex: 1 0 0;
  border-radius: 2px;
  background: #ebebeb;
  width: 100%;
  overflow: hidden;
  margin-right: 12px;
`;

const FamilyProgress = styled.div`
  height: 100%;
  background: var(--key_purple, #aa91e8);
`;

const FamilyCompletionRate = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
