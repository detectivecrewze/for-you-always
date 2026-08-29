"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { STOREFRONT_CATALOG, type StorefrontCatalogItem } from "@/lib/storefront-catalog";
import styles from "./GiftFinderClient.module.css";

type Occasion = "Birthday" | "Anniversary" | "LDR" | "Apology" | "Just Because";
type Recipient = "Pasangan" | "Crush" | "Teman" | "Keluarga";
type Format = "Digital" | "Fisik" | "Bebas";
type Budget = "25" | "50" | "50+";
type StepKey = "occasion" | "recipient" | "format" | "budget";
type Answers = { occasion: Occasion | null; recipient: Recipient | null; format: Format | null; budget: Budget | null };
type QuestionOption = { value: string; label: string; description: string };
type QuestionConfig = { key: StepKey; eyebrow: string; title: string; helper: string; options: QuestionOption[] };

const QUESTIONS: QuestionConfig[] = [
    {
        key: "occasion", eyebrow: "Tentang momennya", title: "Momen apa yang ingin kamu buat lebih berkesan?",
        helper: "Pilih suasana yang paling mendekati alasanmu memberi kado.",
        options: [
            { value: "Birthday", label: "Birthday", description: "Hari spesial yang layak terasa lebih personal." },
            { value: "Anniversary", label: "Anniversary", description: "Rayakan perjalanan dan cerita yang sudah dibangun." },
            { value: "LDR", label: "LDR", description: "Kirim rasa dekat meski sedang berjauhan." },
            { value: "Apology", label: "Apology", description: "Sampaikan maaf dengan cara yang lebih tulus." },
            { value: "Just Because", label: "Just Because", description: "Kejutan kecil tanpa menunggu tanggal tertentu." },
        ],
    },
    {
        key: "recipient", eyebrow: "Tentang penerimanya", title: "Untuk siapa kado ini kamu siapkan?",
        helper: "Hubunganmu dengan penerima membantu kami menentukan rasa yang tepat.",
        options: [
            { value: "Pasangan", label: "Pasangan", description: "Untuk seseorang yang menjadi rumah." },
            { value: "Crush", label: "Crush", description: "Isyarat manis tanpa terasa berlebihan." },
            { value: "Teman", label: "Teman", description: "Apresiasi hangat untuk teman terbaik." },
            { value: "Keluarga", label: "Keluarga", description: "Kado personal untuk orang terdekat." },
        ],
    },
    {
        key: "format", eyebrow: "Tentang pengalamannya", title: "Pengalaman seperti apa yang kamu bayangkan?",
        helper: "Pilih format yang paling nyaman untuk diberikan dan dinikmati.",
        options: [
            { value: "Digital", label: "Digital", description: "Langsung dikirim, interaktif, dan bisa dibuka kapan saja." },
            { value: "Fisik", label: "Fisik", description: "Pengalaman unboxing dengan kejutan digital di dalamnya." },
            { value: "Bebas", label: "Bebas", description: "Biarkan kami memilih format yang paling cocok." },
        ],
    },
    {
        key: "budget", eyebrow: "Tentang anggarannya", title: "Berapa budget yang nyaman untukmu?",
        helper: "Kami hanya akan menampilkan koleksi dalam rentang pilihanmu.",
        options: [
            { value: "25", label: "Sampai Rp25.000", description: "Pilihan digital personal dengan harga paling ringan." },
            { value: "50", label: "Rp26.000–Rp50.000", description: "Koleksi premium digital untuk momen yang lebih spesial." },
            { value: "50+", label: "Di atas Rp50.000", description: "Kado fisik dan pengalaman hybrid yang lebih lengkap." },
        ],
    },
];

const INITIAL_ANSWERS: Answers = { occasion: null, recipient: null, format: null, budget: null };
const RECIPIENT_MATCHES: Record<Recipient, string[]> = {
    Pasangan: ["the-gift-box", "loves", "letter", "voices", "wrapped"],
    Crush: ["invitation", "mixtape", "letter"],
    Teman: ["birthday", "arcade", "retro", "wrapped"],
    Keluarga: ["birthday", "letter", "voices", "loves"],
};

function inBudget(item: StorefrontCatalogItem, budget: Budget) {
    if (budget === "25") return item.numericPrice <= 25000;
    if (budget === "50") return item.numericPrice > 25000 && item.numericPrice <= 50000;
    return item.numericPrice > 50000;
}

function occasionScore(item: StorefrontCatalogItem, occasion: Occasion) {
    if (occasion === "Just Because") {
        return item.occasions.includes("Any Occasion") || ["letter", "voices", "mixtape"].includes(item.id) ? 3 : 0;
    }
    return item.occasions.some((entry) => entry.toLowerCase().includes(occasion.toLowerCase())) ? 4 : 0;
}

function recommendationReason(item: StorefrontCatalogItem, occasion: Occasion, recipient: Recipient) {
    const format = item.id === "the-gift-box" ? "kado fisik dengan kejutan digital" : "pengalaman digital interaktif";
    return `Cocok untuk ${occasion.toLowerCase()} bersama ${recipient.toLowerCase()}, dengan ${format} yang terasa personal.`;
}

