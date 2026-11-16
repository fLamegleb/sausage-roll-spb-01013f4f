import { useRef, useState } from "react";
import { Send } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "@/lib/emailjs";

const schema = z.object({
  name: z.string().trim().min(2, "Укажите имя: минимум 2 символа").max(60),
  email: z.string().trim().email("Укажите корректный email").max(254),
  message: z.string().trim().min(10, "Напишите сообщение: минимум 10 символов").max(3000),
});
const empty = { name: "", email: "", message: "", website: "" };

export function FeedbackForm() {
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [failed, setFailed] = useState(false);
  const lock = useRef(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (lock.current || form.website) return;
    const result = schema.safeParse(form);
    setFailed(false);
    if (!result.success) {
      setFailed(true);
      setStatus(result.error.issues[0].message);
      return;
    }
    lock.current = true;
    setSending(true);
    setStatus("");
    try {
      await sendEmail({ subject: "Обратная связь — Рейтинг булочных СПб", from_name: result.data.name,
        reply_to: result.data.email, message: result.data.message });
      setForm(empty);
      setStatus("Сообщение отправлено. Спасибо! Ответим на указанный email.");
    } catch (error) {
      setFailed(true);
      setStatus(error instanceof Error ? error.message : "Не удалось отправить сообщение. Попробуйте ещё раз.");
    } finally {
      lock.current = false;
      setSending(false);
    }
  };
  return (
    <section id="feedback" className="container grid gap-8 py-16 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="feedback-title">
      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Обратная связь</p>
        <h2 id="feedback-title" className="text-4xl font-black uppercase leading-tight md:text-6xl">Есть что<br />рассказать?</h2>
        <p className="mt-5 max-w-md leading-7 text-muted-foreground">Предложите булочную, сообщите об ошибке или задайте вопрос. Ваше сообщение придёт команде сайта на почту.</p>
      </div>
      <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-5 shadow-card md:p-8" aria-busy={sending}>
        <fieldset disabled={sending} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-bold">Ваше имя
              <Input autoComplete="name" required minLength={2} maxLength={60} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="space-y-2 text-sm font-bold">Email для ответа
              <Input type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </label>
          </div>
          <label className="block space-y-2 text-sm font-bold">Сообщение
            <Textarea required minLength={10} maxLength={3000} rows={6} placeholder="Чем можем помочь?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
          </label>
          <div className="hidden" aria-hidden="true">
            <label>Ваш сайт<Input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></label>
          </div>
          <Button type="submit" variant="hero" size="xl" className="w-full"><Send />{sending ? "Отправляем…" : "Отправить сообщение"}</Button>
        </fieldset>
        <p role="status" aria-live="polite" className={"mt-4 text-sm " + (failed ? "text-destructive" : "text-muted-foreground")}>{status}</p>
      </form>
    </section>
  );
}
