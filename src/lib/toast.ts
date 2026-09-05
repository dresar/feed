import { toast as rawToast } from "sonner";

let lastToastTime = 0;
let lastToastMsg = "";

export const toast = {
  success: (msg: string, opts?: any) => {
    const now = Date.now();
    if (msg === lastToastMsg && now - lastToastTime < 2000) {
      return;
    }
    lastToastTime = now;
    lastToastMsg = msg;
    rawToast.success(msg, opts);
  },
  error: (msg: string, opts?: any) => {
    const now = Date.now();
    if (msg === lastToastMsg && now - lastToastTime < 2000) {
      return;
    }
    lastToastTime = now;
    lastToastMsg = msg;
    rawToast.error(msg, opts);
  },
  info: (msg: string, opts?: any) => {
    const now = Date.now();
    if (msg === lastToastMsg && now - lastToastTime < 2000) {
      return;
    }
    lastToastTime = now;
    lastToastMsg = msg;
    rawToast.info(msg, opts);
  },
  warning: (msg: string, opts?: any) => {
    const now = Date.now();
    if (msg === lastToastMsg && now - lastToastTime < 2000) {
      return;
    }
    lastToastTime = now;
    lastToastMsg = msg;
    rawToast.warning(msg, opts);
  },
};
