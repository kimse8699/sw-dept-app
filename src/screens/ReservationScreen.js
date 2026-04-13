import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
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

const CATEGORIES = ["전체", "노트북", "카메라", "마이크", "스터디룸"];

const ITEMS = [
  { id: 1, cat: "노트북", name: "노트북 A", model: "LG 그램 16인치", available: true, icon: "laptop" },
  { id: 2, cat: "노트북", name: "노트북 B", model: "삼성 갤럭시북 Pro", available: false, reservedBy: "이민준", returnAt: "오후 5시" },
  { id: 3, cat: "노트북", name: "노트북 C", model: "MacBook Air M2", available: true, icon: "laptop" },
  { id: 4, cat: "카메라", name: "DSLR 카메라", model: "Canon EOS 850D", available: true, icon: "camera" },
  { id: 5, cat: "카메라", name: "미러리스 카메라", model: "Sony A7C", available: false, reservedBy: "박지현", returnAt: "내일 오전 10시" },
  { id: 6, cat: "마이크", name: "마이크 세트 A", model: "Rode NT-USB + 스탠드", available: true, icon: "microphone" },
  { id: 7, cat: "마이크", name: "마이크 세트 B", model: "Blue Yeti X", available: true, icon: "microphone" },
  { id: 8, cat: "스터디룸", name: "스터디룸 101", model: "최대 6명 / 화이트보드 있음", available: true, icon: "door-open" },
  { id: 9, cat: "스터디룸", name: "스터디룸 102", model: "최대 4명 / 빔프로젝터 있음", available: false, reservedBy: "최수연", returnAt: "오후 4시" },
  { id: 10, cat: "스터디룸", name: "스터디룸 201", model: "최대 8명 / 대형 화면 있음", available: true, icon: "door-open" },
];

const CAT_ICONS = {
  노트북: "laptop",
  카메라: "camera",
  마이크: "microphone",
  스터디룸: "door-open",
};

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function ReservationScreen({ navigation }) {
  const [cat, setCat] = useState("전체");
  const [modalItem, setModalItem] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState("1");
  const [purpose, setPurpose] = useState("");
  const [items, setItems] = useState(ITEMS);

  const filtered = cat === "전체" ? items : items.filter((i) => i.cat === cat);

  const doReserve = () => {
    if (!selectedTime) { Alert.alert("시간을 선택해주세요"); return; }
    Alert.alert(
      "예약 완료",
      `${modalItem.name} 예약이 완료되었습니다.\n시간: ${selectedTime} (${duration}시간)`,
      [{ text: "확인", onPress: () => {
        setItems((prev) => prev.map((it) => it.id === modalItem.id ? { ...it, available: false, reservedBy: "김세훈", returnAt: `${selectedTime} + ${duration}h` } : it));
        setModalItem(null); setSelectedTime(null); setDuration("1"); setPurpose("");
      }}]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>기자재 예약</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 카테고리 탭 */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={styles.catScroll} contentContainerStyle={styles.catContent}
      >
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.catBtn, cat === c && styles.catBtnActive]}
            onPress={() => setCat(c)}
          >
            {c !== "전체" && (
              <MaterialCommunityIcons
                name={CAT_ICONS[c]}
                size={15}
                color={cat === c ? "white" : "#64748b"}
                style={{ marginRight: 5 }}
              />
            )}
            <Text style={[styles.catText, cat === c && styles.catTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 기자재 목록 */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        numColumns={1}
        renderItem={({ item }) => (
          <View style={[styles.itemCard, !item.available && styles.itemCardDim]}>
            <View style={[styles.itemIcon, { backgroundColor: item.available ? PRIMARY_LIGHT : "#f1f5f9" }]}>
              <MaterialCommunityIcons
                name={CAT_ICONS[item.cat]}
                size={28}
                color={item.available ? PRIMARY : "#94a3b8"}
              />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemModel}>{item.model}</Text>
              {!item.available && (
                <Text style={styles.reservedInfo}>반납 예정: {item.returnAt}</Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.reserveBtn, !item.available && styles.reserveBtnDisabled]}
              onPress={() => item.available && setModalItem(item)}
              disabled={!item.available}
            >
              <Text style={[styles.reserveBtnText, !item.available && { color: "#94a3b8" }]}>
                {item.available ? "예약" : "사용중"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 예약 모달 */}
      <Modal visible={!!modalItem} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalItem?.name} 예약</Text>
              <TouchableOpacity onPress={() => { setModalItem(null); setSelectedTime(null); }}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>예약 시간</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {TIME_SLOTS.map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.timeSlot, selectedTime === t && styles.timeSlotActive]}
                      onPress={() => setSelectedTime(t)}
                    >
                      <Text style={[styles.timeSlotText, selectedTime === t && { color: "white" }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Text style={styles.fieldLabel}>사용 시간 (시간)</Text>
              <View style={styles.durationRow}>
                {["1", "2", "3", "4"].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.durBtn, duration === d && styles.durBtnActive]}
                    onPress={() => setDuration(d)}
                  >
                    <Text style={[styles.durText, duration === d && { color: "white" }]}>{d}시간</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>사용 목적 (선택)</Text>
              <TextInput
                style={styles.purposeInput}
                placeholder="예: 캡스톤 영상 촬영"
                placeholderTextColor="#94a3b8"
                value={purpose}
                onChangeText={setPurpose}
              />

              <TouchableOpacity style={styles.confirmBtn} onPress={doReserve}>
                <Text style={styles.confirmBtnText}>예약 확정</Text>
              </TouchableOpacity>
            </ScrollView>
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

  catScroll: { maxHeight: 56, backgroundColor: "white" },
  catContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, alignItems: "center" },
  catBtn: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: "#f1f5f9",
  },
  catBtnActive: { backgroundColor: PRIMARY },
  catText: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  catTextActive: { color: "white" },

  list: { padding: 16, gap: 10 },
  itemCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "white", borderRadius: 18, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  itemCardDim: { opacity: 0.8 },
  itemIcon: {
    width: 52, height: 52, borderRadius: 16,
    justifyContent: "center", alignItems: "center", marginRight: 14,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "700", color: "#1e293b", marginBottom: 4 },
  itemModel: { fontSize: 13, color: "#64748b" },
  reservedInfo: { fontSize: 12, color: "#ef4444", marginTop: 4 },

  reserveBtn: {
    backgroundColor: PRIMARY, paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 12,
  },
  reserveBtnDisabled: { backgroundColor: "#f1f5f9" },
  reserveBtnText: { fontSize: 14, fontWeight: "700", color: "white" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, maxHeight: "80%",
  },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },

  fieldLabel: { fontSize: 14, fontWeight: "700", color: "#64748b", marginBottom: 10 },

  timeSlot: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 12, borderWidth: 1.5, borderColor: "#e2e8f0",
  },
  timeSlotActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  timeSlotText: { fontSize: 14, fontWeight: "600", color: "#374151" },

  durationRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  durBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12,
    backgroundColor: "#f1f5f9", alignItems: "center",
  },
  durBtnActive: { backgroundColor: PRIMARY },
  durText: { fontSize: 14, fontWeight: "700", color: "#64748b" },

  purposeInput: {
    backgroundColor: "#f8fafc", borderRadius: 14, padding: 14,
    fontSize: 15, color: "#1e293b", marginBottom: 20,
    borderWidth: 1, borderColor: "#e2e8f0",
  },
  confirmBtn: {
    backgroundColor: PRIMARY, borderRadius: 16,
    paddingVertical: 16, alignItems: "center", marginBottom: 8,
  },
  confirmBtnText: { fontSize: 16, fontWeight: "800", color: "white" },
});
