/**
 * 가짜 API 레이어 — axios와 동일한 인터페이스 유지
 * 실제 HTTP 요청 없이 mockData를 딜레이 후 반환
 */
import {
  MOCK_PROFILE,
  NOTICES,
  POLLS_ACTIVE,
  POLLS_ENDED,
  RESERVATION_ITEMS,
} from "../data/mockData";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const fakeDelay = () => sleep(Math.floor(Math.random() * 500) + 500);

const api = {
  get: async (url, config = {}) => {
    await fakeDelay();

    if (url === "/users/me") {
      return { data: MOCK_PROFILE };
    }

    if (url === "/notices") {
      const type = config?.params?.type;
      const data = type ? NOTICES.filter((n) => n.type === type) : NOTICES;
      return { data };
    }

    if (url === "/polls") {
      const active = config?.params?.active;
      return {
        data: active === "true"
          ? POLLS_ACTIVE.map((p) => ({ ...p, options: p.options.map((o) => ({ ...o })) }))
          : POLLS_ENDED.map((p) => ({ ...p, options: p.options.map((o) => ({ ...o })) })),
      };
    }

    if (url === "/reservations") {
      const myReservations = RESERVATION_ITEMS.filter((i) => !i.available)
        .slice(0, 2)
        .map((i) => ({ ...i, status: "active" }));
      return { data: myReservations };
    }

    if (url === "/reservations/items") {
      return { data: RESERVATION_ITEMS.map((i) => ({ ...i })) };
    }

    return { data: [] };
  },

  post: async (url, body = {}) => {
    await fakeDelay();

    if (url === "/auth/login") {
      return { data: { token: "sw-jwt-token-abc123xyz", user: MOCK_PROFILE } };
    }

    if (url === "/auth/register") {
      const yearLabelMap = { y1: "1학년", y2: "2학년", y3: "3학년", y4: "4학년" };
      const newUser = {
        ...MOCK_PROFILE,
        name: body.name || MOCK_PROFILE.name,
        studentId: body.studentId || MOCK_PROFILE.studentId,
        yearId: body.yearId || "y3",
        yearLabel: yearLabelMap[body.yearId] || "3학년",
      };
      return { data: { token: "sw-jwt-token-abc123xyz", user: newUser } };
    }

    if (url.match(/\/polls\/\d+\/vote/)) {
      return { data: { success: true } };
    }

    if (url === "/reservations") {
      return { data: { success: true, reservationId: Date.now() } };
    }

    return { data: { success: true } };
  },
};

export default api;
