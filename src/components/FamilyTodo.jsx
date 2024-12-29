import React, { useState, useEffect } from "react";
import useHouseworkTagStore from "../stores/HouseworkTagStore";
import instance from "../api/axios";

import styled, { createGlobalStyle } from "styled-components";
import userCharacter1Img from "../images/character/프사피부미인.svg";
import userCharacter2Img from "../images/character/프사머리숱부자.svg";
import userCharacter3Img from "../images/character/프사핑크수집가.svg";
import userCharacter4Img from "../images/character/프사고민해결사.svg";
import userCharacter5Img from "../images/character/프사매듭의달인.svg";
import TodoDelModal from "./TodoDelModal";
import Delete from "../images/Delete.svg";

const characterImages = {
  1: userCharacter1Img,
  2: userCharacter2Img,
  3: userCharacter3Img,
  4: userCharacter4Img,
  5: userCharacter5Img,
};
const FamilyTodo = ({
  houseworkId,
  categoryName,
  houseworkPlace,
  houseworkDetail,
  houseworkDone,
  nickname,
  userCharacter,
  isEditing,
  updateTasks,
}) => {
  const [tagValue, setTagValue] = useState("");
  const houseworkTag = useHouseworkTagStore((state) => state.houseworkTag);
  useEffect(() => {
    if (houseworkTag[categoryName]) {
      setTagValue(houseworkTag[categoryName]);
    } else {
      setTagValue("유효하지 않은 태그입니다.");
    }
  }, [categoryName, houseworkTag]);

  const goDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.delete(
        `${process.env.REACT_APP_SERVER_PORT}housework/delete/${houseworkId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("DELETE 성공:", response.data);
        console.log(`Deleting houseworkId: ${houseworkId}`);
        setModal(false);
        updateTasks();
      } else {
        console.error("DELETE 요청 실패:", response.status);
      }
    } catch (error) {
      console.error("DELETE 요청 중 에러 발생:", error);
    }
  };

  const [modal, setModal] = useState(false);
  const openModal = () => {
    setModal(true);
  };

  return (
    <>
      {" "}
      {modal && <TodoDelModal setModal={setModal} goDelete={goDelete} />}
      <Container>
        <GlobalStyle />
        <Wrapper1>
          <Img src={characterImages[userCharacter]} alt="프로필사진" />
          <Wrapper>
            <NameWrapper>
              <Name>{nickname}</Name>
              <FinishBtn houseworkDone={houseworkDone}>
                {houseworkDone ? "완료" : "미완료"}
              </FinishBtn>
            </NameWrapper>
            <CategoryWrapper>
              <Category>{tagValue}</Category>

              {houseworkPlace !== "미정" && (
                <Category>{houseworkPlace}</Category>
              )}
              {houseworkDetail !== "미정" && (
                <Category>{houseworkDetail}</Category>
              )}
            </CategoryWrapper>
          </Wrapper>
        </Wrapper1>
        {isEditing ? (
          <DelImg src={Delete} alt="Delete" onClick={openModal} />
        ) : null}
      </Container>
    </>
  );
};

export default FamilyTodo;

const GlobalStyle = createGlobalStyle``;

const Wrapper1 = styled.div`
  display: flex;
  gap: 16px;
`;

const Container = styled.div`
  display: flex;
  padding: 20px 24px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  margin-top: 12px;
  border-radius: 11px;
  background: #fff;
  flex-direction: row;
  justify-content: space-between;
`;

const DelImg = styled.img`
  width: 24px;
  cursor: pointer;
`;

const Category = styled.div`
  color: var(--key_purple, #aa91e8);
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  display: flex;
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  border: 1px solid var(--key_purple, #aa91e8);
`;

const Img = styled.img`
  width: 46px;
  height: 46px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const FinishBtn = styled.div`
  display: flex;
  width: 40px;
  padding: 5px 0px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  background: ${({ houseworkDone }) =>
    houseworkDone ? "var(--key_purple, #aa91e8)" : "#bebebe"};
  color: var(--white, #f2f2f2);
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
