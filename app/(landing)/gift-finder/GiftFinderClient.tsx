"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import DemoPreviewModal from "../../components/LazyDemoPreviewModal";
import type { DemoCloseReason, DemoPreviewVariant } from "../../components/DemoPreviewModal";
import SlotPickerModal, { type SlotPickerConfig } from "../../components/SlotPickerModal";
import { useCart } from "../../context/CartContext";
import {
    FINDER_QUESTIONS,
    INITIAL_FINDER_ANSWERS,
    budgetHasExactMatches,
    getFinderSteps,
    getRecommendations,
    getRecommendedPhysicalInsert,
    type FinderAnswers,
    type FinderBudget,
    type FinderExperience,
    type FinderRecommendation,
    type FinderStepKey,
} from "@/lib/gift-finder";
import { STOREFRONT_DEMO_CONFIGS, type DemoProductId } from "@/lib/storefront-demo-config";
import type { StorefrontCatalogItem } from "@/lib/storefront-catalog";
import styles from "./GiftFinderClient.module.css";

const FINDER_VERSION = "v2";
const THREE_SLOT_IDS = new Set(["letter", "voices", "retro", "mixtape", "invitation"]);
const DEMO_PRODUCT_IDS = new Set<DemoProductId>(["loves", "letter", "voices", "mixtape", "invitation", "retro", "wrapped", "birthday", "arcade", "storybook"]);

const ROLE_LABELS: Record<FinderRecommendation["role"], string> = {
    primary: "Paling sesuai dengan jawabanmu",
    simpler: "Lebih ringkas untuk disiapkan",
    immersive: "Lebih banyak untuk dijelajahi",
};

const BUDGET_OPTIONS: Array<{ value: FinderBudget; label: string }> = [
    { value: "all", label: "Semua harga" },
    { value: "up25", label: "Sampai Rp25.000" },
    { value: "26to50", label: "Rp26.000–Rp50.000" },
    { value: "above50", label: "Di atas Rp50.000" },
];

interface ActiveDemo {
    productId: DemoProductId;
    recommendationRank: number;
    initialVariantId: string;
    switchCount: number;
    openedAt: number;
}

function captureFinderEvent(event: string, properties: Record<string, unknown> = {}) {
    void import("posthog-js")
        .then(({ default: posthog }) => posthog.capture(event, { finder_version: FINDER_VERSION, ...properties }))
        .catch(() => {});
}

function answerSnapshot(answers: FinderAnswers) {
    return {
        finder_recipient: answers.recipient,
        finder_intent: answers.intent,
        finder_format: answers.format,
        finder_experiences: answers.experiences,
        finder_material: answers.material,
    };
}

function CheckIcon() {
    return <svg className={styles.checkIcon} viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" /><path d="m6 10 2.4 2.5L14 7.4" /></svg>;
}

function WizardProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
    const percentage = Math.round(((currentStep + 1) / totalSteps) * 100);
    return (
        <div className={styles.progress} aria-label={`Pertanyaan ${currentStep + 1} dari ${totalSteps}`}>
            <div className={styles.progressMeta}><span>Pertanyaan {currentStep + 1} dari {totalSteps}</span><span>{percentage}%</span></div>
            <div className={styles.progressTrack} aria-hidden="true"><span className={styles.progressFill} style={{ width: `${percentage}%` }} /></div>
        </div>
    );
}

function AnswerCard({ label, description, name, selected, multiple, disabled, onSelect }: {
    label: string;
    description: string;
    name: string;
    selected: boolean;
    multiple: boolean;
    disabled?: boolean;
    onSelect: () => void;
}) {
    return (
        <label className={`${styles.answerCard} ${selected ? styles.answerCardSelected : ""} ${disabled ? styles.answerCardDisabled : ""}`}>
            <input className={styles.answerInput} type={multiple ? "checkbox" : "radio"} name={name} checked={selected} disabled={disabled} onChange={onSelect} />
            <span className={styles.answerText}><strong>{label}</strong><span>{description}</span></span>
            <CheckIcon />
        </label>
    );
}

