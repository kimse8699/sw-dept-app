import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const NAVY = "#1B3080";
const MY_NAME = "김세훈";

const SAMPLE_MESSAGES = {
  notice: [
    { id: 1, sender: "학과봇", text: "📌 중간고사 기간 강의실 개방 안내입니다.\n\n운영 기간: 04.14 ~ 04.18\n운영 시간: 08:00 ~ 22:00\n장소: 공학관 301, 302호", time: "오전 10:23", isMe: false },
    { id: 2, sender: "학과봇", text: "학생증 지참 필수입니다. 많은 이용 바랍니다.", time: "오전 10:24", isMe: false },
  ],
  y1: [
    { id: 1, sender: "이민준", text: "안녕하세요! 알고리즘 과제 어떻게 하고 계세요?", time: "오전 9:20", isMe: false },
    { id: 2, sender: "박지은", text: "저도 아직 못 풀었어요ㅠ", time: "오전 9:25", isMe: false },
    { id: 3, sender: MY_NAME, text: "저도 지금 막혀서요ㅠㅠ 다이나믹 프로그래밍으로 접근했는데 맞는지 모르겠어요", time: "오전 9:30", isMe: true },
    { id: 4, sender: "이민준", text: "혹시 알고리즘 과제 어떻게 풀었어요?", time: "오전 9:41", isMe: false },
  ],
  y2: [
    { id: 1, sender: "최수연", text: "자료구조 시험 범위 어디까지예요?", time: "오전 8:10", isMe: false },
    { id: 2, sender: "김도현", text: "트리까지래요! 그래프는 안 나온대요", time: "오전 8:15", isMe: false },
    { id: 3, sender: MY_NAME, text: "감사합니다! 공부 열심히 해야겠네요", time: "오전 8:30", isMe: true },
  ],
  y3: [
    { id: 1, sender: "홍길동", text: "다들 캡스톤 주제 정했나요?", time: "어제 오후 3:10", isMe: false },
    { id: 2, sender: "이영희", text: "저는 AI 기반 학습 도우미로 생각 중이에요", time: "어제 오후 3:15", isMe: false },
    { id: 3, sender: MY_NAME, text: "저는 아직 고민 중입니다!", time: "어제 오후 3:20", isMe: true },
  ],
  y4: [
    { id: 1, sender: "졸업위원장", text: "졸업사진 촬영 일정 공지드립니다.\n\n일시: 5월 10일 오후 2시\n장소: 학교 정문 앞\n\n정장 착용 부탁드립니다.", time: "어제 오전 11:00", isMe: false },
    { id: 2, sender: MY_NAME, text: "감사합니다! 꼭 참석하겠습니다.", time: "어제 오전 11:30", isMe: true },
  ],
  study: [
    { id: 1, sender: "박스터디", text: "알고리즘 스터디 같이하실 분 구합니다!\n\n주 2회 (화/목) 오후 7시\n온라인/오프라인 병행", time: "월요일 오후 7:00", isMe: false },
    { id: 2, sender: MY_NAME, text: "저 관심 있어요! 어떻게 신청하면 되나요?", time: "월요일 오후 7:30", isMe: true },
  ],
  capstone: [
    { id: 1, sender: "지도교수", text: "캡스톤 발표 자료 양식 공유해드렸습니다. 이메일 확인해주세요.", time: "월요일 오전 10:00", isMe: false },
  ],
};

let msgId = 300;

