import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const NAVY = "#1B3080";
const SKY = "#5BC8EA";
const NAVY_LIGHT = "#1B308010";
const SKY_LIGHT = "#5BC8EA18";

const TAG_COLORS = {
  필독: { bg: "#fee2e2", text: "#ef4444" },
  학사: { bg: "#dbeafe", text: "#3b82f6" },
  장학: { bg: "#dcfce7", text: "#16a34a" },
  일반: { bg: NAVY_LIGHT, text: NAVY },
};

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth();
  const displayName = profile?.name || "사용자";
  const displayYear = profile?.yearLabel || "";

  const [notices, setNotices] = useState([]);
  const [activePoll, setActivePoll] = useState(null);
  const [reservationCount, setReservationCount] = useState(0);
  const [voteCount, setVoteCount] = useState(0);

  const gridItems = [
    { name: "학과 일정", icon: "calendar-blank", screen: "Calendar", color: NAVY },
    { name: "게시판", icon: "comment-text-multiple", screen: "Notice", color: NAVY },
    { name: "기자재", icon: "robot-industrial", screen: "Reservation", color: NAVY },
    { name: "QnA", icon: "frequently-asked-questions", screen: "Chatbot", color: NAVY },
  ];

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [noticeRes, pollRes, reserveRes] = await Promise.all([
        api.get("/notices"),
        api.get("/polls", { params: { active: "true" } }),
        api.get("/reservations"),
      ]);
      setNotices(noticeRes.data.slice(0, 2));
      setActivePoll(pollRes.data[0] || null);
      setReservationCount(reserveRes.data.filter((r) => r.status === "active").length);
      setVoteCount(pollRes.data.filter((p) => p.myVote !== null).length);
    } catch (e) {
      console.error("홈 데이터 로딩 실패:", e.message);
    }
  };

  function formatTime(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 60) return `${min}분 전`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}시간 전`;
    return `${Math.floor(hr / 24)}일 전`;
  }

  function getPollRemaining(deadline) {
    if (!deadline) return null;
    const diff = new Date(deadline) - Date.now();
    if (diff <= 0) return null;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}일 남음`;
    if (hours > 0) return `${hours}시간 남음`;
    return "곧 마감";
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* ── 헤더 ── */}
        <View style={styles.header}>
          <View style={styles.logoArea}>
            <View style={styles.swBadge}>
              <Text style={styles.swS}>S</Text>
              <Text style={styles.swW}>W</Text>
            </View>
            <Text style={styles.logoText}>SOFTWARE</Text>
          </View>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="notifications-outline" size={24} color="#1a1a1a" />
            <View style={[styles.notificationDot, { backgroundColor: NAVY }]} />
          </TouchableOpacity>
        </View>

        {/* ── 웰컴 카드 ── */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeDecoLeft} />
          <View style={styles.welcomeDecoRight} />
          <View style={styles.welcomeTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeName}>{displayName}님, 안녕하세요!</Text>
              <Text style={styles.welcomeDept}>소프트웨어융합학과 · {displayYear}</Text>
            </View>
          </View>
          <View style={styles.welcomeStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{reservationCount}</Text>
              <Text style={styles.statLabel}>예약 중</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{voteCount}</Text>
              <Text style={styles.statLabel}>투표 참여</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{notices.length}</Text>
              <Text style={styles.statLabel}>최근 공지</Text>
            </View>
          </View>
        </View>

        {/* ── 진행 중인 투표 배너 ── */}
        {activePoll && (
          <TouchableOpacity
            style={styles.activeBanner}
            onPress={() => navigation.navigate("투표")}
          >
            <View style={[styles.bannerIconBg, { backgroundColor: SKY }]}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={22} color="white" />
            </View>
            <View style={styles.bannerCenter}>
              <Text style={[styles.bannerTag, { color: SKY }]}>🗳️ 투표 진행 중</Text>
              <Text style={styles.bannerTitle} numberOfLines={1}>{activePoll.title}</Text>
            </View>
            <View style={styles.bannerRight}>
              {getPollRemaining(activePoll.deadline) && (
                <Text style={styles.bannerTime}>{getPollRemaining(activePoll.deadline)}</Text>
              )}
              <Ionicons name="chevron-forward" size={16} color="#bbb" />
            </View>
          </TouchableOpacity>
        )}

        {/* ── 빠른 메뉴 그리드 ── */}
        <View style={styles.gridContainer}>
          {gridItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[
                styles.iconBox,
                index % 2 === 0 ? { backgroundColor: NAVY_LIGHT } : { backgroundColor: SKY_LIGHT },
              ]}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={30}
                  color={index % 2 === 0 ? NAVY : SKY}
                />
              </View>
              <Text style={styles.gridText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── 최근 공지 ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleWrap}>
            <View style={[styles.sectionAccent, { backgroundColor: NAVY }]} />
            <Text style={styles.sectionTitle}>최근 공지</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Notice")}>
            <Text style={[styles.moreText, { color: NAVY }]}>전체보기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listCard}>
          {notices.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyRowText}>공지사항이 없습니다</Text>
            </View>
          ) : (
            notices.map((notice, index) => (
              <TouchableOpacity
                key={notice.id}
                style={[styles.listItem, index === 0 && styles.firstListItem]}
                onPress={() => navigation.navigate("Notice")}
              >
                <View style={[
                  styles.noticeTag,
                  { backgroundColor: TAG_COLORS[notice.type]?.bg || NAVY_LIGHT },
                ]}>
                  <Text style={[
                    styles.noticeTagText,
                    { color: TAG_COLORS[notice.type]?.text || NAVY },
                  ]}>
                    {notice.type}
                  </Text>
                </View>
                <Text style={styles.listText} numberOfLines={1}>{notice.title}</Text>
                <Text style={styles.listTime}>{formatTime(notice.createdAt)}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── 챗봇 플로팅 버튼 ── */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: NAVY }]}
        onPress={() => navigation.navigate("Chatbot")}
      >
        <Ionicons name="chatbubble-ellipses" size={26} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F7FA" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: Platform.OS === "android" ? 20 : 10 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", height: 60, marginBottom: 16 },
  logoArea: { flexDirection: "row", alignItems: "center", gap: 10 },
  swBadge: { flexDirection: "row", width: 38, height: 38, borderRadius: 10, overflow: "hidden", borderWidth: 1.5, borderColor: "#e2e8f0" },
  swS: { flex: 1, backgroundColor: SKY, color: "white", fontWeight: "900", fontSize: 14, textAlign: "center", textAlignVertical: "center", lineHeight: 35 },
  swW: { flex: 1, backgroundColor: NAVY, color: "white", fontWeight: "900", fontSize: 14, textAlign: "center", textAlignVertical: "center", lineHeight: 35 },
  logoText: { fontSize: 18, fontWeight: "900", color: NAVY, letterSpacing: 1 },
  headerIconBtn: { padding: 8, position: "relative" },
  notificationDot: { position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: 3.5, borderWidth: 1.5, borderColor: "#F5F7FA" },

  welcomeCard: { backgroundColor: NAVY, borderRadius: 24, padding: 22, marginBottom: 16, overflow: "hidden", shadowColor: NAVY, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  welcomeDecoLeft: { position: "absolute", top: -30, left: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: SKY, opacity: 0.2 },
  welcomeDecoRight: { position: "absolute", bottom: -40, right: -20, width: 130, height: 130, borderRadius: 65, backgroundColor: SKY, opacity: 0.15 },
  welcomeTop: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  welcomeName: { fontSize: 20, fontWeight: "800", color: "white", marginBottom: 6 },
  welcomeDept: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: "500" },
  welcomeStats: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, padding: 14 },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 22, fontWeight: "900", color: "white", marginBottom: 2 },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
  statDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)", marginVertical: 4 },

  activeBanner: { flexDirection: "row", alignItems: "center", backgroundColor: "white", padding: 16, borderRadius: 20, marginBottom: 20, borderWidth: 1.5, borderColor: SKY + "50", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  bannerIconBg: { width: 42, height: 42, borderRadius: 13, justifyContent: "center", alignItems: "center", marginRight: 12 },
  bannerCenter: { flex: 1 },
  bannerTag: { fontSize: 11, fontWeight: "700", marginBottom: 3 },
  bannerTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  bannerRight: { flexDirection: "row", alignItems: "center" },
  bannerTime: { fontSize: 12, color: "#94a3b8", marginRight: 4 },

  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 },
  gridItem: { width: "48%", backgroundColor: "white", padding: 18, borderRadius: 22, alignItems: "center", marginBottom: 14, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  iconBox: { width: 60, height: 60, borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  gridText: { fontSize: 14, fontWeight: "700", color: "#1e293b" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingHorizontal: 2 },
  sectionTitleWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionAccent: { width: 4, height: 18, borderRadius: 2 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },
  moreText: { fontSize: 13, fontWeight: "600" },

  listCard: { backgroundColor: "white", borderRadius: 20, overflow: "hidden", marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  listItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: "#f8fafc" },
  firstListItem: { borderTopWidth: 0 },
  noticeTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 10 },
  noticeTagText: { fontSize: 12, fontWeight: "700" },
  listText: { fontSize: 14, color: "#334155", flex: 1, fontWeight: "600" },
  listTime: { fontSize: 12, color: "#94a3b8", marginLeft: 8 },
  emptyRow: { paddingVertical: 20, alignItems: "center" },
  emptyRowText: { fontSize: 14, color: "#94a3b8" },

  fab: { position: "absolute", bottom: 24, right: 20, width: 58, height: 58, borderRadius: 20, justifyContent: "center", alignItems: "center", shadowColor: NAVY, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8 },
});
