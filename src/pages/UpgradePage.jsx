import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import GlobalStyle from "../style/GlobalStyle";
import BackHeader from "../components/BackHeader";

import KkaebiProfileImg from "../images/KkaebiProfile.svg";
import Modal from "../components/PremiumModal";
import instance from "axios";

const UpgradePage = () => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);

  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };

  const goPremium = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await instance.patch(
        `${process.env.REACT_APP_SERVER_PORT}mypage/plan-upgrade/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      alert(response.data.message);
      navigate("/mypage");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        setIsPremium(true);
        navigate("/mypage");
      }
      alert(error.response?.data?.message || "알 수 없는 오류가 발생했습니다.");
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
    props.isPremium ? "var(--key_purple, #aa91e8)" : "#d3d3d3"};
  justify-content: center;
  align-items: center;
  cursor: ${(props) => (props.isPremium ? "pointer" : "not-allowed")};
  display: flex;
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
  line-height: 150%;
  align-self: stretch;
`;
