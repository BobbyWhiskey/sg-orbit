import { create } from "@storybook/theming";

export default create({
    base: "light",

    // UI
    appBg: "white",
    appContentBg: "white",
    appBorderColor: "grey",
    appBorderRadius: 4,

    // Typography
    fontBase: "\"Open Sans\", sans-serif",
    fontCode: "monospace",

    // Text colors
    textColor: "black",
    textInverseColor: "rgba(255,255,255,0.9)",

    // Toolbar default and active colors
    barTextColor: "silver",
    barSelectedColor: "white",
    barBg: "#323E5A",

    // Form colors
    inputBg: "white",
    inputBorder: "silver",
    inputTextColor: "black",
    inputBorderRadius: 4,

    brandTitle: "Sharegate Storybook",
    brandUrl: "https://sharegate.com"
});
