import { useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { motion, AnimatePresence } from "framer-motion";

export default function EmergencyServices() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);

  const services = [
    {
      key: "ambulance",
      img: "/embilance.png",
      borderColor: "border-destructive",
      number: "14",
    },
    {
      key: "gendarmerie",
      img: "/gendarme.png",
      borderColor: "border-accent",
      number: "1055",
    },
    {
      key: "civilProtection",
      img: "/himaya.png",
      borderColor: "border-destructive",
      number: "14",
    },
    {
      key: "police",
      img: "/police.png",
      borderColor: "border-primary",
      number: "17",
    },
  ];

  return (
    <section id="emergency-services"
      className="bg-background text-foreground dark:bg-background dark:text-foreground
      py-2 lg:py-12 transition-colors duration-300
      ">
      <div className="text-center mb-12 lg:mb-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary">
          {t("emergencyServices.title")}
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6">
        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => setSelected(service)}
            className="bg-card cursor-pointer rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 border border-border"
          >
            <div className={`w-24 h-24 bg-card rounded-full flex items-center justify-center mb-4 border-4 ${service.borderColor}`}>
              <Image src={service.img} alt={service.key} width={70} height={70} className="object-contain rounded-full" />
            </div>

            <h2 className="font-semibold text-lg text-secondary-foreground">
              {t(`emergencyServices.${service.key}.title`)}
            </h2>

            <p className="text-base font-semibold text-primary mt-1">{service.number}</p>

            <p className="text-sm text-muted-foreground mt-2">
              {t(`emergencyServices.${service.key}.description`)}
            </p>
          </div>
        ))}
      </div>

      {/* POPUP */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="popup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-card p-6 rounded-2xl max-w-md w-full shadow-xl text-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 text-primary">
                {t(`emergencyServices.${selected.key}.title`)}
              </h2>

              <div className="flex flex-col space-y-3">
                <a
                  href={`tel:${selected.number}`}
                  className="w-full py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
                >
                  {t("emergencyServices.actions.call")}
                </a>

                <button disabled className="w-full py-3 px-4 rounded-xl bg-secondary text-secondary-foreground font-semibold opacity-50 cursor-not-allowed">
                  {t("emergencyServices.actions.message")} ({t("soon")})
                </button>

                <button disabled className="w-full py-3 px-4 rounded-xl bg-destructive text-destructive-foreground font-semibold opacity-50 cursor-not-allowed">
                  {t("emergencyServices.actions.alert")} ({t("soon")})
                </button>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-lg font-bold text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