export default function ChatRoomScreen({ navigation, route }) {
  const { room } = route.params;
  const initialMsgs = SAMPLE_MESSAGES[room.id] || [];
  const [messages, setMessages] = useState(initialMsgs);
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const PRIMARY = room.color || NAVY;

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      {
        id: ++msgId,
        sender: MY_NAME,
        text: trimmed,
        time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
      },
    ]);
    setInput("");
  };

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const renderItem = ({ item, index }) => {
    const showSender = !item.isMe && (index === 0 || messages[index - 1]?.sender !== item.sender);

    return (
      <View style={[styles.msgRow, item.isMe && styles.msgRowMe]}>
        {!item.isMe && (
          <View style={[styles.senderAvatar, { backgroundColor: PRIMARY + "25" }]}>
            {showSender && <Ionicons name={room.icon} size={14} color={PRIMARY} />}
          </View>
        )}
        <View style={styles.msgGroup}>
          {showSender && <Text style={styles.senderName}>{item.sender}</Text>}
          <View style={styles.bubbleRow}>
            {item.isMe && <Text style={styles.timeText}>{item.time}</Text>}
            <View style={[styles.bubble, item.isMe ? [styles.bubbleMe, { backgroundColor: NAVY }] : styles.bubbleOther]}>
              <Text style={[styles.bubbleText, item.isMe && { color: "white" }]}>{item.text}</Text>
            </View>
            {!item.isMe && <Text style={styles.timeText}>{item.time}</Text>}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={[styles.header, { borderBottomColor: PRIMARY + "20" }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={[styles.roomIcon, { backgroundColor: PRIMARY + "20" }]}>
            <Ionicons name={room.icon} size={18} color={PRIMARY} />
          </View>
          <View>
            <Text style={styles.headerTitle} numberOfLines={1}>{room.name}</Text>
            {room.desc && <Text style={[styles.headerSub, { color: PRIMARY }]}>{room.desc}</Text>}
          </View>
        </View>
        <TouchableOpacity style={styles.menuBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.msgList}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <View style={[styles.emptyChatIcon, { backgroundColor: PRIMARY + "15" }]}>
                <Ionicons name={room.icon} size={32} color={PRIMARY} />
              </View>
              <Text style={styles.emptyChatText}>{room.name}</Text>
              <Text style={styles.emptyChatSub}>첫 메시지를 보내보세요!</Text>
            </View>
          }
        />

        {/* 입력창 */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="메시지 입력..."
            placeholderTextColor="#94a3b8"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: input.trim() ? NAVY : "#e2e8f0" }]}
            onPress={sendMessage}
          >
            <Ionicons name="send" size={18} color={input.trim() ? "white" : "#94a3b8"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  roomIcon: {
    width: 36, height: 36, borderRadius: 12,
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#1e293b" },
  headerSub: { fontSize: 11, fontWeight: "600", marginTop: 1 },
  menuBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "flex-end" },

  msgList: { padding: 16, gap: 10 },

  emptyChat: { alignItems: "center", paddingTop: 80, gap: 10 },
  emptyChatIcon: { width: 72, height: 72, borderRadius: 24, justifyContent: "center", alignItems: "center" },
  emptyChatText: { fontSize: 16, fontWeight: "800", color: "#1e293b" },
  emptyChatSub: { fontSize: 14, color: "#94a3b8" },

  msgRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  msgRowMe: { flexDirection: "row-reverse" },

  senderAvatar: {
    width: 32, height: 32, borderRadius: 12,
    justifyContent: "center", alignItems: "center", flexShrink: 0,
  },
  msgGroup: { maxWidth: "75%", gap: 3 },
  senderName: { fontSize: 12, fontWeight: "600", color: "#64748b", paddingHorizontal: 4 },

  bubbleRow: { flexDirection: "row", alignItems: "flex-end", gap: 5 },
  bubble: { padding: 12, borderRadius: 18, flexShrink: 1 },
  bubbleOther: {
    backgroundColor: "white", borderTopLeftRadius: 4,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  bubbleMe: { borderTopRightRadius: 4 },
  bubbleText: { fontSize: 15, color: "#1e293b", lineHeight: 22 },
  timeText: { fontSize: 11, color: "#94a3b8", marginBottom: 2 },

  inputBar: {
    flexDirection: "row", alignItems: "flex-end",
    padding: 12, backgroundColor: "white",
    borderTopWidth: 1, borderTopColor: "#f1f5f9", gap: 10,
  },
  input: {
    flex: 1, backgroundColor: "#f8fafc", borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, color: "#1e293b", maxHeight: 100,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21,
    justifyContent: "center", alignItems: "center",
  },
});