function CheckIcon() {
    return <svg className={styles.checkIcon} viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" /><path d="m6 10 2.4 2.5L14 7.4" /></svg>;
}

function WizardProgress({ currentStep }: { currentStep: number }) {
    return (
        <div className={styles.progress} aria-label={`Pertanyaan ${currentStep + 1} dari ${QUESTIONS.length}`}>
            <div className={styles.progressMeta}><span>Pertanyaan {currentStep + 1} dari {QUESTIONS.length}</span><span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}%</span></div>
            <div className={styles.progressTrack} aria-hidden="true"><span className={styles.progressFill} style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }} /></div>
        </div>
    );
}

function AnswerCard({ option, name, selected, onSelect }: { option: QuestionOption; name: string; selected: boolean; onSelect: (value: string) => void }) {
    return (
        <label className={`${styles.answerCard} ${selected ? styles.answerCardSelected : ""}`}>
            <input className={styles.answerInput} type="radio" name={name} value={option.value} checked={selected} onChange={() => onSelect(option.value)} />
            <span className={styles.answerText}><strong>{option.label}</strong><span>{option.description}</span></span>
            <CheckIcon />
        </label>
    );
}

function QuestionStep({ question, selectedValue, currentStep, onSelect, onBack, onContinue }: {
    question: QuestionConfig; selectedValue: string | null; currentStep: number; onSelect: (value: string) => void; onBack: () => void; onContinue: () => void;
}) {
    return (
        <div className={styles.questionStep}>
            <div className={styles.questionHeader}>
                <span className={styles.questionEyebrow}>{question.eyebrow}</span>
                <h2 id={`${question.key}-title`} className={styles.questionTitle}>{question.title}</h2>
                <p>{question.helper}</p>
            </div>
            <fieldset className={styles.answerFieldset} aria-labelledby={`${question.key}-title`}>
                <legend className={styles.srOnly}>{question.title}</legend>
                <div className={styles.answersGrid}>
                    {question.options.map((option) => <AnswerCard key={option.value} option={option} name={question.key} selected={selectedValue === option.value} onSelect={onSelect} />)}
                </div>
            </fieldset>
            <div className={styles.wizardActions}>
                {currentStep > 0 ? <button className={styles.backButton} type="button" onClick={onBack}>Kembali</button> : <span aria-hidden="true" />}
                <button className={styles.continueButton} type="button" onClick={onContinue} disabled={!selectedValue}>
                    {currentStep === QUESTIONS.length - 1 ? "Lihat Rekomendasi" : "Lanjutkan"}<span aria-hidden="true">→</span>
                </button>
            </div>
        </div>
    );
}

type Recommendation = { item: StorefrontCatalogItem; index: number; score: number };

