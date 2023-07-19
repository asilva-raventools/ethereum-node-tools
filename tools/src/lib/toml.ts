export const replaceStartLine = (toml:string, searchStart:string, replace:string) => {
  const lines = toml.split('\n');

  const lineIndex = lines.findIndex((line:string) => line.trim().startsWith(searchStart));

  lines[lineIndex] = replace

  return lines.join('\n');
}