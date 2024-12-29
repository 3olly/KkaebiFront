import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";

import GlobalStyle from "../style/GlobalStyle";
import BackHeader from "../components/BackHeader";
import useDateStore from "../stores/DateStore"; // DateStore 가져오기
import MyTodo from "../components/MyTodo";
import FamilyTodo from "../components/FamilyTodo";
import add from "../images/add.svg";
import LoginKkaebi from "../images/LoginKkaebi.svg"; // 이미지 import
import instance from "axios"; // Axios 인스턴스 가져오기
import Delete from "../images/Delete.svg";

const DayPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("myTasks");
  const [isEditing, setIsEditing] = useState(false); // Add this state
  const [adjustedMargin, setAdjustedMargin] = useState(85);
  // Zustand에서 상태와 상태 변경 함수 가져오기
  const { setYear, setMonth, setDay, month, day } = useDateStore();

  const [myTasks, setMyTasks] = useState([]); // 나의 할 일 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [familyTasks, setFamilyTasks] = useState([]); // 식구들의 할 일 데이터 상태

  // URL에서 쿼리스트링으로 전달된 데이터를 가져옴
  const queryYear = searchParams.get("year");
  const queryMonth = searchParams.get("month");
  const queryDay = searchParams.get("date");

  const fetchTasks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const [myTasksResponse, familyTasksResponse] = await Promise.all([
        instance.get(
          `${process.env.REACT_APP_SERVER_PORT}calendar/housework/my/${queryYear}/${queryMonth}/${queryDay}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        instance.get(
          `${process.env.REACT_APP_SERVER_PORT}calendar/housework/family/${queryYear}/${queryMonth}/${queryDay}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);
      setMyTasks(myTasksResponse.data.data);
      setFamilyTasks(familyTasksResponse.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [queryYear, queryMonth, queryDay]);

  useEffect(() => {
    if (queryYear && queryMonth && queryDay) {
      setYear(Number(queryYear));
      setMonth(Number(queryMonth));
      setDay(Number(queryDay));
    }
  }, [queryYear, queryMonth, queryDay, setYear, setMonth, setDay]);

  useEffect(() => {
    if (queryYear && queryMonth && queryDay) {
      fetchTasks();
    }
  }, [fetchTasks, queryYear, queryMonth, queryDay]);

  const updateTasks = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchTasks(); // 컴포넌트 마운트 시 데이터 로드
  }, [fetchTasks]);

  useEffect(() => {
    const totalHeight = document.body.scrollHeight; // 콘텐츠의 총 높이
    const windowHeight = window.innerHeight; // 기기의 화면 높이
    if (totalHeight > windowHeight) {
      const marginAdjustment = totalHeight - windowHeight;
      setAdjustedMargin(85 - marginAdjustment); // 화면이 짧으면 margin을 조정
    }
  }, []);

  // 상태 업데이트
  useEffect(() => {
    if (queryYear && queryMonth && queryDay) {
      setYear(Number(queryYear));
      setMonth(Number(queryMonth));
      setDay(Number(queryDay)); // queryDay를 setDay에 제대로 전달
    }
  }, [queryYear, queryMonth, queryDay, setYear, setMonth, setDay]);

  // 나의 할 일 데이터 요청
  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await instance.get(
          `${process.env.REACT_APP_SERVER_PORT}calendar/housework/my/${queryYear}/${queryMonth}/${queryDay}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setMyTasks(response.data.data);
        } else {
          console.error("데이터를 가져오는 데 실패했습니다:", response.status);
        }
      } catch (error) {
        console.error("에러 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    if (queryYear && queryMonth && queryDay) {
      fetchMyTasks();
    }
  }, [queryYear, queryMonth, queryDay]);

  // 식구들의 할 일 데이터 요청
  useEffect(() => {
    const fetchFamilyTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await instance.get(
          `${process.env.REACT_APP_SERVER_PORT}calendar/housework/family/${queryYear}/${queryMonth}/${queryDay}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setFamilyTasks(response.data.data);
          console.log("familyTasks:", response.data.data);
        } else {
          console.error("데이터를 가져오는 데 실패했습니다:", response.status);
        }
      } catch (error) {
        console.error("에러 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    if (queryYear && queryMonth && queryDay) {
      fetchFamilyTasks();
    }
  }, [queryYear, queryMonth, queryDay]);

  const renderEmptyState = () => (
    <EmptyContainer>
      <EmptyText>아직 집안일이 없어요</EmptyText>
      <EmptyImage src={LoginKkaebi} alt="빈 상태 이미지" />
    </EmptyContainer>
  );

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const getSortedTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      if (a.houseworkDone === b.houseworkDone) {
        return 0; // 상태가 같으면 원래 순서 유지
      }
      // false가 true보다 앞에 오도록 정렬
      return a.houseworkDone ? 1 : -1;
    });
  };

  return (
    <>
      <GlobalStyle />
      <BackHeader title={`${month}월 ${day}일`} pageurl={"/month"} />
      <Container>
        <TopWrapper>
          <TabContainer>
            <Tab
              isActive={activeTab === "myTasks"}
              onClick={() => setActiveTab("myTasks")}
            >
              나의 할 일{activeTab === "myTasks" && <Underline />}
            </Tab>
            <Tab
              isActive={activeTab === "familyTasks"}
              onClick={() => setActiveTab("familyTasks")}
            >
              식구들의 할 일{activeTab === "familyTasks" && <Underline />}
            </Tab>
          </TabContainer>
          <EditButton
            onClick={handleEditClick}
            isEditing={isEditing} // 편집 상태에 따라 스타일 변경
          >
            {isEditing ? "완료" : "편집"}
          </EditButton>
        </TopWrapper>

        {loading ? (
          <LoadingMessage></LoadingMessage>
        ) : activeTab === "myTasks" ? (
          myTasks.length > 0 ? (
            getSortedTasks(myTasks).map((task) => (
              <MyTodo
                key={task.houseworkId}
                categoryName={task.tag.tagid}
                houseworkPlace={task.houseworkPlace}
                houseworkDetail={task.houseworkDetail}
                houseworkId={task.houseworkId}
                houseworkDone={task.houseworkDone}
                isEditing={isEditing}
                updateTasks={updateTasks}
              />
            ))
          ) : (
            renderEmptyState()
          )
        ) : familyTasks.length > 0 ? (
          getSortedTasks(familyTasks).map((task) => (
            <FamilyTodo
              key={task.houseworkId}
              nickname={task.user.nickname}
              userCharacter={task.user.userCharacter}
              categoryName={task.tag.tagid}
              houseworkPlace={task.houseworkPlace}
              houseworkDetail={task.houseworkDetail}
              houseworkId={task.houseworkId}
              houseworkDone={task.houseworkDone}
              isEditing={isEditing}
              updateTasks={updateTasks}
            />
          ))
        ) : (
          renderEmptyState()
        )}
        <Bottom>
          <Floating
            src={add}
            onClick={() =>
              navigate(
                `/maketodo?year=${queryYear}&month=${queryMonth}&date=${queryDay}`
              )
            }
          ></Floating>
        </Bottom>
      </Container>
    </>
  );
};

