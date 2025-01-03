import { axiosInstance } from "../api/http";

// POST : 카카오 로그인 사용자 정보 가져오기
export const KakaoLogin = async (code) => {
  try {
    const response = await axiosInstance.post(
      "user/login/kakao/userinfo/",
      {
        code: code,
      },
      {
        headers: {
          Authorization: null, // 첫 요청 시 Authorization 헤더 제거
        },
      }
    );

    localStorage.setItem("user_id", response.data.user.id);
    localStorage.setItem("nickname", response.data.user.nickname);
    localStorage.setItem("token", response.data.token);

    // is_new_user 값에 따라서 기존 유저 처리하는 부분.
    // 백에서 boolean값을 넘겨줄 때 파이썬이라 첫 문자가 대문자인데, js에서는 boolean값을 소만자만 처리함.
    // 그래서 백으로부터 받은 값을 소문자로 처리해주는 코드 필요( 혹시 몰라서 문자열을 boolean값으로 처리하는 부분도 추가)
    if (String(response.data.user.is_new_user).toLowerCase() === "true") {
      // 처음 가입하는 유저라면 온보딩으로 이동
      window.location.replace("/signupintro");
    } else {
      // 기존에 가입한 기록이 있으면 홈으로 이동
      window.location.replace("/homemain");
    }

    return Promise.resolve(response.data);
  } catch (error) {
    console.error("Login failed:", error);

    // Handle error (e.g., show an alert or redirect to an error page)
    alert("로그인에 실패했습니다. 다시 시도해주세요.");
    window.location.replace("/"); // Redirect to an error page or a fallback
    return Promise.reject(error);
  }
};

// DELETE : 카카오 회원 탈퇴 (아직 구현 중)
export const DelKakaoAccount = async () => {
  try {
    const response = await axiosInstance.post("/accounts/kakao/delete/");
    console.log(response.data);
    alert("회원탈퇴가 완료되었습니다.");
    window.localStorage.clear();
    window.location.replace("/");
    return Promise.resolve(response.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert(error.response.data.error.non_field_errors);
    }
    console.error(error.response);
  }
};
