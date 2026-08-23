import { Loader2 } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { buildPricingRequestMessage, getPricingSelectionLabel, pricingTiers, type PricingTierId } from "@/lib/pricingConfig";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TurnstileField } from "@/components/TurnstileField";
import { isStaticEnquiryHost, submitStaticEnquiry } from "@/lib/staticEnquiry";

type PricingRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tierId: PricingTierId;
  onTierChange: (tierId: PricingTierId) => void;
};

const initialFormData = {
  name: "",
  email: "",
  company: "",
  sport: "",
  organizationType: "",
  message: "",
  website: "",
};

export default function PricingRequestDialog({
  open,
  onOpenChange,
  tierId,
  onTierChange,
}: PricingRequestDialogProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const contactMutation = trpc.contact.submit.useMutation();
  const selectedOption = getPricingSelectionLabel(tierId);
  const usesStaticEnquiries = isStaticEnquiryHost();

  const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    if (usesStaticEnquiries && !turnstileToken) {
      toast.error("Please complete the spam-protection check.");
      return;
    }

    setIsSubmitting(true);
    try {
      const message = buildPricingRequestMessage(tierId, formData.message);
      if (usesStaticEnquiries) {
        await submitStaticEnquiry({
          kind: "smart-referee-pricing",
          name: formData.name,
          email: formData.email,
          organisation: formData.company || undefined,
          organisationType: formData.organizationType || undefined,
          selectedPackage: selectedOption,
          message,
          website: formData.website || undefined,
          payload: { tierId, sport: formData.sport || undefined },
          turnstileToken,
        });
      } else {
        await contactMutation.mutateAsync({
          name: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          sport: formData.sport || undefined,
          organizationType: formData.organizationType || undefined,
          message,
          website: formData.website || undefined,
        });
      }
      toast.success("Pricing request received. Our team will follow up with a tailored quote.");
      setFormData(initialFormData);
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
      onOpenChange(false);
    } catch {
      toast.error("We could not send the pricing request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="pricing-request-dialog" className="max-h-[88vh] overflow-y-auto border-white/10 bg-[#1C1D20] text-white [&>button]:text-white/65 [&>button:hover]:text-white sm:max-w-2xl">
        <DialogHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Pricing request</p>
          <DialogTitle className="text-2xl text-white">Get pricing for your setup</DialogTitle>
          <DialogDescription className="text-white/65">Confirm the event package, then tell us about your event. The selected package is included with your request.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <input name="website" value={formData.website} onChange={handleFormChange} tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="mb-3 text-sm font-semibold text-white">Selected package</p>
            <div>
              <label className="grid gap-2 text-sm font-medium text-white/75">
                Event package
                <select name="pricingTier" value={tierId} onChange={(event) => onTierChange(event.target.value as PricingTierId)} className="h-10 rounded-md border border-white/15 bg-black/20 px-3 text-white outline-none transition-colors focus:border-accent [&>option]:bg-black [&>option]:text-white">
                  {pricingTiers.map((tier) => <option key={tier.id} value={tier.id}>{tier.name}</option>)}
                </select>
              </label>
            </div>
            <p data-testid="pricing-selection-summary" className="mt-3 text-sm font-semibold text-accent">{selectedOption}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-white/75">Name *<Input name="name" value={formData.name} onChange={handleFormChange} required className="border-white/15 bg-black/20 text-white placeholder:text-white/45" /></label>
            <label className="grid gap-2 text-sm font-medium text-white/75">Email *<Input name="email" type="email" value={formData.email} onChange={handleFormChange} required className="border-white/15 bg-black/20 text-white placeholder:text-white/45" /></label>
            <label className="grid gap-2 text-sm font-medium text-white/75">
              Organisation
              <Input name="company" value={formData.company} onChange={handleFormChange} className="border-white/15 bg-black/20 text-white placeholder:text-white/45" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-white/75">
              Organisation type
              <select name="organizationType" value={formData.organizationType} onChange={handleFormChange} className="h-10 rounded-md border border-white/15 bg-black/20 px-3 text-white outline-none transition-colors focus:border-accent [&>option]:bg-black [&>option]:text-white">
                <option value="">Select one</option>
                <option value="Event organizer">Event organizer</option>
                <option value="Drone club">Drone club</option>
                <option value="Education provider">Education provider</option>
                <option value="Research team">Research team</option>
                <option value="Other">Other</option>
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-white/75">
            Sport or use case
            <select name="sport" value={formData.sport} onChange={handleFormChange} className="h-10 rounded-md border border-white/15 bg-black/20 px-3 text-white outline-none transition-colors focus:border-accent [&>option]:bg-black [&>option]:text-white">
              <option value="">Select one</option>
              <option value="Drone soccer">Drone soccer</option>
              <option value="RoboCon competition">RoboCon competition</option>
              <option value="Ground truth">Ground truth</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-white/75">Tell us about your venue, event timeline, and what you need to review *<Textarea name="message" value={formData.message} onChange={handleFormChange} required className="min-h-28 border-white/15 bg-black/20 text-white placeholder:text-white/45" /></label>

          {usesStaticEnquiries ? <TurnstileField resetKey={turnstileResetKey} onToken={setTurnstileToken} onError={() => toast.error("Spam protection could not load. Please refresh and try again.")} /> : null}

          <Button type="submit" disabled={isSubmitting} className="w-full bg-accent font-semibold text-black hover:opacity-90">
            {isSubmitting ? <><Loader2 className="mr-2 size-4 animate-spin" /> Sending request</> : "Get Pricing"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
