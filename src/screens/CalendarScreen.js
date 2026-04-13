import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PRIMARY = "#1B3080";
const PRIMARY_LIGHT = "#1B308012";

const EVENTS = {
  "2026-04-13": [{ id: 1, title: "조별 과제 미팅", time: "14:00", place: "중앙 도서관 스터디룸", color: PRIMARY }],
  "2026-04-14": [{ id: 2, title: "중간고사 시작", time: "09:00", place: "각 강의실", color: "#ef4444" }],
  "2026-04-15": [{ id: 3, title: "중간고사", time: "09:00", place: "각 강의실", color: "#ef4444" }, { id: 4, title: "수강신청 변경", time: "10:00", place: "학교 포털", color: "#3b82f6" }],
  "2026-04-16": [{ id: 5, title: "중간고사", time: "09:00", place: "각 강의실", color: "#ef4444" }],
  "2026-04-17": [{ id: 6, title: "중간고사", time: "09:00", place: "각 강의실", color: "#ef4444" }, { id: 7, title: "수강신청 변경 마감", time: "17:00", place: "학교 포털", color: "#3b82f6" }],
  "2026-04-18": [{ id: 8, title: "중간고사 종료", time: "18:00", place: "각 강의실", color: "#ef4444" }],
  "2026-04-25": [{ id: 9, title: "소프트웨어 경진대회 신청 마감", time: "18:00", place: "학과 사무실", color: "#f59e0b" }],
  "2026-04-30": [{ id: 10, title: "프로젝트 중간 발표", time: "13:00", place: "공학관 세미나실", color: PRIMARY }],
};

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const MONTH_NAMES = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

function toKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function CalendarScreen({ navigation }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(toKey(today.getFullYear(), today.getMonth(), today.getDate()));

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const selectedEvents = EVENTS[selectedDate] || [];

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>학과 일정</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 달력 카드 */}
        <View style={styles.calendarCard}>
          {/* 월 네비게이션 */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={22} color="#1e293b" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{year}년 {MONTH_NAMES[month]}</Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={22} color="#1e293b" />
            </TouchableOpacity>
          </View>

          {/* 요일 헤더 */}
          <View style={styles.dayRow}>
            {DAY_NAMES.map((d, i) => (
              <Text
                key={d}
                style={[
                  styles.dayName,
                  i === 0 && { color: "#ef4444" },
                  i === 6 && { color: "#3b82f6" },
                ]}
              >
                {d}
              </Text>
            ))}
          </View>

          {/* 날짜 그리드 */}
          <View style={styles.grid}>
            {cells.map((day, idx) => {
              if (!day) return <View key={`empty-${idx}`} style={styles.cell} />;
              const key = toKey(year, month, day);
              const isToday = key === todayKey;
              const isSelected = key === selectedDate;
              const hasEvent = !!EVENTS[key];
              const colIdx = idx % 7;

              return (
                <TouchableOpacity
                  key={key}
                  style={styles.cell}
                  onPress={() => setSelectedDate(key)}
                >
                  <View style={[
                    styles.dateCircle,
                    isSelected && { backgroundColor: PRIMARY },
                    isToday && !isSelected && { borderWidth: 2, borderColor: PRIMARY },
                  ]}>
                    <Text style={[
                      styles.dateText,
                      colIdx === 0 && { color: "#ef4444" },
                      colIdx === 6 && { color: "#3b82f6" },
                      isSelected && { color: "white" },
                      isToday && !isSelected && { color: PRIMARY, fontWeight: "800" },
                    ]}>
                      {day}
                    </Text>
                  </View>
                  {hasEvent && (
                    <View style={[styles.eventDot, isSelected && { backgroundColor: "white" }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 선택 날짜 일정 */}
        <View style={styles.eventsSection}>
          <Text style={styles.eventsTitle}>
            {selectedDate.replace(/-/g, ".")} 일정
          </Text>

          {selectedEvents.length === 0 ? (
            <View style={styles.noEvent}>
              <Ionicons name="calendar-outline" size={40} color="#e2e8f0" />
              <Text style={styles.noEventText}>일정이 없습니다</Text>
            </View>
          ) : (
            selectedEvents.map((ev) => (
              <View key={ev.id} style={styles.eventCard}>
                <View style={[styles.eventBar, { backgroundColor: ev.color }]} />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{ev.title}</Text>
                  <View style={styles.eventMeta}>
                    <Ionicons name="time-outline" size={13} color="#94a3b8" />
                    <Text style={styles.eventMetaText}> {ev.time}</Text>
                    <Text style={styles.eventMetaText}>  </Text>
                    <Ionicons name="location-outline" size={13} color="#94a3b8" />
                    <Text style={styles.eventMetaText}> {ev.place}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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

  calendarCard: {
    backgroundColor: "white", margin: 16, borderRadius: 24,
    padding: 16, shadowColor: "#000", shadowOpacity: 0.05,
    shadowRadius: 10, elevation: 3,
  },
  monthNav: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: 16,
  },
  navBtn: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  monthTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },

  dayRow: { flexDirection: "row", marginBottom: 8 },
  dayName: {
    flex: 1, textAlign: "center", fontSize: 13,
    fontWeight: "700", color: "#64748b",
  },

  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: "14.28%", aspectRatio: 1,
    alignItems: "center", justifyContent: "center",
  },
  dateCircle: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: "center", alignItems: "center",
  },
  dateText: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
  eventDot: {
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: PRIMARY, marginTop: 2,
  },

  eventsSection: { paddingHorizontal: 16 },
  eventsTitle: { fontSize: 17, fontWeight: "800", color: "#1e293b", marginBottom: 12 },

  noEvent: { alignItems: "center", paddingVertical: 32 },
  noEventText: { marginTop: 10, fontSize: 14, color: "#94a3b8" },

  eventCard: {
    flexDirection: "row", backgroundColor: "white",
    borderRadius: 16, marginBottom: 10,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    overflow: "hidden",
  },
  eventBar: { width: 5 },
  eventInfo: { flex: 1, padding: 14 },
  eventTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b", marginBottom: 6 },
  eventMeta: { flexDirection: "row", alignItems: "center" },
  eventMetaText: { fontSize: 12, color: "#94a3b8" },
});
