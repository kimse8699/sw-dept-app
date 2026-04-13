import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "홈") iconName = focused ? "home" : "home-outline";
          else if (route.name === "투표")
            iconName = focused ? "checkbox" : "checkbox-outline";
          else if (route.name === "채팅")
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          else if (route.name === "마이")
            iconName = focused ? "person" : "person-outline";
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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Notice" component={NoticeScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        <Stack.Screen name="Reservation" component={ReservationScreen} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
