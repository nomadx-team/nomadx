function wrap(value: string, strA: string, strB?: string): string {
    if (!strB) strB = strA;
    return `${strA}${value}${strB}`;
}

export function getArticleFor(value: string) {
    return (value.startsWith('a')) ? 'an' : 'a';
}

export function quote(value: string, type: 'single' | 'double' = 'single') {
    const char = (type === 'single') ? '\'' : '"';
    return wrap(value, char);
}

export function tag(value: string, close = true) {
    const end = close ? '/>' : '>';
    return wrap(value, '<', end);
}