import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

const PRIMARY = "#1B3080";
const PRIMARY_LIGHT = "#1B308012";

const MENU_ITEMS = [
  {
    section: "나의 활동",
    items: [
      { icon: "calendar-check-outline", iconLib: "material", label: "내 예약 현황", badge: "2", color: PRIMARY },
      { icon: "checkbox-outline", iconLib: "ion", label: "내 투표 현황", badge: "5", color: "#3b82f6" },
      { icon: "notifications-outline", iconLib: "ion", label: "알림 설정", color: "#f59e0b" },
    ],
  },
  {
    section: "학과 정보",
    items: [
      { icon: "document-text-outline", iconLib: "ion", label: "공지사항", color: "#64748b" },
      { icon: "calendar-outline", iconLib: "ion", label: "학사일정", color: "#64748b" },
      { icon: "school-outline", iconLib: "ion", label: "학과 소개", color: "#64748b" },
    ],
  },
  {
    section: "설정",
    items: [
      { icon: "shield-checkmark-outline", iconLib: "ion", label: "이용 약관 및 개인정보처리방침", color: "#64748b" },
      { icon: "help-circle-outline", iconLib: "ion", label: "문의하기", color: "#64748b" },
      { icon: "log-out-outline", iconLib: "ion", label: "로그아웃", color: "#ef4444", danger: true },
    ],
  },
];

export default function MyScreen({ navigation }) {
  const { profile, logout } = useAuth();
  const displayName = profile?.name || "사용자";
  const studentId = profile?.studentId || "-";
  const yearLabel = profile?.yearLabel || "";
  const initials = displayName.slice(-2);

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "로그아웃", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>마이페이지</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={[styles.avatar, { backgroundColor: PRIMARY }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileSub}>소프트웨어융합학과 · {studentId}</Text>
            <View style={[styles.gradeBadge, { backgroundColor: PRIMARY_LIGHT }]}>
              <Text style={[styles.gradeText, { color: PRIMARY }]}>{yearLabel} 1학기</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={18} color={PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* 통계 */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: PRIMARY }]}>2</Text>
            <Text style={styles.statLabel}>예약 중</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: "#3b82f6" }]}>5</Text>
            <Text style={styles.statLabel}>투표 참여</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: "#f59e0b" }]}>12</Text>
            <Text style={styles.statLabel}>읽은 공지</Text>
          </View>
        </View>

        {/* 메뉴 */}
        {MENU_ITEMS.map((section) => (
          <View key={section.section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.menuItem,
                    idx > 0 && styles.menuItemBorder,
                  ]}
                  onPress={() => {
                    if (item.danger) handleLogout();
                  }}
                >
                  <View style={[styles.menuIconWrap, { backgroundColor: item.color + "18" }]}>
                    {item.iconLib === "material" ? (
                      <MaterialCommunityIcons name={item.icon} size={20} color={item.color} />
                    ) : (
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    )}
                  </View>
                  <Text style={[styles.menuLabel, item.danger && { color: "#ef4444" }]}>
                    {item.label}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    {item.badge && (
                      <View style={[styles.menuBadge, { backgroundColor: item.color }]}>
                        <Text style={styles.menuBadgeText}>{item.badge}</Text>
                      </View>
                    )}
                    {!item.danger && (
                      <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.version}>버전 1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 24 : 16,
    paddingBottom: 16, backgroundColor: "#f8fafc",
  },
  headerTitle: { fontSize: 24, fontWeight: "900", color: "#1e293b" },

  profileCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "white", margin: 16, borderRadius: 24,
    padding: 20,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 22,
    justifyContent: "center", alignItems: "center", marginRight: 14,
  },
  avatarText: { fontSize: 22, fontWeight: "800", color: "white" },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: "800", color: "#1e293b", marginBottom: 4 },
  profileSub: { fontSize: 13, color: "#64748b", marginBottom: 8 },
  gradeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" },
  gradeText: { fontSize: 12, fontWeight: "700" },
  editBtn: { padding: 8 },

  statsRow: {
    flexDirection: "row", backgroundColor: "white",
    marginHorizontal: 16, borderRadius: 20, padding: 16, marginBottom: 8,
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 24, fontWeight: "900", marginBottom: 4 },
  statLabel: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },
  statDivider: { width: 1, backgroundColor: "#f1f5f9", marginVertical: 4 },

  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: "#94a3b8", marginBottom: 8, paddingLeft: 4 },
  menuCard: {
    backgroundColor: "white", borderRadius: 20,
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 8, elevation: 1,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 16,
  },
  menuItemBorder: { borderTopWidth: 1, borderTopColor: "#f8fafc" },
  menuIconWrap: {
    width: 36, height: 36, borderRadius: 12,
    justifyContent: "center", alignItems: "center", marginRight: 14,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: "#1e293b" },
  menuBadge: {
    minWidth: 20, height: 20, borderRadius: 10,
    justifyContent: "center", alignItems: "center", paddingHorizontal: 6,
  },
  menuBadgeText: { fontSize: 11, fontWeight: "700", color: "white" },

  version: { textAlign: "center", fontSize: 13, color: "#cbd5e1", marginTop: 20 },
});
