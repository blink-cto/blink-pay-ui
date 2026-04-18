import { motion } from 'framer-motion'
import { GradientText } from '@/components/GradientText'
import { Zap, Shield, Users } from 'lucide-react'

const values = [
    {
        icon: Zap,
        title: 'Speed first',
        description: 'Every design decision is made with speed in mind. Payments settle in seconds, not business days.',
        color: 'text-[#00D4B8]',
        bg: 'bg-[#00D4B8]/10',
    },
    {
        icon: Shield,
        title: 'Built secure',
        description: 'End-to-end encryption and JWT-based auth keep your money and data protected at every step.',
        color: 'text-[#9B6DFF]',
        bg: 'bg-[#9B6DFF]/10',
    },
    {
        icon: Users,
        title: 'People-centred',
        description: 'Splitting a bill or settling a debt should feel effortless. We built Blink Pay so it does.',
        color: 'text-[#FF2D78]',
        bg: 'bg-[#FF2D78]/10',
    },
]

const team = [
    { name: 'Mohamed Asmall', role: 'Co-founder & CEO', img: null },
    { name: 'Ammaar Peerbhai', role: 'Co-founder & CTO', img: null },
]

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    }),
}

export default function AboutPage() {
    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-[#9B6DFF]/6 blur-[100px]" />
                </div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-sm font-medium text-[#00D4B8] uppercase tracking-widest mb-4"
                    >
                        Our story
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
                        className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6"
                    >
                        We're building the <GradientText>future of payments</GradientText>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
                        className="text-lg text-muted-foreground leading-relaxed"
                    >
                        Blink Pay was started with one belief — sending money between friends should be as
                        simple as sending a message. Replace this with your actual founding story.
                    </motion.p>
                </div>
            </section>

            {/* Values */}
            <section className="px-6 py-20 bg-card/40">
                <div className="max-w-screen-lg mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-foreground mb-3">What we stand for</h2>
                        <p className="text-muted-foreground">The principles behind every decision we make.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                className="rounded-2xl bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                            >
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${v.bg}`}>
                                    <v.icon className={`w-5 h-5 ${v.color}`} />
                                </div>
                                <h3 className="text-foreground font-semibold text-lg mb-2">{v.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="px-6 py-20">
                <div className="max-w-screen-lg mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-foreground mb-3">The team</h2>
                        <p className="text-muted-foreground">The people building Blink Pay.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2le gap-8 max-w-2xl mx-auto">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                className="flex flex-col items-center text-center gap-3"
                            >
                                {/* Avatar placeholder */}
                                <div className="w-20 h-20 rounded-2xl bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-center text-2xl text-muted-foreground">
                                    {member.img
                                        ? <img src={member.img} alt={member.name} className="w-full h-full object-cover rounded-2xl" />
                                        : <span className="text-3xl">👤</span>
                                    }
                                </div>
                                <div>
                                    <div className="font-semibold text-foreground">{member.name}</div>
                                    <div className="text-sm text-muted-foreground">{member.role}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer nudge */}
            <section className="border-t border-border/40 px-6 py-10 text-center">
                <p className="text-muted-foreground text-sm">
                    Want to join us?{' '}
                    <a href="mailto:hello@blinkpay.co.za" className="text-[#00D4B8] hover:underline">
                        Say hello.
                    </a>
                </p>
            </section>
        </div>
    )
}
