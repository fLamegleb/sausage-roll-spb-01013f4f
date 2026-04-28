import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Bike,
  Camera,
  Coffee,
  Compass,
  Filter,
  Heart,
  MapPin,
  Navigation,
  PiggyBank,
  Search,
  Send,
  Star,
  ThumbsUp,
  Upload,
  Wheat,
} from "lucide-react";
import heroImage from "@/assets/sausage-roll-hero.jpg";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Bakery = {
  name: string;
  rating: number;
  price: number;
  district: string;
  dough: "дрожжевое" | "слоеное";
  freshness: number;
  juiciness: number;
  value: number;
  look: number;
  comment: string;
  image: string;
  x: string;
  y: string;
};

const bakeries: Bakery[] = [
  { name: "Булочная Ф. Вольчека", rating: 4.5, price: 119, district: "Центр", dough: "дрожжевое", freshness: 4.6, juiciness: 4.3, value: 4.7, look: 4.2, comment: "Народная классика: мягкое тесто, честная цена и стабильный результат между парами.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80", x: "45%", y: "39%" },
  { name: "Цех 85", rating: 4.2, price: 149, district: "Петроградка", dough: "слоеное", freshness: 4.4, juiciness: 4.0, value: 4.0, look: 4.5, comment: "Глянцевая корочка, стильная подача, но цена уже просит студенческую скидку.", image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=900&q=80", x: "52%", y: "31%" },
  { name: "Хлебник", rating: 4.1, price: 99, district: "Купчино", dough: "дрожжевое", freshness: 4.1, juiciness: 3.9, value: 4.6, look: 3.8, comment: "Доступный вариант без пафоса: горячо, быстро и почти всегда рядом.", image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=900&q=80", x: "55%", y: "72%" },
  { name: "Люди Любят", rating: 4.6, price: 159, district: "Васильевский", dough: "слоеное", freshness: 4.8, juiciness: 4.5, value: 4.3, look: 4.7, comment: "Уютная булочная с сильной выпечкой: сосиска выглядит так, будто ее фотографировали для обложки.", image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=80", x: "32%", y: "46%" },
  { name: "Буше", rating: 4.4, price: 179, district: "Центр", dough: "слоеное", freshness: 4.6, juiciness: 4.2, value: 3.9, look: 4.8, comment: "Французский флер, аккуратная корочка и кофе, который делает перекус почти культурным событием.", image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=900&q=80", x: "47%", y: "47%" },
  { name: "Север / Север-Метрополь", rating: 4.1, price: 189, district: "Центр", dough: "дрожжевое", freshness: 4.0, juiciness: 3.8, value: 3.7, look: 4.6, comment: "Исторический вес Петербурга чувствуется сильнее, чем мясная сочность, но опыт важный.", image: "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=900&q=80", x: "50%", y: "43%" },
  { name: "Два Зерна", rating: 4.9, price: 169, district: "Адмиралтейский", dough: "слоеное", freshness: 5.0, juiciness: 4.8, value: 4.7, look: 4.9, comment: "Кофейный фаворит индекса: тесто хрустит, сосиска не теряется, настроение растет.", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80", x: "41%", y: "53%" },
  { name: "Британские Пекарни", rating: 4.3, price: 165, district: "Московский", dough: "слоеное", freshness: 4.4, juiciness: 4.1, value: 4.0, look: 4.5, comment: "Авторская выпечка и плотный перекус для тех, кто любит экспериментировать с маршрутом.", image: "https://images.unsplash.com/photo-1600398137872-57a8055f8efa?auto=format&fit=crop&w=900&q=80", x: "57%", y: "61%" },
  { name: "Лавка Пекаря", rating: 3.8, price: 109, district: "Невский", dough: "дрожжевое", freshness: 3.8, juiciness: 3.6, value: 4.1, look: 3.7, comment: "Горячая выпечка спасает, но индекс просит чуть больше сочности и аккуратности.", image: "https://images.unsplash.com/photo-1567042661848-7161ce446f85?auto=format&fit=crop&w=900&q=80", x: "66%", y: "48%" },
  { name: "Кофе на Кухне", rating: 4.3, price: 155, district: "Петроградка", dough: "дрожжевое", freshness: 4.5, juiciness: 4.2, value: 4.1, look: 4.3, comment: "Домашнее настроение, мягкая булка и тот самый перекус, после которого хочется остаться с ноутбуком.", image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=80", x: "58%", y: "27%" },
];

const reasons = [
  ["Универсальный продукт", "Есть почти в каждой булочной — значит, сравнение получается честным."],
  ["Тесто говорит первым", "Свежесть, корочка и воздушность сразу показывают уровень пекарни."],
  ["Сосиска не прощает", "Если начинка сухая или безвкусная, общий рейтинг уже не спасает."],
  ["Sausage Roll Index", "Как индекс Биг-Мака, только теплее, ближе и с петербургскими крошками."],
];

const personas = [
  ["Анна", "19 лет, студентка", "Ищет быстрый и недорогой перекус между парами, ценит отзывы, цену и понятный рейтинг."],
  ["Дмитрий", "32 года, фрилансер-разработчик", "Работает в кофейнях, любит новые места, карту, фильтры и подробные комментарии."],
  ["Ольга", "51 год, преподаватель", "Выбирает надежные места, обращает внимание на свежесть, гигиену и качество продуктов."],
];

const metricIcons = [Wheat, Heart, PiggyBank, Camera, ThumbsUp];

const Index = () => {
  const [sort, setSort] = useState("rating");
  const [district, setDistrict] = useState("all");
  const [dough, setDough] = useState("all");
  const [active, setActive] = useState(bakeries[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const openBakeryDetails = (bakery: Bakery) => {
    setActive(bakery);
    setDetailsOpen(true);
  };

  const filteredBakeries = useMemo(() => {
    return [...bakeries]
      .filter((item) => district === "all" || item.district === district)
      .filter((item) => dough === "all" || item.dough === dough)
      .sort((a, b) => {
        if (sort === "price") return a.price - b.price;
        if (sort === "freshness") return b.freshness - a.freshness;
        if (sort === "juiciness") return b.juiciness - a.juiciness;
        if (sort === "value") return b.value - a.value;
        return b.rating - a.rating;
      });
  }, [district, dough, sort]);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative min-h-[92vh] bg-gradient-hero paper-grain">
        <div className="container grid min-h-[92vh] items-center gap-10 py-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="animate-rise space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/75 px-4 py-2 text-sm font-bold text-primary shadow-card backdrop-blur">
              <BadgeCheck className="h-4 w-4" /> Производственная практика 2026
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] md:text-7xl lg:text-8xl">Рейтинг булочных СПб</h1>
              <p className="max-w-2xl text-2xl font-extrabold text-cocoa md:text-3xl">Ищем лучшую сосиску в тесте в Санкт-Петербурге</p>
              <p className="max-w-xl text-lg leading-8 text-muted-foreground">Оцениваем булочные по свежести теста, сочности сосиски, цене и отзывам покупателей.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl"><a href="#rating"><Star /> Смотреть рейтинг</a></Button>
              <Button asChild variant="bakery" size="xl"><a href="#review"><Send /> Оставить отзыв</a></Button>
            </div>
            <div className="grid max-w-xl grid-cols-3 gap-3 text-sm font-bold">
              {[["4.9", "лидер индекса"], ["10", "точек в обзоре"], ["5", "критериев оценки"]].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-border bg-card/70 p-4 shadow-card backdrop-blur">
                  <div className="text-2xl text-primary">{value}</div><div className="text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={heroImage} alt="Сосиска в тесте, кофе и карта Санкт-Петербурга на столе булочной" width={1600} height={1100} className="h-[48vh] min-h-[360px] w-full rounded-[2rem] object-cover shadow-warm lg:h-[70vh]" />
            <div className="absolute -bottom-7 left-8 animate-float rounded-2xl border border-border bg-card p-5 shadow-warm">
              <div className="text-4xl">🌭</div><div className="font-display text-2xl font-black">Индекс сосиски</div><div className="text-sm text-muted-foreground">важнее общего рейтинга</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mb-10 max-w-3xl">
          <p className="mb-3 font-bold uppercase text-primary">Почему именно сосиска в тесте?</p>
          <h2 className="text-4xl font-black md:text-6xl">Маленький продукт, большой булочный детектор</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map(([title, text], index) => (
            <article key={title} className="group rounded-2xl border border-border bg-card p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-warm">
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold font-black text-accent-foreground">0{index + 1}</div>
              <h3 className="mb-3 text-2xl font-black">{title}</h3>
              <p className="leading-7 text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="rating" className="bg-cream py-20">
        <div className="container">
          <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 font-bold uppercase text-primary">Рейтинг булочных</p>
              <h2 className="text-4xl font-black md:text-6xl">Где тесто держит марку</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-card lg:min-w-[560px]">
              <div className="mb-3 flex items-center gap-2 font-bold"><Filter className="h-4 w-4 text-primary" /> Фильтры и сортировка</div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Select value={sort} onValueChange={setSort}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="rating">по рейтингу</SelectItem><SelectItem value="price">по цене</SelectItem><SelectItem value="freshness">по свежести</SelectItem><SelectItem value="juiciness">по сочности</SelectItem><SelectItem value="value">цена/качество</SelectItem></SelectContent></Select>
                <Select value={district} onValueChange={setDistrict}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">все районы</SelectItem><SelectItem value="Центр">Центр</SelectItem><SelectItem value="Петроградка">Петроградка</SelectItem><SelectItem value="Васильевский">Васильевский</SelectItem><SelectItem value="Купчино">Купчино</SelectItem><SelectItem value="Московский">Московский</SelectItem><SelectItem value="Невский">Невский</SelectItem></SelectContent></Select>
                <Select value={dough} onValueChange={setDough}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">любое тесто</SelectItem><SelectItem value="дрожжевое">дрожжевое</SelectItem><SelectItem value="слоеное">слоеное</SelectItem></SelectContent></Select>
                <Button variant="gold"><Compass /> рядом</Button>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredBakeries.map((bakery) => (
              <article key={bakery.name} className="overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-warm">
                <div className="relative h-52 overflow-hidden"><img src={bakery.image} alt={`Фото выпечки или булочной ${bakery.name}`} loading="lazy" className="h-full w-full object-cover transition duration-500 hover:scale-105" /><div className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-sm font-black text-primary shadow-card">★ {bakery.rating}</div></div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3"><h3 className="text-2xl font-black">{bakery.name}</h3><span className="rounded-full bg-secondary px-3 py-1 text-sm font-bold">{bakery.price} ₽</span></div>
                  <p className="leading-7 text-muted-foreground">{bakery.comment}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[['тесто', bakery.freshness], ['сосиска', bakery.juiciness], ['цена', bakery.value], ['вид', bakery.look]].map(([label, value]) => (
                      <div key={label} className="rounded-lg bg-muted p-3"><div className="flex justify-between font-bold"><span>{label}</span><span>{value}</span></div><div className="mt-2 h-2 rounded-full bg-border"><div className="h-full rounded-full bg-primary" style={{ width: `${Number(value) * 20}%` }} /></div></div>
                    ))}
                  </div>
                  <Button variant="bakery" className="w-full" onClick={() => openBakeryDetails(bakery)}>Подробнее</Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container grid gap-8 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-warm"><img src={active.image} alt={`Большое фото сосиски в тесте и выпечки ${active.name}`} loading="lazy" className="h-80 w-full object-cover lg:h-full" /></div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
          <p className="mb-3 font-bold uppercase text-primary">Подробная карточка</p>
          <h2 className="mb-4 text-4xl font-black md:text-5xl">{active.name}</h2>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <Info icon={MapPin} label="Адрес" value={`${active.district}, СПб`} />
            <Info icon={Star} label="Средний рейтинг" value={`${active.rating} из 5`} />
            <Info icon={PiggyBank} label="Цена" value={`${active.price} ₽`} />
            <Info icon={Wheat} label="Тип теста" value={active.dough} />
          </div>
          <div className="space-y-3">
            {[['Сочность сосиски', active.juiciness], ['Свежесть', active.freshness], ['Цена/качество', active.value], ['Внешний вид', active.look]].map(([label, value]) => <Score key={label} label={String(label)} value={Number(value)} />)}
          </div>
          <div className="mt-6 rounded-xl bg-muted p-5"><p className="font-bold">Комментарии пользователей</p><p className="mt-2 text-muted-foreground">«Свежая партия после 12:00 — лучший шанс поймать хрустящую корочку и нормальную температуру начинки».</p></div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button variant="hero"><Navigation /> Построить маршрут</Button><Button variant="bakery"><Send /> Оставить отзыв</Button></div>
        </div>
      </section>

      <section className="bg-cocoa py-20 text-primary-foreground">
        <div className="container grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div><p className="mb-3 font-bold uppercase text-bread">Карта Петербурга</p><h2 className="text-4xl font-black md:text-6xl">Точки, где пахнет булкой</h2><p className="mt-5 text-lg leading-8 text-primary-foreground/75">Кликните по отметке, чтобы увидеть мини-карточку с рейтингом сосиски в тесте, ценой и быстрым переходом к деталям.</p></div>
          <div className="relative min-h-[460px] rounded-3xl border border-primary-foreground/15 bg-secondary/15 p-5 shadow-warm">
            <div className="absolute inset-5 rounded-2xl border border-primary-foreground/10 paper-grain" />
            <div className="absolute left-[18%] top-[20%] h-px w-[68%] rotate-12 bg-primary-foreground/20" /><div className="absolute left-[22%] top-[62%] h-px w-[60%] -rotate-12 bg-primary-foreground/20" /><div className="absolute left-[38%] top-[12%] h-[72%] w-px bg-primary-foreground/20" />
            {bakeries.map((bakery) => <button key={bakery.name} onClick={() => setActive(bakery)} className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-card transition hover:scale-125" style={{ left: bakery.x, top: bakery.y }} aria-label={`Открыть точку ${bakery.name}`}><MapPin className="h-4 w-4" /></button>)}
            <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-card p-5 text-foreground shadow-warm md:left-auto md:w-80">
              <div className="mb-2 text-xl font-black">{active.name}</div><p className="text-sm text-muted-foreground">Рейтинг сосиски: <b className="text-primary">{active.rating}</b> · цена {active.price} ₽</p><Button variant="hero" size="sm" className="mt-4" onClick={() => openBakeryDetails(active)}>Подробнее</Button>
            </div>
          </div>
        </div>
      </section>

      <section id="review" className="container grid gap-8 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <div><p className="mb-3 font-bold uppercase text-primary">Анкета покупателей</p><h2 className="text-4xl font-black md:text-6xl">Ваш перекус — часть науки</h2><p className="mt-5 text-lg leading-8 text-muted-foreground">Дружелюбная форма для отзывов помогает обновлять Sausage Roll Index и отделять легенду от пересушенной сосиски.</p><div className="mt-8 rounded-3xl bg-gradient-gold p-8 shadow-card"><div className="text-7xl">🌭</div><h3 className="mt-4 text-3xl font-black">Маскот Батончик</h3><p className="mt-2 text-accent-foreground/80">Улыбается только свежему тесту и честным отзывам.</p></div></div>
        <form className="rounded-2xl border border-border bg-card p-5 shadow-card md:p-8">
          <div className="grid gap-4 md:grid-cols-2"><Input placeholder="Имя" /><Input type="date" /><Input type="time" /><Input placeholder="Название заведения" /></div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">{['Свежесть теста', 'Сочность сосиски', 'Цена-качество', 'Внешний вид'].map((label) => <label key={label} className="rounded-xl bg-muted p-4 font-bold">{label}<Input type="range" min="1" max="5" defaultValue="4" className="mt-3" /></label>)}</div>
          <div className="mt-5 grid gap-4 md:grid-cols-2"><Select><SelectTrigger><SelectValue placeholder="Рекомендуете?" /></SelectTrigger><SelectContent><SelectItem value="yes">Да</SelectItem><SelectItem value="no">Нет</SelectItem></SelectContent></Select><label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background text-sm font-bold"><Upload className="h-4 w-4" /> Загрузка фото<Input type="file" className="hidden" /></label></div>
          <Textarea className="mt-5" placeholder="Комментарий: температура, хруст, настроение, очередь..." />
          <Button variant="hero" size="xl" className="mt-5 w-full"><Send /> Отправить отзыв</Button>
        </form>
      </section>

      <section className="bg-cream py-20">
        <div className="container">
          <div className="mb-10 max-w-3xl"><p className="mb-3 font-bold uppercase text-primary">Как считается рейтинг</p><h2 className="text-4xl font-black md:text-6xl">Формула честной булки</h2></div>
          <div className="grid gap-4 md:grid-cols-5">{['тесто', 'сосиска', 'цена', 'фото', 'лайк'].map((label, index) => { const Icon = metricIcons[index]; return <div key={label} className="rounded-2xl border border-border bg-card p-6 text-center shadow-card"><Icon className="mx-auto mb-4 h-9 w-9 text-primary" /><div className="font-black">{label}</div><div className="mt-2 text-2xl font-black text-accent">+1</div></div>; })}</div>
          <div className="mt-6 rounded-2xl border border-primary/20 bg-card p-6 text-center text-xl font-black shadow-card">Итоговый рейтинг = свежесть теста + сочность сосиски + цена/качество + внешний вид + рекомендации пользователей</div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div><p className="mb-3 font-bold uppercase text-primary">Целевая аудитория</p><h2 className="mb-6 text-4xl font-black md:text-6xl">Для кого этот сервис</h2><div className="space-y-4">{personas.map(([name, role, text]) => <article key={name} className="rounded-2xl border border-border bg-card p-6 shadow-card"><h3 className="text-2xl font-black">{name}</h3><p className="font-bold text-primary">{role}</p><p className="mt-2 text-muted-foreground">{text}</p></article>)}</div></div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-warm"><p className="mb-3 font-bold uppercase text-primary">Аналоги</p><h2 className="text-4xl font-black">Нишево, но без визуального шума</h2><div className="mt-6 space-y-4"><div className="rounded-xl bg-muted p-5"><b>Hleb club</b><p className="text-muted-foreground">Понятная структура, но местами страдает читаемость.</p></div><div className="rounded-xl bg-muted p-5"><b>Где Шаверма</b><p className="text-muted-foreground">Удачный нишевый рейтинг с геймификацией, но визуально шумный.</p></div><div className="rounded-xl bg-primary p-5 text-primary-foreground"><b>Вывод</b><p className="text-primary-foreground/80">Наш сайт сфокусирован на одном продукте, чистой иерархии и быстром выборе булочной.</p></div></div></div>
        </div>
      </section>

      <a href="#review" className="fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-button text-primary-foreground shadow-warm md:hidden" aria-label="Оставить отзыв"><Send className="h-5 w-5" /></a>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl border-border p-0 shadow-warm sm:max-w-3xl">
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-72 overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
              <img src={active.image} alt={`Подробное фото булочной ${active.name}`} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1 text-sm font-black text-primary shadow-card">★ {active.rating}</div>
            </div>
            <div className="p-6 md:p-8">
              <DialogHeader>
                <DialogDescription className="font-bold uppercase text-primary">Подробная карточка пекарни</DialogDescription>
                <DialogTitle className="text-3xl font-black leading-tight md:text-4xl">{active.name}</DialogTitle>
              </DialogHeader>
              <p className="mt-4 leading-7 text-muted-foreground">{active.comment}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Info icon={MapPin} label="Район" value={`${active.district}, СПб`} />
                <Info icon={PiggyBank} label="Цена" value={`${active.price} ₽`} />
                <Info icon={Wheat} label="Тип теста" value={active.dough} />
                <Info icon={Star} label="Индекс" value={`${active.rating} из 5`} />
              </div>
              <div className="mt-6 space-y-3">
                {[['Сочность сосиски', active.juiciness], ['Свежесть теста', active.freshness], ['Цена/качество', active.value], ['Внешний вид', active.look]].map(([label, value]) => <Score key={label} label={String(label)} value={Number(value)} />)}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button variant="hero" onClick={() => setDetailsOpen(false)}><Navigation /> Построить маршрут</Button>
                <Button asChild variant="bakery" onClick={() => setDetailsOpen(false)}><a href="#review"><Send /> Оставить отзыв</a></Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

const Info = ({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) => (
  <div className="rounded-xl bg-muted p-4"><Icon className="mb-2 h-5 w-5 text-primary" /><div className="text-sm text-muted-foreground">{label}</div><div className="font-black">{value}</div></div>
);

const Score = ({ label, value }: { label: string; value: number }) => (
  <div><div className="mb-2 flex justify-between font-bold"><span>{label}</span><span>{value}/5</span></div><div className="h-3 rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-button" style={{ width: `${value * 20}%` }} /></div></div>
);

export default Index;