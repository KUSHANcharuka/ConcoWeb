"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CreditCard,
  Lock,
  CheckCircle2,
  Loader2,
  Building2,
  User,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Check
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface CheckoutProduct {
  name: string
  priceType: "one-off" | "per-seat" | "flat-monthly" | "custom"
  price: number
  maintenancePrice?: number
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  products: CheckoutProduct[]
  seats: number
  isAnnual: boolean
  seatDiscountPercent: number
  bundleDiscountPercent: number
}

export function CheckoutModal({
  isOpen,
  onClose,
  products,
  seats,
  isAnnual,
  seatDiscountPercent,
  bundleDiscountPercent
}: CheckoutModalProps) {
  const [checkoutState, setCheckoutState] = useState<"form" | "processing" | "success">("form")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

  // Calculations
  const calculations = React.useMemo(() => {
    let oneOffTotal = 0
    let flatMonthlyTotal = 0
    let perSeatUserRateSum = 0
    let annualMaintenanceTotal = 0

    products.forEach((p) => {
      if (p.priceType === "one-off") {
        oneOffTotal += p.price
        if (p.maintenancePrice) {
          annualMaintenanceTotal += p.maintenancePrice
        }
      } else if (p.priceType === "flat-monthly") {
        flatMonthlyTotal += p.price
      } else if (p.priceType === "per-seat") {
        // If it's a per-seat product, e.g., BuildMonitor is $100/yr (we can represent as $8.33/mo or direct yearly)
        // For simplicity, let's treat the inputs as monthly values:
        perSeatUserRateSum += p.price
      }
    })

    // Apply seat discount only on the per-seat rate sum
    const discountedPerSeatRate = perSeatUserRateSum * (1 - seatDiscountPercent / 100)
    const perSeatMonthlySubtotal = Math.round(discountedPerSeatRate * seats)

    // Total monthly recurring (flat monthly + per-seat monthly)
    const monthlyRecurringSubtotal = flatMonthlyTotal + perSeatMonthlySubtotal

    // Apply bundle discount on ALL recurring fees and one-off fees
    const finalMonthlyRecurring = Math.round(monthlyRecurringSubtotal * (1 - bundleDiscountPercent / 100))
    const finalOneOff = Math.round(oneOffTotal * (1 - bundleDiscountPercent / 100))
    const finalAnnualMaintenance = Math.round(annualMaintenanceTotal * (1 - bundleDiscountPercent / 100))

    return {
      oneOffTotal: finalOneOff,
      monthlyRecurring: finalMonthlyRecurring,
      annualMaintenance: finalAnnualMaintenance,
      perSeatSubtotal: perSeatMonthlySubtotal,
      flatMonthlySubtotal: flatMonthlyTotal,
      hasPerSeat: perSeatUserRateSum > 0,
      hasOneOff: oneOffTotal > 0,
      hasFlatMonthly: flatMonthlyTotal > 0
    }
  }, [products, seats, seatDiscountPercent, bundleDiscountPercent])

  const handleClose = () => {
    setTimeout(() => {
      setCheckoutState("form")
      setName("")
      setEmail("")
      setCompany("")
      setCardNumber("")
      setCardExpiry("")
      setCardCvc("")
    }, 300)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCheckoutState("processing")

    setTimeout(() => {
      setCheckoutState("success")
    }, 2000)
  }

  // Format credit card input
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    const formatted = value.slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ")
    setCardNumber(formatted)
  }

  // Format expiry input
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    let formatted = value.slice(0, 4)
    if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`
    }
    setCardExpiry(formatted)
  }

  // Format CVC input
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setCardCvc(value.slice(0, 3))
  }

  const hasRecurring = calculations.monthlyRecurring > 0
  const totalImmediateDue = calculations.oneOffTotal + (hasRecurring ? calculations.monthlyRecurring : 0)

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent className="sm:max-w-5xl lg:max-w-6xl p-0 overflow-hidden border border-border/80 shadow-2xl rounded-3xl bg-background">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full min-h-[550px]">
          
          {/* Left Column: Summary (6/12 width on md) */}
          <div className="md:col-span-6 bg-zinc-50 dark:bg-zinc-900/50 p-6 border-b md:border-b-0 md:border-r border-border flex flex-col justify-between overflow-y-auto max-h-[580px]">
            <div>
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Order Summary</h3>
              <h2 className="text-xl font-bold text-foreground mb-4">Concolabs Custom Bundle</h2>

              {/* Selected Products List */}
              <div className="mb-6 space-y-3">
                <h4 className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Selected Tools ({products.length})</h4>
                <ul className="space-y-2 border-b border-border/60 pb-3">
                  {products.map((prod, idx) => (
                    <li key={idx} className="flex justify-between items-start text-xs font-semibold">
                      <span className="text-foreground/90 flex items-start gap-1.5 pr-2">
                        <Check className="w-3.5 h-3.5 text-lime shrink-0 stroke-[3] mt-0.5" />
                        <span className="leading-tight">{prod.name}</span>
                      </span>
                      <span className="text-muted-foreground whitespace-nowrap text-right text-[11px]">
                        {prod.priceType === "one-off" ? (
                          `$${prod.price.toLocaleString()} one-off`
                        ) : prod.priceType === "flat-monthly" ? (
                          `$${prod.price}/mo flat`
                        ) : prod.priceType === "per-seat" ? (
                          `$${prod.price}/user/mo`
                        ) : (
                          "R&D Custom"
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Order breakdown */}
              <div className="space-y-2 text-xs border-b border-border/60 pb-4">
                {calculations.hasPerSeat && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Seats (User License)</span>
                    <span className="text-foreground font-semibold">{seats} seats</span>
                  </div>
                )}
                
                {seatDiscountPercent > 0 && calculations.hasPerSeat && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                    <span>Seat Discount</span>
                    <span>-{seatDiscountPercent}%</span>
                  </div>
                )}

                {bundleDiscountPercent > 0 && (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                    <span>Bundle Discount</span>
                    <span>-{bundleDiscountPercent}%</span>
                  </div>
                )}
              </div>

              {/* Detailed Cost Breakdown Ledger */}
              <div className="space-y-2 text-xs pt-4">
                {calculations.hasOneOff && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>One-Time Licensing Cost</span>
                    <span className="text-foreground font-bold">${calculations.oneOffTotal.toLocaleString()}</span>
                  </div>
                )}

                {calculations.hasOneOff && calculations.annualMaintenance > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Annual Maintenance Fee</span>
                    <span className="text-foreground font-bold">${calculations.annualMaintenance.toLocaleString()}/yr</span>
                  </div>
                )}

                {hasRecurring && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Recurring Monthly Cost</span>
                    <span className="text-foreground font-bold">${calculations.monthlyRecurring.toLocaleString()}/mo</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border/60">
              <div className="flex justify-between items-baseline mb-2">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">Total Immediate Due</span>
                  <span className="text-[10px] text-muted-foreground">Includes one-off + first month recurring</span>
                </div>
                <span className="text-2xl font-extrabold text-foreground tracking-tight">
                  ${totalImmediateDue.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-muted-foreground/60" />
                256-bit SSL encrypted connection
              </p>
            </div>
          </div>

          {/* Right Column: Checkout Interactive Steps (6/12 width on md) */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-center bg-white dark:bg-background">
            <AnimatePresence mode="wait">
              {checkoutState === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full justify-between"
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground tracking-tight mb-1">Billing Details</h3>
                      <p className="text-xs text-muted-foreground mb-4">Complete your credentials to configure and register your Concolabs portal.</p>
                    </div>

                    <div className="space-y-3">
                      {/* Name input */}
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/50" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full Name"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-border/80 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime text-xs rounded-xl text-foreground"
                        />
                      </div>

                      {/* Email input */}
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/50" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Work Email"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-border/80 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime text-xs rounded-xl text-foreground"
                        />
                      </div>

                      {/* Company input */}
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/50" />
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Company Name"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-border/80 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime text-xs rounded-xl text-foreground"
                        />
                      </div>

                      {/* Card Number input */}
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/50" />
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="Card Number"
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-border/80 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime text-xs rounded-xl text-foreground"
                        />
                      </div>

                      {/* Expiry & CVC grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-border/80 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime text-xs rounded-xl text-foreground text-center"
                        />
                        <input
                          type="text"
                          required
                          value={cardCvc}
                          onChange={handleCvcChange}
                          placeholder="CVC"
                          className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-border/80 focus:border-lime focus:outline-none focus:ring-1 focus:ring-lime text-xs rounded-xl text-foreground text-center"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button type="submit" className="w-full py-5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2">
                        Activate Licenses & Workspaces
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {checkoutState === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <Loader2 className="w-12 h-12 text-lime animate-spin mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">Processing Secure Payment</h3>
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                    Please hold on while we verify your credit card details and set up your workspace subscription...
                  </p>
                </motion.div>
              )}

              {checkoutState === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="flex flex-col items-center justify-center text-center py-4"
                >
                  <div className="w-14 h-14 bg-lime/10 border border-lime/30 rounded-full flex items-center justify-center mb-4 relative">
                    <CheckCircle2 className="w-8 h-8 text-foreground fill-lime stroke-[2.5]" />
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-lime/50"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.4, opacity: 0 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                    />
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight">Setup Completed!</h3>
                  <p className="text-xs text-muted-foreground max-w-xs mb-4 leading-relaxed">
                    Welcome to Concolabs! Your order has been completed and your workspaces are ready for onboarding.
                  </p>

                  <div className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-border/80 rounded-2xl p-4 mb-5 text-left space-y-2">
                    <div className="flex justify-between text-[11px] border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Order ID</span>
                      <span className="font-semibold text-foreground font-mono">CCL-{(100000 + Math.floor(Math.random() * 900000))}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Workspace Seats</span>
                      <span className="font-semibold text-foreground">{seats} Seats</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Immediate Paid</span>
                      <span className="font-semibold text-foreground">${totalImmediateDue.toLocaleString()}</span>
                    </div>
                    {calculations.monthlyRecurring > 0 && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Ongoing Recurring</span>
                        <span className="font-semibold text-foreground">${calculations.monthlyRecurring.toLocaleString()}/month</span>
                      </div>
                    )}
                  </div>

                  <Button onClick={handleClose} className="w-full py-5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Enter Concolabs Workspace
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
