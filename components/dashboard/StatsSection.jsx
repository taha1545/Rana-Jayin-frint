'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function StatsSection({ stats }) {
    return (
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((item, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
                    <Card className="transition-shadow hover:shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                {item.icon}
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{item.value}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </section>
    );
}
