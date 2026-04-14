import { Ionicons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../config/firebase";
import { toAuthEmail } from "../context/AuthContext";

const NAVY = "#1B3080";
const SKY = "#5BC8EA";

// 학년 → yearId 매핑
const YEAR_MAP = {
  1: { yearId: "y1", label: "1학년", admissionYear: new Date().getFullYear() - 0 },
  2: { yearId: "y2", label: "2학년" },
  3: { yearId: "y3", label: "3학년" },
  4: { yearId: "y4", label: "4학년" },
};

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [year, setYear] = useState(null); // 1~4
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // 유효성 검사
    if (!name.trim()) return Alert.alert("입력 오류", "이름을 입력해주세요.");
    if (studentId.trim().length < 8) return Alert.alert("입력 오류", "학번을 정확히 입력해주세요. (8자리 이상)");
    if (!year) return Alert.alert("입력 오류", "학년을 선택해주세요.");
    if (!email.trim() || !email.includes("@")) return Alert.alert("입력 오류", "올바른 이메일을 입력해주세요.");
    if (password.length < 6) return Alert.alert("입력 오류", "비밀번호는 6자 이상이어야 합니다.");
    if (password !== confirmPw) return Alert.alert("입력 오류", "비밀번호가 일치하지 않습니다.");

    setLoading(true);
    try {
      // 1. Firebase Auth 계정 생성 (학번 기반 이메일)
      const authEmail = toAuthEmail(studentId.trim());
      const { user } = await createUserWithEmailAndPassword(auth, authEmail, password);

      // 2. Firestore에 유저 프로필 저장
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name.trim(),
        studentId: studentId.trim(),
        email: email.trim(),
        year: year,
        yearId: YEAR_MAP[year].yearId,
        yearLabel: YEAR_MAP[year].label,
        department: "소프트웨어융합학과",
        isAdmin: false,
        createdAt: serverTimestamp(),
      });

      // 성공 → onAuthStateChanged가 자동으로 메인 화면으로 이동
      Alert.alert("가입 완료", `${name}님, 환영합니다!`);
    } catch (error) {
      const msg =
        error.code === "auth/email-already-in-use" ? "이미 가입된 학번입니다." :
        error.code === "auth/weak-password" ? "비밀번호가 너무 약합니다." :
        "회원가입 중 오류가 발생했습니다.";
      Alert.alert("가입 실패", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>

        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={NAVY} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.swBadgeSm}>
              <Text style={[styles.swLetterSm, { backgroundColor: SKY }]}>S</Text>
              <Text style={[styles.swLetterSm, { backgroundColor: NAVY }]}>W</Text>
            </View>
            <Text style={styles.headerTitle}>회원가입</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.subTitle}>소프트웨어융합학과 구성원만 가입할 수 있습니다.</Text>

          {/* 이름 */}
          <Text style={styles.label}>이름</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={17} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="홍길동"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* 학번 */}
          <Text style={styles.label}>학번</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="card-outline" size={17} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="20221xxxxx"
              placeholderTextColor="#94a3b8"
              value={studentId}
              onChangeText={setStudentId}
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>

          {/* 학년 선택 */}
          <Text style={styles.label}>학년</Text>
          <View style={styles.yearRow}>
            {[1, 2, 3, 4].map((y) => (
              <TouchableOpacity
                key={y}
                style={[styles.yearBtn, year === y && styles.yearBtnActive]}
                onPress={() => setYear(y)}
              >
                <Text style={[styles.yearBtnText, year === y && styles.yearBtnTextActive]}>
                  {y}학년
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 이메일 */}
          <Text style={styles.label}>이메일</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={17} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* 비밀번호 */}
          <Text style={styles.label}>비밀번호</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={17} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="6자 이상"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
            />
            <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
              <Ionicons name={showPw ? "eye-outline" : "eye-off-outline"} size={17} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* 비밀번호 확인 */}
          <Text style={styles.label}>비밀번호 확인</Text>
          <View style={[
            styles.inputWrap,
            confirmPw.length > 0 && {
              borderColor: confirmPw === password ? "#22c55e" : "#ef4444"
            }
          ]}>
            <Ionicons name="lock-closed-outline" size={17} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="비밀번호 재입력"
              placeholderTextColor="#94a3b8"
              value={confirmPw}
              onChangeText={setConfirmPw}
              secureTextEntry={!showPw}
            />
            {confirmPw.length > 0 && (
              <Ionicons
                name={confirmPw === password ? "checkmark-circle" : "close-circle"}
                size={18}
                color={confirmPw === password ? "#22c55e" : "#ef4444"}
              />
            )}
          </View>

          {/* 가입 버튼 */}
          <TouchableOpacity
            style={[styles.signupBtn, loading && { opacity: 0.7 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.signupBtnText}>가입하기</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F7FA" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backBtn: { width: 40, height: 40, justifyContent: "center" },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  swBadgeSm: {
    flexDirection: "row", width: 28, height: 28,
    borderRadius: 8, overflow: "hidden",
  },
  swLetterSm: {
    flex: 1, color: "white", fontWeight: "900", fontSize: 11,
    textAlign: "center", textAlignVertical: "center", lineHeight: 26,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#1e293b" },

  scroll: { padding: 24 },
  subTitle: { fontSize: 13, color: "#94a3b8", marginBottom: 24 },

  label: {
    fontSize: 13, fontWeight: "700", color: "#64748b",
    marginBottom: 8, marginTop: 4,
  },
  inputWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "white", borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 2,
    marginBottom: 16, borderWidth: 1.5, borderColor: "#e2e8f0",
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#1e293b", paddingVertical: 13 },
  eyeBtn: { padding: 6 },

  yearRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  yearBtn: {
    flex: 1, paddingVertical: 13, borderRadius: 14,
    backgroundColor: "white", alignItems: "center",
    borderWidth: 1.5, borderColor: "#e2e8f0",
  },
  yearBtnActive: { backgroundColor: NAVY, borderColor: NAVY },
  yearBtnText: { fontSize: 14, fontWeight: "700", color: "#64748b" },
  yearBtnTextActive: { color: "white" },

  signupBtn: {
    backgroundColor: NAVY, borderRadius: 16,
    paddingVertical: 16, alignItems: "center",
    marginTop: 8,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  signupBtnText: { fontSize: 17, fontWeight: "800", color: "white" },
});
