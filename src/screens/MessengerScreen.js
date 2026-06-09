import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NAVY = "#1B3080";
const SKY = "#5BC8EA";

const ALL_ROOMS = [
  {
    id: "notice",
    name: "📢 학과 공지방",
    lastMsg: "기말고사 기간 강의실 개방 안내입니다.",
    time: "오전 9:15",
    unread: 3,
    icon: "megaphone-outline",
    color: NAVY,
    yearId: "notice",
    yearLabel: "전체 공지",
  },
  {
    id: "y1",
    name: "25학번 (1학년)",
    lastMsg: "알고리즘 과제 어떻게 하고 계세요?",
    time: "오전 9:41",
    unread: 12,
    icon: "people-outline",
    color: SKY,
    yearId: "y1",
    yearLabel: "1학년",
  },
  {
    id: "y2",
    name: "24학번 (2학년)",
    lastMsg: "자료구조 시험 범위 어디까지예요?",
    time: "오전 8:30",
    unread: 5,
    icon: "people-outline",
    color: "#3B82F6",
    yearId: "y2",
    yearLabel: "2학년",
  },
  {
    id: "y3",
    name: "23학번 (3학년)",
    lastMsg: "캡스톤 발표 준비 다들 어떻게 하고 있어요?",
    time: "오전 10:02",
    unread: 7,
    icon: "people-outline",
    color: "#6366F1",
    yearId: "y3",
    yearLabel: "3학년",
  },
  {
    id: "y4",
    name: "22학번 (4학년)",
    lastMsg: "졸업사진 촬영 일정 확인하세요!",
    time: "어제",
    unread: 2,
    icon: "people-outline",
    color: "#8B5CF6",
    yearId: "y4",
    yearLabel: "4학년",
  },
];

const ADMIN_TABS = ["전체", "1학년", "2학년", "3학년", "4학년"];

const getVisibleRooms = (user) => {
  if (user?.isAdmin) return ALL_ROOMS;
  return ALL_ROOMS.filter(
    (r) => r.yearId === "notice" || r.yearId === user?.yearId
  );
};

export default function MessengerScreen({ navigation }) {
  const { profile } = useAuth();
  const [adminTab, setAdminTab] = useState("전체");

  const currentUser = {
    yearId: profile?.yearId || "y1",
    isAdmin: profile?.isAdmin || false,
  };
  const visibleRooms = getVisibleRooms(currentUser);

  const displayedRooms = currentUser.isAdmin && adminTab !== "전체"
    ? visibleRooms.filter((r) => r.yearId === "notice" || r.yearLabel === adminTab)
    : visibleRooms;

  const totalUnread = visibleRooms.reduce((sum, r) => sum + r.unread, 0);

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>채팅</Text>
          {totalUnread > 0 && (
            <Text style={styles.headerSub}>읽지 않은 메시지 {totalUnread}개</Text>
          )}
        </View>
        {currentUser.isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>관리자</Text>
          </View>
        )}
      </View>

      {/* 관리자 전용: 학년별 탭 필터 */}
      {currentUser.isAdmin && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabContent}
        >
          {ADMIN_TABS.map((tab) => {
            const tabUnread = tab === "전체"
              ? totalUnread
              : ALL_ROOMS.filter((r) => r.yearLabel === tab)
                  .reduce((s, r) => s + r.unread, 0);
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, adminTab === tab && styles.tabBtnActive]}
                onPress={() => setAdminTab(tab)}
              >
                <Text style={[styles.tabText, adminTab === tab && styles.tabTextActive]}>
                  {tab}
                </Text>
                {tabUnread > 0 && (
                  <View style={[
                    styles.tabBadge,
                    { backgroundColor: adminTab === tab ? "white" : NAVY }
                  ]}>
                    <Text style={[
                      styles.tabBadgeText,
                      { color: adminTab === tab ? NAVY : "white" }
                    ]}>
                      {tabUnread}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* 일반 유저: 내 학년 안내 배너 */}
      {!currentUser.isAdmin && (
        <View style={styles.yearBanner}>
          <View style={[styles.yearDot, { backgroundColor: "#6366F1" }]} />
          <Text style={styles.yearBannerText}>
            {profile?.yearLabel || ""} ({(profile?.studentId || "").slice(0, 4)}학번) 학우방에 참여 중
          </Text>
        </View>
      )}

      {/* 채팅방 목록 */}
      <FlatList
        data={displayedRooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.roomItem}
            onPress={() => navigation.navigate("ChatRoom", { room: item })}
          >
            <View style={[styles.avatar, { backgroundColor: item.color + "20" }]}>
              <Ionicons name={item.icon} size={24} color={item.color} />
            </View>

            <View style={styles.roomInfo}>
              <View style={styles.roomTop}>
                <View style={styles.roomNameWrap}>
                  <Text style={styles.roomName}>{item.name}</Text>
                  {item.yearLabel && item.yearId !== "notice" && (
                    <View style={[styles.yearTag, { backgroundColor: item.color + "18" }]}>
                      <Text style={[styles.yearTagText, { color: item.color }]}>
                        {item.yearLabel}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.roomTime}>{item.time}</Text>
              </View>
              <View style={styles.roomBottom}>
                <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMsg}</Text>
                {item.unread > 0 && (
                  <View style={[styles.badge, { backgroundColor: NAVY }]}>
                    <Text style={styles.badgeText}>
                      {item.unread > 99 ? "99+" : item.unread}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "white" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 24 : 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: { fontSize: 26, fontWeight: "900", color: "#1e293b" },
  headerSub: { fontSize: 12, color: "#94a3b8", marginTop: 2 },

  adminBadge: {
    backgroundColor: NAVY,
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 10,
  },
  adminBadgeText: { fontSize: 12, fontWeight: "700", color: "white" },

  tabScroll: { maxHeight: 52, backgroundColor: "white" },
  tabContent: {
    paddingHorizontal: 16, paddingVertical: 10,
    gap: 8, alignItems: "center",
  },
  tabBtn: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: "#f1f5f9", gap: 5,
  },
  tabBtnActive: { backgroundColor: NAVY },
  tabText: { fontSize: 13, fontWeight: "700", color: "#64748b" },
  tabTextActive: { color: "white" },
  tabBadge: {
    minWidth: 18, height: 18, borderRadius: 9,
    justifyContent: "center", alignItems: "center", paddingHorizontal: 5,
  },
  tabBadgeText: { fontSize: 10, fontWeight: "800" },

  yearBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F5F7FA",
    gap: 8,
  },
  yearDot: { width: 8, height: 8, borderRadius: 4 },
  yearBannerText: { fontSize: 13, color: "#64748b", fontWeight: "500" },

  separator: { height: 1, backgroundColor: "#f8fafc", marginLeft: 82 },

  roomItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 14,
  },
  avatar: {
    width: 54, height: 54, borderRadius: 18,
    justifyContent: "center", alignItems: "center",
    marginRight: 14,
  },
  roomInfo: { flex: 1 },
  roomTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  roomNameWrap: {
    flexDirection: "row", alignItems: "center",
    gap: 6, flex: 1,
  },
  roomName: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  yearTag: {
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
  },
  yearTagText: { fontSize: 11, fontWeight: "700" },
  roomTime: { fontSize: 12, color: "#94a3b8", flexShrink: 0, marginLeft: 8 },
  roomBottom: { flexDirection: "row", alignItems: "center" },
  lastMsg: { flex: 1, fontSize: 14, color: "#64748b" },
  badge: {
    minWidth: 20, height: 20, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
    paddingHorizontal: 6, marginLeft: 8,
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: "white" },
});
