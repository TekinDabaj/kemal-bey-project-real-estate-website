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
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
  CalendarCheck,
  Home,
  DollarSign,
  Building2,
  Search,
  Key,
  Target,
  Globe,
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
  price: number;
  currency: string;
  type: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  total_area: number;
  address: string;
  images: string[];
};

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
      p.address?.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[#13102b] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col border border-slate-200 dark:border-[#2d2a4a]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-[#2d2a4a]">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t("propertyModal.title")}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t("propertyModal.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-[#1a1735] rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 dark:border-[#2d2a4a]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t("propertyModal.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Property List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              {t("propertyModal.noProperties")}
            </div>
          ) : (
            filteredProperties.map((property) => {
              const isSelected = tempSelected.some((p) => p.id === property.id);
              return (
                <div
                  key={property.id}
                  onClick={() => toggleProperty(property)}
                  className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      : "border-slate-200 dark:border-[#2d2a4a] hover:border-slate-300 dark:hover:border-[#3d3a5a]"
                  }`}
                >
                  {/* Property Image */}
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-[#1a1735]">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      </div>
                    )}
                  </div>

                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                        {property.title}
                      </h4>
                      {isSelected && (
                        <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {property.address || t("propertyModal.noAddress")}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-4 h-4" /> {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-4 h-4" /> {property.bathrooms}
                        </span>
                      )}
                      {property.total_area > 0 && (
                        <span className="flex items-center gap-1">
                          <Square className="w-4 h-4" /> {property.total_area}m²
                        </span>
                      )}
                    </div>
                    <p className="text-amber-600 dark:text-amber-400 font-semibold mt-2">
                      {property.currency} {property.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-[#2d2a4a]">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tempSelected.length} {t("propertyModal.selected")}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border-2 border-slate-200 dark:border-[#2d2a4a] text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-[#1a1735] transition"
            >
              {t("propertyModal.cancel")}
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition"
            >
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
      const { data } = await supabase
        .from("properties")
        .select("id, title, price, currency, type, property_type, bedrooms, bathrooms, total_area, address, images")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (data) {
        setProperties(data);
      }
    }
    fetchProperties();
  }, [supabase]);

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
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 pt-24 md:pt-28 bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0a1d] dark:to-[#0c0a1d]">
        <div className="max-w-lg w-full">
          <div className="bg-white dark:bg-[#13102b] rounded-2xl shadow-xl dark:shadow-purple-900/10 p-8 md:p-12 text-center border border-slate-100 dark:border-[#2d2a4a]">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t("success.title")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t("success.subtitle")}
            </p>

            <div className="bg-slate-50 dark:bg-[#1a1735] rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 text-lg font-semibold text-slate-900 dark:text-white mb-2">
                <CalendarCheck className="w-5 h-5 text-amber-500" />
                <span>
                  {format(selectedDate!, "EEEE, MMMM d, yyyy", {
                    locale: dateLocale,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span>
                  {t("success.at")} {selectedTime}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              {t("success.confirmationSent")}{" "}
              <strong className="dark:text-white">{formData.email}</strong>
            </p>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 mb-8 text-left border dark:border-amber-800/30">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                {t("success.whatNext")}
              </h3>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  {t("success.step1")}
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  {t("success.step2")}
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-800/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  {t("success.step3")}
                </li>
              </ul>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-[#2d2a4a] hover:bg-slate-800 dark:hover:bg-[#3d3a5c] text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <Home className="w-4 h-4" />
              {t("success.backToHome")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0a1d] dark:to-[#0c0a1d]">
      {/* Property Selection Modal */}
      <PropertySelectionModal
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
        properties={properties}
        selectedProperties={selectedProperties}
        onConfirm={setSelectedProperties}
        t={t}
      />

      {/* Hero Section */}
      <div className="bg-slate-900 dark:bg-[#0c0a1d] dark:border-b dark:border-[#2d2a4a] text-white py-16 pt-24 md:pt-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-slate-300 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            {t("subtitle")}
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-300 dark:text-slate-400">
              <Shield className="w-4 h-4 text-amber-400" />
              {t("freeConsultation")}
            </div>
            <div className="flex items-center gap-2 text-slate-300 dark:text-slate-400">
              <Clock className="w-4 h-4 text-amber-400" />
              {t("workingHours")}
            </div>
            <div className="flex items-center gap-2 text-slate-300 dark:text-slate-400">
              <CheckCircle className="w-4 h-4 text-amber-400" />
              {t("noObligation")}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                    step >= s
                      ? "bg-amber-500 text-white"
                      : "bg-slate-200 dark:bg-[#2d2a4a] text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {i < 2 && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-2 rounded transition-all ${
                      step > s
                        ? "bg-amber-500"
                        : "bg-slate-200 dark:bg-[#2d2a4a]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-[#13102b] rounded-2xl shadow-lg dark:shadow-purple-900/10 border border-slate-100 dark:border-[#2d2a4a] overflow-hidden">
          {/* Step 1: Select Date */}
          <div
            className={`transition-all duration-300 ${
              step === 1 ? "block" : "hidden"
            }`}
          >
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-[#2d2a4a]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {t("selectDate")}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {t("step")} 1 {t("of")} 3
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
                {availableDays.map((date) => {
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString();
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateSelect(date)}
                      className={`group relative p-3 rounded-xl text-center border-2 transition-all hover:scale-105 ${
                        isSelected
                          ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/25"
                          : "border-slate-200 dark:border-[#2d2a4a] hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:text-white"
                      }`}
                    >
                      <div
                        className={`text-xs font-medium mb-1 ${
                          isSelected
                            ? "text-amber-100"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {format(date, "EEE", { locale: dateLocale })}
                      </div>
                      <div className="text-lg font-bold">
                        {format(date, "d", { locale: dateLocale })}
                      </div>
                      <div
                        className={`text-xs ${
                          isSelected
                            ? "text-amber-100"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {format(date, "MMM", { locale: dateLocale })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 2: Select Time */}
          <div
            className={`transition-all duration-300 ${
              step === 2 ? "block" : "hidden"
            }`}
          >
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-[#2d2a4a]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {t("selectTime")}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {t("step")} 2 {t("of")} 3 &bull;{" "}
                      {selectedDate &&
                        format(selectedDate, "EEEE, MMM d", {
                          locale: dateLocale,
                        })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("back")}</span>
                </button>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {timeSlots.map((time) => {
                  const isBooked = bookedSlots.includes(time);
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => !isBooked && handleTimeSelect(time)}
                      disabled={isBooked}
                      className={`relative p-4 rounded-xl text-center font-semibold border-2 transition-all ${
                        isBooked
                          ? "bg-slate-50 dark:bg-[#1a1735] text-slate-300 dark:text-slate-600 border-slate-100 dark:border-[#2d2a4a] cursor-not-allowed"
                          : isSelected
                          ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/25"
                          : "border-slate-200 dark:border-[#2d2a4a] hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:text-white"
                      }`}
                    >
                      {time}
                      {isBooked && (
                        <span className="absolute -top-2 -right-2 bg-slate-400 dark:bg-slate-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                          {t("booked")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 3: Contact Details + Additional Info */}
          <div
            className={`transition-all duration-300 ${
              step === 3 ? "block" : "hidden"
            }`}
          >
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-[#2d2a4a]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {t("yourDetails")}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {t("step")} 3 {t("of")} 3
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("back")}</span>
                </button>
              </div>
            </div>

            {/* Selected Date/Time Summary */}
            <div className="mx-6 md:mx-8 mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="font-medium text-slate-900 dark:text-white">
                    {selectedDate &&
                      format(selectedDate, "EEEE, MMMM d, yyyy", {
                        locale: dateLocale,
                      })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="font-medium text-slate-900 dark:text-white">
                    {selectedTime}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              {/* Contact Information Section */}
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-500" />
                  {t("contactInfo")}
                </h3>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <User className="w-4 h-4" />
                    {t("name")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Mail className="w-4 h-4" />
                      {t("email")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Phone className="w-4 h-4" />
                      {t("phone")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Property Preferences Section */}
              <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-[#2d2a4a]">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-500" />
                  {t("propertyPreferences")}
                </h3>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Budget */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <DollarSign className="w-4 h-4" />
                      {t("budget")}
                    </label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      placeholder={t("budgetPlaceholder")}
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Building2 className="w-4 h-4" />
                      {t("propertyType")}
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) =>
                        setFormData({ ...formData, propertyType: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    >
                      <option value="">{t("selectPropertyType")}</option>
                      <option value="house">{t("propertyTypes.house")}</option>
                      <option value="apartment">{t("propertyTypes.apartment")}</option>
                      <option value="office">{t("propertyTypes.office")}</option>
                      <option value="land">{t("propertyTypes.land")}</option>
                    </select>
                  </div>

                  {/* Investment Type */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Key className="w-4 h-4" />
                      {t("investmentType")}
                    </label>
                    <select
                      value={formData.investmentType}
                      onChange={(e) =>
                        setFormData({ ...formData, investmentType: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    >
                      <option value="">{t("selectInvestmentType")}</option>
                      <option value="buying">{t("investmentTypes.buying")}</option>
                      <option value="renting">{t("investmentTypes.renting")}</option>
                    </select>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      <Target className="w-4 h-4" />
                      {t("reason")}
                    </label>
                    <select
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    >
                      <option value="">{t("selectReason")}</option>
                      <option value="investment">{t("reasons.investment")}</option>
                      <option value="personal">{t("reasons.personal")}</option>
                    </select>
                  </div>
                </div>

                {/* Desired Properties */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Home className="w-4 h-4" />
                    {t("desiredProperties")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPropertyModalOpen(true)}
                    className="w-full px-4 py-3 border-2 border-dashed border-slate-300 dark:border-[#2d2a4a] bg-slate-50 dark:bg-[#1a1735] text-slate-600 dark:text-slate-400 rounded-xl hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    {selectedProperties.length > 0
                      ? t("propertyModal.changeSelection", { count: selectedProperties.length })
                      : t("browseProperties")}
                  </button>

                  {/* Selected Properties Display */}
                  {selectedProperties.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {selectedProperties.map((property) => (
                        <div
                          key={property.id}
                          className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-[#1a1735]">
                              {property.images?.[0] ? (
                                <img
                                  src={property.images[0]}
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white text-sm">
                                {property.title}
                              </p>
                              <p className="text-xs text-amber-600 dark:text-amber-400">
                                {property.currency} {property.price?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedProperties((prev) =>
                                prev.filter((p) => p.id !== property.id)
                              )
                            }
                            className="p-1.5 hover:bg-amber-100 dark:hover:bg-amber-800/30 rounded-lg transition"
                          >
                            <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Referral Source */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    <Globe className="w-4 h-4" />
                    {t("referralSource")}
                  </label>
                  <select
                    value={formData.referralSource}
                    onChange={(e) =>
                      setFormData({ ...formData, referralSource: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
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

              {/* Additional Message */}
              <div className="pt-4 border-t border-slate-200 dark:border-[#2d2a4a]">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <MessageSquare className="w-4 h-4" />
                  {t("message")}{" "}
                  <span className="text-slate-400 dark:text-slate-500 font-normal">
                    ({t("optional")})
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-slate-200 dark:border-[#2d2a4a] bg-white dark:bg-[#1a1735] text-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder={t("messagePlaceholder")}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("booking")}
                  </>
                ) : (
                  <>
                    {t("confirmBooking")}
                    <ArrowRight className="w-5 h-5" />
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