export const transformTooltip = (tooltip: string): string => {
  let transformedText = '';
  let endTag = false;
  for (const letter of tooltip) {
    if (letter === '<') {
      endTag = true;
      continue;
    }
    if (letter === '>') {
      endTag = false;
      continue;
    }
    if (!endTag) transformedText += letter;
  }

  return transformedText;
};
