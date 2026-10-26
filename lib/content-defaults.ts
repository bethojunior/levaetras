export type TextField = {
  id: string;
  group: string;
  label: string;
  value: string;
  long?: boolean;
};

const f = (
  id: string,
  group: string,
  label: string,
  value: string,
  long = false,
): TextField => ({ id, group, label, value, long });

const list = <T,>(n: number, make: (i: number) => T[]) =>
  Array.from({ length: n }, (_, i) => make(i + 1)).flat();

const services = [
  ["Corridas urbanas", "Do centro à Vila Amazônia, do aeroporto ao cais. Motoristas conhecidos da cidade e veículos revisados."],
  ["Entregas e encomendas", "Documentos, compras, refeições e pacotes entregues com agilidade e cuidado, direto na porta."],
  ["Passeios e turismo", "Conheça os pontos turísticos de Parintins com quem é daqui. Roteiros sob medida para grupos e famílias."],
  ["Leva e traz agendado", "Escola, trabalho, consultas, voos e barcos. Agende com antecedência e nunca perca o horário."],
];
const steps = [
  ["Chame", "Mande uma mensagem no WhatsApp com origem e destino."],
  ["Confirme", "Receba o valor e o tempo de chegada antes de aceitar."],
  ["Embarque", "O motorista vai até você, com identificação e veículo conhecido."],
  ["Chegue", "Pague no destino, em dinheiro ou Pix. Sem surpresas."],
];
const why = [
  ["Preço justo", "Valores claros, combinados antes da corrida."],
  ["Segurança", "Motoristas identificados e veículos em dia."],
  ["Pontualidade", "Respeitamos o seu tempo, sempre."],
  ["Atendimento local", "Falamos a sua língua e conhecemos a sua cidade."],
];
const faq = [
  ["Como faço para pedir uma corrida?", "É só chamar no WhatsApp informando o local de partida e o destino. Respondemos em poucos minutos."],
  ["Quais formas de pagamento vocês aceitam?", "Dinheiro e Pix. Combinamos o valor antes de iniciar a corrida."],
  ["Vocês atendem à noite e nos fins de semana?", "Sim, atendemos 24 horas, inclusive feriados e durante o Festival."],
  ["Posso agendar uma corrida?", "Pode. Agende com antecedência para voos, barcos, consultas e compromissos."],
  ["Fazem entregas?", "Sim. Entregamos documentos, encomendas e compras em toda a cidade."],
];
const stats = [
  ["24h", "atendimento"],
  ["5 min", "resposta média"],
  ["100%", "parintinense"],
];

