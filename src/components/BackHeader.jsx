import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../images/LeftArrow.svg";
import instance from "axios";

const Header = ({ title, pageurl, houseworkId }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
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
        navigate(pageurl);
      } else {
        console.error("DELETE 요청 실패:", response.status);
        navigate(pageurl);
      }
    } catch (error) {
      console.error("DELETE 요청 중 에러 발생:", error);
      navigate(pageurl);
    }
  };

  const handleBackClick = () => {
    if (houseworkId) {
      handleDelete();
    } else {
      navigate(pageurl);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <BackBtn src={LeftArrow} alt="Back Btn" onClick={handleBackClick} />
        <Name>{title}</Name>
      </Container>
    </>
  );
};

export default Header;

const GlobalStyle = createGlobalStyle``;

const Container = styled.div`
  background-color: #fafafa;
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 12px;
  img {
    cursor: pointer;
  }
`;

const BackBtn = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Name = styled.div`
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.5px;
`;
