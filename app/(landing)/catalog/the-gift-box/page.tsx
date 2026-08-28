import GiftBoxClient from "./GiftBoxClient";
import GiftBoxProcessSection from "./GiftBoxProcessSection";

export default function TheGiftBoxPage() {
    return (
        <GiftBoxClient>
            <GiftBoxProcessSection />
        </GiftBoxClient>
    );
}
