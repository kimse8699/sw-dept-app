export const MOCK_PROFILE = {
  id: 1,
  name: "김소연",
  studentId: "2022110234",
  yearId: "y3",
  yearLabel: "3학년",
  email: "soyeon@sw.ac.kr",
  isAdmin: false,
};

export const NOTICES = [
  {
    id: 1,
    type: "필독",
    title: "2026년 1학기 기말고사 일정 및 유의사항 안내",
    content:
      "안녕하세요, 소프트웨어융합학과 학생 여러분.\n\n2026년 1학기 기말고사 일정을 안내드립니다.\n\n■ 시험 기간: 2026년 6월 16일(화) ~ 6월 20일(토)\n■ 시험 범위: 각 교과목 교수님께 확인\n\n■ 유의사항\n- 시험 시작 10분 전까지 입실 완료\n- 신분증(학생증) 반드시 지참\n- 부정행위 적발 시 해당 과목 0점 처리\n\n건강한 마무리 되시길 바랍니다.",
    createdAt: "2026-06-07T09:00:00Z",
    views: 412,
  },
  {
    id: 2,
    type: "장학",
    title: "2026년 국가장학금 2차 신청 기간 안내 (6/10~6/23)",
    content:
      "안녕하세요.\n\n2026년 국가장학금 2차 신청 기간을 안내드립니다.\n\n■ 신청 기간: 2026년 6월 10일(수) ~ 6월 23일(화) 18:00\n■ 신청 방법: 한국장학재단 홈페이지 또는 모바일 앱\n■ 지원 대상: 대학(원)에 재·편입학하는 학생\n\n※ 가구원 정보 제공 동의 필요\n※ 기한 내 미신청 시 장학금 수혜 불가\n\n자세한 사항은 학생처 장학팀(내선 1234)으로 문의하세요.",
    createdAt: "2026-06-06T14:00:00Z",
    views: 228,
  },
  {
    id: 3,
    type: "학사",
    title: "2026-1학기 수강 변경(취소) 신청 기간 안내",
    content:
      "소프트웨어융합학과 학생 여러분께 수강 변경 및 취소 신청 기간을 안내드립니다.\n\n■ 신청 기간: 2026년 6월 9일(월) ~ 6월 11일(수)\n■ 신청 방법: 학생정보시스템 → 수강신청 메뉴\n■ 유의사항\n  - 수강 취소 시 해당 학점 반영 불가\n  - 최소 이수 학점(12학점) 미만이 되지 않도록 주의\n\n문의: 교학처 학사팀 (내선 2345)",
    createdAt: "2026-06-05T10:30:00Z",
    views: 267,
  },
  {
    id: 4,
    type: "일반",
    title: "소프트웨어융합학과 2026 여름 MT 참가 신청 안내",
    content:
      "안녕하세요, 소프트웨어융합학과 학생회입니다.\n\n이번 여름 MT를 아래와 같이 진행합니다.\n\n■ 일정: 2026년 7월 3일(금) ~ 7월 4일(토) 1박 2일\n■ 장소: 가평 청평 OO 펜션 (버스 이동)\n■ 참가비: 4만원\n■ 신청 기간: 6월 9일 ~ 6월 20일\n\n많은 참여 부탁드립니다!",
    createdAt: "2026-06-04T16:00:00Z",
    views: 134,
  },
  {
    id: 5,
    type: "학사",
    title: "캡스톤 디자인 최종 발표 일정 및 장소 안내",
    content:
      "캡스톤 디자인 수강 학생 여러분께 최종 발표 일정을 안내드립니다.\n\n■ 발표 일시: 2026년 6월 18일(목) 14:00 ~ 18:00\n■ 장소: 공학관 B101호\n■ 발표 순서: 수업 시간 공지 예정\n\n■ 평가 항목\n  - 주제 구체성 (20점)\n  - 기술적 완성도 (40점)\n  - 발표 능력 (20점)\n  - Q&A 대응 (20점)\n\n발표 자료는 6월 17일 오전까지 교수님 이메일로 제출 바랍니다.",
    createdAt: "2026-06-03T11:00:00Z",
    views: 198,
  },
  {
    id: 6,
    type: "필독",
    title: "실습실 기자재 파손·분실 시 보고 절차 안내",
    content:
      "소프트웨어융합학과 학생 여러분께 기자재 관련 안내를 드립니다.\n\n실습실 내 기자재 파손 또는 분실 발생 시 즉시 아래 절차에 따라 신고해 주시기 바랍니다.\n\n1. 즉시 조교 또는 담당 교수님께 구두 보고\n2. 학과 사무실 방문 후 '기자재 파손 보고서' 작성\n3. 파손 원인에 따라 변상 여부 결정\n\n파손 후 방치하거나 은폐할 경우 더 큰 불이익이 발생할 수 있습니다.",
    createdAt: "2026-06-01T09:00:00Z",
    views: 88,
  },
];

