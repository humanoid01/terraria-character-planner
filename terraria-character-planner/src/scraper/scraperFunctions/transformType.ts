const deleteHTML = (text: string): string => {
  let transformedText = '';
  let endTag = false;
  for (const letter of text) {
    if (letter === '<') {
      endTag = true;
      continue;
    }
    if (letter === '>') {
      endTag = false;
      transformedText += ' ';
      continue;
    }
    if (!endTag) transformedText += letter;
  }
  return transformedText;
};

export const transformType = (text: string): string => {
  const transformedText = deleteHTML(text);

  return transformedText.replace(/\s+/g, ' ').trim();
};
