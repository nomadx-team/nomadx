export function isBoolean(value: any): value is boolean {
    return (typeof value === 'boolean');
}

export function isString(value: any): value is string {
    return (typeof value === 'string');
}

export function isBooleanString(value: any): value is 'true'|'false' {
    return isString(value) && (value === 'true' || value === 'false');
}

export function isEmptyString(value: any): value is '' {
    return isString(value) && (value === '');
}