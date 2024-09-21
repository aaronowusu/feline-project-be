export function formatCatNames(catNames: string[]): string {
  if (catNames.length === 1) {
    return catNames[0];
  } else if (catNames.length === 2) {
    return `${catNames[0]} and ${catNames[1]}`;
  } else if (catNames.length > 2) {
    return (
      catNames.slice(0, -1).join(", ") +
      `, and ${catNames[catNames.length - 1]}`
    );
  }
  return "";
}
