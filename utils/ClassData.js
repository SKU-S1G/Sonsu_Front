import SignImage from "../assets/images/Sign.png";

const classData = {
  초급: [
    { id: 1, title: "지문자, 지숫자", animationPath: SignImage, topics: ["자음", "모음", "숫자", "단위"] },
    { id: 2, title: "인사 표현", animationPath: SignImage, topics: ["안녕하세요"] },
    { id: 3, title: "감정 표현", animationPath: SignImage, topics: ["감사합니다", "미안합니다", "사랑합니다", "괜찮아요"] },
    { id: 4, title: "날짜 및 시간", animationPath: SignImage, topics: ["년", "월", "일", "시", "분", "초", "요일", "내일", "어제", "모레", "그제"] },
    { id: 5, title: "인칭 대명사", animationPath: SignImage, topics: ["나", "너", "우리", "엄마", "아빠", "동생"] },
    { id: 6, title: "부사", animationPath: SignImage, topics: ["잘", "못 (잘 부탁드립니다의 잘 같은)"] },
    { id: 7, title: "명사", animationPath: SignImage, topics: ["사과", "봄", "여름"] },
    { id: 8, title: "동사", animationPath: SignImage, topics: ["간다", "온다", "하다", "덥다", "춥다"] },
  ],
  중급: [
    { id: 1, title: "인삿말", animationPath: SignImage, topics: ["안녕하세요", "제 이름은 ~~~입니다.", "만나서 반갑습니다.", "잘 부탁드립니다"] },
    { id: 2, title: "3인칭", animationPath: SignImage, topics: ["엄마 배고파요 밥 주세요", "우리는 사과를 먹었다", "동생은 학교에 갔다"] },
    { id: 3, title: "날짜 및 시간 활용 문장", animationPath: SignImage, topics: ["제 생일은 ~월 ~일 입니다.", "제 나이는 ~살입니다.", "지금은 ~시 ~분 입니다."] },
    { id: 4, title: "감정 표현", animationPath: SignImage, topics: ["늦어서 죄송합니다", "엄마는 아빠를 사랑해", "기다려주셔서 감사합니다."] },
    { id: 5, title: "기타 문장", animationPath: SignImage, topics: ["봄이 왔어요", "겨울이 와서 날씨가 추워요", "아이스 아메리카노 하나 주세요", "얼마에요?", "~갈려면 어디로 가야해요?"] },
  ],
  고급: [
    { id: 1, title: "병원", animationPath: SignImage, topics: ["정맥주사", "인턴", "유행", "산소소흡기", "심폐소생술"] },
    { id: 2, title: "법", animationPath: SignImage, topics: ["제 3자", "전과", "고발", "전과자", "항소", "고등법원", "가정법원", "특허권"] },
    { id: 3, title: "속담", animationPath: SignImage, topics: ["가는 말이 고와야 오는 말이 곱다.", "돌다리도 두들겨 보고 건너라", "소 잃고 외양간 고치기", "마른 하늘에 날벼락"] },
    { id: 4, title: "학교", animationPath: SignImage, topics: ["수재", "공부를 잘하다", "복습", "학습"] },
    { id: 5, title: "기타", animationPath: SignImage, topics: ["눈치채다", "비위가 상하다"] },
  ],
};

export default classData;
