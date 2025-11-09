'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto py-10 px-6 space-y-10">
            <h1 className="text-3xl font-bold text-center mb-8">
                Terms & Conditions / Conditions Générales / الشروط والأحكام
            </h1>

            {/* Section 1 */}
            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">1. Use of Service / Utilisation du service / استخدام الخدمة</h2>
                <p>You agree to use our services in compliance with all applicable laws and not to engage in harmful behavior.</p>
                <p className="italic">Vous acceptez d'utiliser nos services conformément à toutes les lois applicables et de ne pas adopter de comportements nuisibles.</p>
                <p className="italic text-right" dir="rtl">أنت توافق على استخدام خدماتنا بما يتوافق مع جميع القوانين المعمول بها وعدم الانخراط في أي سلوك ضار.</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">2. Privacy / Confidentialité / الخصوصية</h2>
                <p>Your personal data will be handled according to our Privacy Policy.</p>
                <p className="italic">Vos données personnelles seront traitées conformément à notre Politique de confidentialité.</p>
                <p className="italic text-right" dir="rtl">سيتم التعامل مع بياناتك الشخصية وفقًا لسياسة الخصوصية الخاصة بنا.</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">3. Account Responsibility / Responsabilité du compte / مسؤولية الحساب</h2>
                <p>You are responsible for maintaining the confidentiality of your account information.</p>
                <p className="italic">Vous êtes responsable du maintien de la confidentialité des informations de votre compte.</p>
                <p className="italic text-right" dir="rtl">أنت مسؤول عن الحفاظ على سرية معلومات حسابك.</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">4. Limitation of Liability / Limitation de responsabilité / حدود المسؤولية</h2>
                <p>We are not liable for any damages resulting from your use of our services.</p>
                <p className="italic">Nous ne sommes pas responsables des dommages résultant de votre utilisation de nos services.</p>
                <p className="italic text-right" dir="rtl">نحن غير مسؤولين عن أي أضرار تنتج عن استخدامك لخدماتنا.</p>
            </section>

            {/* Back button */}
            <div className="text-center mt-8">
                <Link href="/auth/signup">
                    <Button className="px-6 py-2 text-lg font-medium">
                        Back to Signup / Retour à l'inscription / العودة إلى التسجيل
                    </Button>
                </Link>
            </div>
        </div>
    );
}
