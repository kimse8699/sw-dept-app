import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "./src/context/AuthContext";

// 인증 화면
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";

// 메인 화면
import CalendarScreen from "./src/screens/CalendarScreen";
import ChatRoomScreen from "./src/screens/ChatRoomScreen";
import ChatbotScreen from "./src/screens/ChatbotScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MessengerScreen from "./src/screens/MessengerScreen";
import MyScreen from "./src/screens/MyScreen";
import NoticeScreen from "./src/screens/NoticeScreen";
import PollingScreen from "./src/screens/PollingScreen";
import ReservationScreen from "./src/screens/ReservationScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ── 하단 탭 네비게이터
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "홈") iconName = focused ? "home" : "home-outline";
          else if (route.name === "투표") iconName = focused ? "checkbox" : "checkbox-outline";
          else if (route.name === "채팅") iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          else if (route.name === "마이") iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1B3080",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 60,
          paddingBottom: 8,
        },
      })}
    >
      <Tab.Screen name="홈" component={HomeScreen} />
      <Tab.Screen name="투표" component={PollingScreen} />
      <Tab.Screen name="채팅" component={MessengerScreen} />
      <Tab.Screen name="마이" component={MyScreen} />
    </Tab.Navigator>
  );
}

// ── 로그인된 사용자용 스택
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Notice" component={NoticeScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      <Stack.Screen name="Reservation" component={ReservationScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
    </Stack.Navigator>
  );
}

// ── 비로그인 사용자용 스택
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ animation: "slide_from_bottom" }}
      />
    </Stack.Navigator>
  );
}

// ── 로그인 상태에 따라 분기
function RootNavigator() {
  const { user, loading } = useAuth();

  // Firebase 인증 상태 확인 중 → 스플래시 로딩
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1B3080" }}>
        <ActivityIndicator size="large" color="#5BC8EA" />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
