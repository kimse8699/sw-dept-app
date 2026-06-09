require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, User, Notice, Poll, PollOption, Item } = require("./src/models");

async function seed() {
  try {
    // DB 연결 및 테이블 동기화
    await sequelize.sync({ force: true }); // 기존 데이터 초기화 후 재생성
    console.log("✅ 테이블 초기화 완료");

    // ── 유저 생성 ─────────────────────────────────
    const hashedPw = await bcrypt.hash("1234567", 10);
    const adminPw  = await bcrypt.hash("admin123", 10);

    const users = await User.bulkCreate([
      {
        name: "관리자",
        studentId: "00000000",
        email: "admin@swdept.kr",
        password: adminPw,
        yearId: "y1",
        yearLabel: "1학년",
        isAdmin: true,
      },
      {
        name: "김세훈",
        studentId: "20221001",
        email: "kimse@swdept.kr",
        password: hashedPw,
        yearId: "y3",
        yearLabel: "3학년",
        isAdmin: false,
      },
      {
        name: "이지은",
        studentId: "20231002",
        email: "jieun@swdept.kr",
        password: hashedPw,
        yearId: "y2",
        yearLabel: "2학년",
        isAdmin: false,
      },
      {
        name: "박민준",
        studentId: "20251003",
        email: "minjun@swdept.kr",
        password: hashedPw,
        yearId: "y1",
        yearLabel: "1학년",
        isAdmin: false,
      },
      {
        name: "최예린",
        studentId: "20211004",
        email: "yerin@swdept.kr",
        password: hashedPw,
        yearId: "y4",
        yearLabel: "4학년",
        isAdmin: false,
      },
    ]);
    console.log(`✅ 유저 ${users.length}명 생성`);

    // ── 공지사항 생성 ─────────────────────────────
    await Notice.bulkCreate([
      {
        title: "[필독] 2025-1학기 졸업요건 안내",
        content: "졸업을 앞둔 4학년 학생들은 졸업요건을 반드시 확인하시기 바랍니다.\n\n1. 전공 학점 72학점 이상\n2. 교양 학점 36학점 이상\n3. 졸업 프로젝트 이수\n4. 영어 공인 점수 제출 (TOEIC 700 이상)\n\n문의: 학과 사무실 (02-XXXX-XXXX)",
        type: "필독",
        createdById: 1,
        createdByName: "관리자",
        views: 42,
      },
      {
        title: "중간고사 기간 강의실 개방 안내",
        content: "중간고사 기간(4월 14일 ~ 4월 18일) 동안 아래 강의실을 개방합니다.\n\n- 공학관 301호: 09:00 ~ 22:00\n- 공학관 302호: 09:00 ~ 22:00\n\n이용 시 조용한 분위기 유지 부탁드립니다.",
        type: "일반",
        createdById: 1,
        createdByName: "관리자",
        views: 87,
      },
      {
        title: "2025-1학기 장학금 신청 안내",
        content: "성적 우수 장학금 및 교내 근로 장학금 신청을 받습니다.\n\n신청 기간: 4월 15일 ~ 4월 30일\n신청 방법: 학생 포털 → 장학 → 장학금 신청\n\n성적 우수: 직전 학기 4.0 이상\n근로 장학: 주 15시간 이내",
        type: "장학",
        createdById: 1,
        createdByName: "관리자",
        views: 134,
      },
      {
        title: "캡스톤디자인 발표 일정 공지",
        content: "2025-1학기 캡스톤디자인 중간 발표 일정을 안내합니다.\n\n일시: 5월 8일(목) 14:00 ~ 18:00\n장소: 공학관 대강당\n발표 시간: 팀당 10분 발표 + 5분 Q&A\n\n발표 자료는 5월 5일까지 제출해주세요.",
        type: "학사",
        createdById: 1,
        createdByName: "관리자",
        views: 63,
      },
      {
        title: "SW 학과 MT 감사 행사 안내",
        content: "지난 학과 MT에 참석해주신 모든 분들께 감사드립니다.\n다음 행사도 많은 참여 부탁드립니다.",
        type: "일반",
        createdById: 1,
        createdByName: "관리자",
        views: 29,
      },
    ]);
    console.log("✅ 공지사항 5개 생성");

    // ── 투표 생성 ─────────────────────────────────
    const poll1 = await Poll.create({
      title: "소프트웨어학과 MT 장소 투표",
      desc: "이번 학기 MT 장소를 선택해주세요!",
      isActive: true,
      deadline: new Date("2025-05-01"),
      total: 15,
      createdById: 1,
    });
    await PollOption.bulkCreate([
      { pollId: poll1.id, text: "강원도 속초", votes: 7 },
      { pollId: poll1.id, text: "충청도 단양", votes: 5 },
      { pollId: poll1.id, text: "경기도 가평", votes: 3 },
    ]);

    const poll2 = await Poll.create({
      title: "종강파티 날짜 선택",
      desc: "종강파티 날짜를 투표로 정합니다.",
      isActive: true,
      deadline: new Date("2025-06-15"),
      total: 8,
      createdById: 1,
    });
    await PollOption.bulkCreate([
      { pollId: poll2.id, text: "6월 20일 (금)", votes: 4 },
      { pollId: poll2.id, text: "6월 21일 (토)", votes: 3 },
      { pollId: poll2.id, text: "6월 22일 (일)", votes: 1 },
    ]);

    const poll3 = await Poll.create({
      title: "학과 티셔츠 색상 투표",
      desc: "학과 단체 티셔츠 색상을 골라주세요.",
      isActive: false,
      total: 31,
      createdById: 1,
    });
    await PollOption.bulkCreate([
      { pollId: poll3.id, text: "네이비", votes: 18 },
      { pollId: poll3.id, text: "스카이블루", votes: 9 },
      { pollId: poll3.id, text: "화이트", votes: 4 },
    ]);
    console.log("✅ 투표 3개 생성");

    // ── 기자재 생성 ───────────────────────────────
    await Item.bulkCreate([
      { name: "노트북 A (맥북 Pro)", category: "노트북", description: "Apple MacBook Pro 14인치 M3", available: true },
      { name: "노트북 B (LG 그램)", category: "노트북", description: "LG gram 16인치", available: true },
      { name: "노트북 C (삼성 갤럭시북)", category: "노트북", description: "Samsung Galaxy Book4 Pro", available: false, reservedBy: "김세훈" },
      { name: "빔프로젝터 1호", category: "빔프로젝터", description: "Epson EB-X51 (3800루멘)", available: true },
      { name: "빔프로젝터 2호", category: "빔프로젝터", description: "BenQ MH550 (3500루멘)", available: true },
      { name: "삼각대 세트 A", category: "촬영장비", description: "Manfrotto 삼각대 + 볼헤드", available: true },
      { name: "DSLR 카메라", category: "촬영장비", description: "Canon EOS 90D", available: false, reservedBy: "이지은" },
      { name: "아두이노 키트 (10개)", category: "실습장비", description: "Arduino Uno R3 + 부품 세트", available: true },
      { name: "라즈베리파이 키트", category: "실습장비", description: "Raspberry Pi 4 Model B 8GB", available: true },
      { name: "VR 헤드셋 (Quest 3)", category: "VR/AR", description: "Meta Quest 3 128GB", available: true },
    ]);
    console.log("✅ 기자재 10개 생성");

    console.log("\n🎉 시드 데이터 입력 완료!");
    console.log("\n📋 테스트 계정:");
    console.log("  관리자  → 학번: 00000000  비번: admin123");
    console.log("  3학년   → 학번: 20221001  비번: 1234567  (김세훈)");
    console.log("  2학년   → 학번: 20231002  비번: 1234567  (이지은)");
    console.log("  1학년   → 학번: 20251003  비번: 1234567  (박민준)");
    console.log("  4학년   → 학번: 20211004  비번: 1234567  (최예린)");
  } catch (err) {
    console.error("❌ 시드 오류:", err.message);
  } finally {
    await sequelize.close();
  }
}

seed();
