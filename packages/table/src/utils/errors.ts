const FixParentChild = 'Make sure these elements are properly nested.';
export const RenderErrorNoParent = (child, parent) => `Cannot render <${child}> outside of a <${parent}> component. ${FixParentChild}`
export const RenderErrorNoChild = (parent, child) => `Cannot render <${parent}> without a child <${child}> component. ${FixParentChild}`