function QuestionStep({ stepKey, answers, currentStep, totalSteps, onSingleSelect, onExperienceSelect, onBack, onContinue }: {
    stepKey: FinderStepKey;
    answers: FinderAnswers;
    currentStep: number;
    totalSteps: number;
    onSingleSelect: (key: Exclude<FinderStepKey, "experiences">, value: string) => void;
    onExperienceSelect: (value: FinderExperience) => void;
    onBack: () => void;
    onContinue: () => void;
}) {
    const question = FINDER_QUESTIONS[stepKey];
    const selectedValues = stepKey === "experiences" ? answers.experiences : [answers[stepKey] as string | null].filter(Boolean);
    const canContinue = selectedValues.length > 0;
    return (
        <div className={styles.questionStep}>
            <div className={styles.questionHeader}>
                <span className={styles.questionEyebrow}>{question.eyebrow}</span>
                <h2 id={`${stepKey}-title`} className={styles.questionTitle}>{question.title}</h2>
                <p>{question.helper}</p>
            </div>
            <fieldset className={styles.answerFieldset} aria-labelledby={`${stepKey}-title`}>
                <legend className={styles.srOnly}>{question.title}</legend>
                <div className={styles.answersGrid}>
                    {question.options.map((option) => {
                        const selected = selectedValues.includes(option.value);
                        const disabled = stepKey === "experiences" && !selected && answers.experiences.length >= 2;
                        return (
                            <AnswerCard
                                key={option.value}
                                label={option.label}
                                description={option.description}
                                name={stepKey}
                                selected={selected}
                                multiple={stepKey === "experiences"}
                                disabled={disabled}
                                onSelect={() => stepKey === "experiences"
                                    ? onExperienceSelect(option.value as FinderExperience)
                                    : onSingleSelect(stepKey as Exclude<FinderStepKey, "experiences">, option.value)}
                            />
                        );
                    })}
                </div>
            </fieldset>
            <div className={styles.wizardActions}>
                {currentStep > 0 ? <button className={styles.backButton} type="button" onClick={onBack}>Kembali</button> : <span aria-hidden="true" />}
                <button className={styles.continueButton} type="button" onClick={onContinue} disabled={!canContinue}>
                    {currentStep === totalSteps - 1 ? "Lihat Rekomendasi" : "Lanjutkan"}<span aria-hidden="true">→</span>
                </button>
            </div>
        </div>
    );
}

function RecommendationCard({ recommendation, rank, physicalMode, onDemo, onOrder }: {
    recommendation: FinderRecommendation;
    rank: number;
    physicalMode: boolean;
    onDemo: (recommendation: FinderRecommendation, rank: number) => void;
    onOrder: (recommendation: FinderRecommendation, rank: number) => void;
}) {
    const { item } = recommendation;
    const isPrimary = recommendation.role === "primary";
    const price = recommendation.physicalInsert ? "Termasuk dalam Gift Box" : item.newPrice;
    const demoLabel = item.id === "arcade" ? "Buka Demo Arcade" : recommendation.physicalInsert ? "Lihat Demo Isi Digital" : "Lihat Demo";
    return (
        <article className={`${styles.resultCard} ${isPrimary ? styles.primaryCard : styles.secondaryCard}`}>
            <div className={styles.resultMedia}>
                <Image src={item.imageSrc} alt={item.title} fill sizes={isPrimary ? "(max-width: 720px) calc(100vw - 48px), 350px" : "(max-width: 720px) calc(100vw - 48px), 430px"} quality={90} priority={isPrimary} style={{ objectFit: "contain", padding: isPrimary ? 16 : 12 }} />
                <span className={styles.resultRole}>{recommendation.physicalInsert ? "Pilihan isi digital" : ROLE_LABELS[recommendation.role]}</span>
            </div>
            <div className={styles.resultContent}>
                <span className={styles.collectionLabel}>{item.badgeText}</span>
                <h3>{item.title}</h3>
                <strong className={styles.resultPrice}>{price}</strong>
                <p>{recommendation.reason}</p>
                <div className={styles.resultActions}>
                    <button className={styles.demoButton} type="button" onClick={() => onDemo(recommendation, rank)}>{demoLabel}</button>
                    <button className={styles.orderButton} type="button" onClick={() => onOrder(recommendation, rank)}>
                        {physicalMode ? "Pilih Gift Box" : "Pesan Sekarang"}<span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>
        </article>
    );
}