export const POLLS_ACTIVE = [
  {
    id: 1,
    title: "다음 학과 세미나 주제 선택",
    desc: "6월 세미나에서 다룰 주제를 투표해주세요.",
    deadline: "2026-06-15T23:59:00Z",
    myVote: null,
    total: 47,
    options: [
      { id: 101, text: "AI · 머신러닝 최신 트렌드", votes: 21 },
      { id: 102, text: "클라우드 & DevOps 실전", votes: 14 },
      { id: 103, text: "웹/앱 창업 사례 분석", votes: 8 },
      { id: 104, text: "사이버보안 기초와 실습", votes: 4 },
    ],
  },
  {
    id: 2,
    title: "학과 MT 날짜 최종 결정",
    desc: "일정 중 참석 가능한 날짜를 선택해주세요.",
    deadline: "2026-06-12T23:59:00Z",
    myVote: null,
    total: 63,
    options: [
      { id: 201, text: "7월 3일(금) ~ 4일(토)", votes: 38 },
      { id: 202, text: "7월 10일(금) ~ 11일(토)", votes: 25 },
    ],
  },
];

export const POLLS_ENDED = [
  {
    id: 10,
    title: "2026년 학과 대표 티셔츠 디자인 선택",
    desc: "최종 3개 디자인 중 선호하는 안을 선택해주세요.",
    deadline: "2026-05-25T23:59:00Z",
    myVote: 302,
    total: 89,
    options: [
      { id: 301, text: "A안 - 심플 로고 포인트", votes: 12 },
      { id: 302, text: "B안 - 미니멀 타이포그래피", votes: 51 },
      { id: 303, text: "C안 - 컬러블록 패턴", votes: 26 },
    ],
  },
  {
    id: 11,
    title: "1학기 학과 행사 만족도 조사",
    desc: "이번 학기 학과 행사에 대한 만족도를 알려주세요.",
    deadline: "2026-05-31T23:59:00Z",
    myVote: null,
    total: 54,
    options: [
      { id: 401, text: "매우 만족", votes: 18 },
      { id: 402, text: "만족", votes: 22 },
      { id: 403, text: "보통", votes: 11 },
      { id: 404, text: "불만족", votes: 3 },
    ],
  },
];

export const RESERVATION_ITEMS = [
  { id: 1, name: '맥북 프로 14" (1번)', category: "노트북", description: "Apple M3 Pro · 18GB RAM", available: true, reservedBy: null },
  { id: 2, name: '맥북 프로 14" (2번)', category: "노트북", description: "Apple M3 Pro · 18GB RAM", available: false, reservedBy: "이준혁 (24학번)" },
  { id: 3, name: "ThinkPad X1 Carbon", category: "노트북", description: "Intel i7 · 16GB RAM", available: true, reservedBy: null },
  { id: 4, name: "Dell XPS 15", category: "노트북", description: "Intel i9 · 32GB RAM", available: false, reservedBy: "박지민 (23학번)" },
  { id: 5, name: "엡손 EB-2265U", category: "빔프로젝터", description: "WUXGA 5500안시 · 레이저", available: true, reservedBy: null },
  { id: 6, name: "소니 VPL-FHZ85", category: "빔프로젝터", description: "WUXGA 8000안시", available: false, reservedBy: "김태양 (25학번)" },
  { id: 7, name: "소니 ZV-E10 (1번)", category: "촬영장비", description: "APS-C · 미러리스 카메라", available: true, reservedBy: null },
  { id: 8, name: "소니 ZV-E10 (2번)", category: "촬영장비", description: "APS-C · 미러리스 카메라", available: true, reservedBy: null },
  { id: 9, name: "DJI 오즈모 포켓 3", category: "촬영장비", description: "소형 짐벌 카메라", available: false, reservedBy: "최수빈 (22학번)" },
  { id: 10, name: "Arduino Mega Kit", category: "실습장비", description: "아두이노 메가 + 센서 세트", available: true, reservedBy: null },
  { id: 11, name: "Raspberry Pi 4B", category: "실습장비", description: "8GB RAM · 공식 키트", available: true, reservedBy: null },
  { id: 12, name: "Meta Quest 3", category: "VR/AR", description: "VR 헤드셋 · 128GB", available: true, reservedBy: null },
  { id: 13, name: "Microsoft HoloLens 2", category: "VR/AR", description: "AR 헤드셋 · 혼합현실", available: false, reservedBy: "정서연 (23학번)" },
];
