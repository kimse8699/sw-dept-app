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

const PRIMARY = "#1B3080";

const BOT_RESPONSES = {
  수강신청: "수강신청 기간은 매 학기 초에 학사포털에서 공지됩니다.\n\n📅 2026-1학기 수강신청 변경: 4월 15일 ~ 17일\n\n수강신청은 학교 포털(portal.univ.ac.kr)에서 진행할 수 있습니다.",
  졸업요건: "소프트웨어학과 졸업요건을 안내드립니다.\n\n📋 졸업 조건\n• 총 취득학점: 130학점 이상\n• 전공필수: 45학점\n• 교양필수: 15학점\n• 졸업논문/프로젝트 이수 필수\n\n자세한 내용은 학과 사무실로 문의하세요.",
  장학금: "장학금 신청 안내입니다.\n\n💰 국가장학금\n• 신청처: 한국장학재단 (www.kosaf.go.kr)\n• 신청 기간: 2차 2026.04.10 ~ 05.08\n• 대상: 소득분위 8구간 이하\n\n📌 교내장학금은 학과 사무실에서 별도 공지됩니다.",
  학사일정: "2026학년도 1학기 주요 학사일정입니다.\n\n📆 주요 일정\n• 중간고사: 4월 14일 ~ 18일\n• 수강변경: 4월 15일 ~ 17일\n• 캡스톤발표: 6월 10일 ~ 11일\n• 기말고사: 6월 15일 ~ 19일\n• 종강: 6월 20일",
  성적: "성적 관련 안내입니다.\n\n📊 성적 확인\n• 중간성적 발표: 5월 초\n• 최종성적 발표: 학기 종료 후 2주 내\n\n성적 이의신청은 발표 후 1주일 이내에 담당 교수님께 직접 연락하거나 학과 사무실을 방문하세요.",
};

const QUICK_REPLIES = ["수강신청", "졸업요건", "장학금", "학사일정", "성적"];

let msgId = 100;

const BOT_INTRO = {
  id: 1,
  from: "bot",
  text: "안녕하세요! 소프트웨어학과 챗봇입니다 😊\n궁금한 내용을 질문하거나 아래 빠른 답변을 선택해보세요.",
  time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
};

export default function ChatbotScreen({ navigation }) {
  const [messages, setMessages] = useState([BOT_INTRO]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = {
      id: ++msgId,
      from: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // 봇 응답 찾기
    const keyword = Object.keys(BOT_RESPONSES).find((k) => trimmed.includes(k));
    const reply = keyword
      ? BOT_RESPONSES[keyword]
      : "죄송합니다, 해당 내용은 학과 사무실(02-XXX-XXXX)로 문의해 주세요.\n\n📌 운영시간: 평일 09:00 ~ 18:00";

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: ++msgId,
          from: "bot",
          text: reply,
          time: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 600);
  };

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={[styles.botAvatar, { backgroundColor: PRIMARY }]}>
            <Ionicons name="chatbubble-ellipses" size={18} color="white" />
          </View>
          <View>
            <Text style={styles.headerTitle}>학과 챗봇</Text>
            <Text style={styles.headerSub}>온라인</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        {/* 메시지 목록 */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.messages}
          renderItem={({ item }) => {
            const isUser = item.from === "user";
            return (
              <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
                {!isUser && (
                  <View style={[styles.botAvatarSmall, { backgroundColor: PRIMARY }]}>
                    <Ionicons name="chatbubble-ellipses" size={12} color="white" />
                  </View>
                )}
                <View style={styles.msgGroup}>
                  <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
                    <Text style={[styles.bubbleText, isUser && { color: "white" }]}>
                      {item.text}
                    </Text>
                  </View>
                  <Text style={[styles.msgTime, isUser && { textAlign: "right" }]}>{item.time}</Text>
                </View>
              </View>
            );
          }}
        />

        {/* 빠른 답변 */}
        <View>
          <View style={styles.quickRow}>
            {QUICK_REPLIES.map((q) => (
              <TouchableOpacity
                key={q}
                style={styles.quickBtn}
                onPress={() => sendMessage(q)}
              >
                <Text style={styles.quickText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 입력창 */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              placeholder="메시지를 입력하세요..."
              placeholderTextColor="#94a3b8"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => sendMessage(input)}
              returnKeyType="send"
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: input.trim() ? PRIMARY : "#e2e8f0" }]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim()}
            >
              <Ionicons name="send" size={18} color={input.trim() ? "white" : "#94a3b8"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1, borderBottomColor: "#f1f5f9",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 10 },
  botAvatar: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#1e293b" },
  headerSub: { fontSize: 12, color: "#22c55e", fontWeight: "600" },

  messages: { padding: 16, gap: 12 },

  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  msgRowUser: { flexDirection: "row-reverse" },

  botAvatarSmall: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: "center", alignItems: "center",
    flexShrink: 0, alignSelf: "flex-start", marginTop: 2,
  },
  msgGroup: { maxWidth: "75%", gap: 4 },

  bubble: { padding: 12, borderRadius: 18 },
  bubbleBot: {
    backgroundColor: "white", borderTopLeftRadius: 4,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  bubbleUser: { backgroundColor: PRIMARY, borderTopRightRadius: 4 },
  bubbleText: { fontSize: 15, color: "#1e293b", lineHeight: 22 },
  msgTime: { fontSize: 11, color: "#94a3b8", paddingHorizontal: 4 },

  quickRow: {
    flexDirection: "row", flexWrap: "wrap", gap: 8,
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: "white", borderTopWidth: 1, borderTopColor: "#f1f5f9",
  },
  quickBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1.5, borderColor: PRIMARY,
  },
  quickText: { fontSize: 13, fontWeight: "600", color: PRIMARY },

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
