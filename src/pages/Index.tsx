import { useMemo, useState } from "react";
import { z } from "zod";
import {
  BadgeCheck,
  Beef,
  Camera,
  Compass,
  Cookie,
  Droplet,
  Filter,
  Heart,
  MapPin,
  Navigation,
  PiggyBank,
  Send,
  Settings2,
  Star,
  ThumbsUp,
  Upload,
  Wheat,
} from "lucide-react";
import heroImage from "@/assets/sausage-roll-hero.jpg";
import mascot from "@/assets/review-mascot.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Reveal } from "@/components/Reveal";

type Bakery = {
  name: string;
  rating: number;
  price: number;
  district: string;
  dough: "дрожжевое" | "слоеное";
  sausage: string;
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
  { name: "Два Зерна", rating: 4.9, price: 169, district: "Адмиралтейский", dough: "слоеное", sausage: "Молочная", freshness: 5.0, juiciness: 4.8, value: 4.7, look: 4.9, comment: "Кофейный фаворит индекса: тесто хрустит, сосиска не теряется, настроение растёт.", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80", x: "41%", y: "53%" },
  { name: "Люди Любят", rating: 4.6, price: 159, district: "Васильевский", dough: "слоеное", sausage: "Сливочная", freshness: 4.8, juiciness: 4.5, value: 4.3, look: 4.7, comment: "Уютная булочная с сильной выпечкой: сосиска выглядит так, будто её фотографировали для обложки.", image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=80", x: "32%", y: "46%" },
  { name: "Вольчека", rating: 4.5, price: 119, district: "Центр", dough: "дрожжевое", sausage: "Классическая", freshness: 4.6, juiciness: 4.3, value: 4.7, look: 4.2, comment: "Народная классика: мягкое тесто, честная цена и стабильный результат между парами.", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80", x: "45%", y: "39%" },
  { name: "Буше", rating: 4.4, price: 179, district: "Центр", dough: "слоеное", sausage: "Баварская", freshness: 4.6, juiciness: 4.2, value: 3.9, look: 4.8, comment: "Французский флёр, аккуратная корочка и кофе, превращающий перекус в культурное событие.", image: "https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=900&q=80", x: "47%", y: "47%" },
  { name: "Лавка Пекаря", rating: 4.3, price: 109, district: "Невский", dough: "дрожжевое", sausage: "Куриная", freshness: 4.2, juiciness: 4.1, value: 4.4, look: 4.0, comment: "Горячая выпечка спасает, индекс держится за счёт скорости и температуры подачи.", image: "https://images.unsplash.com/photo-1567042661848-7161ce446f85?auto=format&fit=crop&w=900&q=80", x: "66%", y: "48%" },
  { name: "Кио Кухня", rating: 4.3, price: 145, district: "Петроградка", dough: "дрожжевое", sausage: "Сырная", freshness: 4.4, juiciness: 4.2, value: 4.2, look: 4.3, comment: "Домашнее настроение и мягкая булка — перекус, после которого хочется остаться с ноутбуком.", image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=80", x: "58%", y: "27%" },
  { name: "Цех 85", rating: 4.2, price: 149, district: "Петроградка", dough: "слоеное", sausage: "Венская", freshness: 4.4, juiciness: 4.0, value: 4.0, look: 4.5, comment: "Глянцевая корочка, стильная подача, но цена уже просит студенческую скидку.", image: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&w=900&q=80", x: "52%", y: "31%" },
  { name: "Хлебник", rating: 4.1, price: 99, district: "Купчино", dough: "дрожжевое", sausage: "Куриная", freshness: 4.1, juiciness: 3.9, value: 4.6, look: 3.8, comment: "Доступный вариант без пафоса: горячо, быстро и почти всегда рядом.", image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=900&q=80", x: "55%", y: "72%" },
  { name: "Север", rating: 4.1, price: 189, district: "Центр", dough: "дрожжевое", sausage: "Молочная", freshness: 4.0, juiciness: 3.8, value: 3.7, look: 4.6, comment: "Исторический вес Петербурга чувствуется сильнее, чем мясная сочность, но опыт важный.", image: "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=900&q=80", x: "50%", y: "43%" },
  { name: "Румяный хлеб", rating: 4.0, price: 129, district: "Московский", dough: "слоеное", sausage: "Классическая", freshness: 4.1, juiciness: 4.0, value: 4.3, look: 4.0, comment: "Авторская выпечка и плотный перекус для тех, кто любит экспериментировать с маршрутом.", image: "https://images.unsplash.com/photo-1600398137872-57a8055f8efa?auto=format&fit=crop&w=900&q=80", x: "57%", y: "61%" },
];

const reasons: [string, string][] = [
  ["Универсальный продукт", "Есть почти в каждой булочной — значит, сравнение получается честным."],
  ["Тесто говорит первым", "Свежесть, корочка и воздушность сразу показывают уровень пекарни."],
  ["Сосиска не прощает", "Если начинка сухая или безвкусная, общий рейтинг уже не спасает."],
  ["Sausage Roll Index", "Как индекс Биг-Мака, только теплее, ближе и с петербургскими крошками."],
];


const reviewSchema = z.object({
  name: z.string().trim().min(2, "Имя минимум 2 символа").max(60),
  date: z.string().min(1, "Укажите дату"),
  time: z.string().min(1, "Укажите время"),
  place: z.string().trim().min(2, "Название заведения").max(80),
  comment: z.string().trim().max(800).optional(),
  recommend: z.string().min(1, "Выберите вариант"),
});

const Index = () => {
  const [sort, setSort] = useState("rating");
  const [district, setDistrict] = useState("all");
  const [dough, setDough] = useState("all");
  const [active, setActive] = useState<Bakery>(bakeries[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    date: "",
    time: "",
    place: "",
    comment: "",
    recommend: "",
    freshness: 4,
    juiciness: 4,
    value: 4,
    look: 4,
  });

  const openBakery = (b: Bakery) => {
    setActive(b);
    setDetailsOpen(true);
  };

  const filtered = useMemo(() => {
    return [...bakeries]
      .filter((b) => district === "all" || b.district === district)
      .filter((b) => dough === "all" || b.dough === dough)
      .sort((a, b) => {
        if (sort === "price") return a.price - b.price;
        if (sort === "freshness") return b.freshness - a.freshness;
        if (sort === "juiciness") return b.juiciness - a.juiciness;
        if (sort === "value") return b.value - a.value;
        return b.rating - a.rating;
      });
  }, [district, dough, sort]);

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Заполните форму", description: parsed.error.issues[0]?.message ?? "Проверьте поля", variant: "destructive" });
      return;
    }
    toast({ title: "Отзыв отправлен 🌭", description: `Спасибо, ${form.name}! Индекс обновится в ближайшие минуты.` });
    setForm({ name: "", date: "", time: "", place: "", comment: "", recommend: "", freshness: 4, juiciness: 4, value: 4, look: 4 });
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* HERO */}
      <section className="relative paper-grain">
        <div className="container grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="space-y-7 animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/75 px-4 py-2 text-sm font-bold text-primary shadow-card backdrop-blur">
              <BadgeCheck className="h-4 w-4" /> Sausage Roll Index · СПб
            </div>
            <h1 className="text-5xl font-black uppercase leading-[0.95] tracking-tight md:text-7xl lg:text-[6.2rem]">
              Рейтинг<br />булочных<br />СПб
            </h1>
            <p className="max-w-lg text-lg leading-7 text-muted-foreground md:text-xl">
              Оцениваем булочные по свежести теста и сочности сосиски.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl"><a href="#rating"><Star /> Смотреть рейтинг</a></Button>
              <Button asChild variant="bakery" size="xl"><a href="#review"><Send /> Оставить отзыв</a></Button>
            </div>
          </div>
          <div className="relative">
            <img src={heroImage} alt="Сосиска в тесте крупным планом" width={1600} height={1100} className="h-[44vh] min-h-[320px] w-full rounded-[2rem] object-cover shadow-warm lg:h-[72vh] animate-float" />
            <div className="absolute -bottom-7 left-6 rounded-2xl border border-border bg-card p-4 shadow-warm md:p-5">
              <div className="text-3xl">🌭</div>
              <div className="font-display text-xl font-black md:text-2xl">Индекс сосиски</div>
              <div className="text-xs text-muted-foreground md:text-sm">важнее общего рейтинга</div>
            </div>
          </div>
        </div>
      </section>

      {/* REASONS */}
      <section className="container py-20">
        <Reveal className="mb-10 max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Почему именно сосиска в тесте?</p>
          <h2 className="text-4xl font-black uppercase leading-tight md:text-6xl">Маленький продукт,<br />большой булочный детектор</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map(([title, text], i) => (
            <Reveal key={title} delay={i * 80}>
              <article className="h-full rounded-2xl border border-border bg-card p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-warm">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold text-sm font-black text-accent-foreground">
                  0{i + 1}
                </div>
                <h3 className="mb-3 text-xl font-black">{title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* INFOGRAPHIC */}
      <section className="container pb-10">
        <Reveal>
          <SausageComposition />
        </Reveal>
      </section>

      {/* RATING */}
      <section id="rating" className="bg-cream py-20">
        <div className="container">
          <Reveal className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Рейтинг булочных</p>
              <h2 className="text-4xl font-black uppercase md:text-6xl">Где сосиска<br />держит марку</h2>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-card lg:min-w-[560px]">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold"><Filter className="h-4 w-4 text-primary" /> Фильтры и сортировка</div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Select value={sort} onValueChange={setSort}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="rating">по рейтингу</SelectItem><SelectItem value="price">по цене</SelectItem><SelectItem value="freshness">по свежести</SelectItem><SelectItem value="juiciness">по сочности</SelectItem><SelectItem value="value">цена/качество</SelectItem></SelectContent></Select>
                <Select value={district} onValueChange={setDistrict}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">все районы</SelectItem><SelectItem value="Центр">Центр</SelectItem><SelectItem value="Петроградка">Петроградка</SelectItem><SelectItem value="Васильевский">Васильевский</SelectItem><SelectItem value="Адмиралтейский">Адмиралтейский</SelectItem><SelectItem value="Купчино">Купчино</SelectItem><SelectItem value="Московский">Московский</SelectItem><SelectItem value="Невский">Невский</SelectItem></SelectContent></Select>
                <Select value={dough} onValueChange={setDough}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">любое тесто</SelectItem><SelectItem value="дрожжевое">дрожжевое</SelectItem><SelectItem value="слоеное">слоёное</SelectItem></SelectContent></Select>
                <Button variant="gold" onClick={() => toast({ title: "Поиск рядом", description: "Геолокация скоро появится — пока пользуйтесь картой ниже." })}><Compass /> рядом</Button>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((b, i) => (
              <Reveal key={b.name} delay={(i % 3) * 80}>
                <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-warm">
                  <div className="relative h-48 overflow-hidden">
                    <img src={b.image} alt={`Витрина ${b.name}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute left-3 top-3 rounded-full bg-card/95 px-3 py-1 text-xs font-black text-primary shadow-card">★ {b.rating}</div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black uppercase">{b.name}</h3>
                      <span className="shrink-0 rounded-full bg-mustard/70 px-3 py-1 text-xs font-bold text-foreground">{b.price} ₽</span>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{b.comment}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[["тесто", b.freshness], ["сосиска", b.juiciness], ["цена", b.value], ["вид", b.look]].map(([l, v]) => (
                        <div key={String(l)} className="rounded-lg bg-muted p-2.5">
                          <div className="flex justify-between font-bold uppercase"><span>{l}</span><span>{v}</span></div>
                          <div className="mt-1.5 h-1.5 rounded-full bg-border"><div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${Number(v) * 20}%` }} /></div>
                        </div>
                      ))}
                    </div>
                    <Button variant="bakery" className="w-full" onClick={() => openBakery(b)}>Подробнее</Button>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="bg-cocoa py-20 text-primary-foreground">
        <div className="container grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-bread">Карта Петербурга</p>
            <h2 className="text-4xl font-black uppercase leading-tight md:text-6xl">Точки, где<br />пахнет булкой</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-primary-foreground/75">Кликните по жёлтой метке — мини-карточка с рейтингом сосиски в тесте, ценой и быстрым переходом к деталям.</p>
          </Reveal>
          <Reveal delay={120}>
            <SpbMap bakeries={bakeries} active={active} setActive={setActive} openBakery={openBakery} />
          </Reveal>
        </div>
      </section>

      {/* REVIEW */}
      <section id="review" className="container grid gap-8 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Анкета покупателей</p>
          <h2 className="text-4xl font-black uppercase leading-tight md:text-6xl">Ваш перекус<br />— часть науки</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">Дружелюбная форма для отзывов помогает обновлять Sausage Roll Index и отделять легенду от пересушенной сосиски.</p>
          <img src={mascot} alt="Маскот с сосиской в тесте" width={800} height={800} loading="lazy" className="mt-6 w-64 animate-float" />
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={submitReview} className="rounded-2xl border border-border bg-card p-5 shadow-card md:p-8">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={60} />
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              <Input placeholder="Название заведения" value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} maxLength={80} />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {([
                ["Свежесть теста", "freshness"],
                ["Сочность сосиски", "juiciness"],
                ["Цена-качество", "value"],
                ["Внешний вид", "look"],
              ] as const).map(([label, key]) => (
                <div key={key} className="rounded-xl bg-muted p-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase">
                    <span>{label}</span><span className="text-primary">{form[key]}/5</span>
                  </div>
                  <input
                    type="range" min={1} max={5} step={0.1}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                    className="mt-3 w-full accent-primary"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Select value={form.recommend} onValueChange={(v) => setForm({ ...form, recommend: v })}>
                <SelectTrigger><SelectValue placeholder="Рекомендуете?" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Да, обязательно</SelectItem>
                  <SelectItem value="maybe">Возможно</SelectItem>
                  <SelectItem value="no">Нет</SelectItem>
                </SelectContent>
              </Select>
              <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background text-sm font-bold transition hover:bg-secondary">
                <Upload className="h-4 w-4" /> Загрузка фото
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && toast({ title: "Фото добавлено", description: e.target.files[0].name })} />
              </label>
            </div>
            <Textarea className="mt-5" placeholder="Комментарий: температура, хруст, настроение, очередь…" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} maxLength={800} />
            <Button type="submit" variant="hero" size="xl" className="mt-5 w-full"><Send /> Отправить отзыв</Button>
          </form>
        </Reveal>
      </section>

      {/* FORMULA */}
      <section className="bg-cream py-20">
        <div className="container">
          <Reveal className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Как считается рейтинг</p>
            <h2 className="text-4xl font-black uppercase md:text-6xl">Формула честной булки</h2>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-5">
            {[["тесто", Wheat], ["сосиска", Heart], ["цена", PiggyBank], ["фото", Camera], ["лайк", ThumbsUp]].map(([label, Icon], i) => {
              const I = Icon as typeof Wheat;
              return (
                <Reveal key={String(label)} delay={i * 60}>
                  <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-card transition hover:-translate-y-1 hover:shadow-warm">
                    <I className="mx-auto mb-4 h-9 w-9 text-primary" />
                    <div className="text-sm font-black uppercase">{String(label)}</div>
                    <div className="mt-2 text-2xl font-black text-accent">+1</div>
                  </div>
                </Reveal>
              );
            })}


          </div>
          <Reveal>
            <div className="mt-6 rounded-2xl border border-primary/20 bg-card p-6 text-center text-base font-black shadow-card md:text-xl">
              Итоговый рейтинг = свежесть теста + сочность сосиски + цена/качество + внешний вид + рекомендации
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="bg-cocoa py-16 text-primary-foreground/80">
        <div className="container text-center">
          <h2 className="font-display text-5xl font-black uppercase leading-none text-primary-foreground md:text-8xl">Рейтинг<br />булочных<br />СПб</h2>
          <p className="mt-6 text-sm">Sausage Roll Index · Санкт-Петербург</p>
        </div>
      </footer>


      {/* DIALOG */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl border-border bg-card p-0 shadow-warm sm:max-w-3xl">
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-72 overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
              <img src={active.image} alt={`Фото ${active.name}`} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1 text-xs font-black text-primary shadow-card">★ {active.rating}</div>
            </div>
            <div className="p-6 md:p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black uppercase md:text-3xl">{active.name}</DialogTitle>
                <DialogDescription className="text-sm text-primary">Фаворит индекса: {active.comment}</DialogDescription>
              </DialogHeader>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <FactCell label="Район" value={`${active.district}, СПб`} />
                <FactCell label="Цена" value={`${active.price} ₽`} />
                <FactCell label="Сосиска" value={active.sausage} />
                <FactCell label="Индекс" value={`${active.rating} из 5`} />
              </div>
              <div className="mt-6 space-y-3">
                {[["Сочность сосиски", active.juiciness], ["Свежесть теста", active.freshness], ["Цена/качество", active.value], ["Внешний вид", active.look]].map(([l, v]) => (
                  <Score key={String(l)} label={String(l)} value={Number(v)} />
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button variant="hero" onClick={() => { setDetailsOpen(false); toast({ title: "Маршрут построен", description: `До «${active.name}» — открываем карты.` }); }}>
                  <Navigation /> Построить маршрут
                </Button>
                <Button asChild variant="bakery" onClick={() => setDetailsOpen(false)}>
                  <a href="#review"><Send /> Оставить отзыв</a>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

type CompNode = { icon: typeof MapPin; title: string; text: string; corner: "tl" | "tr" | "bl" | "br" };
const compNodes: CompNode[] = [
  { icon: Beef, title: "Сосиска", text: "Сочная мясная начинка из отборных ингредиентов", corner: "tl" },
  { icon: Droplet, title: "Соусы", text: "Добавьте кетчуп, сырный или фирменный соус", corner: "tr" },
  { icon: Cookie, title: "Тесто", text: "Мягкое воздушное тесто с золотистой корочкой", corner: "bl" },
  { icon: Settings2, title: "Добавки", text: "Сыр, халапеньо, лук или бекон", corner: "br" },
];

// SVG paths from each corner label toward the central box edge (viewBox 100x60)
const linePaths: Record<CompNode["corner"], string> = {
  tl: "M 14 14 L 28 14 L 38 24",
  tr: "M 86 14 L 72 14 L 62 24",
  bl: "M 14 46 L 28 46 L 38 36",
  br: "M 86 46 L 72 46 L 62 36",
};

const SausageComposition = () => {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card md:p-10">
      <p className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-foreground/80 md:text-base">Настоящая сосиска в тесте состоит из:</p>
      <div className="relative">
        {/* SVG connectors — desktop only */}
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block">
          {compNodes.map((n) => (
            <path
              key={n.corner}
              d={linePaths[n.corner]}
              fill="none"
              stroke={hover === n.title ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.6)"}
              strokeWidth={hover === n.title ? 0.6 : 0.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          ))}
        </svg>

        <div className="grid grid-cols-2 items-center gap-6 md:grid-cols-[1fr_1.3fr_1fr] md:gap-10">
          {/* LEFT column */}
          <div className="space-y-10 md:space-y-20">
            <CompCorner node={compNodes[0]} hovered={hover === compNodes[0].title} onHover={setHover} align="left" />
            <CompCorner node={compNodes[2]} hovered={hover === compNodes[2].title} onHover={setHover} align="left" />
          </div>
          {/* CENTER box (desktop) */}
          <div className="order-first col-span-2 md:order-none md:col-span-1">
            <div className="mx-auto flex aspect-[5/4] max-w-xs items-center justify-center rounded-3xl bg-mustard shadow-warm md:max-w-sm">
              <SausageSvg />
            </div>
          </div>
          {/* RIGHT column */}
          <div className="space-y-10 md:space-y-20">
            <CompCorner node={compNodes[1]} hovered={hover === compNodes[1].title} onHover={setHover} align="right" />
            <CompCorner node={compNodes[3]} hovered={hover === compNodes[3].title} onHover={setHover} align="right" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CompCorner = ({ node, hovered, onHover, align }: { node: CompNode; hovered: boolean; onHover: (t: string | null) => void; align: "left" | "right" }) => {
  const Icon = node.icon;
  return (
    <div
      onMouseEnter={() => onHover(node.title)}
      onMouseLeave={() => onHover(null)}
      className={`group cursor-pointer ${align === "right" ? "text-right" : "text-left"}`}
    >
      <div className={`mb-2 flex ${align === "right" ? "justify-end" : "justify-start"}`}>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-mustard text-cocoa shadow-card transition-transform duration-300 ${hovered ? "scale-110" : ""}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className={`mb-1 pb-1 text-base font-black transition-all duration-300 md:text-lg ${align === "right" ? "origin-right" : "origin-left"} ${hovered ? "scale-110 text-primary" : ""}`}>
        {node.title}
      </div>
      <p className={`text-xs leading-5 text-muted-foreground transition-all duration-300 md:text-sm ${align === "right" ? "origin-right" : "origin-left"} ${hovered ? "scale-105 text-foreground" : ""}`}>
        {node.text}
      </p>
    </div>
  );
};

const SausageSvg = () => (
  <svg viewBox="0 0 200 140" className="h-3/4 w-3/4">
    <g fill="none" stroke="hsl(var(--cocoa))" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="100" cy="70" rx="78" ry="34" />
      <path d="M40 55 q12 18 0 32" />
      <path d="M60 50 q14 22 0 42" />
      <path d="M82 48 q14 22 0 46" />
      <path d="M104 48 q14 22 0 46" />
      <path d="M126 50 q14 22 0 42" />
      <path d="M148 54 q12 18 0 34" />
      <path d="M30 70 l-10 -4 m10 4 l-10 4 m10 -4 l-12 0" />
    </g>
  </svg>
);

type MapProps = { bakeries: Bakery[]; active: Bakery; setActive: (b: Bakery) => void; openBakery: (b: Bakery) => void };
const SpbMap = ({ bakeries, active, setActive, openBakery }: MapProps) => {
  return (
    <div className="relative h-[560px] overflow-hidden rounded-3xl border-[6px] border-cocoa bg-cocoa shadow-warm">
      <iframe
        title="Карта Санкт-Петербурга"
        src="https://www.openstreetmap.org/export/embed.html?bbox=30.20%2C59.905%2C30.42%2C59.97&layer=mapnik"
        className="absolute inset-0 h-full w-full"
        style={{ border: 0, pointerEvents: "none" }}
        loading="lazy"
      />
      {/* clickable overlay layer */}
      <div className="pointer-events-none absolute inset-0">
        {bakeries.map((b) => {
          const isActive = b.name === active.name;
          return (
            <button
              key={b.name}
              onClick={() => setActive(b)}
              style={{ left: b.x, top: b.y }}
              className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-full transition-all duration-300 hover:scale-125 ${isActive ? "z-20 scale-125" : "z-10"}`}
              aria-label={b.name}
            >
              <span className="relative block">
                {isActive && (
                  <span className="absolute -inset-2 -z-10 animate-ping rounded-full bg-mustard/60" />
                )}
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cocoa bg-mustard text-cocoa shadow-warm">
                  <MapPin className="h-5 w-5" />
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {/* mini-card */}
      <div className="absolute bottom-5 right-5 left-5 z-30 rounded-2xl bg-cream p-4 text-foreground shadow-warm sm:left-auto sm:w-72 animate-fade-in" key={active.name}>
        <div className="text-base font-black uppercase">{active.name}</div>
        <p className="mt-1 text-sm text-muted-foreground">Рейтинг сосиски: <b className="text-primary">{active.rating}</b> · цена {active.price} ₽</p>
        <Button variant="hero" size="sm" className="mt-3" onClick={() => openBakery(active)}>Подробнее</Button>
      </div>
    </div>
  );
};


const FactCell = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-border bg-muted/60 p-3">
    <div className="text-xs uppercase text-muted-foreground">{label}</div>
    <div className="mt-1 text-sm font-black">{value}</div>
  </div>
);

const Score = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="mb-1.5 flex justify-between text-xs font-black uppercase"><span>{label}</span><span className="text-primary">{value}/5</span></div>
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-gradient-button transition-all duration-700" style={{ width: `${value * 20}%` }} />
    </div>
  </div>
);

export default Index;