function ResultView({ answers, budget, recommendations, exactBudgetMatch, onBudgetChange, onDemo, onOrder, onEdit, onReset }: {
    answers: FinderAnswers;
    budget: FinderBudget;
    recommendations: FinderRecommendation[];
    exactBudgetMatch: boolean;
    onBudgetChange: (budget: FinderBudget) => void;
    onDemo: (recommendation: FinderRecommendation, rank: number) => void;
    onOrder: (recommendation: FinderRecommendation, rank: number) => void;
    onEdit: () => void;
    onReset: () => void;
}) {
    const physicalMode = answers.format === "physical";
    return (
        <section className={styles.results} aria-live="polite">
            <div className={styles.resultsHeader}>
                <span className={styles.resultEyebrow}>Pilihan untukmu</span>
                <h2>Kado yang paling dekat dengan keinginanmu.</h2>
                <p>{physicalMode ? "Kami memilih Gift Box beserta pengalaman digital yang paling sesuai untuk kartu aksesnya." : "Dipilih dari momen, penerima, dan pengalaman yang ingin kamu berikan."}</p>
            </div>

            {!physicalMode && (
                <div className={styles.budgetFilter}>
                    <span>Sesuaikan budget</span>
                    <div className={styles.budgetChips} role="group" aria-label="Filter budget">
                        {BUDGET_OPTIONS.map((option) => (
                            <button key={option.value} type="button" className={budget === option.value ? styles.budgetChipActive : ""} aria-pressed={budget === option.value} onClick={() => onBudgetChange(option.value)}>{option.label}</button>
                        ))}
                    </div>
                    {!exactBudgetMatch && budget !== "all" && <p className={styles.budgetNotice}>Belum ada kado digital di rentang ini. Kami tetap menampilkan pilihan terdekat agar kamu tidak kehilangan rekomendasi terbaik.</p>}
                </div>
            )}

            <div className={styles.resultList}>
                {recommendations.map((recommendation, index) => (
                    <RecommendationCard key={`${recommendation.item.id}-${recommendation.role}`} recommendation={recommendation} rank={index + 1} physicalMode={physicalMode} onDemo={onDemo} onOrder={onOrder} />
                ))}
            </div>
            <div className={styles.resultFooterActions}>
                <button className={styles.editButton} type="button" onClick={onEdit}>Ubah jawaban</button>
                <button className={styles.resetButton} type="button" onClick={onReset}>Mulai ulang</button>
            </div>
        </section>
    );
}

