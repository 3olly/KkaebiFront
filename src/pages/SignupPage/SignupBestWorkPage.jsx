import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import GlobalStyle from "../../style/GlobalStyle";
import SignupBackBtn from "../../images/SignupBackBtn.svg";
import KkaebiProfileImg from "../../images/KkaebiProfile.svg";
import CategorySelector from "../../components/CategorySelector";
import useHouseworkTagStore from "../../stores/HouseworkTagStore";

const SignupBestWorkPage = () => {
  const houseworkTag = useHouseworkTagStore((state) => state.houseworkTag);
  const setSignupSelectedTag = useHouseworkTagStore(
    (state) => state.setSignupSelectedTag
  );
  const categories = Object.values(houseworkTag);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  const toggleCategory = (category) => {
    const tag = Object.keys(houseworkTag).find(
      (key) => houseworkTag[key] === category
    );

    if (selectedCategories.includes(category)) {
      const updatedCategories = selectedCategories.filter(
        (item) => item !== category
      );
      setSelectedCategories(updatedCategories);
      console.log("선택취소");
    } else {
      const updatedCategories = [...selectedCategories, category];
      setSelectedCategories(updatedCategories);
      console.log("선택된 tag:", tag);
    }

    const updatedTags = [...selectedCategories, category]
      .filter((cat, index, self) => self.indexOf(cat) === index)
      .map((cat) =>
        Number(
          Object.keys(houseworkTag).find((key) => houseworkTag[key] === cat)
        )
      );

    setSignupSelectedTag(updatedTags);
  };

  const handleNextClick = async () => {
    const token = localStorage.getItem("token");
    if (selectedCategories.length > 0) {
      const tags = selectedCategories.map((category) =>
        Number(
          Object.keys(houseworkTag).find(
            (key) => houseworkTag[key] === category
          )
        )
      );

      console.log("보낼 데이터:", { houseworkTag: tags.join(",") });

      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_PORT}user/create/houseworktag/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ houseworkTag: tags.join(",") }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("성공적으로 업데이트됨:", data);
          navigate("/signupkkaebicomment");
        } else {
          console.error("태그 업데이트 실패:", response.status);
          alert("태그 업데이트에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("오류 발생:", error);
        alert("서버와의 연결 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <>
      <GlobalStyle />
      <Header>
        <BackBtn
          src={SignupBackBtn}
          alt="뒤로가기"
          onClick={() => navigate("/signupcharacter")}
        />
      </Header>
      <Container>
        <Top>
          <Kkaebi>
            <KkaebiProfile src={KkaebiProfileImg} alt="깨비 프로필 이미지" />
            <Comment>
              거의 다 왔어요!
              <br />
              자신있는 집안일을 선택해주세요.
            </Comment>
          </Kkaebi>
          <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            onToggle={toggleCategory}
          />
        </Top>
        <Bottom>
          <NextBtn
            $isActive={selectedCategories.length > 0}
            onClick={handleNextClick}
          >
            시작하기
          </NextBtn>
        </Bottom>
      </Container>
    </>
  );
};

export default SignupBestWorkPage;

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
