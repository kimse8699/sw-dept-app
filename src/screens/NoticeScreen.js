import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = "#1B3080";
const PRIMARY_LIGHT = "#1B308012";

const NOTICES = [
  { id: 1, type: "필독", title: "[필독] 졸업요건 안내 사항", date: "2026.04.12", views: 142, content: "졸업요건 관련 안내입니다.\n\n1. 총 취득학점: 130학점 이상\n2. 전공필수: 45학점 이상\n3. 교양필수: 15학점 이상\n4. 졸업논문/프로젝트 이수 필수\n\n자세한 사항은 학과 사무실로 문의 바랍니다." },
  { id: 2, type: "학사", title: "2026-1학기 수강신청 변경 기간 안내", date: "2026.04.11", views: 89, content: "수강신청 변경 기간을 안내드립니다.\n\n변경 기간: 2026.04.15 ~ 04.17\n변경 방법: 학교 포털 → 수강신청 → 수강변경\n\n해당 기간 외에는 수강변경이 불가합니다." },
  { id: 3, type: "장학", title: "국가장학금 2차 신청 안내", date: "2026.04.10", views: 201, content: "2026년 1학기 국가장학금 2차 신청 기간을 안내드립니다.\n\n신청 기간: 2026.04.10 ~ 05.08\n신청 방법: 한국장학재단 홈페이지 (www.kosaf.go.kr)\n\n소득분위 8구간 이하 학생은 꼭 신청하세요!" },
  { id: 4, type: "일반", title: "중간고사 기간 강의실 개방 안내", date: "2026.04.10", views: 56, content: "중간고사 기간 동안 자율학습 강의실을 운영합니다.\n\n운영 기간: 2026.04.14 ~ 04.18\n운영 시간: 08:00 ~ 22:00\n운영 강의실: 공학관 301, 302호\n\n학생증 지참 필수입니다." },
  { id: 5, type: "필독", title: "[필독] 캡스톤디자인 발표 일정 안내", date: "2026.04.09", views: 178, content: "캡스톤디자인 최종 발표 일정을 안내드립니다.\n\n발표 일자: 2026.06.10 ~ 06.11\n발표 장소: 공학관 세미나실\n발표 시간: 팀별 10분 발표 + 5분 질의응답\n\n발표 자료 제출 마감: 2026.06.07까지 학과 이메일로 제출." },
  { id: 6, type: "학사", title: "소프트웨어 경진대회 참가 모집", date: "2026.04.08", views: 134, content: "2026 소프트웨어 경진대회 참가팀을 모집합니다.\n\n참가 자격: 재학생 2~4인 팀\n신청 마감: 2026.04.25\n시상 내역: 대상 100만원, 최우수상 50만원, 우수상 20만원\n\n신청서는 학과 사무실에서 수령하세요." },
  { id: 7, type: "장학", title: "교내 우수장학생 선발 공고", date: "2026.04.07", views: 67, content: "교내 우수장학생을 선발합니다.\n\n선발 기준: 직전 학기 성적 3.5 이상, 무결석\n혜택: 전액 장학금 (등록금 전액 면제)\n신청 방법: 학과 사무실 방문 접수\n\n신청 마감: 2026.04.20" },
  { id: 8, type: "일반", title: "동아리 홍보 게시판 안내", date: "2026.04.06", views: 43, content: "2026년 1학기 동아리 홍보 기간을 안내드립니다.\n\n홍보 기간: 2026.04.06 ~ 04.19\n홍보 장소: 학생회관 1층 게시판\n\n자세한 문의는 학생처로 연락 바랍니다." },
];

const FILTERS = ["전체", "필독", "학사", "장학", "일반"];

const TAG_STYLE = {
  필독: { bg: "#fee2e2", text: "#ef4444" },
  학사: { bg: "#dbeafe", text: "#3b82f6" },
  장학: { bg: "#dcfce7", text: "#16a34a" },
  일반: { bg: PRIMARY_LIGHT, text: PRIMARY },
};

export default function NoticeScreen({ navigation }) {
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = NOTICES.filter((n) => {
    const matchFilter = filter === "전체" || n.type === filter;
    const matchSearch = n.title.includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>학과 게시판</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 검색창 */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="공지사항 검색..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* 필터 탭 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 공지 목록 */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.noticeItem} onPress={() => setSelected(item)}>
            <View style={styles.noticeTop}>
              <View style={[styles.tag, { backgroundColor: TAG_STYLE[item.type].bg }]}>
                <Text style={[styles.tagText, { color: TAG_STYLE[item.type].text }]}>
                  {item.type}
                </Text>
              </View>
              <Text style={styles.noticeDate}>{item.date}</Text>
            </View>
            <Text style={styles.noticeTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.noticeMeta}>
              <Ionicons name="eye-outline" size={13} color="#94a3b8" />
              <Text style={styles.noticeViews}> {item.views}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={48} color="#e2e8f0" />
            <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
          </View>
        }
      />

      {/* 상세 모달 */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelected(null)}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.tag, { backgroundColor: TAG_STYLE[selected.type].bg, alignSelf: "flex-start", marginBottom: 12 }]}>
                  <Text style={[styles.tagText, { color: TAG_STYLE[selected.type].text }]}>{selected.type}</Text>
                </View>
                <Text style={styles.modalTitle}>{selected.title}</Text>
                <View style={styles.modalMeta}>
                  <Text style={styles.modalMetaText}>{selected.date}</Text>
                  <Text style={styles.modalMetaText}>  조회 {selected.views}</Text>
                </View>
                <View style={styles.modalDivider} />
                <Text style={styles.modalContent}>{selected.content}</Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 12,
    backgroundColor: "white",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    marginBottom: 8,
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, color: "#1e293b" },

  filterScroll: { maxHeight: 48 },
  filterContent: { paddingHorizontal: 16, gap: 8, alignItems: "center" },
  filterBtn: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: "white",
    borderWidth: 1.5, borderColor: "#e2e8f0",
  },
  filterBtnActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  filterText: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  filterTextActive: { color: "white" },

  list: { padding: 16, gap: 0 },
  separator: { height: 1, backgroundColor: "#f1f5f9" },
  noticeItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 0,
  },
  noticeTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 12, fontWeight: "700" },
  noticeDate: { fontSize: 12, color: "#94a3b8" },
  noticeTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b", marginBottom: 8, lineHeight: 22 },
  noticeMeta: { flexDirection: "row", alignItems: "center" },
  noticeViews: { fontSize: 12, color: "#94a3b8" },

  empty: { alignItems: "center", paddingTop: 60 },
  emptyText: { marginTop: 12, fontSize: 15, color: "#94a3b8" },

  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, maxHeight: "80%",
  },
  modalClose: { alignSelf: "flex-end", marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b", marginBottom: 8, lineHeight: 26 },
  modalMeta: { flexDirection: "row", marginBottom: 16 },
  modalMetaText: { fontSize: 13, color: "#94a3b8" },
  modalDivider: { height: 1, backgroundColor: "#f1f5f9", marginBottom: 16 },
  modalContent: { fontSize: 15, color: "#374151", lineHeight: 26 },
});
