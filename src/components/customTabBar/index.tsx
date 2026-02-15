import { useTheme } from "@/src/contexts/theme/useTheme";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from "react-native-reanimated";

import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, layout } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);

  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const progress = useSharedValue(0);

  const TAB_HEIGHT = 64;
  const FAB_SIZE = 56;

  const salesIndex = state.routes.findIndex((r) => r.name === "sales");

  const sideRoutes = state.routes.filter((_, i) => i !== salesIndex);
  const leftRoutes = sideRoutes.slice(0, Math.ceil(sideRoutes.length / 2));
  const rightRoutes = sideRoutes.slice(Math.ceil(sideRoutes.length / 2));

  const goTo = (routeName: string) => navigation.navigate(routeName as never);

  const iconFor = (name: string, color: string, size: number) => {
    switch (name) {
      case "home":
        return <Entypo name="home" size={size} color={color} />;
      case "products":
        return <MaterialIcons name="inventory" size={size} color={color} />;
      case "settings":
        return <MaterialIcons name="settings" size={size} color={color} />;
      default:
        return <Entypo name="dot-single" size={size} color={color} />;
    }
  };

  const isFocused = (routeName: string) => state.routes[state.index]?.name === routeName;

  const handleContainerLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const animateFAB = () => {
    scale.value = withSequence(
      withSpring(0.9, { damping: 10, stiffness: 300 }), // aperta
      withSpring(1.2, { damping: 8, stiffness: 250 }),  // solta e expande
      withSpring(1, { damping: 15, stiffness: 400 })    // volta ao normal
    );

    rotate.value = withSequence(
      withTiming(360, { 
        duration: 600, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      }),
      withTiming(0, { duration: 0 }) // reseta para a próxima vez
    );

    progress.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 200 })
    );

    setTimeout(() => {
      goTo("sales");
    }, 150);
  };

  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` }
      ],
    };
  });

  const ringAnimatedStyle = useAnimatedStyle(() => {
    const ringScale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 1.3, 1]
    );

    const ringOpacity = interpolate(
      progress.value,
      [0, 0.3, 0.7, 1],
      [0.5, 0.8, 0.4, 0]
    );

    return {
      transform: [{ scale: ringScale }],
      opacity: ringOpacity,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const iconScale = interpolate(
      progress.value,
      [0, 0.3, 0.6, 1],
      [1, 1.2, 0.9, 1]
    );

    return {
      transform: [{ scale: iconScale }],
    };
  });

  return (
    <View
      onLayout={handleContainerLayout}
      style={{
        position: "absolute",
        left: layout.space[4],
        right: layout.space[4],
        bottom: layout.space[2],

        height: TAB_HEIGHT,
        borderRadius: layout.radius.pill,
        backgroundColor: colors.elevated,
        borderTopWidth: 0,

        shadowColor: colors.glow,
        shadowOpacity: 0.35,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 10,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: layout.space[5],
      }}
    >
      {/* LADO ESQUERDO */}
      <View style={{ flexDirection: "row", gap: layout.space[6] }}>
        {leftRoutes.map((route) => {
          const focused = isFocused(route.name);
          const color = focused ? colors.primary : colors.textMuted;

          return (
            <Pressable
              key={route.key}
              onPress={() => goTo(route.name)}
              style={({ pressed }) => [
                { padding: 10, borderRadius: 12 },
                pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
              ]}
            >
              {iconFor(route.name, color, 24)}
            </Pressable>
          );
        })}
      </View>

      {/* LADO DIREITO */}
      <View style={{ flexDirection: "row", gap: layout.space[6] }}>
        {rightRoutes.map((route) => {
          const focused = isFocused(route.name);
          const color = focused ? colors.primary : colors.textMuted;

          return (
            <Pressable
              key={route.key}
              onPress={() => goTo(route.name)}
              style={({ pressed }) => [
                { padding: 10, borderRadius: 12 },
                pressed && { transform: [{ scale: 0.96 }], opacity: 0.9 },
              ]}
            >
              {iconFor(route.name, color, 24)}
            </Pressable>
          );
        })}
      </View>

      {/* FAB CENTRAL COM ANIMAÇÃO */}
      {containerWidth > 0 && (
        <View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            left: containerWidth / 2 - FAB_SIZE / 2,
            top: -22,
            width: FAB_SIZE,
            height: FAB_SIZE,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Anel animado */}
          <Animated.View
            style={[
              ringAnimatedStyle,
              {
                position: "absolute",
                width: FAB_SIZE + 10,
                height: FAB_SIZE + 10,
                borderRadius: (FAB_SIZE + 10) / 2,
                backgroundColor: colors.primary,
                opacity: 0.5,
              }
            ]}
          />

          {/* Anel externo (decoração) */}
          <View
            style={{
              position: "absolute",
              width: FAB_SIZE + 10,
              height: FAB_SIZE + 10,
              borderRadius: (FAB_SIZE + 10) / 2,
              backgroundColor: colors.bg,
            }}
          />

          {/* Botão animado */}
          <AnimatedPressable
            onPress={animateFAB}
            style={[
              fabAnimatedStyle,
              {
                width: FAB_SIZE,
                height: FAB_SIZE,
                borderRadius: FAB_SIZE / 2,
                backgroundColor: "#000",
                alignItems: "center",
                justifyContent: "center",

                shadowColor: colors.glow,
                shadowOpacity: 0.55,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 10 },
                elevation: 12,
              }
            ]}
          >
            <Animated.View style={iconAnimatedStyle}>
              <Ionicons name="add" size={30} color={colors.accent} />
            </Animated.View>
          </AnimatedPressable>
        </View>
      )}
    </View>
  );
}