export const textFields: TextField[] = [
  f("whatsapp", "Contato", "WhatsApp (DDI + DDD + número, só dígitos)", "5592999999999"),
  f("wa_message", "Contato", "Mensagem padrão do WhatsApp", "Olá! Quero pedir uma corrida."),
  f("ios_url", "Contato", "Link do app na App Store (iOS)", "https://apps.apple.com/br/app/leva-e-tr%C3%A1s/id1559597973"),
  f("android_url", "Contato", "Link do app na Google Play (Android)", "https://play.google.com/store/apps/details?id=br.com.client.paritinslevaetras"),
  f("driver_url", "Contato", "Link de cadastro do motorista", "https://paritinslevaetras.prod.704apps.com.br/driver/signup/MjExNg=="),
  f("site_url", "Contato", "Endereço do site (opcional, para o sitemap, ex.: https://paritinslevaetraz.com.br)", ""),
  f("instagram", "Contato", "Link do Instagram (opcional, https://...)", ""),

  f("seo_title", "SEO", "Título da página", "Parintins Leva e Traz | Mobilidade Urbana em Parintins"),
  f("seo_description", "SEO", "Descrição para buscadores", "Parintins Leva e Traz: corridas, entregas e passeios em Parintins-AM. Peça pelo WhatsApp, rápido, seguro e com preço justo.", true),

  f("nav_services", "Menu", "Link: Serviços", "Serviços"),
  f("nav_steps", "Menu", "Link: Como funciona", "Como funciona"),
  f("nav_festival", "Menu", "Link: Festival", "Festival"),
  f("nav_faq", "Menu", "Link: Dúvidas", "Dúvidas"),
  f("nav_app", "Menu", "Link: Aplicativo", "Aplicativo"),
  f("nav_blog", "Menu", "Link: Blog", "Blog"),
  f("nav_driver", "Menu", "Link: Seja motorista", "Seja motorista"),
  f("nav_cta", "Menu", "Botão do menu", "Pedir agora"),

  f("hero_tag", "Início", "Selo (hashtag)", "#deParintinsParaOMundoVer"),
  f("hero_title_pre", "Início", "Título: início", "Sua corrida em Parintins,"),
  f("hero_title_yellow", "Início", "Título: palavra amarela", "rápida"),
  f("hero_title_mid", "Início", "Título: ligação", "e"),
  f("hero_title_green", "Início", "Título: palavra verde", "segura"),
  f("hero_lead", "Início", "Texto de apoio", "Mobilidade urbana de verdade: levamos você, sua encomenda e seus convidados onde precisar, a qualquer hora do dia.", true),
  f("hero_cta", "Início", "Botão principal", "Pedir pelo WhatsApp"),
  f("hero_cta2", "Início", "Botão secundário", "Ver serviços"),
  ...list(3, (i) => [
    f(`stat_${i}_value`, "Início", `Destaque ${i}: número`, stats[i - 1][0]),
    f(`stat_${i}_label`, "Início", `Destaque ${i}: legenda`, stats[i - 1][1]),
  ]),
  f("strip", "Início", "Faixa animada (um item por linha)", "Corridas\nEntregas\nPasseios\nTraslados\nMobilidade Urbana", true),

  f("services_eyebrow", "Serviços", "Chamada", "Serviços"),
  f("services_title", "Serviços", "Título", "Tudo o que você precisa para se mover pela ilha"),
  ...list(4, (i) => [
    f(`service_${i}_title`, "Serviços", `Serviço ${i}: título`, services[i - 1][0]),
    f(`service_${i}_text`, "Serviços", `Serviço ${i}: texto`, services[i - 1][1], true),
  ]),

  f("steps_eyebrow", "Como funciona", "Chamada", "Como funciona"),
  f("steps_title", "Como funciona", "Título", "Pedir é simples. Chegar é melhor ainda."),
  ...list(4, (i) => [
    f(`step_${i}_title`, "Como funciona", `Passo ${i}: título`, steps[i - 1][0]),
    f(`step_${i}_text`, "Como funciona", `Passo ${i}: texto`, steps[i - 1][1], true),
  ]),

  f("why_eyebrow", "Por que escolher", "Chamada", "Por que escolher"),
  f("why_title", "Por que escolher", "Título", "Feito em Parintins, por quem conhece cada rua"),
  f("why_lead", "Por que escolher", "Texto de apoio", "Somos uma empresa local, com atendimento humano e compromisso com a nossa gente.", true),
  ...list(4, (i) => [
    f(`why_${i}_title`, "Por que escolher", `Vantagem ${i}: título`, why[i - 1][0]),
    f(`why_${i}_text`, "Por que escolher", `Vantagem ${i}: texto`, why[i - 1][1], true),
  ]),

  f("app_eyebrow", "Aplicativo", "Chamada", "Aplicativo"),
  f("app_title", "Aplicativo", "Título", "Baixe o app e peça sem sair do lugar"),
  f("app_lead", "Aplicativo", "Texto", "Solicite sua corrida, acompanhe o motorista e pague pelo aplicativo Leva e Trás. Disponível para iPhone e Android.", true),
  f("app_ios_label", "Aplicativo", "Botão iOS", "Baixar na App Store"),
  f("app_android_label", "Aplicativo", "Botão Android", "Baixar no Google Play"),

  f("driver_eyebrow", "Motorista", "Chamada", "Para motoristas"),
  f("driver_title", "Motorista", "Título", "Dirija com o Leva e Traz e ganhe com a sua cidade"),
  f("driver_lead", "Motorista", "Texto", "Faça seu cadastro, envie seus documentos e comece a receber corridas em Parintins.", true),
  f("driver_cta", "Motorista", "Botão", "Quero ser motorista"),

  f("blog_title", "Blog", "Título da página do blog", "Blog Leva e Traz"),
  f("blog_description", "Blog", "Descrição do blog", "Novidades, dicas e histórias da mobilidade urbana em Parintins.", true),

  f("fest_eyebrow", "Festival", "Chamada", "Festival Folclórico"),
  f("fest_title", "Festival", "Título", "Na noite do Festival, a gente leva você ao Bumbódromo"),
  f("fest_lead", "Festival", "Texto", "Seja Garantido ou Caprichoso, reserve seu traslado com antecedência. Vagas limitadas nas noites de apresentação.", true),
  f("fest_cta", "Festival", "Botão", "Reservar traslado"),
  f("fest_wa_message", "Festival", "Mensagem do WhatsApp do botão", "Olá! Quero reservar traslado para o Festival de Parintins."),

  f("faq_eyebrow", "Dúvidas", "Chamada", "Dúvidas"),
  f("faq_title", "Dúvidas", "Título", "Perguntas frequentes"),
  ...list(5, (i) => [
    f(`faq_${i}_q`, "Dúvidas", `Pergunta ${i}`, faq[i - 1][0]),
    f(`faq_${i}_a`, "Dúvidas", `Resposta ${i}`, faq[i - 1][1], true),
  ]),

  f("final_title", "Chamada final", "Título", "Precisa ir a algum lugar?"),
  f("final_sub", "Chamada final", "Subtítulo", "Chama o Leva e Traz."),
  f("final_cta", "Chamada final", "Botão", "Chamar no WhatsApp"),

  f("footer_line", "Rodapé", "Linha de apresentação", "Mobilidade Urbana · Parintins, Amazonas"),
  f("footer_copy", "Rodapé", "Direitos autorais (sem o ano)", "Parintins Leva e Traz. Todos os direitos reservados."),
];

export type Texts = Record<string, string>;
export const defaultTexts: Texts = Object.fromEntries(
  textFields.map((x) => [x.id, x.value]),
);
export const groups = [...new Set(textFields.map((x) => x.group))];
