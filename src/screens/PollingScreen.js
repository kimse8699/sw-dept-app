import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../services/api";

const PRIMARY = "#1B3080";
const PRIMARY_LIGHT = "#1B308012";

function getRemaining(deadline) {
  if (!deadline) return null;
  const diff = new Date(deadline) - new Date();
  if (diff <= 0) return "마감";
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}일 남음`;
  if (hours > 0) return `${hours}시간 남음`;
  return "곧 마감";
}

function PollCard({ poll, onVote, ended }) {
  const maxVotes = Math.max(...poll.options.map((o) => o.votes), 0);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.statusBadge, { backgroundColor: ended ? "#f1f5f9" : PRIMARY_LIGHT }]}>
          <Text style={[styles.statusText, { color: ended ? "#94a3b8" : PRIMARY }]}>
            {ended ? "종료" : "진행중"}
          </Text>
        </View>
        <Text style={styles.deadline}>
          <Ionicons name="time-outline" size={12} />{" "}
          {ended
            ? poll.deadline ? new Date(poll.deadline).toLocaleDateString("ko-KR") : "-"
            : getRemaining(poll.deadline)}
        </Text>
      </View>

      <Text style={styles.pollTitle}>{poll.title}</Text>
      {!!poll.desc && <Text style={styles.pollDesc}>{poll.desc}</Text>}

      <View style={styles.options}>
        {poll.options.map((opt) => {
          const pct = poll.total > 0 ? Math.round((opt.votes / poll.total) * 100) : 0;
          const isVoted = poll.myVote === opt.id;
          const isWinner = ended && opt.votes === maxVotes && maxVotes > 0;

          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.optionBtn,
                (isVoted || (ended && isWinner)) && { borderColor: PRIMARY, borderWidth: 2 },
              ]}
              onPress={() => !ended && !poll.myVote && onVote(poll.id, opt.id)}
              disabled={ended || !!poll.myVote}
            >
              <View style={styles.optionTop}>
                <View style={styles.optionLeft}>
                  {(isVoted || (ended && isWinner)) && (
                    <Ionicons name="checkmark-circle" size={16} color={PRIMARY} style={{ marginRight: 6 }} />
                  )}
                  <Text style={[styles.optionText, isVoted && { color: PRIMARY, fontWeight: "700" }]}>
                    {opt.text}
                  </Text>
                </View>
                <Text style={styles.optionPct}>
                  {(poll.myVote || ended) ? `${pct}% (${opt.votes}명)` : ""}
                </Text>
              </View>
              {(poll.myVote || ended) && (
                <View style={styles.progressBg}>
                  <View style={[
                    styles.progressFill,
                    { width: `${pct}%`, backgroundColor: isVoted || isWinner ? PRIMARY : "#e2e8f0" },
                  ]} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.totalVotes}>총 {poll.total}명 참여</Text>
    </View>
  );
}

export default function PollingScreen() {
  const [tab, setTab] = useState("active");
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();
  }, [tab]);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const res = await api.get("/polls", {
        params: { active: tab === "active" ? "true" : "false" },
      });
      setPolls(res.data);
    } catch (e) {
      console.error("투표 로딩 실패:", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (pollId, optionId) => {
    Alert.alert("투표 확인", "정말 투표하시겠습니까? 투표 후 변경할 수 없습니다.", [
      { text: "취소", style: "cancel" },
      {
        text: "투표",
        onPress: async () => {
          try {
            await api.post(`/polls/${pollId}/vote`, { optionId });
            setPolls((prev) =>
              prev.map((p) => {
                if (p.id !== pollId) return p;
                return {
                  ...p,
                  myVote: optionId,
                  total: p.total + 1,
                  options: p.options.map((o) =>
                    o.id === optionId ? { ...o, votes: o.votes + 1 } : o
                  ),
                };
              })
            );
          } catch (e) {
            Alert.alert("오류", "투표 중 오류가 발생했습니다.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>투표</Text>
        <MaterialCommunityIcons name="clipboard-list-outline" size={26} color="#1e293b" />
      </View>

      {/* 탭 */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "active" && styles.tabBtnActive]}
          onPress={() => setTab("active")}
        >
          <Text style={[styles.tabText, tab === "active" && styles.tabTextActive]}>진행 중</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "ended" && styles.tabBtnActive]}
          onPress={() => setTab("ended")}
        >
          <Text style={[styles.tabText, tab === "ended" && styles.tabTextActive]}>종료된 투표</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {polls.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={52} color="#e2e8f0" />
              <Text style={styles.emptyText}>투표가 없습니다</Text>
            </View>
          ) : (
            polls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                onVote={handleVote}
                ended={tab === "ended"}
              />
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 24 : 16,
    paddingBottom: 16, backgroundColor: "white",
  },
  headerTitle: { fontSize: 24, fontWeight: "900", color: "#1e293b" },

  tabRow: {
    flexDirection: "row", backgroundColor: "white",
    paddingHorizontal: 20, paddingBottom: 12, gap: 8,
    borderBottomWidth: 1, borderBottomColor: "#f1f5f9",
  },
  tabBtn: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: "#f1f5f9" },
  tabBtnActive: { backgroundColor: PRIMARY },
  tabText: { fontSize: 14, fontWeight: "700", color: "#64748b" },
  tabTextActive: { color: "white" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { padding: 16, gap: 12 },

  card: {
    backgroundColor: "white", borderRadius: 20, padding: 18,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: "700" },
  deadline: { fontSize: 12, color: "#94a3b8" },

  pollTitle: { fontSize: 17, fontWeight: "800", color: "#1e293b", marginBottom: 6 },
  pollDesc: { fontSize: 13, color: "#64748b", marginBottom: 16 },

  options: { gap: 10, marginBottom: 12 },
  optionBtn: { borderWidth: 1.5, borderColor: "#e2e8f0", borderRadius: 14, padding: 14 },
  optionTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  optionLeft: { flexDirection: "row", alignItems: "center" },
  optionText: { fontSize: 15, color: "#374151", fontWeight: "600" },
  optionPct: { fontSize: 13, color: "#94a3b8" },
  progressBg: { height: 6, backgroundColor: "#f1f5f9", borderRadius: 3, marginTop: 10, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },

  totalVotes: { fontSize: 13, color: "#94a3b8", textAlign: "right" },
  empty: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: "#94a3b8" },
});
