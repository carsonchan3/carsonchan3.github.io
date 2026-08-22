import { Loader2 } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ServiceEnquiryDialogProps = {
  service: string | null;
  onOpenChange: (open: boolean) => void;
};

const initialFormData = {
  name: "",
  email: "",
  company: "",
  organizationType: "",
  message: "",
  droneModel: "",
  faultSymptoms: "",
  priorRepairs: "",
  powerState: "",
  hasPhotos: false,
  website: "",
};

export default function ServiceEnquiryDialog({ service, onOpenChange }: ServiceEnquiryDialogProps) {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contactMutation = trpc.contact.submit.useMutation();
  const isOpen = Boolean(service);
  const isRepairService = service === "Drone Repair Service";

  useEffect(() => {
    if (service) setFormData(initialFormData);
  }, [service]);

  const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    const checked = event.target instanceof HTMLInputElement ? event.target.checked : undefined;
    setFormData((current) => ({ ...current, [name]: event.target instanceof HTMLInputElement && event.target.type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const repairIntakeComplete = formData.droneModel && formData.faultSymptoms.trim().length >= 10 && formData.priorRepairs && formData.powerState;
    if (!service || !formData.name || !formData.email || (!isRepairService && !formData.message) || (isRepairService && !repairIntakeComplete)) {
      toast.error(isRepairService ? "Please complete the repair intake checklist." : "Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await contactMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        company: formData.company || undefined,
        selectedService: service,
        organizationType: formData.organizationType || undefined,
        message: isRepairService ? [`Repair intake checklist`, `Drone model: ${formData.droneModel}`, `Fault symptoms: ${formData.faultSymptoms}`, `Previous repairs: ${formData.priorRepairs}`, `Power state: ${formData.powerState}`, `Photos available: ${formData.hasPhotos ? "Yes" : "No"}`, formData.message ? `Additional notes: ${formData.message}` : ""].filter(Boolean).join("\n") : formData.message,
        repairIntake: isRepairService ? {
          droneModel: formData.droneModel,
          faultSymptoms: formData.faultSymptoms,
          priorRepairs: formData.priorRepairs,
          powerState: formData.powerState,
          hasPhotos: formData.hasPhotos,
        } : undefined,
        website: formData.website || undefined,
      });
      toast.success("Service enquiry received. Our team will follow up with the next steps.");
      setFormData(initialFormData);
      onOpenChange(false);
    } catch {
      toast.error("We could not send the enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto border-white/10 bg-[#1C1D20] text-white sm:max-w-2xl">
        <DialogHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Service enquiry</p>
          <DialogTitle className="text-2xl text-white">Discuss this service</DialogTitle>
          <DialogDescription className="text-white/65">{isRepairService ? "Tell us about the repair issue and we will reply with mail-in instructions for assessment and quotation." : "Share the context for your request and we will follow up with a tailored next step."}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-5">
          <input name="website" value={formData.website} onChange={handleFormChange} tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
          <div className="rounded-lg border border-accent/25 bg-accent/10 p-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Selected service</p><p data-testid="selected-service-summary" className="mt-1 font-semibold text-white">{service}</p></div>
          {isRepairService ? <aside data-testid="repair-mail-in-guidance" className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/75"><p className="font-semibold text-white">Mail-in assessment and quotation</p><p className="mt-1">Please describe the issue first. We will provide mail-in instructions, assess the drone, and send a repair solution and quotation before work begins. Delivery fees can be waived if the proposed repair is accepted and completed.</p></aside> : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-white/75">Name *<Input name="name" value={formData.name} onChange={handleFormChange} required className="border-white/15 bg-black/20 text-white" /></label>
            <label className="grid gap-2 text-sm font-medium text-white/75">Email *<Input name="email" type="email" value={formData.email} onChange={handleFormChange} required className="border-white/15 bg-black/20 text-white" /></label>
            <label className="grid gap-2 text-sm font-medium text-white/75">Organisation<Input name="company" value={formData.company} onChange={handleFormChange} className="border-white/15 bg-black/20 text-white" /></label>
            <label className="grid gap-2 text-sm font-medium text-white/75">Organisation type<select data-testid="service-organization-type-select" name="organizationType" value={formData.organizationType} onChange={handleFormChange} className="h-10 rounded-md border border-white/15 bg-black/20 px-3 text-white outline-none transition-colors focus:border-accent [&>option]:bg-black [&>option]:text-white"><option value="">Select one</option><option value="Event organizer">Event organizer</option><option value="Drone club">Drone club</option><option value="Education provider">Education provider</option><option value="Research team">Research team</option><option value="Other">Other</option></select></label>
          </div>
          {isRepairService ? <fieldset data-testid="repair-intake-checklist" className="space-y-4 rounded-lg border border-accent/25 bg-accent/5 p-4"><legend className="px-1 text-sm font-semibold text-white">Repair intake checklist</legend><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium text-white/75">Drone model *<Input name="droneModel" value={formData.droneModel} onChange={handleFormChange} required className="border-white/15 bg-black/20 text-white" /></label><label className="grid gap-2 text-sm font-medium text-white/75">Previous repairs *<select name="priorRepairs" value={formData.priorRepairs} onChange={handleFormChange} required className="h-10 rounded-md border border-white/15 bg-black/20 px-3 text-white outline-none transition-colors focus:border-accent [&>option]:bg-black [&>option]:text-white"><option value="">Select one</option><option>No previous repairs</option><option>Previously repaired</option><option>Unknown</option></select></label><label className="grid gap-2 text-sm font-medium text-white/75 sm:col-span-2">Fault symptoms *<Textarea name="faultSymptoms" value={formData.faultSymptoms} onChange={handleFormChange} required className="min-h-24 border-white/15 bg-black/20 text-white" /></label><label className="grid gap-2 text-sm font-medium text-white/75">Power-up state *<select name="powerState" value={formData.powerState} onChange={handleFormChange} required className="h-10 rounded-md border border-white/15 bg-black/20 px-3 text-white outline-none transition-colors focus:border-accent [&>option]:bg-black [&>option]:text-white"><option value="">Select one</option><option>Powers on</option><option>Does not power on</option><option>Intermittent or unsure</option></select></label><label className="flex items-center gap-3 self-end rounded-md border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white/80"><input name="hasPhotos" type="checkbox" checked={formData.hasPhotos} onChange={handleFormChange} className="size-4 accent-[#40E0D0]" />I have photos available to share</label></div></fieldset> : null}
          <label className="grid gap-2 text-sm font-medium text-white/75">{isRepairService ? "Additional repair notes, flight history, or preferred outcome" : "Tell us what you need, your timeframe, and any relevant drone details *"}<Textarea name="message" value={formData.message} onChange={handleFormChange} required={!isRepairService} className="min-h-28 border-white/15 bg-black/20 text-white" /></label>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-accent font-semibold text-black hover:opacity-90">{isSubmitting ? <><Loader2 className="mr-2 size-4 animate-spin" />Sending enquiry</> : "Send service enquiry"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
