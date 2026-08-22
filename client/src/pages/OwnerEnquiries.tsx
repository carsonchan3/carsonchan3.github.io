import DashboardLayout, { type DashboardNavigationItem } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { downloadCsv, downloadExcel } from "@/lib/catalogExport";
import { matchesCatalogSearch } from "@/lib/catalogFilters";
import { createProductFamilyId, isProductFamilyIdAvailable, resolveProductImageAlt } from "@/lib/productAdmin";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ClipboardList, Download, Inbox, Mail, Package, Search, ShieldAlert, Wrench, Edit3, Plus, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS = ["new", "in_review", "awaiting_customer", "quoted", "resolved", "closed"] as const;
type EnquiryStatus = (typeof STATUS_OPTIONS)[number];
type StatusFilter = EnquiryStatus | "all";

const navigation: DashboardNavigationItem[] = [
  { icon: Inbox, label: "Enquiries", path: "/owner" },
  { icon: Package, label: "Product Catalog", path: "/owner?tab=catalog" },
  { icon: Wrench, label: "Service Catalog", path: "/owner?tab=services" },
];

const statusLabels: Record<EnquiryStatus, string> = {
  new: "New",
  in_review: "In review",
  awaiting_customer: "Awaiting customer",
  quoted: "Quoted",
  resolved: "Resolved",
  closed: "Closed",
};

const statusClasses: Record<EnquiryStatus, string> = {
  new: "border-accent/40 bg-accent/10 text-accent",
  in_review: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  awaiting_customer: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  quoted: "border-violet-400/40 bg-violet-400/10 text-violet-200",
  resolved: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  closed: "border-white/20 bg-white/5 text-white/65",
};

const hasUsableImageUrl = (value: string) =>
  /^https:\/\/\S+$/i.test(value.trim()) || /^\/manus-storage\/[^/\s].+/.test(value.trim());

