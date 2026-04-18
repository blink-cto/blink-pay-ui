import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, MapPin } from 'lucide-react'
import { GradientText } from '@/components/GradientText'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const contactItems = [
    {
        icon: Mail,
        label: 'Email us',
        value: 'hello@blinkpay.co.za',
        href: 'mailto:hello@blinkpay.co.za',
        color: 'text-[#00D4B8]',
        bg: 'bg-[#00D4B8]/10',
    },
    {
        icon: MessageSquare,
        label: 'Support',
        value: 'support@blinkpay.co.za',
        href: 'mailto:support@blinkpay.co.za',
        color: 'text-[#9B6DFF]',
        bg: 'bg-[#9B6DFF]/10',
    },
    {
        icon: MapPin,
        label: 'Based in',
        value: 'Johannesburg, South Africa',
        href: null,
        color: 'text-[#FF2D78]',
        bg: 'bg-[#FF2D78]/10',
    },
]

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [sent, setSent] = useState(false)

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        // Wire up to your backend / email service when ready
        setSent(true)
    }

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="relative px-6 pt-24 pb-16 text-center overflow-hidden">
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] rounded-full bg-[#00D4B8]/5 blur-[80px]" />
                </div>
                <div className="relative z-10 max-w-xl mx-auto">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="text-sm font-medium text-[#00D4B8] uppercase tracking-widest mb-4"
                    >
                        Get in touch
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
                        className="text-5xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-5"
                    >
                        Let's <GradientText>talk</GradientText>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
                        className="text-lg text-muted-foreground leading-relaxed"
                    >
                        Have a question, a partnership idea, or just want to say hi? We'd love to hear from you.
                    </motion.p>
                </div>
            </section>

            {/* Contact info + form */}
            <section className="px-6 py-16">
                <div className="max-w-screen-md mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
                    {/* Left — contact details */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                        className="md:col-span-2 flex flex-col gap-6 justify-center"
                    >
                        {contactItems.map((item) => (
                            <div key={item.label} className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                                        {item.label}
                                    </div>
                                    {item.href ? (
                                        <a href={item.href} className="text-sm text-foreground hover:text-[#00D4B8] transition-colors no-underline">
                                            {item.value}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-foreground">{item.value}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Right — form */}
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                        className="md:col-span-3"
                    >
                        <div className="rounded-2xl bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_24px_rgba(0,0,0,0.3)]">
                            {sent ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                                    <div className="text-4xl">✉️</div>
                                    <h3 className="text-foreground font-semibold text-lg">Message sent!</h3>
                                    <p className="text-muted-foreground text-sm">We'll get back to you as soon as possible.</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                                        className="mt-2 border-white/10 text-muted-foreground hover:text-foreground cursor-pointer"
                                    >
                                        Send another
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={onSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-foreground">Name</Label>
                                            <Input
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder="Alice Smith"
                                                required
                                                className="bg-secondary/60 border-white/8 text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-foreground">Email</Label>
                                            <Input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                placeholder="you@example.com"
                                                required
                                                className="bg-secondary/60 border-white/8 text-foreground placeholder:text-muted-foreground focus-visible:ring-[#00D4B8]"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-foreground">Message</Label>
                                        <textarea
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            placeholder="Tell us what's on your mind..."
                                            required
                                            rows={5}
                                            className="w-full rounded-lg px-3 py-2 text-sm bg-secondary/60 border border-white/8 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00D4B8] focus:ring-offset-0 resize-none transition-colors"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-[#00D4B8] text-[#09090B] hover:bg-[#00BFA5] font-semibold h-11 shadow-md shadow-[#00D4B8]/20 cursor-pointer"
                                    >
                                        Send message
                                    </Button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            <footer className="border-t border-border/40 px-6 py-8 text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} Blink Pay. Built for speed.</p>
            </footer>
        </div>
    )
}
