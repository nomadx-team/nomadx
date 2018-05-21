export function isMarkdown(value: string): boolean {
  return /^\s*(?:\n)*\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/.test(value);
}

export function isArrayString(value: string): boolean {
  return /^\s*\[[\s\S]*\]\s*$/gm.test(value);
}
