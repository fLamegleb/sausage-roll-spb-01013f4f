import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "./emailjs";

describe("EmailJS delivery", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_test");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_test");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "public_test");
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
  const message = { subject: "Отзыв", from_name: "Глеб", message: "Текст отзыва" };
  it("does not pretend to send when configuration is missing", async () => {
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "");
    const request = vi.fn(); vi.stubGlobal("fetch", request);
    await expect(sendEmail(message)).rejects.toThrow("Отправка пока недоступна");
    expect(request).not.toHaveBeenCalled();
  });
  it("passes template parameters and never supplies a recipient from user input", async () => {
    const request = vi.fn().mockResolvedValue({ ok: true }); vi.stubGlobal("fetch", request);
    await sendEmail({ ...message, reply_to: "reader@example.com" });
    const body = JSON.parse(request.mock.calls[0][1].body);
    expect(body).toEqual({ service_id: "service_test", template_id: "template_test", user_id: "public_test",
      template_params: { ...message, reply_to: "reader@example.com", site_url: window.location.origin } });
  });
  it("reports rate limiting as failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 429 }));
    await expect(sendEmail(message)).rejects.toThrow("Слишком много отправок");
  });
  it("reports network errors as failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(sendEmail(message)).rejects.toThrow("Проверьте соединение");
  });
});
