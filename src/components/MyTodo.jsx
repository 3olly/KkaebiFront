import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import instance from "../api/axios";

import NoCheck from "../images/NoCheck.svg";
import CheckPurple from "../images/CheckPurple.svg";
import useHouseworkTagStore from "../stores/HouseworkTagStore";
import TodoDelModal from "./TodoDelModal";
import Delete from "../images/Delete.svg";

const MyTodo = ({
  houseworkId,
  categoryName,
  houseworkPlace,
  houseworkDetail,
  houseworkDone,
  removeStyles,
  isEditing,
  updateTasks,
}) => {
  const [isChecked, setIsChecked] = useState(houseworkDone);
  const [tagValue, setTagValue] = useState("");
  const houseworkTag = useHouseworkTagStore((state) => state.houseworkTag);

  useEffect(() => {
    if (houseworkTag[categoryName]) {
      setTagValue(houseworkTag[categoryName]);
    } else {
      setTagValue("유효하지 않은 태그입니다.");
    }
  }, [categoryName, houseworkTag]);

  const toggleCheck = async () => {
    setIsChecked((prev) => !prev);
    const token = localStorage.getItem("token");

    try {
      const response = await instance.put(
        `${process.env.REACT_APP_SERVER_PORT}calendar/houseworkDone/`,
        { houseworkId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsChecked(response.data.data.houseworkDone);
        console.log("할 일 상태 변경 성공", response.data.data);
      } else {
        console.error("API 요청 실패:", response.status);
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

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
      {modal && <TodoDelModal setModal={setModal} goDelete={goDelete} />}

      <GlobalStyle />
      <Container removeStyles={removeStyles}>
        <Front>
          <Category>{tagValue}</Category>
          {houseworkPlace !== "미정" && (
            <TodoCategory>{houseworkPlace}</TodoCategory>
          )}
          {houseworkDetail !== "미정" && (
            <TodoCategory>{houseworkDetail}</TodoCategory>
          )}
        </Front>
        <Img
          src={isEditing ? Delete : isChecked ? CheckPurple : NoCheck}
          alt="Check or Delete"
          onClick={isEditing ? openModal : toggleCheck}
        />
      </Container>
    </>
  );
};

export default MyTodo;

const GlobalStyle = createGlobalStyle``;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 11px;
  flex-direction: row;
  gap: 10px;
  background: ${({ removeStyles }) => (removeStyles ? "none" : "#fff")};
  padding: ${({ removeStyles }) => (removeStyles ? "0" : "16px 20px")};
  background-color: #fff;
  margin-top: 12px;
`;

const Front = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  gap: 10px;
`;

const Category = styled.div`
  color: #000;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Img = styled.img`
  width: 24px;
  align-self: stretch;
  cursor: pointer;
`;

const TodoCategory = styled.div`
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
