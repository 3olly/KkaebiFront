import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import instance from "axios";

import GlobalStyle from "../../style/GlobalStyle";
import KkaebiProfileImg from "../../images/KkaebiProfile.svg";
import CategorySelector from "../../components/CategorySelector";
import BackHeader from "../../components/BackHeader";
import useHouseworkTagStore from "../../stores/HouseworkTagStore";

const MakeTodoPage = () => {
  const houseworkTag = useHouseworkTagStore((state) => state.houseworkTag);
  const [searchParams] = useSearchParams();

  const setSelectedTag = useHouseworkTagStore((state) => state.setSelectedTag);
  const categories = Object.values(houseworkTag);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const queryYear = searchParams.get("year");
  const queryMonth = searchParams.get("month");
  const queryDay = searchParams.get("date");
  const queryDate = `${queryYear}-${queryMonth}-${queryDay}`;

  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await instance.get(
          `${process.env.REACT_APP_SERVER_PORT}housework/recommend-tag?date=${queryDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && response.data.response) {
          console.log(response.data.response);
          const recommendTag = response.data.response;
          setComment(
            <>
              <span style={{ color: "#AA91E8" }}>{recommendTag}</span>
            </>
          );
        } else {
          setComment("");
        }
      } catch (error) {
        // 에러 핸들링
        if (error.response && error.response.status === 403) {
          console.log(
            "AI 추천 기능은 프리미엄 요금제를 결제해야 사용할 수 있습니다."
          );
          setComment("");
        } else if (error.response) {
          console.log("오류 발생: ", error.response);
          setComment("");
        } else {
          alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
        }
        setComment("");
      }
    };

    fetchRecommendation();
  }, [queryDate, houseworkTag]);

  const toggleCategory = (category) => {
    const tag = Object.keys(houseworkTag).find(
      (key) => houseworkTag[key] === category
    );

    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSelectedTag(null);
    } else {
      setSelectedCategory(category);
      setSelectedTag(Number(tag));
      console.log("선택된 tag:", tag);
    }
  };

  const handleNextClick = () => {
    if (selectedCategory) {
      navigate(
        `/wheretodo?year=${queryYear}&month=${queryMonth}&date=${queryDay}`
      );
    }
  };

  return (
    <>
      <GlobalStyle />
      <BackHeader title={<br />} pageurl={"/month"} />
      <Container>
        <Top>
          <Kkaebi>
            <KkaebiProfile src={KkaebiProfileImg} alt="깨비 프로필 이미지" />
            <Comment>
              <p>집안일 카테고리를 선택해주세요.</p>
              {comment && (
                <p style={{ fontSize: "16px" }}>{comment}는 어떨까요?</p>
              )}
            </Comment>
          </Kkaebi>
          <CategorySelector
            categories={categories}
            selectedCategories={selectedCategory ? [selectedCategory] : []}
            onToggle={toggleCategory}
          />
        </Top>
        <Bottom>
          <NextBtn $isActive={!!selectedCategory} onClick={handleNextClick}>
            다음
          </NextBtn>
        </Bottom>
      </Container>
    </>
  );
};

export default MakeTodoPage;

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
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
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
  justify-content: center;
  align-items: center;
  color: #fff;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: ${(props) => (props.$isActive ? "pointer" : "default")};

  &:hover {
    background-color: ${(props) => (props.$isActive ? "#967bd9" : "#bebebe")};
  }
`;
