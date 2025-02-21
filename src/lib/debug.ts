export function debug(label: string, value: unknown) {
  // console.log in NODE
  if (typeof window === "undefined") {
    console.log(value);
    return;
  }

  const color = "#3E78CC";
  const debugValue =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);

  console.debug(`%c${label}: ${debugValue}`, `color: ${color}`);
}
