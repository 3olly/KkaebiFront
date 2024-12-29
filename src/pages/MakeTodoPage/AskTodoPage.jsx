import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import GlobalStyle from "../../style/GlobalStyle";

import KkaebiProfileImg from "../../images/KkaebiProfile.svg";

import empty1Img from "../../images/character/빈피부미인.svg";
import empty2Img from "../../images/character/빈머리숱부자.svg";
import empty3Img from "../../images/character/빈핑크수집가.svg";
import empty4Img from "../../images/character/빈고민해결사.svg";
import empty5Img from "../../images/character/빈매듭의달인.svg";

import BackHeader from "../../components/BackHeader";
import useHouseworkTagStore from "../../stores/HouseworkTagStore";
import instance from "axios";

const emptyImages = {
  1: empty1Img,
  2: empty2Img,
  3: empty3Img,
  4: empty4Img,
  5: empty5Img,
};

const AskTodoPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const houseworkPlace = useHouseworkTagStore((state) => state.houseworkPlace);
  const houseworkDetail = useHouseworkTagStore(
    (state) => state.houseworkDetail
  );
  const houseworkTag = useHouseworkTagStore((state) => state.houseworkTag);
  const selectedTag = useHouseworkTagStore((state) => state.selectedTag);
  const [tagValue, setTagValue] = useState("");
  const location = useLocation();
  const { selectedUser } = location.state || {};
  const { nickname, characterImage } = selectedUser;
  const houseworkId = useHouseworkTagStore((state) => state.houseworkId);

  const queryYear = searchParams.get("year");
  const queryMonth = searchParams.get("month");
  const queryDay = searchParams.get("date");

  console.log("selectedUser 값:", selectedUser);
  console.log("characterImage 값:", characterImage);
  console.log("houseworkDetail", houseworkDetail);

  useEffect(() => {
    if (selectedTag && houseworkTag[selectedTag]) {
      setTagValue(houseworkTag[selectedTag]);
    } else {
      setTagValue("유효하지 않은 태그입니다.");
    }
  }, [selectedTag, houseworkTag, houseworkId]);

  if (!selectedUser) {
    return (
      <div>
        데이터를 찾을 수 없습니다.
        <button onClick={() => navigate(-1)}>돌아가기</button>
      </div>
    );
  }

  const houseworkDate = `${queryYear}-${queryMonth}-${queryDay}`;
  console.log("날짜:", houseworkDate);

  const handleConfirmClick = async () => {
    const putPayload = {
      housework_manager: nickname,
      houseworkId: houseworkId,
    };

    try {
      console.log("PUT 데이터:", putPayload);
      const token = localStorage.getItem("token");

      const putResponse = await instance.put(
        `${process.env.REACT_APP_SERVER_PORT}housework/manager/`,
        putPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (putResponse.status === 200) {
        console.log("Manager PUT 성공", putResponse.data);

        navigate("/month");
      } else {
        console.error("PUT 실패");
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <>
      <GlobalStyle />
      <BackHeader
        title={<br />}
        pageurl={`/whotodo?year=${queryYear}&month=${queryMonth}&date=${queryDay}`}
      />
      <Container>
        <Top>
          <Kkaebi>
            <KkaebiProfile src={KkaebiProfileImg} alt="깨비 프로필 이미지" />
            <Comment>{`${nickname} 님에게 집안일을 부탁할게요.`}</Comment>
          </Kkaebi>
          <CarouselContainer>
            <Character>
              <TextInfo>{`${tagValue} / ${houseworkPlace} / ${houseworkDetail}`}</TextInfo>
              <CharacterImg
                src={emptyImages[characterImage]}
                alt="캐릭터 이미지"
              />
            </Character>
          </CarouselContainer>
        </Top>
        <Bottom>
          <NextBtn onClick={handleConfirmClick}>확인</NextBtn>
        </Bottom>
      </Container>
    </>
  );
};

export default AskTodoPage;

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
  font-weight: 400;
  line-height: 150%;
`;

const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 114.5px;
  width: 100%;
  height: 300px;
`;

const Character = styled.div`
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;
`;

const CharacterImg = styled.img.attrs({
  draggable: false,
})`
  width: 229px;
  height: 100%;
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
  background: #aa91e8;
  color: #fff;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #967bd9;
  }
`;

const TextInfo = styled.div`
  position: absolute;
  margin-top: 20px;
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.5px;
`;