export default DayPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  height: calc(100vh);
  overflow: hidden;
  padding-bottom: 74px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 20px;

  margin-bottom: 9px;
`;

const Tab = styled.div`
  position: relative;
  color: ${(props) => (props.isActive ? "#000" : "#787878")};
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: ${(props) => (props.isActive ? "600" : "400")};
  cursor: pointer;
  text-align: center;
`;

const Underline = styled.div`
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  border-bottom: 1.7px solid #000;
`;

const Floating = styled.img`
  width: 18.824px;
  height: 16.314px;
  padding: 23.843px 22.588px;
  border-radius: 53.961px;
  background: var(--purple, #aa91e8);
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  position: fixed;
  bottom: 50px;
  right: 20px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const LoadingMessage = styled.div``;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80%;
`;

const EmptyText = styled.div`
  color: #787878;
  text-align: center;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.5px;
`;

const EmptyImage = styled.img`
  margin-top: 32px;
  width: 251px; /* 이미지 크기 */
  height: auto;
`;

const EditButton = styled.div`
  color: ${(props) => (props.isEditing ? "#aa91e8" : "#BEBEBE")};
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  display: flex;
  padding: 5px 10px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.isEditing ? "#aa91e8" : "#BEBEBE")};
  cursor: pointer;
`;

const TopWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 10px;
  align-items: flex-start;
`;
