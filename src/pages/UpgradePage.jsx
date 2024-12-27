import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";

import GlobalStyle from "../style/GlobalStyle";
import BackHeader from "../components/BackHeader";
import useDateStore from "../stores/DateStore"; // DateStore 가져오기
import KkaebiProfileImg from "../images/KkaebiProfile.svg";
import Modal from "../components/PremiumModal";
import instance from "axios";

import Copy from "../images/Copy.svg";

const UpgradePage = () => {
  const navigate = useNavigate();

  // 상태 업데이트

  const [modal, setModal] = useState(false);
  // 모달창의 state를 바꾸는 함수 작성 (true <-> false)
  const openModal = () => {
    setModal(true);
  };

  const goPremium = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await instance.patch(
        `${process.env.REACT_APP_SERVER_PORT}mypage/plan-upgrade/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  return (
    <>
      <GlobalStyle />
      {modal ? <Modal setModal={setModal} goPremium={goPremium} /> : null}
      <BackHeader title={`플랜 업그레이드`} pageurl={"/mypage"} />
      <Container>
        <Top>
          <Kkaebi>
            <KkaebiProfile src={KkaebiProfileImg} alt="깨비 프로필 이미지" />
            <Comment>
              <p>
                플랜을 업그레이드 하면 <br />
                그동안의 집안일 데이터를 바탕으로
              </p>
              <Box>
                <Number>1</Number>
                <p>오늘 해야하는 집안일</p>
              </Box>
              <Box>
                <Number>2</Number>
                <p>오늘 집안일을 할 식구</p>
              </Box>
              <p>를 추천해드릴게요!</p>
            </Comment>
          </Kkaebi>
        </Top>
        <Bottom>
          <NextBtn onClick={openModal}>플랜 업그레이드 하기</NextBtn>
        </Bottom>
      </Container>
    </>
  );
};

export default UpgradePage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 20px;
  background-color: #fafafa;
  height: calc(100vh - 132px); /* Header 패딩과 NextBtn 마진 포함 */
  overflow: hidden; /* 스크롤 숨기기 */
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
  line-height: 150%; /* 30px */
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
  line-height: 150%; /* 30px */
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
  justify-content: center;
  align-items: center;
  cursor: "pointer";
  color: #fff;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;
`;

const Box = styled.div`
  display: flex;
  padding: 16px 20px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  border-radius: 11px;
  border: 1px solid var(--key_purple, #aa91e8);
  background: #fff;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const Number = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 30px;
  border: 1px solid var(--key_purple, #aa91e8);
  background: rgba(170, 145, 232, 0.4);
  color: var(--key_purple, #aa91e8);
  text-align: center;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%; /* 21px */
  align-self: stretch;
`;
