import { STOREFRONT_CATALOG, type StorefrontCatalogItem } from "@/lib/storefront-catalog";

export type FinderRecipient = "partner" | "crush" | "friend" | "family";
export type FinderIntent = "birthday" | "anniversary" | "date" | "affection" | "support" | "achievement";
export type FinderFormat = "digital" | "physical" | "unsure";
export type FinderExperience = "heartfelt" | "memories" | "surprises" | "playful" | "invitation" | "audio";
export type FinderMaterial = "message" | "few-media" | "story" | "song" | "voice" | "low-effort" | "unsure";
export type FinderBudget = "all" | "up25" | "26to50" | "above50";
export type FinderStepKey = "recipient" | "intent" | "format" | "experiences" | "material";

export interface FinderAnswers {
    recipient: FinderRecipient | null;
    intent: FinderIntent | null;
    format: FinderFormat | null;
    experiences: FinderExperience[];
    material: FinderMaterial | null;
}

export interface FinderOption<T extends string = string> {
    value: T;
    label: string;
    description: string;
}

export interface FinderQuestion {
    key: FinderStepKey;
    eyebrow: string;
    title: string;
    helper: string;
    multi?: boolean;
    options: readonly FinderOption[];
}

type ExperienceDepth = 1 | 2 | 3;

interface ProductProfile {
    recipients: readonly FinderRecipient[];
    directIntents: readonly FinderIntent[];
    intents: readonly FinderIntent[];
    experiences: readonly FinderExperience[];
    materials: readonly FinderMaterial[];
    depth: ExperienceDepth;
}

export interface FinderRecommendation {
    item: StorefrontCatalogItem;
    score: number;
    depth: ExperienceDepth;
    reason: string;
    role: "primary" | "simpler" | "immersive";
    physicalInsert?: boolean;
}

export const INITIAL_FINDER_ANSWERS: FinderAnswers = {
    recipient: null,
    intent: null,
    format: null,
    experiences: [],
    material: null,
};

export const FINDER_QUESTIONS: Record<FinderStepKey, FinderQuestion> = {
    recipient: {
        key: "recipient", eyebrow: "Tentang penerimanya", title: "Kado ini ingin kamu berikan kepada siapa?", helper: "Pilih hubungan yang paling menggambarkan kalian.",
        options: [
            { value: "partner", label: "Pasangan", description: "Untuk seseorang yang sedang berjalan bersamamu." },
            { value: "crush", label: "Gebetan", description: "Isyarat manis yang tetap terasa nyaman." },
            { value: "friend", label: "Sahabat", description: "Apresiasi hangat untuk teman terdekat." },
            { value: "family", label: "Keluarga", description: "Kejutan personal untuk orang tersayang." },
        ],
    },
    intent: {
        key: "intent", eyebrow: "Tentang pesannya", title: "Apa yang ingin kamu sampaikan lewat kado ini?", helper: "Pilih tujuan yang paling dekat dengan isi hatimu.",
        options: [
            { value: "birthday", label: "Merayakan ulang tahun", description: "Membuat hari spesialnya terasa lebih personal." },
            { value: "anniversary", label: "Mengenang perjalanan bersama", description: "Merayakan anniversary dan cerita yang sudah dibangun." },
            { value: "date", label: "Mengajak pergi atau kencan", description: "Menyampaikan ajakan dengan cara yang lebih berkesan." },
            { value: "affection", label: "Menunjukkan rasa sayang", description: "Memberi kejutan tanpa menunggu tanggal tertentu." },
            { value: "support", label: "Meminta maaf atau memberi semangat", description: "Mengucapkan sesuatu yang sulit disampaikan langsung." },
            { value: "achievement", label: "Merayakan pencapaian penting", description: "Untuk kelulusan, pekerjaan baru, dan kabar membahagiakan." },
        ],
    },
    format: {
        key: "format", eyebrow: "Tentang bentuk kadonya", title: "Kamu ingin memberikannya dalam bentuk apa?", helper: "Keduanya tetap dapat berisi pengalaman digital yang personal.",
        options: [
            { value: "digital", label: "Kado digital", description: "Bisa langsung dikirim dan dibuka dari mana saja." },
            { value: "physical", label: "Kado fisik + kejutan digital", description: "Pengalaman unboxing dengan kartu akses personal." },
            { value: "unsure", label: "Aku belum yakin", description: "Biarkan kami memilih bentuk yang paling sesuai." },
        ],
    },
    experiences: {
        key: "experiences", eyebrow: "Tentang pengalamannya", title: "Apa yang ingin ia rasakan saat membuka kadonya?", helper: "Pilih satu atau maksimal dua pengalaman yang paling kamu bayangkan.", multi: true,
        options: [
            { value: "heartfelt", label: "Tersentuh oleh pesan yang tulus", description: "Kata-kata menjadi bagian utama dari kadonya." },
            { value: "memories", label: "Mengenang cerita kalian", description: "Foto dan perjalanan bersama tersusun lebih bermakna." },
            { value: "surprises", label: "Penasaran membuka kejutan", description: "Ada beberapa bagian yang ditemukan satu per satu." },
            { value: "playful", label: "Seru menjelajahi dan bermain", description: "Kado terasa seperti pengalaman yang bisa dimainkan." },
            { value: "invitation", label: "Merasa diajak ke momen spesial", description: "Ajakanmu hadir dengan waktu dan rencana yang jelas." },
            { value: "audio", label: "Merasa dekat lewat lagu atau suara", description: "Musik dan suara membawa kembali rasa yang familiar." },
        ],
    },
    material: {
        key: "material", eyebrow: "Tentang isi personalnya", title: "Apa yang paling nyaman kamu siapkan?", helper: "Jawaban ini membantu kami memilih pengalaman yang pas untuk bahanmu.",
        options: [
            { value: "message", label: "Tulisan atau pesan personal", description: "Kamu sudah tahu kata-kata yang ingin disampaikan." },
            { value: "few-media", label: "Beberapa foto atau video", description: "Cukup untuk menghidupkan momen-momen utama." },
            { value: "story", label: "Banyak foto dan rangkaian cerita", description: "Kamu ingin menyusun perjalanan kalian lebih lengkap." },
            { value: "song", label: "Lagu atau playlist", description: "Ada musik yang selalu mengingatkan pada kalian." },
            { value: "voice", label: "Rekaman suara", description: "Kamu ingin menyampaikan sesuatu dengan suaramu sendiri." },
            { value: "low-effort", label: "Tidak membutuhkan banyak bahan", description: "Tetap personal dengan persiapan yang lebih ringkas." },
            { value: "unsure", label: "Aku belum yakin", description: "Tampilkan pilihan yang tetap mudah disesuaikan." },
        ],
    },
};

