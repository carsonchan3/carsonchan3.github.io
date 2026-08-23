import { Mail, MapPin, Phone } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { toast } from "sonner";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TurnstileField } from "@/components/TurnstileField";
import { trpc } from "@/lib/trpc";
import { publicContactEmail, publicContactEmailHref } from "@/lib/contactDetails";
import { isStaticEnquiryHost, submitStaticEnquiry } from "@/lib/staticEnquiry";

const initialFormData = {
  name: "",
  email: "",
  company: "",
  sport: "",
  organizationType: "",
  message: "",
  website: "",
};

export default function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const contactMutation = trpc.contact.submit.useMutation();
  const usesStaticEnquiries = isStaticEnquiryHost();

  const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (usesStaticEnquiries && !turnstileToken) {
      toast.error("Please complete the spam-protection check.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (usesStaticEnquiries) {
        await submitStaticEnquiry({
          kind: "general",
          name: formData.name,
          email: formData.email,
          organisation: formData.company || undefined,
          organisationType: formData.organizationType || undefined,
          message: formData.message,
          website: formData.website || undefined,
          payload: { areaOfInterest: formData.sport || undefined },
          turnstileToken,
        });
      } else {
        await contactMutation.mutateAsync({
          name: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          sport: formData.sport || undefined,
          organizationType: formData.organizationType || undefined,
          message: formData.message,
          website: formData.website || undefined,
        });
      }
      toast.success("Enquiry received. Our team will contact you within one business day.");
      setFormData(initialFormData);
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error("Failed to send enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader active="contact" />
      <main data-reveal-page className="pt-16">
        <section data-testid="contact-page-hero" className="relative overflow-hidden border-b border-white/10 bg-[#1C1D20] py-16 md:py-24">
          <div className="absolute inset-0 opacity-10"><svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="contact-grid" width="40" height="40" patternUnits="userSpaceOnUse"><polygon points="20,0 40,20 20,40 0,20" fill="none" stroke="#40E0D0" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#contact-grid)" /></svg></div>
          <div className="container relative z-10"><div data-reveal className="reveal-up max-w-3xl"><div className="mb-5 h-1 w-12 bg-accent" /><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Contact VLI</p><h1 className="velocity-headline mb-5 text-white">Let’s build the right next step.</h1><p className="max-w-2xl text-lg leading-8 text-white/70">Whether you are evaluating Smart Referee, planning a drone programme, or need specialist support, share the details and we will help define the right route.</p></div></div>
        </section>

        <section className="velocity-section bg-black">
          <div className="container"><div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <aside data-reveal className="reveal-up space-y-8 lg:pt-4">
              <div><p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">Direct contact</p><h2 className="velocity-subheading text-white">Start with the channel that suits you.</h2></div>
              <div className="space-y-6">
                <div className="flex items-start gap-4"><Mail className="mt-1 size-6 shrink-0 text-accent" /><div><h3 className="mb-1 font-semibold text-white">Email</h3><a href={publicContactEmailHref} className="text-white/70 transition-colors hover:text-accent">{publicContactEmail}</a></div></div>
                <div className="flex items-start gap-4"><Phone className="mt-1 size-6 shrink-0 text-accent" /><div><h3 className="mb-1 font-semibold text-white">Phone</h3><a href="tel:+85266507520" className="text-white/70 transition-colors hover:text-accent">+852 66507520</a></div></div>
                <div className="flex items-start gap-4"><MapPin className="mt-1 size-6 shrink-0 text-accent" /><div><h3 className="mb-1 font-semibold text-white">Location</h3><p className="text-white/70">Hong Kong, China</p></div></div>
              </div>
              <div className="rounded-lg border border-accent/25 bg-accent/10 p-5"><p className="text-sm font-semibold text-white">What happens next</p><p className="mt-2 text-sm leading-6 text-white/70">Our team reviews each enquiry and responds within one business day with the appropriate next step.</p></div>
            </aside>

            <form data-reveal data-testid="contact-enquiry-form" onSubmit={handleFormSubmit} className="reveal-up rounded-lg border border-white/10 bg-[#27282B] p-5 shadow-2xl sm:p-7" style={{ transitionDelay: "90ms" }}>
              <div className="mb-6"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Tell us about your project</p><p className="mt-2 text-white/65">Required fields are marked with an asterisk.</p></div>
              <input name="website" value={formData.website} onChange={handleFormChange} tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2"><Input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleFormChange} className="border-white/20 bg-black/20 text-white placeholder:text-white/50" required /><Input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleFormChange} className="border-white/20 bg-black/20 text-white placeholder:text-white/50" required /></div>
                <Input type="text" name="company" placeholder="Company (Optional)" value={formData.company} onChange={handleFormChange} className="border-white/20 bg-black/20 text-white placeholder:text-white/50" />
                <div className="grid gap-4 md:grid-cols-2"><select name="sport" value={formData.sport} onChange={handleFormChange} aria-label="Area of interest" className="h-10 w-full rounded-md border border-white/20 bg-black/20 px-3 text-sm text-white outline-none transition-colors focus:border-accent [&>option]:bg-black [&>option]:text-white"><option value="">Area of interest (Optional)</option><option value="Drone sports">Drone sports referee</option><option value="Research / technology">Drone equipment</option><option value="Other sports">Technical services</option><option value="Other">Other</option></select><select name="organizationType" value={formData.organizationType} onChange={handleFormChange} aria-label="Organization type" className="h-10 w-full rounded-md border border-white/20 bg-black/20 px-3 text-sm text-white outline-none transition-colors focus:border-accent [&>option]:bg-black [&>option]:text-white"><option value="">Organization type (Optional)</option><option value="Sports league or association">Sports league or association</option><option value="Event organizer">Event organizer</option><option value="Technology company">Technology company</option><option value="School or university">School or university</option><option value="Other organization">Other organization</option></select></div>
                <Textarea name="message" placeholder="Tell us about your needs..." value={formData.message} onChange={handleFormChange} className="min-h-36 border-white/20 bg-black/20 text-white placeholder:text-white/50" required />
                {usesStaticEnquiries ? <TurnstileField resetKey={turnstileResetKey} onToken={setTurnstileToken} onError={() => toast.error("Spam protection could not load. Please refresh and try again.")} /> : null}
                <p className="text-sm text-white/55">Our team will review your details and reply within one business day.</p>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-accent font-semibold text-black hover:opacity-90">{isSubmitting ? "Sending..." : "Send enquiry"}</Button>
              </div>
            </form>
          </div></div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
