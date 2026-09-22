export function fmt(n) {
  const num = Number(n) || 0;
  return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