const PROFILES: Record<string, ProductProfile> = {
    letter: { recipients: ["partner", "crush", "friend", "family"], directIntents: ["support", "achievement"], intents: ["anniversary", "affection"], experiences: ["heartfelt"], materials: ["message", "low-effort", "unsure"], depth: 1 },
    loves: { recipients: ["partner", "crush", "friend", "family"], directIntents: [], intents: ["birthday", "anniversary", "date", "affection", "support", "achievement"], experiences: ["heartfelt", "memories", "surprises", "invitation", "audio"], materials: ["message", "few-media", "story", "song", "voice", "low-effort", "unsure"], depth: 3 },
    birthday: { recipients: ["partner", "crush", "friend", "family"], directIntents: ["birthday"], intents: ["affection"], experiences: ["surprises", "memories"], materials: ["few-media", "story", "song", "voice", "unsure"], depth: 2 },
    storybook: { recipients: ["partner", "crush", "friend", "family"], directIntents: ["anniversary"], intents: ["birthday", "affection", "support"], experiences: ["heartfelt", "memories", "surprises", "audio", "playful"], materials: ["message", "few-media", "story", "song", "unsure"], depth: 3 },
    invitation: { recipients: ["partner", "crush"], directIntents: ["date"], intents: ["anniversary", "affection"], experiences: ["invitation", "heartfelt"], materials: ["message", "low-effort", "unsure"], depth: 1 },
    voices: { recipients: ["partner", "crush", "friend", "family"], directIntents: ["support"], intents: ["birthday", "affection"], experiences: ["audio", "heartfelt"], materials: ["voice", "song", "few-media", "unsure"], depth: 2 },
    mixtape: { recipients: ["partner", "crush", "friend"], directIntents: [], intents: ["birthday", "affection", "support"], experiences: ["audio", "memories"], materials: ["song", "few-media", "unsure"], depth: 2 },
    arcade: { recipients: ["partner", "crush", "friend"], directIntents: [], intents: ["birthday", "anniversary", "affection"], experiences: ["playful", "surprises", "memories"], materials: ["few-media", "story", "song", "unsure"], depth: 3 },
    retro: { recipients: ["partner", "crush", "friend"], directIntents: [], intents: ["birthday", "affection", "achievement"], experiences: ["surprises", "playful"], materials: ["message", "few-media", "low-effort", "unsure"], depth: 2 },
    wrapped: { recipients: ["partner"], directIntents: ["anniversary"], intents: ["affection"], experiences: ["memories", "heartfelt"], materials: ["story", "few-media", "unsure"], depth: 3 },
    "the-gift-box": { recipients: ["partner", "crush", "friend", "family"], directIntents: [], intents: ["birthday", "anniversary", "affection", "achievement"], experiences: ["surprises", "memories", "heartfelt"], materials: ["message", "few-media", "story", "song", "voice", "low-effort", "unsure"], depth: 3 },
};

