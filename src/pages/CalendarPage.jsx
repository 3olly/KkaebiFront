import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import instance from "axios";

import GlobalStyle from "../style/GlobalStyle";
import Header from "../components/Header";

import LeftArrow from "../images/LeftArrow.svg";
import RightArrow from "../images/RightArrow.svg";
import MyTodo from "../components/MyTodo";

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const navigate = useNavigate();
  const today = new Date();

  useEffect(() => {
    const fetchMonthData = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const token = localStorage.getItem("token");

      const response = await instance.get(
        `${process.env.REACT_APP_SERVER_PORT}calendar/${year}/${month}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMonthData(response.data.data);
      }
    };

    fetchMonthData();
  }, [currentDate]);

  useEffect(() => {
    console.log("Month data changed:", monthData);
  }, [monthData]);

  useEffect(() => {
    const fetchTodayTasks = async () => {
      const token = localStorage.getItem("token");
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const response = await instance.get(
        `${process.env.REACT_APP_SERVER_PORT}calendar/housework/my/${year}/${month}/${day}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const todayTasks = response.data.data;
        setTodayTasks(todayTasks);
        console.log("오늘의 할 일:", todayTasks);
      }
    };

    fetchTodayTasks();
  }, []);

  const handlePrevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    );
    setCurrentDate(newDate);
  };

  const handleDateClick = (selectedDay) => {
    if (selectedDay) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      navigate(`/day?year=${year}&month=${month}&date=${selectedDay}`);
    }
  };

  const renderDays = () => {
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    return (
      <DaysContainer>
        {daysOfWeek.map((day, index) => (
          <Day key={index}>{day}</Day>
        ))}
      </DaysContainer>
    );
  };

  const getSortedTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      if (a.houseworkDone === b.houseworkDone) {
        return 0;
      }

      return a.houseworkDone ? 1 : -1;
    });
  };

  const renderDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const dates = [];
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      dates.push({ date: prevMonthLastDate - i, type: "prev" });
    }
    for (let i = 1; i <= lastDate; i++) {
      const hasTask = monthData.some(
        (task) =>
          new Date(task.houseworkDate).getDate() === i &&
          new Date(task.houseworkDate).getMonth() === month
      );
      const isToday =
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      dates.push({ date: i, type: "current", hasTask, isToday });
    }
    const remainingDays = (7 - (dates.length % 7)) % 7;
    for (let i = 1; i <= remainingDays; i++) {
      dates.push({ date: i, type: "next" });
    }

    const rows = [];
    for (let i = 0; i < dates.length; i += 7) {
      rows.push(dates.slice(i, i + 7));
    }

    return (
      <DatesContainer>
        {rows.map((week, rowIndex) => (
          <Week key={rowIndex}>
            {week.map((dateObj, colIndex) => (
              <DateBox
                key={colIndex}
                type={dateObj.type}
                isToday={dateObj.isToday}
                onClick={() =>
                  dateObj.type === "current" && handleDateClick(dateObj.date)
                }
              >
                {dateObj.date}
                <TaskIndicator hasTask={dateObj.hasTask} />
              </DateBox>
            ))}
          </Week>
        ))}
      </DatesContainer>
    );
  };

  return (
    <>
      <GlobalStyle />
      <Header title="캘린더" />
      <Container>
        <HeaderContainer>
          <ArrowButton onClick={handlePrevMonth}>
            <img src={LeftArrow} alt="Previous Month" />
          </ArrowButton>
          <MonthLabel>
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </MonthLabel>
          <ArrowButton onClick={handleNextMonth}>
            <img src={RightArrow} alt="Next Month" />
          </ArrowButton>
        </HeaderContainer>
        {renderDays()}
        {renderDates()}
        <MyTodoContainer>
          <Name>{`${today.getMonth() + 1}월 ${today.getDate()}일`}</Name>
          {getSortedTasks(todayTasks).map((todo, index) => (
            <MyTodo
              key={index}
              categoryName={todo.tag.tagid}
              houseworkPlace={todo.houseworkPlace}
              houseworkDetail={todo.houseworkDetail}
              houseworkId={todo.houseworkId}
              houseworkDone={todo.houseworkDone}
              removeStyles
            />
          ))}
        </MyTodoContainer>
      </Container>
    </>
  );
};

export default CalendarPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  background-color: #fafafa;
  height: calc(100vh - 132px);
  overflow-y: auto;
  padding-bottom: 74px;
`;

const MyTodoContainer = styled.div`
  display: flex;
  padding: 20px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex-shrink: 0;
  align-self: stretch;
  background: #fff;
  margin-top: 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;

const MonthLabel = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  img {
    width: 24px;
    height: 24px;
  }
`;

const DaysContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const Day = styled.div`
  flex: 1;
  text-align: center;
  font-weight: light;
  color: #555;
`;

const DatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const Week = styled.div`
  display: flex;
`;

const DateBox = styled.div`
  flex: 1;
  margin: 15px;
  padding: 5px 0px 5px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: ${({ type }) =>
    type === "prev" || type === "next" ? "default" : "pointer"};
  color: ${({ type }) =>
    type === "prev" || type === "next" ? "#B3B3B3" : "#000"};
  position: relative;
  background: ${({ type, isToday }) =>
    type === "current" && isToday ? "var(--key_purple, #aa91e8)" : "none"};
  border-radius: ${({ type, isToday }) =>
    type === "current" && isToday ? "100%" : "none"};
  color: ${({ type, isToday }) =>
    type === "current" && isToday ? "white" : "inherit"};
  opacity: ${({ type }) => (type === "prev" || type === "next" ? 0.3 : 1)};
  & > .task-indicator {
    width: 7px;
    height: 7px;
    background: #aa91e8;
    border-radius: 50%;
    margin-top: 10px;
    position: absolute;
    top: 20px;
  }

  &::before > .today-indicator {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 32px; // 고정된 원의 너비
    height: 32px; // 고정된 원의 높이
    background-color: #aa91e8;
    border-radius: 50%;
    z-index: -1;
  }
`;

const TodayIndicator = ({ isToday }) => {
  return isToday ? <div className="today-indicator" /> : null;
};

const TaskIndicator = ({ hasTask }) => {
  return hasTask ? <div className="task-indicator" /> : null;
};

const Name = styled.div`
  color: #000;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.5px;
`;
