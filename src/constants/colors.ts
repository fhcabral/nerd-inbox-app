const primitives = {
  // Neons roxos
  purple_900: "#0A0921", // quase preto, mas roxo/índigo
  purple_850: "#1F0844",
  purple_800: "#360F77",
  purple_700: "#461FA1",
  purple_600: "#6F29EE",
  purple_500: "#A227F0", // neon principal
  purple_400: "#9809DF",
  purple_300: "#D170F6",
  purple_250: "#D270F6",
  purple_200: "#CF85F5",

  // Neutros (puxados pro lilás, não “cinza morto”)
  ink_950: "#000000",
  ink_900: "#0B0B14",
  neutral_100: "#E1E1EF",
  neutral_200: "#CFCFE6",
  neutral_400: "#8F8FB2",

  // Acentos “nerd”
  mint_500: "#40FCBF",
  mint_700: "#1B9478",

  // Acento “arcade/fun”
  pink_500: "#EE6084",
  pink_700: "#C01541",
};

const dark = {
  bg: primitives.purple_900,
  surface: primitives.purple_850,
  surface2: "#120B2B",
  elevated: "#22104D",
  border: "rgba(209,112,246,0.35)",
  borderStrong: "rgba(162,39,240,0.65)",

  text: primitives.neutral_100,
  text2: primitives.neutral_200,
  textMuted: primitives.neutral_400,

  primary: primitives.purple_500,
  primary2: primitives.purple_600,
  onPrimary: "#0A0921",

  accent: primitives.mint_500,
  onAccent: "#06140F",

  fun: primitives.pink_500,
  onFun: "#1A070E",

  success: primitives.mint_500,
  warning: "#F6C177",
  error: "#FF4D6D",
  info: "#7AA2F7",

  overlay: "rgba(0,0,0,0.55)",
  focusRing: "rgba(64,252,191,0.55)",
  glow: "rgba(162,39,240,0.65)", // usado em sombra/borda neon
};

const light = {
  bg: "#F7F3FF",
  surface: "#FFFFFF",
  surface2: "#F1E9FF",
  elevated: "#FFFFFF",
  border: "rgba(70,31,161,0.18)",
  borderStrong: "rgba(162,39,240,0.35)",

  text: "#130A2B",
  text2: "#2A1459",
  textMuted: "#5B4B7A",

  primary: primitives.purple_600,
  primary2: primitives.purple_500,
  onPrimary: "#FFFFFF",

  accent: primitives.mint_700,
  onAccent: "#FFFFFF",

  fun: primitives.pink_700,
  onFun: "#FFFFFF",

  success: primitives.mint_700,
  warning: "#C97A1B",
  error: "#D81B60",
  info: "#3B5CCC",

  overlay: "rgba(10,9,33,0.12)",
  focusRing: "rgba(111,41,238,0.30)",
  glow: "rgba(111,41,238,0.30)",
};

const effects = {
  shadowSm: { shadowOpacity: 0.18, shadowRadius: 8, elevation: 2 },
  shadowMd: { shadowOpacity: 0.22, shadowRadius: 14, elevation: 4 },
  shadowLg: { shadowOpacity: 0.28, shadowRadius: 22, elevation: 7 },

  glowPrimary: { shadowColor: dark.glow, shadowOpacity: 0.55, shadowRadius: 16, elevation: 8 },
  glowMint: { shadowColor: dark.accent, shadowOpacity: 0.40, shadowRadius: 14, elevation: 7 },
};

export { dark, effects, light, primitives };

