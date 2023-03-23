export const deleteDuplicates = (items: any[]) => {
  const memoizedNames: { [key: string]: string } = {};

  const filteredItems = items.filter(item => {
    if (item.name)
      if (memoizedNames.hasOwnProperty(item.name)) {
        return false;
      }
    if (item.name) memoizedNames[item.name] = item.name;

    return true;
  });

  return filteredItems;
};