function formatDate(value: Date | string) {
  return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function OwnerEnquiries() {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const isOwner = user?.role === "admin";
  const utils = trpc.useUtils();
  const input = useMemo(() => ({ ...(status === "all" ? {} : { status }), ...(search.trim() ? { query: search.trim() } : {}) }), [search, status]);
  const enquiries = trpc.enquiries.list.useQuery(input, { enabled: isOwner });
  const updateStatus = trpc.enquiries.updateStatus.useMutation({
    onSuccess: async () => {
      await utils.enquiries.list.invalidate();
    },
  });

  const [activeTab, setActiveTab] = useState<"enquiries" | "catalog" | "services">(() => {
    if (typeof window === "undefined") return "enquiries";
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("tab") === "catalog") return "catalog";
    if (searchParams.get("tab") === "services") return "services";
    return "enquiries";
  });

  const body = loading ? (
    <div className="rounded-xl border border-white/10 bg-[#1C1D20] p-8 text-white/70">Checking account access…</div>
  ) : !user ? (
    <div className="rounded-xl border border-white/10 bg-[#1C1D20] p-8 text-white/70">Sign in to access the owner enquiry dashboard.</div>
  ) : !isOwner ? (
    <div className="rounded-xl border border-red-400/25 bg-red-400/10 p-8">
      <ShieldAlert className="mb-3 text-red-300" />
      <h1 className="text-xl font-semibold text-white">Owner access required</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">This dashboard is restricted to the website owner. Public enquiry data is not available to standard accounts.</p>
    </div>
  ) : (
    <div className="space-y-6">
      <div className="flex border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("enquiries")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === "enquiries" ? "border-accent text-accent" : "border-transparent text-white/65 hover:text-white"
          }`}
        >
          <Inbox size={16} /> Enquiries
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === "catalog" ? "border-accent text-accent" : "border-transparent text-white/65 hover:text-white"
          }`}
        >
          <Package size={16} /> Product Catalog
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("services")}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === "services" ? "border-accent text-accent" : "border-transparent text-white/65 hover:text-white"
          }`}
        >
          <Wrench size={16} /> Service Catalog
        </button>
      </div>
      {activeTab === "enquiries" ? (
        <EnquiryList
          status={status}
          setStatus={setStatus}
          search={search}
          setSearch={setSearch}
          data={enquiries.data}
          loading={enquiries.isLoading}
          error={enquiries.error?.message}
          updatingId={updateStatus.isPending ? updateStatus.variables?.id : undefined}
          onStatusChange={(id, nextStatus) => updateStatus.mutate({ id, status: nextStatus })}
        />
      ) : activeTab === "catalog" ? (
        <ProductCatalogManager />
      ) : (
        <ServiceCatalogManager />
      )}
    </div>
  );

  return <DashboardLayout navigation={navigation} title="VLI owner"><div className="min-h-[calc(100vh-2rem)] bg-[#111214] p-1 text-white md:p-5">{body}</div></DashboardLayout>;
}

type EnquiryListProps = {
  status: StatusFilter;
  setStatus: (status: StatusFilter) => void;
  search: string;
  setSearch: (value: string) => void;
  data: Array<{
    id: number;
    name: string;
    email: string;
    company: string | null;
    selectedService: string | null;
    message: string;
    status: EnquiryStatus;
    createdAt: Date;
    kind: "repair" | "product-pricing" | "service" | "general";
    cartItems: Array<{ name: string; model?: string; price: string; quantity: number }> | null;
    repairIntake: { droneModel?: string; faultSymptoms?: string; priorRepairs?: string; powerState?: string; hasPhotos?: boolean } | null;
  }> | undefined;
  loading: boolean;
  error?: string;
  updatingId?: number;
  onStatusChange: (id: number, status: EnquiryStatus) => void;
};

function EnquiryList({ status, setStatus, search, setSearch, data, loading, error, updatingId, onStatusChange }: EnquiryListProps) {
  const totals = useMemo(() => ({ all: data?.length ?? 0, new: data?.filter((entry) => entry.status === "new").length ?? 0, repair: data?.filter((entry) => entry.kind === "repair").length ?? 0 }), [data]);

  return <div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Owner workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">Enquiry command centre</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">Review general, service, repair, and product-pricing requests. Update only the status; the original submission remains preserved.</p></div><div className="grid grid-cols-3 gap-2 text-center text-xs"><Stat label="Visible" value={totals.all} /><Stat label="New" value={totals.new} /><Stat label="Repairs" value={totals.repair} /></div></header>
    <section className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#1C1D20] p-3 sm:flex-row sm:items-center"><label className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/45" /><Input aria-label="Search enquiries" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, service, or message" className="border-white/10 bg-black/20 pl-9 text-white placeholder:text-white/40" /></label><select aria-label="Filter enquiries by status" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} className="h-10 rounded-md border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-accent"><option value="all">All statuses</option>{STATUS_OPTIONS.map((option) => <option key={option} value={option}>{statusLabels[option]}</option>)}</select></section>
    {loading ? <div className="rounded-xl border border-white/10 bg-[#1C1D20] p-10 text-center text-white/65">Loading enquiries…</div> : error ? <div className="rounded-xl border border-red-400/25 bg-red-400/10 p-6 text-red-100">Unable to load enquiries: {error}</div> : data?.length === 0 ? <div className="rounded-xl border border-dashed border-white/15 bg-[#1C1D20] p-10 text-center"><ClipboardList className="mx-auto size-8 text-accent" /><h2 className="mt-3 font-semibold text-white">No matching enquiries</h2><p className="mt-1 text-sm text-white/60">New requests will appear here after a visitor submits a form.</p></div> : <div className="grid gap-4">{data?.map((entry) => <EnquiryCard key={entry.id} entry={entry} updating={updatingId === entry.id} onStatusChange={onStatusChange} />)}</div>}
  </div>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg border border-white/10 bg-[#1C1D20] px-3 py-2"><p className="text-lg font-bold text-white">{value}</p><p className="uppercase tracking-[0.12em] text-white/45">{label}</p></div>;
}

function EnquiryCard({ entry, updating, onStatusChange }: { entry: NonNullable<EnquiryListProps["data"]>[number]; updating: boolean; onStatusChange: (id: number, status: EnquiryStatus) => void }) {
  const icon = entry.kind === "repair" ? <Wrench className="size-4" /> : entry.kind === "product-pricing" ? <Package className="size-4" /> : <Mail className="size-4" />;
  return <article className="rounded-xl border border-white/10 bg-[#1C1D20] p-4 shadow-sm md:p-5"><div className="flex flex-col justify-between gap-4 md:flex-row"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Badge className="border border-white/10 bg-black/20 text-white/70 hover:bg-black/20">{icon}<span className="ml-1 capitalize">{entry.kind.replace("-", " ")}</span></Badge><Badge className={statusClasses[entry.status]}>{statusLabels[entry.status]}</Badge><span className="text-xs text-white/45">#{entry.id} · {formatDate(entry.createdAt)}</span></div><h2 className="mt-3 text-lg font-bold text-white">{entry.name}</h2><p className="mt-1 text-sm text-white/70"><a className="underline decoration-white/20 underline-offset-4 hover:text-accent" href={`mailto:${entry.email}`}>{entry.email}</a>{entry.company ? ` · ${entry.company}` : ""}</p></div><label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Tracking status<select aria-label={`Status for enquiry ${entry.id}`} disabled={updating} value={entry.status} onChange={(event) => onStatusChange(entry.id, event.target.value as EnquiryStatus)} className="h-10 min-w-44 rounded-md border border-white/10 bg-black/20 px-3 text-sm font-medium normal-case tracking-normal text-white outline-none focus:border-accent disabled:opacity-60">{STATUS_OPTIONS.map((option) => <option key={option} value={option}>{statusLabels[option]}</option>)}</select></label></div>{entry.selectedService ? <p className="mt-4 text-sm font-semibold text-accent">{entry.selectedService}</p> : null}<p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/75">{entry.message}</p>{entry.repairIntake ? <ContextPanel title="Repair intake" icon={<Wrench className="size-4" />}><dl className="grid gap-3 sm:grid-cols-2"><Detail label="Drone model" value={entry.repairIntake.droneModel} /><Detail label="Fault symptoms" value={entry.repairIntake.faultSymptoms} /><Detail label="Previous repairs" value={entry.repairIntake.priorRepairs} /><Detail label="Power state" value={entry.repairIntake.powerState} /><Detail label="Photos available" value={entry.repairIntake.hasPhotos ? "Yes" : "No"} /></dl></ContextPanel> : null}{entry.cartItems?.length ? <ContextPanel title="Product pricing cart" icon={<Package className="size-4" />}><ul className="space-y-1 text-sm text-white/75">{entry.cartItems.map((item, index) => <li key={`${item.name}-${index}`}>{item.quantity} × {item.name}{item.model ? ` (${item.model})` : ""} · {item.price}</li>)}</ul></ContextPanel> : null}</article>;
}

function ContextPanel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="mt-4 rounded-lg border border-accent/20 bg-accent/5 p-4"><p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">{icon}{title}</p>{children}</section>;
}

function Detail({ label, value }: { label: string; value?: string }) {
  return <div><dt className="text-xs uppercase tracking-[0.1em] text-white/45">{label}</dt><dd className="mt-1 text-sm leading-5 text-white/80">{value || "Not provided"}</dd></div>;
}

function ProductCatalogManager() {
  const utils = trpc.useUtils();
  const productsQuery = trpc.products.list.useQuery();
  const uploadImageMutation = trpc.upload.image.useMutation();
  const upsertMutation = trpc.products.upsert.useMutation({
    onSuccess: () => {
      utils.products.list.invalidate();
      setEditingFamilyId(null);
      toast.success("Product family saved successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save product family");
    },
  });

  const deleteProductMutation = trpc.products.delete.useMutation({
    onSuccess: async () => {
      toast.success("Product deleted successfully");
      await utils.products.list.invalidate();
    },
    onError: (err) => {
      toast.error(`Failed to delete product: ${err.message}`);
    },
  });

  const [editingFamilyId, setEditingFamilyId] = useState<string | null>(null);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formValues, setFormValues] = useState<{
    familyId: string;
    name: string;
    category: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    refNumber: string;
    variantsText: string;
  }>({ familyId: "", name: "", category: "", description: "", imageUrl: "", imageAlt: "", refNumber: "", variantsText: "" });

  const productCategories = useMemo(
    () => Array.from(new Set((productsQuery.data ?? []).map((product) => product.category))).sort(),
    [productsQuery.data],
  );
  const filteredProducts = useMemo(() => {
    const query = catalogSearch.trim().toLowerCase();
    return (productsQuery.data ?? []).filter((product) => {
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      return matchesCategory && matchesCatalogSearch(query, [product.name, product.category, product.description, product.refNumber, ...product.variants.flatMap((variant) => [variant.name, variant.model, variant.price])]);
    });
  }, [catalogSearch, categoryFilter, productsQuery.data]);
  const productExportRows = useMemo(
    () => filteredProducts.flatMap((product) => product.variants.map((variant) => ({
      "Reference": product.refNumber,
      "Family ID": product.familyId,
      "Product Name": product.name,
      "Category": product.category,
      "Description": product.description,
      "Variant Name": variant.name,
      "Variant Model": variant.model,
      "Price": variant.price,
      "Family Image URL": product.imageUrl,
      "Variant Image URL": variant.imageUrl ?? "",
      "Image Alt Text": product.imageAlt,
    }))),
    [filteredProducts],
  );
  const exportProducts = (format: "csv" | "xlsx") => {
    if (!productExportRows.length) {
      toast.error("There are no products in the current view to export.");
      return;
    }
    const date = new Date().toISOString().slice(0, 10);
    if (format === "csv") downloadCsv(productExportRows, `vli-products-${date}.csv`);
    else downloadExcel(productExportRows, `vli-products-${date}.xlsx`, "Products");
    toast.success(`Exported ${productExportRows.length} product variant${productExportRows.length === 1 ? "" : "s"}.`);
  };

  const startEdit = (product: NonNullable<typeof productsQuery.data>[number]) => {
    setEditingFamilyId(product.familyId);
    setFormValues({
      familyId: product.familyId,
      name: product.name,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl,
      imageAlt: product.imageAlt,
      refNumber: product.refNumber,
      variantsText: product.variants.map((v) => `${v.name}|${v.model}|${v.price}${v.imageUrl ? `|${v.imageUrl}` : ""}`).join("\n"),
    });
  };

  const startNew = () => {
    setEditingFamilyId("new");
    setFormValues({
      familyId: "",
      name: "",
      category: "Drone platform",
      description: "",
      imageUrl: "",
      imageAlt: "",
      refNumber: "1",
      variantsText: "RTF|TZ009|HK$3,000",
    });
  };

  const handleSave = () => {
    try {
      const name = formValues.name.trim();
      const familyId = formValues.familyId.trim() || createProductFamilyId(name);
      if (!name) throw new Error("Enter a product name before saving.");
      if (editingFamilyId === "new" && !isProductFamilyIdAvailable((productsQuery.data ?? []).map((product) => product.familyId), familyId)) {
        throw new Error("A product family with this ID already exists. Choose a different Family ID.");
      }
      if (!formValues.category.trim() || !formValues.description.trim() || !formValues.refNumber.trim()) {
        throw new Error("Category, description, and reference number are required.");
      }
      if (!hasUsableImageUrl(formValues.imageUrl)) {
        throw new Error("Upload an image or provide a valid HTTPS image URL before saving.");
      }
      const variants = formValues.variantsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const parts = line.split("|").map((p) => p.trim());
          if (parts.length < 3) throw new Error(`Invalid variant format: "${line}". Use Name|Model|HK$Price|ImageUrl`);
          return { name: parts[0], model: parts[1], price: parts[2], imageUrl: parts[3] || undefined };
        });
      if (!variants.length) throw new Error("At least one variant is required");

      upsertMutation.mutate({
        familyId,
        name,
        category: formValues.category.trim(),
        description: formValues.description.trim(),
        imageUrl: formValues.imageUrl.trim(),
        imageAlt: resolveProductImageAlt(formValues.imageAlt, name),
        refNumber: formValues.refNumber.trim(),
        variants,
      });
    } catch (err: any) {
      toast.error(err.message || "Invalid input");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Catalogue management</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">Product catalogue editor</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">Edit product families, variants, pricing, and descriptions directly. Changes reflect immediately on the public Product page.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportProducts("csv")} className="gap-1.5 border-white/20 text-white/80 hover:bg-white/10"><Download size={14} /> CSV</Button>
          <Button variant="outline" size="sm" onClick={() => exportProducts("xlsx")} className="gap-1.5 border-white/20 text-white/80 hover:bg-white/10"><Download size={14} /> Excel</Button>
          <Button onClick={startNew} className="gap-2 bg-accent text-black font-semibold hover:opacity-90"><Plus size={16} /> Add product family</Button>
        </div>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative block min-w-64">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
            <Input value={catalogSearch} onChange={(event) => setCatalogSearch(event.target.value)} placeholder="Search products, variants, models…" className="h-9 border-white/15 bg-black/25 pl-9 text-xs text-white placeholder:text-white/40" />
          </label>
          <select aria-label="Filter products by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="h-9 rounded-md border border-white/15 bg-black/25 px-3 text-xs text-white outline-none focus:border-accent">
            <option value="all">All categories</option>
            {productCategories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
        <p className="text-xs text-white/50">{filteredProducts.length} of {(productsQuery.data ?? []).length} product families shown</p>
      </div>

      {editingFamilyId !== null ? (
        <section className="rounded-lg border border-accent/30 bg-[#161719] p-4 shadow-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white">{editingFamilyId === "new" ? "Add new product family" : `Edit product family: ${formValues.name}`}</h2>
            <Button variant="ghost" size="sm" onClick={() => setEditingFamilyId(null)} className="text-white/70 hover:text-white h-8">Cancel</Button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Family ID (slug)
              <Input
                disabled={editingFamilyId !== "new"}
                value={formValues.familyId}
                onChange={(e) => setFormValues((c) => ({ ...c, familyId: e.target.value }))}
                placeholder="e.g. tops-shield-205"
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Product name
              <Input
                value={formValues.name}
                onChange={(e) => setFormValues((c) => ({ ...c, name: e.target.value, familyId: editingFamilyId === "new" && !c.familyId ? createProductFamilyId(e.target.value) : c.familyId }))}
                placeholder="e.g. TOPS Shield 205"
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Category
              <Input
                value={formValues.category}
                onChange={(e) => setFormValues((c) => ({ ...c, category: e.target.value }))}
                placeholder="e.g. Drone platform"
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Ref Number
              <Input
                value={formValues.refNumber}
                onChange={(e) => setFormValues((c) => ({ ...c, refNumber: e.target.value }))}
                placeholder="e.g. 25–26"
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60 sm:col-span-2">
              Family Image URL & Upload
              <div className="flex items-center gap-2">
                <Input
                  value={formValues.imageUrl}
                  onChange={(e) => setFormValues((c) => ({ ...c, imageUrl: e.target.value }))}
                  placeholder="/manus-storage/..."
                  className="h-9 border-white/15 bg-black/30 text-white text-xs flex-1"
                />
                <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent font-semibold text-xs shrink-0">
                  <span>{uploadImageMutation.isPending ? "Uploading..." : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadImageMutation.isPending}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async () => {
                        const resultStr = reader.result as string;
                        const base64Data = resultStr.includes(",") ? resultStr.split(",")[1] : resultStr;
                        try {
                          const res = await uploadImageMutation.mutateAsync({ filename: file.name, contentType: file.type || "image/png", base64Data });
                          setFormValues((c) => ({ ...c, imageUrl: res.url, imageAlt: resolveProductImageAlt(c.imageAlt, c.name) }));
                          toast.success("Image uploaded!");
                        } catch (err: any) {
                          toast.error(err?.message || "Upload failed");
                        }
                      };
                      reader.readAsDataURL(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60 sm:col-span-3">
              Description
              <Input
                value={formValues.description}
                onChange={(e) => setFormValues((c) => ({ ...c, description: e.target.value }))}
                placeholder="Short product description…"
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60 sm:col-span-3">
              Variants (One per line: <code className="text-accent">Name | Model | Price | Variant ImageUrl (optional)</code>)
              <textarea
                value={formValues.variantsText}
                onChange={(e) => setFormValues((c) => ({ ...c, variantsText: e.target.value }))}
                rows={3}
                placeholder="RTF | TZ009 | HK$3,330 | /manus-storage/rtf.png"
                className="rounded border border-white/15 bg-black/30 p-2 font-mono text-xs text-white outline-none focus:border-accent"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditingFamilyId(null)} className="text-white/70 hover:text-white h-8">Cancel</Button>
            <Button size="sm" disabled={upsertMutation.isPending} onClick={handleSave} className="gap-1.5 bg-accent text-black font-semibold hover:opacity-90 h-8">
              <Check size={14} /> {upsertMutation.isPending ? "Saving…" : "Save family"}
            </Button>
          </div>
        </section>
      ) : null}

      {productsQuery.isLoading ? (
        <div className="rounded-lg border border-white/10 bg-[#161719] p-6 text-center text-white/60 text-xs">Loading catalogue…</div>
      ) : productsQuery.error ? (
        <div className="rounded-lg border border-red-400/25 bg-red-400/10 p-4 text-red-100 text-xs">Unable to load: {productsQuery.error.message}</div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-[#161719] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="border-b border-white/10 bg-black/40 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                <tr>
                  <th className="p-3">Ref</th>
                  <th className="p-3">Product Family</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Variants</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredProducts.map((product) => (
                  <tr key={product.familyId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 font-mono text-white/50">#{product.refNumber}</td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{product.name}</div>
                      <div className="text-[11px] text-white/50 truncate max-w-xs">{product.description}</div>
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded border border-white/10 bg-black/20 text-accent text-[11px]">{product.category}</span>
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {product.variants.map((v, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px]">
                            <span className="font-medium text-white">{v.name} ({v.model})</span>
                            <span className="text-accent font-semibold">{v.price}</span>
                            {v.imageUrl && <span className="text-[9px] text-white/40 truncate max-w-[100px]" title={v.imageUrl}>[Variant Img]</span>}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(product)} className="h-7 px-2 text-xs text-accent hover:bg-accent/10">
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (window.confirm(`Delete "${product.name}"?`)) {
                            deleteProductMutation.mutate({ familyId: product.familyId });
                          }
                        }}
                        className="h-7 px-2 text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


function ServiceCatalogManager() {
  const utils = trpc.useUtils();
  const servicesQuery = trpc.services.list.useQuery();
  const uploadImageMutation = trpc.upload.image.useMutation();
  const upsertMutation = trpc.services.upsert.useMutation({
    onSuccess: () => {
      utils.services.list.invalidate();
      setEditingServiceId(null);
      toast.success("Service saved successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to save service");
    },
  });

  const deleteServiceMutation = trpc.services.delete.useMutation({
    onSuccess: async () => {
      toast.success("Service deleted successfully");
      await utils.services.list.invalidate();
    },
    onError: (err) => {
      toast.error(`Failed to delete service: ${err.message}`);
    },
  });

  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    serviceId: "",
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    imageAlt: "",
    duration: "",
    pricingText: "",
    details: "",
    displayOrder: 0,
  });
  const [serviceSearch, setServiceSearch] = useState("");
  const [durationFilter, setDurationFilter] = useState("all");
  const serviceDurations = useMemo(
    () => Array.from(new Set((servicesQuery.data ?? []).map((service) => service.duration))).sort(),
    [servicesQuery.data],
  );
  const filteredServices = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase();
    return (servicesQuery.data ?? []).filter((service) => {
      const matchesDuration = durationFilter === "all" || service.duration === durationFilter;
      return matchesDuration && matchesCatalogSearch(query, [service.title, service.subtitle, service.description, service.duration, service.pricingText, service.details]);
    });
  }, [durationFilter, serviceSearch, servicesQuery.data]);
  const serviceExportRows = useMemo(
    () => filteredServices.map((service) => ({
      "Display Order": service.displayOrder,
      "Service ID": service.serviceId,
      "Service Title": service.title,
      "Subtitle": service.subtitle,
      "Description": service.description,
      "Duration": service.duration,
      "Pricing Guidance": service.pricingText,
      "Scope Details": service.details,
      "Image URL": service.imageUrl,
      "Image Alt Text": service.imageAlt,
    })),
    [filteredServices],
  );
  const exportServices = (format: "csv" | "xlsx") => {
    if (!serviceExportRows.length) {
      toast.error("There are no services in the current view to export.");
      return;
    }
    const date = new Date().toISOString().slice(0, 10);
    if (format === "csv") downloadCsv(serviceExportRows, `vli-services-${date}.csv`);
    else downloadExcel(serviceExportRows, `vli-services-${date}.xlsx`, "Services");
    toast.success(`Exported ${serviceExportRows.length} service${serviceExportRows.length === 1 ? "" : "s"}.`);
  };

  const startNew = () => {
    setFormValues({
      serviceId: "",
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      imageAlt: "",
      duration: "",
      pricingText: "",
      details: "",
      displayOrder: 0,
    });
    setEditingServiceId("new");
  };

  const startEdit = (service: any) => {
    setFormValues({
      serviceId: service.serviceId,
      title: service.title,
      subtitle: service.subtitle,
      description: service.description,
      imageUrl: service.imageUrl,
      imageAlt: service.imageAlt,
      duration: service.duration,
      pricingText: service.pricingText,
      details: service.details,
      displayOrder: service.displayOrder ?? 0,
    });
    setEditingServiceId(service.serviceId);
  };

  const handleSave = () => {
    if (!hasUsableImageUrl(formValues.imageUrl)) {
      toast.error("Upload an image or provide a valid HTTPS image URL before saving.");
      return;
    }
    if (!formValues.serviceId || !formValues.title || !formValues.description) {
      toast.error("Service ID, title, and description are required");
      return;
    }
    upsertMutation.mutate(formValues);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Service management</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">Service catalogue editor</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">Manage professional services, pricing, durations, and scopes. Changes reflect immediately on the public Services page.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportServices("csv")} className="gap-1.5 border-white/20 text-white/80 hover:bg-white/10"><Download size={14} /> CSV</Button>
          <Button variant="outline" size="sm" onClick={() => exportServices("xlsx")} className="gap-1.5 border-white/20 text-white/80 hover:bg-white/10"><Download size={14} /> Excel</Button>
          <Button onClick={startNew} className="gap-2 bg-accent text-black font-semibold hover:opacity-90"><Plus size={16} /> Add service item</Button>
        </div>
      </header>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="relative block min-w-64">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
            <Input value={serviceSearch} onChange={(event) => setServiceSearch(event.target.value)} placeholder="Search services, scope, pricing…" className="h-9 border-white/15 bg-black/25 pl-9 text-xs text-white placeholder:text-white/40" />
          </label>
          <select aria-label="Filter services by duration" value={durationFilter} onChange={(event) => setDurationFilter(event.target.value)} className="h-9 rounded-md border border-white/15 bg-black/25 px-3 text-xs text-white outline-none focus:border-accent">
            <option value="all">All durations</option>
            {serviceDurations.map((duration) => <option key={duration} value={duration}>{duration}</option>)}
          </select>
        </div>
        <p className="text-xs text-white/50">{filteredServices.length} of {(servicesQuery.data ?? []).length} services shown</p>
      </div>

      {editingServiceId !== null ? (
        <section className="rounded-lg border border-accent/30 bg-[#161719] p-4 shadow-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-bold text-white">{editingServiceId === "new" ? "Add new service" : `Edit service: ${formValues.title}`}</h2>
            <Button variant="ghost" size="sm" onClick={() => setEditingServiceId(null)} className="text-white/70 hover:text-white h-8">Cancel</Button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Service ID (slug)
              <Input
                disabled={editingServiceId !== "new"}
                value={formValues.serviceId}
                onChange={(e) => setFormValues((c) => ({ ...c, serviceId: e.target.value }))}
                placeholder="e.g. drone-repair-service"
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Service Title
              <Input
                value={formValues.title}
                onChange={(e) => setFormValues((c) => ({ ...c, title: e.target.value }))}
                placeholder="e.g. Drone Repair Service"
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Subtitle
              <Input
                value={formValues.subtitle}
                onChange={(e) => setFormValues((c) => ({ ...c, subtitle: e.target.value }))}
                placeholder="e.g. Diagnostic & Repair"
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Duration
              <Input
                value={formValues.duration}
                onChange={(e) => setFormValues((c) => ({ ...c, duration: e.target.value }))}
                placeholder="e.g. 3–5 working days"
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Pricing Guidance
              <Input
                value={formValues.pricingText}
                onChange={(e) => setFormValues((c) => ({ ...c, pricingText: e.target.value }))}
                placeholder="e.g. Quotation first"
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Display Order
              <Input
                type="number"
                value={formValues.displayOrder}
                onChange={(e) => setFormValues((c) => ({ ...c, displayOrder: parseInt(e.target.value) || 0 }))}
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60 sm:col-span-2">
              Service Image URL & Upload
              <div className="flex items-center gap-2">
                <Input
                  value={formValues.imageUrl}
                  onChange={(e) => setFormValues((c) => ({ ...c, imageUrl: e.target.value }))}
                  placeholder="/manus-storage/..."
                  className="h-9 border-white/15 bg-black/30 text-white text-xs flex-1"
                />
                <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent font-semibold text-xs shrink-0">
                  <span>{uploadImageMutation.isPending ? "Uploading..." : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadImageMutation.isPending}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async () => {
                        const resultStr = reader.result as string;
                        const base64Data = resultStr.includes(",") ? resultStr.split(",")[1] : resultStr;
                        try {
                          const res = await uploadImageMutation.mutateAsync({ filename: file.name, contentType: file.type || "image/png", base64Data });
                          setFormValues((c) => ({ ...c, imageUrl: res.url }));
                          toast.success("Image uploaded!");
                        } catch (err: any) {
                          toast.error(err?.message || "Upload failed");
                        }
                      };
                      reader.readAsDataURL(file);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60 sm:col-span-3">
              Description
              <Input
                value={formValues.description}
                onChange={(e) => setFormValues((c) => ({ ...c, description: e.target.value }))}
                placeholder="Short summary…"
                className="h-9 border-white/15 bg-black/30 text-white text-xs"
              />
            </label>
            <label className="grid gap-1 text-[11px] font-semibold uppercase tracking-wider text-white/60 sm:col-span-3">
              Details (Scope and instructions)
              <textarea
                value={formValues.details}
                onChange={(e) => setFormValues((c) => ({ ...c, details: e.target.value }))}
                rows={3}
                placeholder="Scope details…"
                className="rounded border border-white/15 bg-black/30 p-2 text-xs text-white outline-none focus:border-accent"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setEditingServiceId(null)} className="text-white/70 hover:text-white h-8">Cancel</Button>
            <Button size="sm" disabled={upsertMutation.isPending} onClick={handleSave} className="gap-1.5 bg-accent text-black font-semibold hover:opacity-90 h-8">
              <Check size={14} /> {upsertMutation.isPending ? "Saving…" : "Save service"}
            </Button>
          </div>
        </section>
      ) : null}

      {servicesQuery.isLoading ? (
        <div className="rounded-lg border border-white/10 bg-[#161719] p-6 text-center text-white/60 text-xs">Loading services…</div>
      ) : servicesQuery.error ? (
        <div className="rounded-lg border border-red-400/25 bg-red-400/10 p-4 text-red-100 text-xs">Unable to load: {servicesQuery.error.message}</div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-[#161719] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="border-b border-white/10 bg-black/40 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                <tr>
                  <th className="p-3">Service</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Pricing</th>
                  <th className="p-3">Scope Details</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredServices.map((service) => (
                  <tr key={service.serviceId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-white">{service.title}</div>
                      <div className="text-[11px] text-white/50">{service.subtitle}</div>
                    </td>
                    <td className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded border border-white/10 bg-black/20 text-accent text-[11px]">{service.duration}</span>
                    </td>
                    <td className="p-3 font-semibold text-accent text-[11px]">{service.pricingText}</td>
                    <td className="p-3 text-[11px] text-white/70 max-w-xs truncate" title={service.details}>{service.details}</td>
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                      <Button size="sm" variant="ghost" onClick={() => startEdit(service)} className="h-7 px-2 text-xs text-accent hover:bg-accent/10">
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (window.confirm(`Delete service "${service.title}"?`)) {
                            deleteServiceMutation.mutate({ serviceId: service.serviceId });
                          }
                        }}
                        className="h-7 px-2 text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
