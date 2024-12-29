import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Header from "../../components/BackHeader.jsx";

import GlobalStyle from "../../style/GlobalStyle.js";
import KkaebiProfileImg from "../../images/KkaebiProfile.svg";
import NoNotification from "../../images/NoWorkRecord.svg";

const HomeStatisticsPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_PORT}home/distribution/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const json = await response.json();
          setData({
            ...json,
            distribution: json.distribution || [],
            house_completion_rate: json.house_completion_rate || "0%",
          });
        } else {
          console.error("Failed to fetch statistics", response.status);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  console.log(data);

  if (!data) {
    return <div></div>;
  }

  if (
    !data ||
    data.house_completion_rate === "none" ||
    data.total_house_tasks === 0
  ) {
    return (
      <>
        <GlobalStyle />
        <Header title="집안일 통계" pageurl={"/homemain"} />
        <NoDataContainer>
          <NoImage src={NoNotification} alt="No Work Record" />
        </NoDataContainer>
      </>
    );
  }

  const calculateSlices = () => {
    let endAngle = 360;

    const validMembers = data.distribution
      .filter((member) => member.total_tasks > 0)
      .sort((a, b) => b.total_tasks - a.total_tasks);

    if (validMembers.length === 1) {
      const singleMember = validMembers[0];
      return [
        {
          startAngle: 0,
          endAngle: 360,
          color: "rgba(170, 145, 232, 1)",
          nickname: singleMember.nickname || "Unknown",
        },
      ];
    }

    const totalTasks = validMembers.reduce(
      (sum, member) => sum + member.total_tasks,
      0
    );

    const totalMembers = validMembers.length;

    return validMembers.map((member, index) => {
      const percentage = member.total_tasks / totalTasks;
      const startAngle = endAngle - percentage * 360;

      const opacity = (totalMembers - index) / totalMembers;

      const slice = {
        startAngle,
        endAngle,
        color: `rgba(170, 145, 232, ${opacity.toFixed(2)})`,
        nickname: member.nickname || "Unknown",
      };
      endAngle = startAngle;
      return slice;
    });
  };

  const slices = calculateSlices();

  const completionRate = parseInt(data.house_completion_rate, 10);

  const completionSlices =
    completionRate === 100
      ? [
          {
            startAngle: 0,
            endAngle: 360,
            color: "#AA91E8",
            label: "완료",
          },
        ]
      : completionRate === 0
      ? [
          {
            startAngle: 0,
            endAngle: 360,
            color: "#D2D2D2",
            label: "미완료",
          },
        ]
      : [
          {
            startAngle: 0,
            endAngle: ((100 - completionRate) / 100) * 360,
            color: "#D2D2D2",
            label: "미완료",
          },
          {
            startAngle: ((100 - completionRate) / 100) * 360,
            endAngle: 360,
            color: "#AA91E8",
            label: "완료",
          },
        ];

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    if (startAngle === endAngle) {
      return `
              M ${x - radius}, ${y} 
              a ${radius},${radius} 0 1,0 ${radius * 2},0 
              a ${radius},${radius} 0 1,0 ${-radius * 2},0
            `;
    }

    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      x,
      y,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <>
      <GlobalStyle />
      <Header title="집안일 통계" pageurl={"/homemain"} />
      <Container>
        <Section>
          <Kkaebi>
            <KkaebiProfile src={KkaebiProfileImg} alt="깨비 프로필 이미지" />
            <Comment1>이번 주</Comment1>
            <Comment2> 집안일 분배 </Comment2>
            <Comment1> 현황이에요.</Comment1>
          </Kkaebi>
          <PieChart>
            <svg width="200" height="200" viewBox="0 0 200 200">
              {slices.length === 1 ? (
                <circle
                  cx="100" // 중심점 x 좌표
                  cy="100" // 중심점 y 좌표
                  r="100" // 반지름
                  fill={slices[0].color} // 단일 멤버의 색상
                />
              ) : (
                // 여러 멤버가 있을 경우 기존의 describeArc를 사용
                slices.map((slice, index) => (
                  <path
                    key={index}
                    d={describeArc(
                      100, // 중심점 x 좌표
                      100, // 중심점 y 좌표
                      100, // 반지름
                      slice.startAngle,
                      slice.endAngle
                    )}
                    fill={slice.color}
                  />
                ))
              )}
            </svg>
          </PieChart>

          <Legend>
            {slices.map((slice, index) => (
              <LegendItem key={index}>
                <ColorBox style={{ backgroundColor: slice.color }} />
                <Nickname>{slice.nickname}</Nickname>
              </LegendItem>
            ))}
          </Legend>
        </Section>
        <Section>
          <Kkaebi>
            <KkaebiProfile src={KkaebiProfileImg} alt="깨비 프로필 이미지" />
            <Comment1>이번 주</Comment1>
            <Comment2> 집안일 완료 </Comment2>
            <Comment1> 현황이에요.</Comment1>
          </Kkaebi>
          <PieChart>
            <svg width="200" height="200" viewBox="0 0 200 200">
              {completionRate === 100 ? (
                <circle cx="100" cy="100" r="100" fill="#AA91E8" />
              ) : completionRate === 0 ? (
                <circle cx="100" cy="100" r="100" fill="#D2D2D2" />
              ) : (
                completionSlices.map((slice, index) => (
                  <path
                    key={index}
                    d={describeArc(
                      100, // 중심점 x 좌표
                      100, // 중심점 y 좌표
                      100, // 반지름
                      slice.startAngle,
                      slice.endAngle
                    )}
                    fill={slice.color}
                  />
                ))
              )}
            </svg>
          </PieChart>

          <Legend>
            {[...completionSlices].reverse().map((slice, index) => (
              <LegendItem key={index}>
                <ColorBox style={{ backgroundColor: slice.color }} />
                <Nickname>{slice.label}</Nickname>
              </LegendItem>
            ))}
          </Legend>
        </Section>
      </Container>
    </>
  );
};

export default HomeStatisticsPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  justify-content: space-around;
  min-height: calc(100vh - 69px);
  background-color: #fafafa;
`;

const Section = styled.div`
  margin-bottom: 30px;
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
  margin-bottom: 16px;
`;

const KkaebiProfile = styled.img`
  width: 45px;
  height: 45px;
  margin-right: 16px;
`;

const Comment1 = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
`;

const Comment2 = styled.div`
  color: var(--key_purple, #aa91e8);
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%;

  white-space: pre-wrap;
`;

const PieChart = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;

  path {
    transform-origin: 100px 100px; /* 중심 기준 회전 */
    animation: rotateIn 1s ease-out forwards; /* 회전 애니메이션 */
    opacity: 0; /* 초기 상태: 투명 */
  }

  @keyframes rotateIn {
    0% {
      transform: rotate(0deg); /* 시작 각도 */
      opacity: 0; /* 시작 시 투명 */
    }
    100% {
      transform: rotate(360deg); /* 최종 각도 */
      opacity: 1; /* 최종 상태: 불투명 */
    }
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16.5px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-right: 0; /* 마지막 아이템의 margin-right 제거 */
  }
`;

const ColorBox = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  margin-right: 12px;
`;

const Nickname = styled.div`
  color: #000;
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 109px);
`;

const NoImage = styled.img`
  width: 337px;
  height: 260px;
`;
