import { ThemeProvider } from "@react-components/theme-provider";

export function withThemeProvider(Story, context) {
    const theme = context.globals.theme;
    const colorScheme = context.globals.colorScheme;

    return (
        <ThemeProvider theme={theme} colorScheme={colorScheme}>
            <Story />
        </ThemeProvider>
    );
}
