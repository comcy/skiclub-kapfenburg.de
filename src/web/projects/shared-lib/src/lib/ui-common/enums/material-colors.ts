export const MATERIAL_COLOR = {
    NONE: undefined,
    PRIMARY: 'primary',
    ACCENT: 'accent',
    WARN: 'warn',
} as const;

export type MaterialColor = (typeof MATERIAL_COLOR)[keyof typeof MATERIAL_COLOR];
