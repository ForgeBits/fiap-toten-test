export function generatePaymentUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateExternalReference(): string {
  return 'xxxxxxxxxxxxxx'.replace(/x/g, () => {
    const r = (Math.random() * 16) | 0;
    return r.toString(16);
  });
}
