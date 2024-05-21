import { createAction } from "@reduxjs/toolkit";

export const STOP_POLLING = "STOP_POLLING";

// We can also have actions without any reducers to be used in middleware
export const stopPolling = createAction(STOP_POLLING);
