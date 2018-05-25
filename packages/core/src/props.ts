import { isBoolean, isString, isBooleanString, isEmptyString } from './type-guards/guards';


/*
    Use cases:

    <my-element /> => false
    <my-element prop={false} /> => false
    <my-element prop="false" /> => false

    <my-element prop /> => true, global
    <my-element prop={true} /> => true, global
    <my-element prop="true" /> => true, global

    <my-element prop="some value" /> => true, specific
    <my-element prop="some value" /> => true, specific
*/

export function getPropScope(value: any): 'global' | 'specific' {
    let scope: 'global' | 'specific' = 'global';
    if (isString(value) && !isBooleanString(value) && !isEmptyString(value)) scope = 'specific';
    return scope;
}
export function getPropEnabled(value: any): boolean {
    if (isBoolean(value)) return value;
    if (isBooleanString(value)) return (value === 'true');
    if (isEmptyString(value)) return true;
    if (isString(value)) return true;
}