export default function GiftFinderClient() {
    const router = useRouter();
    const { addToCart } = useCart();
    const [answers, setAnswers] = useState<FinderAnswers>(INITIAL_FINDER_ANSWERS);
    const [currentStep, setCurrentStep] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [budget, setBudget] = useState<FinderBudget>("all");
    const [activeDemo, setActiveDemo] = useState<ActiveDemo | null>(null);
    const [slotPickerConfig, setSlotPickerConfig] = useState<SlotPickerConfig | null>(null);
    const focusTargetRef = useRef<HTMLHeadingElement>(null);
    const startedRef = useRef(false);
    const resultSignatureRef = useRef("");
    const reactSessionId = useId();
    const finderSessionIdRef = useRef(`gift-finder-${reactSessionId}`);

    const steps = useMemo(() => getFinderSteps(answers), [answers]);
    const safeCurrentStep = Math.min(currentStep, steps.length - 1);
    const stepKey = steps[safeCurrentStep];
    const recommendations = useMemo(() => getRecommendations(answers, budget), [answers, budget]);
    const exactBudgetMatch = useMemo(() => budgetHasExactMatches(answers, budget), [answers, budget]);

    const analyticsBase = useCallback(() => ({ finder_session_id: finderSessionIdRef.current, ...answerSnapshot(answers) }), [answers]);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;
        captureFinderEvent("gift_finder_started", { finder_session_id: finderSessionIdRef.current, source: "catalog" });
    }, []);

    useEffect(() => {
        if (showResults) return;
        captureFinderEvent("gift_finder_step_viewed", { finder_session_id: finderSessionIdRef.current, step_key: stepKey, step_number: safeCurrentStep + 1, total_steps: steps.length });
    }, [safeCurrentStep, showResults, stepKey, steps.length]);

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            focusTargetRef.current?.focus({ preventScroll: true });
            window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        });
        return () => window.cancelAnimationFrame(frame);
    }, [safeCurrentStep, showResults]);

    useEffect(() => {
        if (!showResults || recommendations.length === 0) return;
        const signature = `${budget}:${recommendations.map((entry) => entry.item.id).join(",")}`;
        if (resultSignatureRef.current === signature) return;
        resultSignatureRef.current = signature;
        captureFinderEvent("gift_finder_result_viewed", {
            ...analyticsBase(), budget_filter: budget,
            recommended_products: recommendations.map((entry, index) => ({ product_id: entry.item.id, rank: index + 1, role: entry.role, score: entry.score })),
        });
    }, [analyticsBase, budget, recommendations, showResults]);

    const selectSingle = useCallback((key: Exclude<FinderStepKey, "experiences">, value: string) => {
        setAnswers((current) => ({ ...current, [key]: value } as FinderAnswers));
        captureFinderEvent("gift_finder_answered", { finder_session_id: finderSessionIdRef.current, step_key: key, answer_value: value });
    }, []);

    const selectExperience = useCallback((value: FinderExperience) => {
        setAnswers((current) => {
            const selected = current.experiences.includes(value);
            const experiences = selected ? current.experiences.filter((entry) => entry !== value) : current.experiences.length < 2 ? [...current.experiences, value] : current.experiences;
            captureFinderEvent("gift_finder_answered", { finder_session_id: finderSessionIdRef.current, step_key: "experiences", answer_value: experiences });
            return { ...current, experiences };
        });
    }, []);

    const continueWizard = useCallback(() => {
        if (safeCurrentStep < steps.length - 1) {
            setCurrentStep((step) => step + 1);
            return;
        }
        const completedAnswers = steps.includes("material") ? answers : { ...answers, material: null };
        setAnswers(completedAnswers);
        setShowResults(true);
        setBudget("all");
        resultSignatureRef.current = "";
        captureFinderEvent("gift_finder_completed", { finder_session_id: finderSessionIdRef.current, total_steps: steps.length, ...answerSnapshot(completedAnswers) });
    }, [answers, safeCurrentStep, steps]);

    const handleBudgetChange = useCallback((nextBudget: FinderBudget) => {
        setBudget(nextBudget);
        resultSignatureRef.current = "";
        captureFinderEvent("gift_finder_budget_filtered", { ...analyticsBase(), previous_budget: budget, budget_filter: nextBudget });
    }, [analyticsBase, budget]);

    const resolveDemoProductId = useCallback((recommendation: FinderRecommendation): DemoProductId | null => {
        if (recommendation.item.id === "the-gift-box") {
            const insert = getRecommendedPhysicalInsert(answers);
            return DEMO_PRODUCT_IDS.has(insert as DemoProductId) ? insert as DemoProductId : "letter";
        }
        return DEMO_PRODUCT_IDS.has(recommendation.item.id as DemoProductId) ? recommendation.item.id as DemoProductId : null;
    }, [answers]);

    const handleDemo = useCallback((recommendation: FinderRecommendation, rank: number) => {
        const productId = resolveDemoProductId(recommendation);
        if (!productId) return;
        const config = STOREFRONT_DEMO_CONFIGS[productId];
        captureFinderEvent("gift_finder_demo_clicked", { ...analyticsBase(), product_id: productId, displayed_product_id: recommendation.item.id, recommendation_rank: rank, recommendation_role: recommendation.role });
        captureFinderEvent("product_demo_opened", { product_id: productId, demo_variant: config.initialVariantId, source: "gift_finder", recommendation_rank: rank });
        if (config.opensInNewTab) {
            window.open(config.variants[0].src, "_blank", "noopener,noreferrer");
            return;
        }
        setActiveDemo({ productId, recommendationRank: rank, initialVariantId: config.initialVariantId, switchCount: 0, openedAt: performance.now() });
    }, [analyticsBase, resolveDemoProductId]);

    const cartItemFor = useCallback((item: StorefrontCatalogItem) => ({
        id: item.id,
        title: item.title,
        numericPrice: item.numericPrice,
        oldNumericPrice: item.oldPrice ? Number(item.oldPrice.replace(/\D/g, "")) : undefined,
        themeColor: item.titleColor,
    }), []);

    const orderRecommendation = useCallback((recommendation: FinderRecommendation, rank: number) => {
        const displayedItem = recommendation.item;
        captureFinderEvent("gift_finder_order_clicked", { ...analyticsBase(), product_id: displayedItem.id, recommendation_rank: rank, recommendation_role: recommendation.role, source: "gift_finder" });
        if (answers.format === "physical" || displayedItem.id === "the-gift-box" || recommendation.physicalInsert) {
            const insertId = displayedItem.id === "the-gift-box" ? getRecommendedPhysicalInsert(answers) : displayedItem.id;
            const digital = ["loves", "birthday", "letter", "voices"].includes(insertId) ? (insertId === "loves" ? "memoria" : insertId) : "letter";
            router.push(`/catalog/the-gift-box?digital=${digital}`);
            return;
        }
        const item = cartItemFor(displayedItem);
        if (THREE_SLOT_IDS.has(item.id)) {
            setSlotPickerConfig({
                productId: item.id, productTitle: item.title, themeColor: item.themeColor,
                singlePriceText: "Rp 20.000", singleOldPriceText: "Rp 30.000", threeSlotPriceText: "Rp 25.000",
                onSelectSingle: () => addToCart(item),
                onSelectThreeSlot: () => addToCart({ id: item.id, title: `${item.title} (3 Gift)`, numericPrice: 25000, themeColor: item.themeColor, isThreeSlot: true, slotCount: 3 }),
            });
            return;
        }
        addToCart(item);
    }, [addToCart, analyticsBase, answers, cartItemFor, router]);

    const closeDemo = useCallback((reason: DemoCloseReason) => {
        setActiveDemo((current) => {
            if (current) {
                captureFinderEvent("product_demo_closed", { product_id: current.productId, demo_variant: current.initialVariantId, source: "gift_finder", recommendation_rank: current.recommendationRank, variant_switch_count: current.switchCount, close_method: reason, open_duration_ms: Math.max(0, Math.round(performance.now() - current.openedAt)) });
            }
            return null;
        });
    }, []);

    const orderFromDemo = useCallback(() => {
        if (!activeDemo) return;
        const recommendation = recommendations.find((entry) => resolveDemoProductId(entry) === activeDemo.productId) ?? recommendations[0];
        if (!recommendation) return;
        captureFinderEvent("product_demo_cta_clicked", { product_id: activeDemo.productId, demo_variant: activeDemo.initialVariantId, source: "gift_finder", recommendation_rank: activeDemo.recommendationRank, destination: answers.format === "physical" ? "gift_box" : "cart" });
        orderRecommendation(recommendation, activeDemo.recommendationRank);
    }, [activeDemo, answers.format, orderRecommendation, recommendations, resolveDemoProductId]);

    const activeConfig = activeDemo ? STOREFRONT_DEMO_CONFIGS[activeDemo.productId] : null;

    return (
        <main className={styles.page}>
            <Navbar />
            <div className={styles.ambient} aria-hidden="true" />
            <section className={styles.shell}>
                <header className={styles.intro}>
                    <span>Bantu Pilih Kado</span>
                    <h1 ref={focusTargetRef} tabIndex={-1}>{showResults ? "Pilihan yang terasa lebih dekat dengan keinginanmu." : "Ceritakan sedikit tentang kado yang kamu bayangkan."}</h1>
                    <p>{showResults ? "Kami merangkumnya menjadi beberapa pilihan dengan alasan yang jelas." : "Empat sampai lima pertanyaan singkat untuk menemukan pengalaman yang paling sesuai."}</p>
                </header>

                {!showResults ? (
                    <section className={styles.wizardPanel} aria-label="Bantu Pilih Kado">
                        <span className={styles.panelAccent} aria-hidden="true" />
                        <WizardProgress currentStep={safeCurrentStep} totalSteps={steps.length} />
                        <QuestionStep key={stepKey} stepKey={stepKey} answers={answers} currentStep={safeCurrentStep} totalSteps={steps.length} onSingleSelect={selectSingle} onExperienceSelect={selectExperience} onBack={() => setCurrentStep((step) => Math.max(0, step - 1))} onContinue={continueWizard} />
                    </section>
                ) : (
                    <ResultView answers={answers} budget={budget} recommendations={recommendations} exactBudgetMatch={exactBudgetMatch} onBudgetChange={handleBudgetChange} onDemo={handleDemo} onOrder={orderRecommendation} onEdit={() => { setShowResults(false); setCurrentStep(0); }} onReset={() => { setAnswers(INITIAL_FINDER_ANSWERS); setCurrentStep(0); setShowResults(false); setBudget("all"); resultSignatureRef.current = ""; }} />
                )}
            </section>

            {activeDemo && activeConfig && (
                <DemoPreviewModal
                    isOpen
                    src={activeConfig.variants[0].src}
                    title={activeConfig.title}
                    subtitle={activeConfig.subtitle}
                    productName={activeConfig.productName}
                    price={activeConfig.price}
                    theme={activeConfig.theme}
                    variants={activeConfig.variants}
                    initialVariantId={activeDemo.initialVariantId}
                    themeSwatches={activeConfig.themeSwatches}
                    onClose={closeDemo}
                    onOrder={orderFromDemo}
                    onLoaded={(loadTimeMs) => captureFinderEvent("product_demo_loaded", { product_id: activeDemo.productId, source: "gift_finder", demo_variant: activeDemo.initialVariantId, load_time_ms: loadTimeMs, recommendation_rank: activeDemo.recommendationRank })}
                    onVariantChange={(previous: DemoPreviewVariant, next: DemoPreviewVariant) => setActiveDemo((current) => {
                        if (!current) return current;
                        const switchCount = current.switchCount + 1;
                        captureFinderEvent("product_demo_variant_changed", { product_id: current.productId, source: "gift_finder", from_variant: previous.id, to_variant: next.id, switch_index: switchCount });
                        return { ...current, initialVariantId: next.id, switchCount };
                    })}
                />
            )}

            {slotPickerConfig && <SlotPickerModal config={slotPickerConfig} onClose={() => setSlotPickerConfig(null)} />}
        </main>
    );
}
