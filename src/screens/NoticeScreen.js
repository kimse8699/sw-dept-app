import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import api from "../services/api";

const PRIMARY = "#1B3080";
const PRIMARY_LIGHT = "#1B308012";
const FILTERS = ["전체", "필독", "학사", "장학", "일반"];

const TAG_STYLE = {
  필독: { bg: "#fee2e2", text: "#ef4444" },
  학사: { bg: "#dbeafe", text: "#3b82f6" },
  장학: { bg: "#dcfce7", text: "#16a34a" },
  일반: { bg: PRIMARY_LIGHT, text: PRIMARY },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function NoticeScreen({ navigation }) {
  const [filter, setFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, [filter]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const params = filter !== "전체" ? { type: filter } : {};
      const res = await api.get("/notices", { params });
      setNotices(res.data);
    } catch (e) {
      console.error("공지 로딩 실패:", e.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = notices.filter((n) => n.title.includes(search));

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
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.filterScroll} contentContainerStyle={styles.filterContent}
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
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.noticeItem} onPress={() => setSelected(item)}>
              <View style={styles.noticeTop}>
                <View style={[styles.tag, { backgroundColor: TAG_STYLE[item.type]?.bg || PRIMARY_LIGHT }]}>
                  <Text style={[styles.tagText, { color: TAG_STYLE[item.type]?.text || PRIMARY }]}>
                    {item.type}
                  </Text>
                </View>
                <Text style={styles.noticeDate}>{formatDate(item.createdAt)}</Text>
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
              <Text style={styles.emptyText}>공지사항이 없습니다</Text>
            </View>
          }
        />
      )}

      {/* 상세 모달 */}
      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSelected(null)}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.tag, { backgroundColor: TAG_STYLE[selected.type]?.bg || PRIMARY_LIGHT, alignSelf: "flex-start", marginBottom: 12 }]}>
                  <Text style={[styles.tagText, { color: TAG_STYLE[selected.type]?.text || PRIMARY }]}>
                    {selected.type}
                  </Text>
                </View>
                <Text style={styles.modalTitle}>{selected.title}</Text>
                <View style={styles.modalMeta}>
                  <Text style={styles.modalMetaText}>{formatDate(selected.createdAt)}</Text>
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
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 12, backgroundColor: "white",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },

  searchWrap: {
    flexDirection: "row", alignItems: "center",
    margin: 16, marginBottom: 8, backgroundColor: "white",
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
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

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16, gap: 0 },
  separator: { height: 1, backgroundColor: "#f1f5f9" },
  noticeItem: { backgroundColor: "white", padding: 16 },
  noticeTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 12, fontWeight: "700" },
  noticeDate: { fontSize: 12, color: "#94a3b8" },
  noticeTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b", marginBottom: 8, lineHeight: 22 },
  noticeMeta: { flexDirection: "row", alignItems: "center" },
  noticeViews: { fontSize: 12, color: "#94a3b8" },

  empty: { alignItems: "center", paddingTop: 60 },
  emptyText: { marginTop: 12, fontSize: 15, color: "#94a3b8" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: "white", borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, maxHeight: "80%",
  },
  modalClose: { alignSelf: "flex-end", marginBottom: 8 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b", marginBottom: 8, lineHeight: 26 },
  modalMeta: { flexDirection: "row", marginBottom: 16 },
  modalMetaText: { fontSize: 13, color: "#94a3b8" },
  modalDivider: { height: 1, backgroundColor: "#f1f5f9", marginBottom: 16 },
  modalContent: { fontSize: 15, color: "#374151", lineHeight: 26 },
});
