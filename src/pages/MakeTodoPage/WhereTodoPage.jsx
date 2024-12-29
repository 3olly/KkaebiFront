import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import GlobalStyle from "../../style/GlobalStyle";
import KkaebiProfileImg from "../../images/KkaebiProfile.svg";
import BackHeader from "../../components/BackHeader";
import useHouseworkTagStore from "../../stores/HouseworkTagStore";

const WhereTodoPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [name, setName] = useState("");
  const setHouseworkPlace = useHouseworkTagStore(
    (state) => state.setHouseworkPlace
  );

  const queryYear = searchParams.get("year");
  const queryMonth = searchParams.get("month");
  const queryDay = searchParams.get("date");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 4) {
      setName(inputValue);
    }
  };

  const handleNextClick = () => {
    setHouseworkPlace(name);
    navigate(
      `/whattodo?year=${queryYear}&month=${queryMonth}&date=${queryDay}`
    );
  };

  return (
    <>
      <GlobalStyle />
      <BackHeader
        title={<br />}
        pageurl={`/maketodo?year=${queryYear}&month=${queryMonth}&date=${queryDay}`}
      />
      <Container>
        <Top>
          <Kkaebi>
            <KkaebiProfile src={KkaebiProfileImg} alt="깨비 프로필 이미지" />
            <Comment>
              <p>집안일을 어디에서 할까요?</p>
              <p style={{ fontSize: "16px" }}>꼭 입력하지 않아도 돼요.</p>
            </Comment>
          </Kkaebi>
          <Input
            placeholder="ex) 거실"
            value={name}
            onChange={handleInputChange}
          />
        </Top>
        <Bottom>
          <NextBtn onClick={handleNextClick}>다음</NextBtn>
        </Bottom>
      </Container>
    </>
  );
};

export default WhereTodoPage;

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

const Input = styled.input`
  display: flex;
  width: 100%;
  height: 46px;
  padding: 20px;
  align-items: center;
  border-radius: 8px;
  border: 0.5px solid #cecece;
  background: #fff;
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  box-sizing: border-box;

  &::placeholder {
    color: #787878;
    font-family: Pretendard;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }

  &:focus {
    border: 0.5px solid #000;
    outline: none;
  }
`;

const ErrorMessage = styled.div`
  color: #f00;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 12px;
  margin-left: 20px;
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
  color: #fff;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: pointer;
`;
