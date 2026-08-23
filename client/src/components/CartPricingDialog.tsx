import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TurnstileField } from "@/components/TurnstileField";
import { isStaticEnquiryHost, submitStaticEnquiry } from "@/lib/staticEnquiry";

export type CartPricingSelection = {
  sourceId: string;
  name: string;
  model: string;
  category: string;
  price: string;
  quantity: number;
};

type CartPricingDialogProps = {
  items: CartPricingSelection[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
};

const initialFormData = {
  name: "",
  email: "",
  company: "",
  organizationType: "",
  deliveryAddress: "",
  message: "",
  website: "",
};

export default function CartPricingDialog({ items, open, onOpenChange, onSubmitted }: CartPricingDialogProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const contactMutation = trpc.contact.submit.useMutation();
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const usesStaticEnquiries = isStaticEnquiryHost();

  useEffect(() => {
    if (open) {
      setFormData(initialFormData);
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
    }
  }, [open]);

  const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0 || !formData.name || !formData.email || !formData.deliveryAddress || !formData.message) {
      toast.error("Add at least one item and complete your name, email, delivery address, and quote notes.");
      return;
    }
    if (usesStaticEnquiries && !turnstileToken) {
      toast.error("Please complete the spam-protection check.");
      return;
    }

    setIsSubmitting(true);
    try {
      const cartItems = items.map((item) => ({
        sourceId: item.sourceId,
        name: item.name,
        model: item.model,
        category: item.category,
        price: item.price,
        quantity: item.quantity,
      }));
      if (usesStaticEnquiries) {
        await submitStaticEnquiry({
          kind: "product-pricing",
          name: formData.name,
          email: formData.email,
          organisation: formData.company || undefined,
          organisationType: formData.organizationType || undefined,
          message: `${formData.message}\n\nDelivery address:\n${formData.deliveryAddress}`,
          website: formData.website || undefined,
          payload: { cartItems, deliveryAddress: formData.deliveryAddress },
          turnstileToken,
        });
      } else {
        await contactMutation.mutateAsync({
          name: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          sport: "Research / technology",
          organizationType: formData.organizationType || undefined,
          deliveryAddress: formData.deliveryAddress,
          message: formData.message,
          website: formData.website || undefined,
          cartItems,
        });
      }
      toast.success("Pricing request received. Our team will review your cart and reply within one business day.");
      setFormData(initialFormData);
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
      onSubmitted();
      onOpenChange(false);
    } catch {
      toast.error("We could not send the pricing request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-white/10 bg-[#1C1D20] text-white sm:max-w-2xl">
        <DialogHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Product pricing request</p>
          <DialogTitle className="text-2xl text-white">Ask for pricing</DialogTitle>
          <DialogDescription className="text-white/65">Your selected quantities are included with this enquiry so our team can confirm pricing and availability.</DialogDescription>
        </DialogHeader>

        <form data-testid="cart-pricing-form" onSubmit={handleSubmit} className="mt-2 space-y-5">
          <input name="website" value={formData.website} onChange={handleFormChange} tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
          <div data-testid="cart-pricing-summary" className="rounded-lg border border-accent/25 bg-accent/10 p-4">
            <div className="flex items-baseline justify-between gap-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Your cart</p><p className="text-xs text-white/65">{items.length} item type{items.length === 1 ? "" : "s"} · {totalUnits} unit{totalUnits === 1 ? "" : "s"}</p></div>
            <ul className="mt-3 space-y-2">
              {items.map((item) => <li key={item.sourceId} className="flex justify-between gap-4 text-sm text-white"><span>{item.quantity} × {item.name}</span><span className="shrink-0 text-white/70">{item.price}</span></li>)}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-white/75">Name *<Input name="name" value={formData.name} onChange={handleFormChange} required className="border-white/15 bg-black/20 text-white" /></label>
            <label className="grid gap-2 text-sm font-medium text-white/75">Email *<Input name="email" type="email" value={formData.email} onChange={handleFormChange} required className="border-white/15 bg-black/20 text-white" /></label>
            <label className="grid gap-2 text-sm font-medium text-white/75">Organisation<Input name="company" value={formData.company} onChange={handleFormChange} className="border-white/15 bg-black/20 text-white" /></label>
            <label className="grid gap-2 text-sm font-medium text-white/75">Organisation type<select name="organizationType" value={formData.organizationType} onChange={handleFormChange} className="h-10 rounded-md border border-white/15 bg-black/20 px-3 text-white outline-none transition-colors focus:border-accent [&>option]:bg-black [&>option]:text-white"><option value="">Select one</option><option value="Event organizer">Event organizer</option><option value="Drone club">Drone club</option><option value="Education provider">Education provider</option><option value="Research team">Research team</option><option value="Other">Other</option></select></label>
          </div>
          <label className="grid gap-2 text-sm font-medium text-white/75">Delivery address *<Textarea data-testid="cart-pricing-delivery-address" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleFormChange} required placeholder="Street, district, city, and postal code" className="min-h-20 border-white/15 bg-black/20 text-white" /></label>
          <label className="grid gap-2 text-sm font-medium text-white/75">Quote notes, programme needs, and delivery timeframe *<Textarea name="message" value={formData.message} onChange={handleFormChange} required className="min-h-28 border-white/15 bg-black/20 text-white" /></label>
          {usesStaticEnquiries ? <TurnstileField resetKey={turnstileResetKey} onToken={setTurnstileToken} onError={() => toast.error("Spam protection could not load. Please refresh and try again.")} /> : null}
          <Button type="submit" disabled={isSubmitting || items.length === 0} className="w-full bg-accent font-semibold text-black hover:opacity-90">{isSubmitting ? <><Loader2 className="mr-2 size-4 animate-spin" />Sending request</> : "Ask for pricing"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
