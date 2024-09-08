export const formatFieldArgsHepler = (fields: string[]): string[] => {
    return fields.join(' ').match(/(\*?\w+:\{[^}]+\})|(\*?\w+:\[[^\]]+\])|(\*?\w+:\w+)/g) || [];
}