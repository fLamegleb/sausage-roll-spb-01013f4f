import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FeedbackForm } from "./FeedbackForm";
import { sendEmail } from "@/lib/emailjs";
vi.mock("@/lib/emailjs", () => ({ sendEmail: vi.fn() }));
afterEach(() => { cleanup(); vi.resetAllMocks(); });
const fill = () => {
  fireEvent.change(screen.getByLabelText("Ваше имя"), { target: { value: "Глеб" } });
  fireEvent.change(screen.getByLabelText("Email для ответа"), { target: { value: "reader@example.com" } });
  fireEvent.change(screen.getByLabelText("Сообщение"), { target: { value: "Предлагаю новую булочную" } });
};
describe("Feedback form", () => {
  it("retains the message and allows retry after a failed request", async () => {
    vi.mocked(sendEmail).mockRejectedValueOnce(new Error("Сервис недоступен"));
    render(<FeedbackForm />); fill();
    fireEvent.click(screen.getByRole("button", { name: "Отправить сообщение" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Сервис недоступен"));
    expect(screen.getByLabelText("Сообщение")).toHaveValue("Предлагаю новую булочную");
    expect(screen.getByRole("button")).not.toBeDisabled();
  });
  it("locks during delivery and clears fields only after success", async () => {
    let resolve!: () => void;
    vi.mocked(sendEmail).mockReturnValueOnce(new Promise<void>(done => { resolve = done; }));
    render(<FeedbackForm />); fill();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByLabelText("Сообщение")).toHaveValue("Предлагаю новую булочную");
    resolve();
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Сообщение отправлено"));
    expect(screen.getByLabelText("Сообщение")).toHaveValue("");
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });
});
