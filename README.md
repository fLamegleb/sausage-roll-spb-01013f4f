# Рейтинг булочных СПб

Информационный сайт-рейтинг булочных Санкт-Петербурга по качеству сосисок в тесте.

## Стек
- Vite + React + TypeScript
- Tailwind CSS
- shadcn/ui

## Разработка
```sh
npm i
npm run dev
```

## Почта через EmailJS

Форма обратной связи и анкета покупателей отправляются одним шаблоном EmailJS через REST API. Backend не требуется. Без настроек форма сообщает о недоступности отправки и сохраняет текст. Фото не отправляются; отзывы не изменяют рейтинг автоматически.

1. В [EmailJS](https://dashboard.emailjs.com/) подключите почтовый сервис в Email Services. Сохраните Service ID.
2. Создайте шаблон в Email Templates. В **To Email** укажите постоянный адрес владельца сайта. Не используйте адрес посетителя в качестве получателя.
3. Настройте поля шаблона:

| Поле | Значение |
| --- | --- |
| Subject | {{subject}} |
| From Name | {{from_name}} |
| From Email | Адрес подключённого сервиса (default) |
| Reply To | {{reply_to}} |

Тело письма (HTML-редактор):

```html
<h2>{{subject}}</h2>
<p>От: {{from_name}}</p>
<p>Email для ответа: {{reply_to}}</p>
<p>Сайт: {{site_url}}</p>
<div style="white-space: pre-wrap">{{message}}</div>
```

Используйте двойные скобки, чтобы EmailJS экранировал введённый пользователем текст. В отзывах reply_to пустой — email для ответа запрашивается только в отдельной форме обратной связи. Сохраните Template ID.

4. В Account найдите Public Key. Private Key и пароль от почты сайту не нужны.
5. В Vercel → проект → Settings → Environment Variables добавьте для Production (и Preview, если нужно):

```dotenv
VITE_EMAILJS_SERVICE_ID=service_...
VITE_EMAILJS_TEMPLATE_ID=template_...
VITE_EMAILJS_PUBLIC_KEY=...
```

Эти параметры публичные: Vite включает их в браузерную сборку. Не добавляйте сюда Private Key. Для локальной проверки скопируйте .env.example в .env.local и заполните значения.

6. Если используете allowlist EmailJS, добавьте точный production origin сайта Vercel и собственный домен. Для проверки preview отдельно разрешите его origin. Honeypot и блокировка двойного нажатия в формах не заменяют серверные лимиты EmailJS.
7. После изменения переменных Vercel сделайте Redeploy: значения Vite подставляются при сборке. Проверьте обе формы и получение писем (включая папку Спам). Отключите сеть и убедитесь, что текст при сбое остаётся. Реальная доставка до заполнения параметров не проверена.

Документация: [EmailJS send](https://www.emailjs.com/docs/rest-api/send/), [переменные шаблонов](https://www.emailjs.com/docs/user-guide/dynamic-variables-templates/), [Vercel variables](https://vercel.com/docs/environment-variables).
