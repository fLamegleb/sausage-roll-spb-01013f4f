export type EmailMessage = {
  subject: string;
  from_name: string;
  reply_to?: string;
  message: string;
};

export async function sendEmail(message: EmailMessage): Promise<void> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();
  if (!serviceId || !templateId || !publicKey) {
    throw new Error("Отправка пока недоступна. Попробуйте позже.");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: { ...message, reply_to: message.reply_to ?? "", site_url: window.location.origin },
      }),
    });
    if (!response.ok) {
      throw new Error(response.status === 429
        ? "Слишком много отправок. Подождите минуту и повторите."
        : "Не удалось отправить сообщение. Попробуйте позже.");
    }
  } catch (error) {
    if (controller.signal.aborted || error instanceof TypeError) {
      throw new Error("Сервис не ответил. Проверьте соединение и попробуйте ещё раз.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
