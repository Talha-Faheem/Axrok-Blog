export const logger = {
  info: (msg: string, ...args: any[]) => console.log(`[AXROK-BACKEND] [INFO] ${msg}`, ...args),
  warn: (msg: string, ...args: any[]) => console.warn(`[AXROK-BACKEND] [WARN] ${msg}`, ...args),
  error: (msg: string, ...args: any[]) => console.error(`[AXROK-BACKEND] [ERROR] ${msg}`, ...args),
};
