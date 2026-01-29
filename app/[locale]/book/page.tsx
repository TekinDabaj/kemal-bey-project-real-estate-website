"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import {
  format,
  addDays,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
} from "date-fns";
import {
  enGB,
  tr,
  ms,
  id,
  es,
  pt,
  de,
  fr,
  it,
  zhCN,
  ja,
  hi,
} from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";

const dateFnsLocales: Record<string, DateFnsLocale> = {
  en: enGB,
  tr: tr,
  ms: ms,
  id: id,
  es: es,
  pt: pt,
  de: de,
  fr: fr,
  it: it,
  zh: zhCN,
  ja: ja,
  hi: hi,
};
import {
  Calendar,
  Clock,
  CheckCircle,
  User,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  CalendarCheck,
  Home,
  Building2,
  Search,
  X,
  Check,
  MapPin,
  Bed,
  Bath,
  Square,
} from "lucide-react";

// Property type from database
type Property = {
  id: string;
  title: string;
  price: number | null;
  type: "sale" | "rent" | null;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  location: string | null;
  images: string[];
};

const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/`;

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

function isWorkingDay(date: Date) {
  return (
    isMonday(date) ||
    isTuesday(date) ||
    isWednesday(date) ||
    isThursday(date) ||
    isFriday(date) ||
    isSaturday(date)
  );
}

function getNext30Days() {
  const days = [];
  const current = new Date();

  for (let i = 0; i < 45 && days.length < 30; i++) {
    const date = addDays(current, i);
    if (isWorkingDay(date)) {
      days.push(date);
    }
  }
  return days;
}

// Property Selection Modal Component
function PropertySelectionModal({
  isOpen,
  onClose,
  properties,
  selectedProperties,
  onConfirm,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  selectedProperties: Property[];
  onConfirm: (properties: Property[]) => void;
  t: ReturnType<typeof useTranslations<"booking">>;
}) {
  const [tempSelected, setTempSelected] = useState<Property[]>(selectedProperties);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setTempSelected(selectedProperties);
  }, [selectedProperties, isOpen]);

  if (!isOpen) return null;

  const filteredProperties = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleProperty = (property: Property) => {
    setTempSelected((prev) =>
      prev.some((p) => p.id === property.id)
        ? prev.filter((p) => p.id !== property.id)
        : [...prev, property]
    );
  };

  const handleConfirm = () => {
    onConfirm(tempSelected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#13102b] rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-slate-200 dark:border-[#2d2a4a]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-[#2d2a4a]">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {t("propertyModal.title")}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-[#1a1735] rounded transition">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="px-4 py-2 border-b border-slate-100 dark:border-[#2d2a4a]">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t("propertyModal.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
              {t("propertyModal.noProperties")}
            </div>
          ) : (
            filteredProperties.map((property) => {
              const isSelected = tempSelected.some((p) => p.id === property.id);
              return (
                <div
                  key={property.id}
                  onClick={() => toggleProperty(property)}
                  className={`flex gap-3 p-2 rounded-md border cursor-pointer transition ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/10"
                      : "border-transparent hover:bg-slate-50 dark:hover:bg-[#1a1735]"
                  }`}
                >
                  <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-slate-100 dark:bg-[#1a1735]">
                    {property.images?.[0] ? (
                      <img src={`${bucketUrl}${property.images[0]}`} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">{property.title}</h4>
                      {isSelected && (
                        <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {property.location || t("propertyModal.noAddress")}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {property.bedrooms && property.bedrooms > 0 && <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" /> {property.bedrooms}</span>}
                      {property.bathrooms && property.bathrooms > 0 && <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" /> {property.bathrooms}</span>}
                      {property.area && property.area > 0 && <span className="flex items-center gap-0.5"><Square className="w-3 h-3" /> {property.area}m²</span>}
                      <span className="text-amber-600 dark:text-amber-400 font-medium ml-auto">${property.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-[#2d2a4a]">
          <span className="text-xs text-slate-500 dark:text-slate-400">{tempSelected.length} {t("propertyModal.selected")}</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-sm border border-slate-200 dark:border-[#2d2a4a] text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-[#1a1735] transition">
              {t("propertyModal.cancel")}
            </button>
            <button onClick={handleConfirm} className="px-3 py-1.5 text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-md font-medium transition">
              {t("propertyModal.confirm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  const t = useTranslations("booking");
  const locale = useLocale();
  const dateLocale = dateFnsLocales[locale] || enGB;
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Properties state
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);

  // Form data with new fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    budget: "",
    propertyType: "",
    investmentType: "",
    reason: "",
    referralSource: "",
  });

  const supabase = createClient();
  const availableDays = getNext30Days();

  // Fetch properties on mount
  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase
        .from("properties")
        .select("id, title, price, type, property_type, bedrooms, bathrooms, area, location, images")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        return;
      }

      if (data) {
        setProperties(data);
      }
    }
    fetchProperties();
  }, []);

  async function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setSelectedTime(null);

    const { data } = await supabase
      .from("reservations")
      .select("time")
      .eq("date", format(date, "yyyy-MM-dd"))
      .neq("status", "cancelled");

    setBookedSlots(data?.map((r) => r.time.slice(0, 5)) || []);
    setStep(2);
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time);
    setStep(3);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;

    setLoading(true);

    const { error } = await supabase.from("reservations").insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || null,
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      budget: formData.budget || null,
      property_type: formData.propertyType || null,
      investment_type: formData.investmentType || null,
      reason: formData.reason || null,
      referral_source: formData.referralSource || null,
      desired_properties: selectedProperties.length > 0 
        ? selectedProperties.map(p => p.id) 
        : null,
    });

    if (error) {
      alert(t("error.description"));
      console.error(error);
      setLoading(false);
      return;
    }

    await fetch("/api/send-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        date: format(selectedDate, "EEEE, MMMM d, yyyy"),
        time: selectedTime,
        budget: formData.budget,
        propertyType: formData.propertyType,
        investmentType: formData.investmentType,
        reason: formData.reason,
        referralSource: formData.referralSource,
        desiredProperties: selectedProperties.map(p => p.title).join(", "),
      }),
    });

    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex items-center justify-center px-3 py-8 pt-20 bg-slate-50 dark:bg-[#0c0a1d] flex-1">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-[#13102b] rounded-lg shadow-sm p-5 text-center border border-slate-200 dark:border-[#2d2a4a]">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{t("success.title")}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t("success.subtitle")}</p>
            <div className="bg-slate-50 dark:bg-[#1a1735] rounded-md p-3 mb-4">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                <CalendarCheck className="w-4 h-4 text-amber-500" />
                {format(selectedDate!, "EEE, MMM d, yyyy", { locale: dateLocale })} • {selectedTime}
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {t("success.confirmationSent")} <strong className="text-slate-700 dark:text-slate-200">{formData.email}</strong>
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-md p-3 mb-4 text-left border border-amber-100 dark:border-amber-900/20">
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">{t("success.whatNext")}</h3>
              <ol className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-decimal list-inside">
                <li>{t("success.step1")}</li>
                <li>{t("success.step2")}</li>
                <li>{t("success.step3")}</li>
              </ol>
            </div>
            <Link href="/" className="inline-flex items-center gap-1.5 bg-slate-900 dark:bg-[#2d2a4a] hover:bg-slate-800 dark:hover:bg-[#3d3a5c] text-white px-4 py-2 rounded-md text-sm font-medium transition">
              <Home className="w-3.5 h-3.5" />
              {t("success.backToHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#0c0a1d] flex-1">
      <PropertySelectionModal
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
        properties={properties}
        selectedProperties={selectedProperties}
        onConfirm={setSelectedProperties}
        t={t}
      />

      {/* Compact Header */}
      <div className="bg-white dark:bg-[#13102b] border-b border-slate-200 dark:border-[#2d2a4a] pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white text-center">{t("title")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-1 max-w-lg mx-auto">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Compact Progress Steps */}
        <div className="flex items-center justify-center gap-1 mb-4 sm:mb-6">
          {[
            { num: 1, label: t("selectDate") },
            { num: 2, label: t("selectTime") },
            { num: 3, label: t("yourDetails") },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs sm:text-sm font-medium transition ${
                step >= s.num
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  step > s.num ? "bg-amber-500 text-white" : step === s.num ? "bg-amber-500 text-white" : "bg-slate-200 dark:bg-[#2d2a4a] text-slate-500"
                }`}>
                  {step > s.num ? <Check className="w-3 h-3" /> : s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < 2 && <div className={`w-6 sm:w-10 h-px mx-1 ${step > s.num ? "bg-amber-400" : "bg-slate-200 dark:bg-[#2d2a4a]"}`} />}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-[#13102b] rounded-lg shadow-sm border border-slate-200 dark:border-[#2d2a4a]">
          {/* Step 1: Select Date */}
          <div className={step === 1 ? "block" : "hidden"}>
            <div className="px-4 py-3 border-b border-slate-100 dark:border-[#2d2a4a] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-medium text-slate-900 dark:text-white">{t("selectDate")}</h2>
            </div>
            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-10 gap-1.5">
                {availableDays.map((date) => {
                  const isSelected = selectedDate?.toDateString() === date.toDateString();
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateSelect(date)}
                      className={`p-1.5 sm:p-2 rounded-md text-center transition ${
                        isSelected
                          ? "bg-amber-500 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-[#1a1735] text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className={`text-[10px] font-medium ${isSelected ? "text-amber-100" : "text-slate-400 dark:text-slate-500"}`}>
                        {format(date, "EEE", { locale: dateLocale })}
                      </div>
                      <div className="text-sm font-semibold">{format(date, "d", { locale: dateLocale })}</div>
                      <div className={`text-[10px] ${isSelected ? "text-amber-100" : "text-slate-400 dark:text-slate-500"}`}>
                        {format(date, "MMM", { locale: dateLocale })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 2: Select Time */}
          <div className={step === 2 ? "block" : "hidden"}>
            <div className="px-4 py-3 border-b border-slate-100 dark:border-[#2d2a4a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-medium text-slate-900 dark:text-white">{t("selectTime")}</h2>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  • {selectedDate && format(selectedDate, "EEE, MMM d", { locale: dateLocale })}
                </span>
              </div>
              <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> {t("back")}
              </button>
            </div>
            <div className="p-3 sm:p-4">
              <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-13 gap-1.5">
                {timeSlots.map((time) => {
                  const isBooked = bookedSlots.includes(time);
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => !isBooked && handleTimeSelect(time)}
                      disabled={isBooked}
                      className={`relative py-2 px-1 rounded-md text-center text-sm font-medium transition ${
                        isBooked
                          ? "bg-slate-100 dark:bg-[#1a1735] text-slate-300 dark:text-slate-600 cursor-not-allowed"
                          : isSelected
                          ? "bg-amber-500 text-white"
                          : "hover:bg-slate-100 dark:hover:bg-[#1a1735] text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {time}
                      {isBooked && <span className="absolute -top-1 -right-1 w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 3: Contact Details + Additional Info */}
          <div className={step === 3 ? "block" : "hidden"}>
            <div className="px-5 py-3 border-b border-slate-100 dark:border-[#2d2a4a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-medium text-slate-900 dark:text-white">{t("yourDetails")}</h2>
              </div>
              <button onClick={() => setStep(2)} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> {t("back")}
              </button>
            </div>

            {/* Selected Date/Time Summary */}
            <div className="mx-5 mt-4 px-4 py-2.5 bg-amber-50/80 dark:bg-amber-900/10 rounded-md border border-amber-200/50 dark:border-amber-800/20 flex items-center justify-center gap-6 text-xs">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-amber-500" />
                {selectedDate && format(selectedDate, "EEE, MMM d, yyyy", { locale: dateLocale })}
              </span>
              <span className="w-px h-4 bg-amber-200 dark:bg-amber-800/40" />
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Clock className="w-4 h-4 text-amber-500" />
                {selectedTime}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="p-5">
              {/* Section 1: Contact Information */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-amber-500 rounded-full" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{t("contactInfo")}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                      {t("name")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                      {t("email")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                      {t("phone")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-[#2d2a4a] to-transparent mb-5" />

              {/* Section 2: Property Preferences */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-amber-500 rounded-full" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{t("propertyPreferences")}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">{t("budget")}</label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                      placeholder={t("budgetPlaceholder")}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">{t("propertyType")}</label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    >
                      <option value="">{t("selectPropertyType")}</option>
                      <option value="house">{t("propertyTypes.house")}</option>
                      <option value="apartment">{t("propertyTypes.apartment")}</option>
                      <option value="office">{t("propertyTypes.office")}</option>
                      <option value="land">{t("propertyTypes.land")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">{t("investmentType")}</label>
                    <select
                      value={formData.investmentType}
                      onChange={(e) => setFormData({ ...formData, investmentType: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    >
                      <option value="">{t("selectInvestmentType")}</option>
                      <option value="buying">{t("investmentTypes.buying")}</option>
                      <option value="renting">{t("investmentTypes.renting")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">{t("reason")}</label>
                    <select
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    >
                      <option value="">{t("selectReason")}</option>
                      <option value="investment">{t("reasons.investment")}</option>
                      <option value="personal">{t("reasons.personal")}</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">{t("desiredProperties")}</label>
                    <button
                      type="button"
                      onClick={() => setIsPropertyModalOpen(true)}
                      className="w-full px-3 py-2 text-sm border border-dashed border-slate-300 dark:border-[#3d3a5a] bg-slate-50/50 dark:bg-[#1a1735] text-slate-500 dark:text-slate-400 rounded-md hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition flex items-center justify-center gap-2"
                    >
                      <Search className="w-3.5 h-3.5" />
                      {selectedProperties.length > 0
                        ? t("propertyModal.changeSelection", { count: selectedProperties.length })
                        : t("browseProperties")}
                    </button>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">{t("referralSource")}</label>
                    <select
                      value={formData.referralSource}
                      onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    >
                      <option value="">{t("selectReferralSource")}</option>
                      <option value="google">{t("referralSources.google")}</option>
                      <option value="facebook">{t("referralSources.facebook")}</option>
                      <option value="instagram">{t("referralSources.instagram")}</option>
                      <option value="reference">{t("referralSources.reference")}</option>
                      <option value="other">{t("referralSources.other")}</option>
                    </select>
                  </div>
                </div>
                {selectedProperties.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedProperties.map((property) => (
                      <div key={property.id} className="flex items-center gap-2 py-1 pl-1.5 pr-1 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200/60 dark:border-amber-800/30">
                        <div className="w-6 h-6 rounded overflow-hidden bg-slate-100 dark:bg-[#1a1735] flex-shrink-0">
                          {property.images?.[0] ? (
                            <img src={`${bucketUrl}${property.images[0]}`} alt={property.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Building2 className="w-3 h-3 text-slate-400" /></div>
                          )}
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-300 max-w-[120px] truncate">{property.title}</span>
                        <button type="button" onClick={() => setSelectedProperties((prev) => prev.filter((p) => p.id !== property.id))} className="p-0.5 hover:bg-amber-100 dark:hover:bg-amber-800/30 rounded transition">
                          <X className="w-3 h-3 text-slate-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-[#2d2a4a] to-transparent mb-5" />

              {/* Section 3: Additional Notes */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-amber-500 rounded-full" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{t("message")}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-normal normal-case">({t("optional")})</span>
                </div>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-md focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-none"
                  placeholder={t("messagePlaceholder")}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-md font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("booking")}
                  </>
                ) : (
                  <>
                    {t("confirmBooking")}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}