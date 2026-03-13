"use client";

import { sendGAEvent } from "@next/third-parties/google";

type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params?: EventParams) {
    const payload = Object.fromEntries(
        Object.entries(params ?? {}).filter(([, value]) => value !== undefined)
    );

    sendGAEvent("event", eventName, payload);
}