function RecommendationResults({ recommendations, occasion, recipient, answers, onEdit, onReset }: {
    recommendations: Recommendation[]; occasion: Occasion; recipient: Recipient; answers: Answers; onEdit: () => void; onReset: () => void;
}) {
    const [primary, ...secondary] = recommendations;
    const answerLabels = QUESTIONS.map((question) => {
        const answer = answers[question.key];
        return question.options.find((option) => option.value === answer)?.label;
    }).filter(Boolean) as string[];

    if (!primary) {
        return (
            <section className={styles.emptyResults} aria-live="polite">
                <span className={styles.resultEyebrow}>Kurasi untukmu</span><h2>Belum ada koleksi dalam kombinasi ini.</h2>
                <p>Coba ubah format atau rentang budget agar kami dapat menampilkan pilihan yang paling mendekati.</p>
                <button className={styles.continueButton} type="button" onClick={onEdit}>Ubah Jawaban</button>
            </section>
        );
    }

    return (
        <section className={styles.results} aria-live="polite">
            <div className={styles.resultsHeader}>
                <span className={styles.resultEyebrow}>Kurasi untukmu</span><h2>Pilihan yang terasa paling tepat.</h2>
                <p>Berdasarkan momen, penerima, format, dan budget yang kamu pilih.</p>
                <div className={styles.answerSummary} aria-label="Ringkasan jawaban">{answerLabels.map((label) => <span key={label}>{label}</span>)}</div>
            </div>

            <article className={`${styles.primaryCard} ${recommendations.length === 1 ? styles.singlePrimaryCard : ""}`}>
                <div className={styles.primaryMedia}>
                    <Image src={primary.item.imageSrc} alt={primary.item.title} fill sizes="(max-width: 720px) calc(100vw - 56px), 360px" quality={90} priority style={{ objectFit: "cover" }} />
                    <span className={styles.topPick}>Pilihan utama</span>
                </div>
                <div className={styles.primaryContent}>
                    <span className={styles.collectionLabel}>{primary.item.badgeText}</span><h3>{primary.item.title}</h3>
                    <strong className={styles.primaryPrice}>{primary.item.newPrice}</strong>
                    <p>{recommendationReason(primary.item, occasion, recipient)}</p>
                    <div className={styles.primaryActions}>
                        <Link className={styles.collectionLink} href={primary.item.href}>Lihat Koleksi</Link>
                        <button className={styles.editButton} type="button" onClick={onEdit}>Ubah Jawaban</button>
                    </div>
                </div>
            </article>

            {secondary.length > 0 && (
                <div className={styles.secondarySection}>
                    <div className={styles.secondaryHeading}><span>Pilihan lain yang juga sesuai</span><i aria-hidden="true" /></div>
                    <div className={styles.secondaryGrid}>
                        {secondary.map(({ item }) => (
                            <article className={styles.secondaryCard} key={item.id}>
                                <div className={styles.secondaryMedia}><Image src={item.imageSrc} alt={item.title} fill sizes="(max-width: 720px) 112px, 180px" quality={90} style={{ objectFit: "cover" }} /></div>
                                <div className={styles.secondaryContent}>
                                    <span>{item.badgeText}</span><h3>{item.title}</h3><strong>{item.newPrice}</strong>
                                    <p>{recommendationReason(item, occasion, recipient)}</p><Link href={item.href}>Lihat Koleksi <span aria-hidden="true">→</span></Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}
            <button className={styles.resetButton} type="button" onClick={onReset}>Mulai Ulang</button>
        </section>
    );
}

export default function GiftFinderClient() {
    const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
    const [currentStep, setCurrentStep] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const focusTargetRef = useRef<HTMLHeadingElement>(null);
    const question = QUESTIONS[currentStep];
    const selectedValue = answers[question.key];

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            focusTargetRef.current?.focus({ preventScroll: true });
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            });
        });
        return () => window.cancelAnimationFrame(frame);
    }, [currentStep, showResults]);

    const recommendations = useMemo(() => {
        const { occasion, recipient, format, budget } = answers;
        if (!occasion || !recipient || !format || !budget) return [];
        const rankedItems = STOREFRONT_CATALOG
            .map((item, index) => ({ item, index, score: occasionScore(item, occasion) + (RECIPIENT_MATCHES[recipient].includes(item.id) ? 3 : 0) }))
            .sort((a, b) => b.score - a.score || a.index - b.index);
        const matchedItems = rankedItems
            .filter(({ item }) => inBudget(item, budget))
            .filter(({ item }) => format === "Bebas" || (format === "Fisik" ? item.id === "the-gift-box" : item.id !== "the-gift-box"))
            .slice(0, 3);

        if (matchedItems.length > 0) return matchedItems;

        // Tetap beri satu pilihan saat kombinasi format dan budget belum memiliki produk persis.
        // Memoria adalah fallback digital premium; The Gift Box adalah satu-satunya pilihan fisik.
        const fallbackId = format === "Fisik" ? "the-gift-box" : "loves";
        const fallback = rankedItems.find(({ item }) => item.id === fallbackId);
        return fallback ? [fallback] : rankedItems.slice(0, 1);
    }, [answers]);

    const selectAnswer = (value: string) => setAnswers((current) => ({ ...current, [question.key]: value } as Answers));
    const continueWizard = () => {
        if (!selectedValue) return;
        if (currentStep === QUESTIONS.length - 1) setShowResults(true);
        else setCurrentStep((step) => step + 1);
    };
    const editAnswers = () => { setShowResults(false); setCurrentStep(0); };
    const resetWizard = () => { setAnswers(INITIAL_ANSWERS); setCurrentStep(0); setShowResults(false); };
    const complete = answers.occasion && answers.recipient && answers.format && answers.budget;

    return (
        <main className={styles.page}>
            <Navbar /><div className={styles.ambient} aria-hidden="true" />
            <section className={styles.shell}>
                <header className={styles.intro}>
                    <span>Gift Finder</span>
                    <h1 ref={focusTargetRef} tabIndex={-1}>{showResults ? "Kurasi kecil, dipilih khusus untukmu." : "Temukan kado yang terasa paling tepat."}</h1>
                    <p>{showResults ? "Pilihan yang lebih sedikit, dengan alasan yang lebih jelas." : "Empat pilihan singkat untuk menemukan koleksi yang paling sesuai."}</p>
                </header>

                {!showResults ? (
                    <section className={styles.wizardPanel} aria-label="Gift Finder">
                        <span className={styles.panelAccent} aria-hidden="true" /><WizardProgress currentStep={currentStep} />
                        <QuestionStep key={question.key} question={question} selectedValue={selectedValue} currentStep={currentStep} onSelect={selectAnswer} onBack={() => setCurrentStep((step) => Math.max(0, step - 1))} onContinue={continueWizard} />
                    </section>
                ) : complete ? (
                    <RecommendationResults recommendations={recommendations} occasion={answers.occasion!} recipient={answers.recipient!} answers={answers} onEdit={editAnswers} onReset={resetWizard} />
                ) : null}
            </section>
        </main>
    );
}
