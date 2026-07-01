"use client";

import { CreditCardIcon, ExternalLinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BillingPaymentMethodCard({
  accountName,
  accountNumberMask,
  bankName,
  imageUrl,
  instructions,
  isClientMode,
  label,
  methodType,
  paymentUrl,
  routingNumberMask,
}: {
  accountName: string | null;
  accountNumberMask: string | null;
  bankName: string | null;
  imageUrl: string | null;
  instructions: string | null;
  isClientMode: boolean;
  label: string;
  methodType: string;
  paymentUrl: string | null;
  routingNumberMask: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex aspect-[16/9] items-center justify-center bg-[linear-gradient(135deg,#f7f4eb,#ece8ff)]">
        {imageUrl ? (
          <img alt={label} className="h-full w-full object-cover" src={imageUrl} />
        ) : (
          <CreditCardIcon className="size-10 text-zinc-500" />
        )}
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <div className="text-lg font-semibold text-zinc-950">{label}</div>
          <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
            {methodType.replaceAll("_", " ")}
          </div>
        </div>

        <div className="space-y-2 text-sm leading-6 text-zinc-600">
          {bankName ? <div>{bankName}</div> : null}
          {accountName ? <div>{accountName}</div> : null}
          {accountNumberMask ? <div>Account: {accountNumberMask}</div> : null}
          {routingNumberMask ? <div>Routing: {routingNumberMask}</div> : null}
          {instructions ? <p>{instructions}</p> : null}
        </div>

        {paymentUrl ? (
          <Button asChild className="w-full" variant={isClientMode ? "default" : "outline"}>
            <a href={paymentUrl} rel="noreferrer" target="_blank">
              {methodType === "stripe_payment_link" ? "Open checkout" : "Open payment link"}
              <ExternalLinkIcon className="size-4" />
            </a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
