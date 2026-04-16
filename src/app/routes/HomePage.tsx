import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Zap, Users, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GradientText } from '@/components/GradientText'
import { FeatureCard } from '@/components/FeatureCard'

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    }),
}

const features = [
    {
        icon: Zap,
        title: 'Instant Pay',
        description: 'Send money directly to anyone in your contacts. Transfers settle in seconds, not days.',
        accentColor: 'teal' as const,
    },
    {
        icon: Users,
        title: 'Split Pay',
        description: 'Divide any expense fairly among a group. Add people, set amounts, done.',
        accentColor: 'pink' as const,
    },
    {
        icon: ArrowLeftRight,
        title: 'Settle Up',
        description: 'See exactly who owes what and clear balances with a single tap.',
        accentColor: 'purple' as const,
    },
]

export default function HomePage() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col">
            {/* ── Hero ──────────────────────────────────────────────── */}
            <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 overflow-hidden">
                {/* Ambient glow blobs */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#00D4B8]/5 blur-[120px]" />
                    <div className="absolute top-20 -right-20 w-[400px] h-[400px] rounded-full bg-[#FF2D78]/5 blur-[100px]" />
                    <div className="absolute top-40 -left-20 w-[400px] h-[400px] rounded-full bg-[#4B7BFF]/5 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        custom={0}
                        variants={fadeUp}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D4B8]/30 bg-[#00D4B8]/5 text-[#00D4B8] text-sm font-medium mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D4B8] animate-pulse" />
                        Now in early access
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        custom={1}
                        variants={fadeUp}
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
                    >
                        Pay anyone,{' '}
                        <GradientText>instantly.</GradientText>
                    </motion.h1>

                    <motion.p
                        initial="hidden"
                        animate="visible"
                        custom={2}
                        variants={fadeUp}
                        className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
                    >
                        Blink Pay makes peer-to-peer payments effortless. Split bills, send money,
                        and settle up — all in one place.
                    </motion.p>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        custom={3}
                        variants={fadeUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button
                            size="lg"
                            onClick={() => navigate('/signup')}
                            className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold px-8 h-12 text-base shadow-lg shadow-[#00D4B8]/20 cursor-pointer"
                        >
                            Get Started — It's Free
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate('/about')}
                            className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary h-12 px-8 text-base cursor-pointer"
                        >
                            Learn More
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* ── Features Strip ────────────────────────────────────── */}
            <section className="px-6 py-20 bg-card/50 border-y border-border">
                <div className="max-w-screen-lg mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                            Everything you need to{' '}
                            <GradientText>move money fast</GradientText>
                        </h2>
                        <p className="text-muted-foreground text-base max-w-lg mx-auto">
                            Three powerful ways to handle payments with friends and family.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                            >
                                <FeatureCard {...feature} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ────────────────────────────────────────── */}
            <section className="px-6 py-24 text-center">
                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Ready to <GradientText>blink?</GradientText>
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            Join early access and start sending money the smart way.
                        </p>
                        <Button
                            size="lg"
                            onClick={() => navigate('/signup')}
                            className="bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold px-10 h-12 text-base shadow-lg shadow-[#00D4B8]/20 cursor-pointer"
                        >
                            Create Your Free Account
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────────── */}
            <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Blink Pay. Built for speed.</p>
            </footer>
        </div>
    )
}
