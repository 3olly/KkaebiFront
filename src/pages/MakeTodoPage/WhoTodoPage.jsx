import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";

import GlobalStyle from "../../style/GlobalStyle";
import FamilySelector from "../../components/FamilySelector";
import { useFamilyStore } from "../../stores/FamilyStore";
import BackHeader from "../../components/BackHeader";
import KkaebiProfileImg from "../../images/KkaebiProfile.svg";
import useHouseworkTagStore from "../../stores/HouseworkTagStore";
import instance from "axios";

const WhoTodoPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const profiles = useFamilyStore((state) => state.profiles);
  const fetchProfiles = useFamilyStore((state) => state.fetchProfiles);

  const queryYear = searchParams.get("year");
  const queryMonth = searchParams.get("month");
  const queryDay = searchParams.get("date");

  const houseworkId = useHouseworkTagStore((state) => state.houseworkId);

  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, [houseworkId, fetchProfiles]);

  const toggleCategory = (nickname) => {
    setSelectedCategory((prev) => (prev === nickname ? null : nickname));
  };

  const handleNextClick = () => {
    if (selectedCategory) {
      const selectedUser = profiles.find(
        (profile) => profile.nickname === selectedCategory
      );
      navigate(
        `/Asktodo?year=${queryYear}&month=${queryMonth}&date=${queryDay}`,
        {
          state: {
            selectedUser,
            characterImage: selectedUser.characterImage,
          },
        }
      );
    }
  };

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await instance.get(
          `${process.env.REACT_APP_SERVER_PORT}housework/recommend-member?houseworkId=${houseworkId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && response.data.response) {
          const responseUserNumber = parseInt(response.data.response, 10);
          const recommendUser = profiles.find(
            (profile) => parseInt(profile.userid, 10) === responseUserNumber
          );

          if (recommendUser) {
            setComment(
              <>
                <span style={{ color: "#AA91E8" }}>
                  {recommendUser.nickname}
                </span>
                <span> 님은 어떨까요?</span>
              </>
            );
          } else {
            setComment("");
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log(
            "AI 추천 기능은 프리미엄 요금제를 결제해야 사용할 수 있습니다."
          );
          setComment("");
        } else if (error.response) {
          console.log("오류 발생: ", error.response);
        } else {
          alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
        }
        setComment("");
      }
    };

    fetchRecommendation();
  }, [houseworkId, profiles]);

  return (
    <>
      <GlobalStyle />
      <BackHeader
        title={<br />}
        pageurl={`/whattodo?year=${queryYear}&month=${queryMonth}&date=${queryDay}`}
        houseworkId={houseworkId}
      />
      <Container>
        <Top>
          <Kkaebi>
            <KkaebiProfile src={KkaebiProfileImg} alt="깨비 프로필 이미지" />
            <Comment>
              <p>담당할 식구를 선택해주세요.</p>
              {comment && (
                <p style={{ fontSize: "16px", marginBottom: "-20px" }}>
                  {comment}
                </p>
              )}
            </Comment>
          </Kkaebi>
          <FamilySelector
            selectedCategories={[selectedCategory]}
            onToggle={toggleCategory}
          />
        </Top>
        <Bottom>
          <NextBtn
            $isActive={selectedCategory !== null}
            onClick={handleNextClick}
          >
            다음
          </NextBtn>
        </Bottom>
      </Container>
    </>
  );
};

export default WhoTodoPage;

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
  align-items: top;
  color: #000;
  font-family: Pretendard, sans-serif;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin-bottom: 20px;
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
  margin-bottom: 20px;
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
  background: ${(props) =>
    props.$isActive ? "var(--key_purple, #AA91E8)" : "#bebebe"};
  color: #fff;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.$isActive ? "pointer" : "default")};

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#967bd9" : "#bebebe")};
  }
`;
