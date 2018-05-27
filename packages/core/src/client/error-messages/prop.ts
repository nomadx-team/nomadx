import { getArticleFor, quote, tag } from './formatters';

export function PropRequired(element: string, prop: string) {
    return `${tag(element)} requires ${getArticleFor(prop)} ${quote(prop)} attribute, but none was specified.`
}

export function PropsIncompatible(element: string, prop: string, otherProp: string) {
    return `${tag(element)} does not support setting ${getArticleFor(prop)} ${quote(prop)} attribute if ${quote(otherProp)} is also defined.`
}

export function PropFormat(element: string, prop: string, value: any, descriptionOfExpectedFormat: string) {
    return `${tag(element)} attribute ${quote(prop)} equals ${quote(value)}, but it must ${descriptionOfExpectedFormat}`
}

export function PropFormatEnum(element: string, prop: string, value: any, acceptedValueList: string[]) {
    return PropFormat(element, prop, value, `be one of the following values: [${acceptedValueList.map(x => quote(x)).join()}]`)
}