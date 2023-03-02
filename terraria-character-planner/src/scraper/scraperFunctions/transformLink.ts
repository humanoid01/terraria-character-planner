export const transformLink = (link: string | undefined): string | undefined => {
  if (link) {
    const endIndex = link.indexOf('/revision/');

    return link.slice(0, endIndex);
  }
};