const PHYSICAL_INSERT_IDS = ["loves", "birthday", "letter", "voices"] as const;

export const RECIPIENT_LABELS: Record<FinderRecipient, string> = { partner: "pasangan", crush: "gebetan", friend: "sahabat", family: "keluarga" };

export function shouldAskMaterial(answers: FinderAnswers) {
    return answers.intent !== "date" && !(answers.experiences.length === 1 && answers.experiences[0] === "heartfelt");
}

export function getFinderSteps(answers: FinderAnswers): FinderStepKey[] {
    const base: FinderStepKey[] = ["recipient", "intent", "format", "experiences"];
    return shouldAskMaterial(answers) ? [...base, "material"] : base;
}

function inBudget(item: StorefrontCatalogItem, budget: FinderBudget) {
    if (budget === "all") return true;
    if (budget === "up25") return item.numericPrice <= 25000;
    if (budget === "26to50") return item.numericPrice >= 26000 && item.numericPrice <= 50000;
    return item.numericPrice > 50000;
}

function scoreProduct(item: StorefrontCatalogItem, answers: FinderAnswers) {
    const profile = PROFILES[item.id];
    if (!profile || !answers.recipient || !answers.intent) return null;
    let score = 0;
    if (profile.directIntents.includes(answers.intent)) score += 12;
    else if (profile.intents.includes(answers.intent)) score += 8;
    score += answers.experiences.filter((experience) => profile.experiences.includes(experience)).length * 6;
    if (profile.recipients.includes(answers.recipient)) score += 3;
    const material = answers.material ?? "unsure";
    if (material !== "unsure") score += profile.materials.includes(material) ? 4 : -8;
    if (material === "voice" && item.id === "voices") score += 6;
    if (material === "song" && item.id === "mixtape") score += 6;
    if (material === "story" && item.id === "storybook") score += 6;
    if (item.id === "letter") score += 3;
    if (item.id === "arcade" && !answers.experiences.includes("playful")) score -= 14;
    if (item.id === "wrapped" && answers.intent !== "anniversary" && !answers.experiences.includes("memories")) score -= 12;
    return { item, score, depth: profile.depth };
}

function productReason(productId: string, answers: FinderAnswers) {
    const recipient = answers.recipient ? RECIPIENT_LABELS[answers.recipient] : "orang tersayang";
    const reasons: Record<string, string> = {
        letter: `Kamu ingin menyampaikan sesuatu yang tulus kepada ${recipient}. Letter menjadikan kata-katamu sebagai pengalaman utama yang hangat dan mudah dinikmati.`,
        loves: `Memoria adalah pilihan paling fleksibel untuk ${recipient}. Foto, lagu, tulisan, ajakan, dan kejutan dapat dirangkai menjadi satu pengalaman premium yang terasa utuh.`,
        birthday: `Kamu ingin hari ulang tahunnya berisi beberapa kejutan personal. Birthday Scrapbook membuka foto, pesan, dan ucapan satu per satu seperti scrapbook yang hidup.`,
        storybook: `Kamu punya cerita, foto, lagu, dan tempat yang ingin dirangkai menjadi satu perjalanan. Storybook Edition menyatukannya dalam lima room komik yang bisa dijelajahi sampai finale.`,
        invitation: `Kamu ingin mengajak ${recipient} pergi dengan cara yang lebih spesial. Invitation mengubah ajakanmu menjadi pengalaman interaktif yang dapat langsung ia jawab.`,
        voices: `Kamu ingin ${recipient} merasakan kehadiranmu melalui suara. Voices menyatukan rekaman, pesan, dan foto dalam pengalaman yang terasa dekat.`,
        mixtape: `Kamu ingin lagu membawa kembali momen bersama ${recipient}. Mixtape membungkus musik dan kenangan dalam kaset retro yang interaktif.`,
        arcade: `Kamu ingin memberi pengalaman yang seru dan bisa dijelajahi. Arcade membawa pesan, foto, dan kejutanmu ke dalam ruangan permainan yang dibuka satu per satu.`,
        retro: `Kamu ingin kejutan yang playful dan tidak biasa. Retro menyembunyikan pesan dan kenangan dalam rangkaian pop-up nostalgia yang menyenangkan.`,
        wrapped: `Kamu ingin merangkum perjalanan bersama ${recipient}. Wrapped menyusun momen penting menjadi cerita interaktif yang mengalir dari awal hingga akhir.`,
        "the-gift-box": `Kamu ingin ${recipient} menikmati pengalaman unboxing sekaligus kejutan digital personal. The Gift Box menyatukan keduanya dalam satu hadiah yang siap dikirim.`,
    };
    return reasons[productId] ?? "Pilihan ini paling dekat dengan pengalaman yang kamu bayangkan.";
}

