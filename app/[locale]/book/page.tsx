"use client";

import { useState } from "react";
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
} from "lucide-react";

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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const supabase = createClient();
  const availableDays = getNext30Days();

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
                  <span className="hidden sm:inline">Back</span>
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

          {/* Step 3: Contact Details */}
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
                  <span className="hidden sm:inline">Back</span>
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

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
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

              <div>
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
