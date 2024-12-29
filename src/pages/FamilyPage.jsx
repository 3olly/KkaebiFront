import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import instance from "axios";
import GlobalStyle from "../style/GlobalStyle";
import BackHeader from "../components/BackHeader";

import Copy from "../images/Copy.svg";
import Delete from "../images/Delete.svg";
import userCharacter1Img from "../images/character/프사피부미인.svg";
import userCharacter2Img from "../images/character/프사머리숱부자.svg";
import userCharacter3Img from "../images/character/프사핑크수집가.svg";
import userCharacter4Img from "../images/character/프사고민해결사.svg";
import userCharacter5Img from "../images/character/프사매듭의달인.svg";

const characterImages = {
  1: userCharacter1Img,
  2: userCharacter2Img,
  3: userCharacter3Img,
  4: userCharacter4Img,
  5: userCharacter5Img,
};

const FamilyPage = () => {
  const navigate = useNavigate();
  const housecode = localStorage.getItem("housecode");
  const [familyProfiles, setFamilyProfiles] = useState([]);
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchFamilyProfiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await instance.get(
          `${process.env.REACT_APP_SERVER_PORT}mypage/member/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const familyData = response.data.housemembers
          .filter((member) => member.userid != currentUserId)
          .map((member) => ({
            userid: member.userid,
            nickname: member.nickname,
            characterImage: member.userCharacter,
          }));

        setFamilyProfiles(familyData);
        console.log("가족 프로필", familyData);
      } catch (error) {
        console.error("Error fetching family profiles:", error);
      }
    };

    fetchFamilyProfiles();
  }, []);

  const handleDelete = async (userid) => {
    try {
      const response = await instance.delete(
        `${process.env.REACT_APP_SERVER_PORT}mypage/remove-member/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          data: { userid },
        }
      );
      if (response.status === 200) {
        alert(response.data.message);
        setFamilyProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile.userid !== userid)
        );
      }
    } catch (error) {
      alert("삭제 요청에 실패했습니다.");
      console.error("Failed to delete member:", error);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(housecode).then(() => {
      alert("우리집 코드가 클립보드에 복사되었습니다!");
    });
  };

  return (
    <>
      <GlobalStyle />
      <BackHeader title={`우리집 관리하기`} pageurl={"/mypage"} />
      <Container>
        <Top>
          <Text>우리집 코드</Text>
          <Code>
            <p>{housecode}</p>
            <img src={Copy} alt="Copy" onClick={handleCopyCode} />{" "}
          </Code>
        </Top>
        <Top>
          <Text>식구들</Text>
          {familyProfiles.map((profile) => (
            <Container2 key={profile.userid}>
              <Wrapper2>
                <Img
                  src={characterImages[profile.characterImage]}
                  alt={`${profile.nickname}의 캐릭터`}
                />
                <NameWrapper>
                  <Name>{profile.nickname}</Name>
                </NameWrapper>
              </Wrapper2>
              <DeleteImg
                src={Delete}
                alt="삭제 버튼"
                onClick={() => handleDelete(profile.userid)}
              />
            </Container2>
          ))}
        </Top>
        <Bottom></Bottom>
      </Container>
    </>
  );
};

export default FamilyPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  height: calc(100vh);
  overflow: hidden;
  padding-bottom: 74px;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  margin-bottom: 24px;
`;

const Text = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 24.5px;
  letter-spacing: -0.5px;
`;

const Code = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  gap: 257px;
  align-self: stretch;
  border-radius: 8px;
  border: 0.5px solid #cecece;
  background: #fff;
  color: #787878;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  img {
    cursor: pointer;
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Container2 = styled.div`
  display: flex;
  padding: 20px 24px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  border-radius: 11px;
  background: #fff;
  flex-direction: row;
  justify-content: space-between;
`;

const Img = styled.img`
  width: 46px;
  height: 46px;
`;

const DeleteImg = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Wrapper2 = styled.div`
  display: flex;
  gap: 21px;
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const Name = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;