function rankDigital(answers: FinderAnswers, budget: FinderBudget, onlyIds?: readonly string[]) {
    const allowedIds = onlyIds ? new Set(onlyIds) : null;
    const allRanked = STOREFRONT_CATALOG
        .filter((item) => (answers.format === "unsure" || item.id !== "the-gift-box") && (!allowedIds || allowedIds.has(item.id)))
        .filter((item) => item.id !== "wrapped" || answers.recipient === "partner")
        .map((item, index) => ({ scored: scoreProduct(item, answers), index }))
        .filter((entry): entry is { scored: NonNullable<ReturnType<typeof scoreProduct>>; index: number } => Boolean(entry.scored))
        .sort((a, b) => b.scored.score - a.scored.score || a.index - b.index);
    const filtered = allRanked.filter(({ scored }) => inBudget(scored.item, budget));
    const selected = filtered.length ? [...filtered] : [...allRanked];
    for (const upsellId of ["loves", "letter"]) {
        const upsell = allRanked.find(({ scored }) => scored.item.id === upsellId);
        if (upsell && !selected.some(({ scored }) => scored.item.id === upsellId)) selected.push(upsell);
    }
    return selected.map(({ scored }) => scored);
}

function chooseThree(ranked: ReturnType<typeof rankDigital>) {
    const primary = ranked[0];
    if (!primary) return [];
    const memoria = ranked.find((candidate) => candidate.item.id === "loves");
    const letter = ranked.find((candidate) => candidate.item.id === "letter");
    const selected = [primary];
    if (memoria && !selected.some((candidate) => candidate.item.id === memoria.item.id)) selected.push(memoria);
    if (letter && !selected.some((candidate) => candidate.item.id === letter.item.id)) selected.push(letter);
    for (const candidate of ranked) {
        if (selected.length >= 3) break;
        if (!selected.some((entry) => entry.item.id === candidate.item.id)) selected.push(candidate);
    }
    const remaining = selected.slice(1);
    const simpler = remaining.find((candidate) => candidate.item.id === "letter")
        ?? [...remaining].sort((a, b) => a.depth - b.depth)[0];
    const immersive = remaining.find((candidate) => candidate.item.id !== simpler?.item.id);
    return [
        { ...primary, role: "primary" as const },
        ...(simpler ? [{ ...simpler, role: "simpler" as const }] : []),
        ...(immersive ? [{ ...immersive, role: "immersive" as const }] : []),
    ];
}

export function getRecommendations(answers: FinderAnswers, budget: FinderBudget): FinderRecommendation[] {
    if (!answers.recipient || !answers.intent || !answers.format || answers.experiences.length === 0) return [];
    if (answers.format === "physical") {
        const giftBox = STOREFRONT_CATALOG.find((item) => item.id === "the-gift-box");
        if (!giftBox) return [];
        const rankedInserts = rankDigital(answers, "all", PHYSICAL_INSERT_IDS);
        const inserts = ["loves", "letter"]
            .map((id) => rankedInserts.find((entry) => entry.item.id === id))
            .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
        return [
            { item: giftBox, score: 100, depth: 3, role: "primary", reason: productReason(giftBox.id, answers) },
            ...inserts.map((entry) => ({ ...entry, role: entry.item.id === "letter" ? "simpler" as const : "immersive" as const, reason: productReason(entry.item.id, answers), physicalInsert: true })),
        ];
    }
    return chooseThree(rankDigital(answers, budget)).map((entry) => ({ ...entry, reason: productReason(entry.item.id, answers) }));
}

export function getRecommendedPhysicalInsert(answers: FinderAnswers) {
    return rankDigital(answers, "all", PHYSICAL_INSERT_IDS)[0]?.item.id ?? "letter";
}

export function budgetHasExactMatches(answers: FinderAnswers, budget: FinderBudget) {
    if (budget === "all" || answers.format === "physical") return true;
    return STOREFRONT_CATALOG.some((item) => (answers.format === "unsure" || item.id !== "the-gift-box") && inBudget(item, budget));
}
