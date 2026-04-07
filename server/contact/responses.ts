import { ContactApiErrorCode } from "../../src/shared/contracts/contact.js";

export const CONTACT_SUCCESS_RESPONSE = { success: true } as const;

export const createContactFailureResponse = (code: ContactApiErrorCode) =>
  ({
    success: false,
    code,
  }) as const;
