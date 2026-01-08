"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  differenceInMinutes,
  parseISO,
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
import {
  LogOut,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Check,
  X,
  Trash2,
  CalendarDays,
  Image as ImageIcon,
  Building2,
  ChevronLeft,
  ChevronRight,
  Bell,
  BellOff,
} from "lucide-react";
import { FileText } from "lucide-react";
import { Reservation, Property, HeroSlide, BlogPost } from "@/types/database";
import ContentEditor from "./ContentEditor";
import PropertiesManager from "./PropertiesManager";
import BlogManager from "./BlogManager";
import { useTranslations } from "next-intl";

type DateFnsLocale = typeof enGB;
const dateFnsLocales: Record<string, DateFnsLocale> = {
  en: enGB,
  tr,
  ms,
  id,
  es,
  pt,
  de,
  fr,
  it,
  zh: zhCN,
  ja,
  hi,
};

type Props = {
  reservations: Reservation[];
  properties: Property[];
  heroSlides: HeroSlide[];
  blogPosts: BlogPost[];
};

export default function AdminDashboard({
  reservations: initialReservations,
  properties,
  heroSlides,
  blogPosts,
}: Props) {
  const t = useTranslations("admin");
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const dateLocale = dateFnsLocales[locale] || enGB;

  const [reservations, setReservations] = useState(initialReservations);
  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "cancelled"
  >("all");
  const [activeTab, setActiveTab] = useState<
    "reservations" | "properties" | "content" | "blog"
  >("reservations");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">("default");

  // Hydration fix: update notification state only after mount
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }
    setNotificationPermission(Notification.permission);
    const savedPreference = localStorage.getItem("admin_notifications_enabled");
    setNotificationsEnabled(savedPreference === "true" && Notification.permission === "granted");
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  const notifiedReservationsRef = useRef<Set<string>>(new Set());
  const serviceWorkerRef = useRef<ServiceWorkerRegistration | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const filtered = reservations.filter(
    (r) => filter === "all" || r.status === filter
  );

  // Calendar helpers
  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();

  // Get reservations for a specific day
  const getReservationsForDay = (day: Date) => {
    return reservations.filter((r) => isSameDay(new Date(r.date), day));
  };

  // Notification functions
  const NOTIFICATION_STORAGE_KEY = "admin_notifications_enabled";
  const NOTIFIED_RESERVATIONS_KEY = "notified_reservations";

  // Load notified reservations from storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(NOTIFIED_RESERVATIONS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          notifiedReservationsRef.current = new Set(parsed);
        } catch {
          notifiedReservationsRef.current = new Set();
        }
      }
    }
  }, []);

  // Save notified reservations to storage
  const saveNotifiedReservations = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        NOTIFIED_RESERVATIONS_KEY,
        JSON.stringify([...notifiedReservationsRef.current])
      );
    }
  }, []);

  // Register service worker for notifications
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/notification-sw.js")
      .then((registration) => {
        serviceWorkerRef.current = registration;
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  }, []);

  // Show notification via Service Worker
  const showNotification = useCallback(
    (reservation: Reservation, minutesUntil: number) => {
      const title = t("reservations.notifications.upcomingTitle");
      const body = t("reservations.notifications.upcomingBody", {
        name: reservation.name,
        minutes: minutesUntil,
        time: reservation.time.slice(0, 5),
      });

      // Try service worker notification first (works when backgrounded)
      if (serviceWorkerRef.current?.active) {
        serviceWorkerRef.current.active.postMessage({
          type: "SHOW_NOTIFICATION",
          title,
          body,
          tag: `reservation-${reservation.id}`,
          data: { reservationId: reservation.id },
        });
      } else if (Notification.permission === "granted") {
        // Fallback to direct notification
        new Notification(title, {
          body,
          icon: "/globe.svg",
          tag: `reservation-${reservation.id}`,
        });
      }
    },
    [t]
  );

  // Check for upcoming reservations
  const checkUpcomingReservations = useCallback(() => {
    if (!notificationsEnabled) return;

    const now = new Date();
    const confirmedReservations = reservations.filter(
      (r) => r.status === "confirmed" || r.status === "pending"
    );

    confirmedReservations.forEach((reservation) => {
      // Create full datetime from date and time
      const reservationDate = parseISO(reservation.date);
      const [hours, minutes] = reservation.time.split(":").map(Number);
      reservationDate.setHours(hours, minutes, 0, 0);

      const minutesUntil = differenceInMinutes(reservationDate, now);

      // Notify if within 60 minutes and not already notified
      if (
        minutesUntil > 0 &&
        minutesUntil <= 60 &&
        !notifiedReservationsRef.current.has(reservation.id)
      ) {
        showNotification(reservation, minutesUntil);
        notifiedReservationsRef.current.add(reservation.id);
        saveNotifiedReservations();
      }
    });
  }, [notificationsEnabled, reservations, saveNotifiedReservations, showNotification]);

  // Set up interval to check for upcoming reservations
  useEffect(() => {
    if (!notificationsEnabled) return;

    // Check immediately
    checkUpcomingReservations();

    // Check every minute
    const interval = setInterval(checkUpcomingReservations, 60000);

    return () => clearInterval(interval);
  }, [notificationsEnabled, checkUpcomingReservations]);

  // Handle notification toggle
  const handleNotificationToggle = async () => {
    if (notificationsEnabled) {
      // Disable notifications
      setNotificationsEnabled(false);
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, "false");
      return;
    }

    // Check if notifications are supported
    if (!("Notification" in window)) {
      alert(t("reservations.notifications.notSupported"));
      return;
    }

    // Request permission if needed
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission !== "granted") {
        alert(t("reservations.notifications.permissionDenied"));
        return;
      }
    } else if (Notification.permission === "denied") {
      alert(t("reservations.notifications.permissionDenied"));
      return;
    }

    // Enable notifications
    setNotificationsEnabled(true);
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, "true");

    // Show test notification
    if (serviceWorkerRef.current?.active) {
      serviceWorkerRef.current.active.postMessage({
        type: "SHOW_NOTIFICATION",
        title: t("reservations.notifications.enabledTitle"),
        body: t("reservations.notifications.enabledBody"),
        tag: "notification-enabled",
      });
    } else if (Notification.permission === "granted") {
      new Notification(t("reservations.notifications.enabledTitle"), {
        body: t("reservations.notifications.enabledBody"),
        icon: "/globe.svg",
      });
    }
  };

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  async function updateStatus(id: string, status: "confirmed" | "cancelled") {
    const { error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setReservations(
        reservations.map((r) => (r.id === id ? { ...r, status } : r))
      );
    }
  }

  async function deleteReservation(id: string) {
    if (!confirm(t("reservations.confirmDelete"))) return;

    const { error } = await supabase.from("reservations").delete().eq("id", id);

    if (!error) {
      setReservations(reservations.filter((r) => r.id !== id));
    }
  }

  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusLabels = {
    pending: t("reservations.stats.pending"),
    confirmed: t("reservations.stats.confirmed"),
    cancelled: t("reservations.stats.cancelled"),
  };

  const filterLabels = {
    all: t("reservations.filter.all"),
    pending: t("reservations.filter.pending"),
    confirmed: t("reservations.filter.confirmed"),
    cancelled: t("reservations.filter.cancelled"),
  };

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-[#0c0a1d] overflow-x-hidden pt-20 md:pt-24">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-[#0c0a1d] dark:border-b dark:border-[#2d2a4a] text-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8">
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition"
          >
            <LogOut size={18} /> {t("logout")}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#13102b] border-b border-slate-200 dark:border-[#2d2a4a]">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-thin">
          <div className="flex gap-4 min-w-max">
            <button
              onClick={() => setActiveTab("reservations")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition whitespace-nowrap ${
                activeTab === "reservations"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <CalendarDays size={18} /> {t("tabs.reservations")}
            </button>
            <button
              onClick={() => setActiveTab("properties")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition whitespace-nowrap ${
                activeTab === "properties"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Building2 size={18} /> {t("tabs.properties")}
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition whitespace-nowrap ${
                activeTab === "content"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <ImageIcon size={18} /> {t("tabs.content")}
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition whitespace-nowrap ${
                activeTab === "blog"
                  ? "border-amber-500 text-amber-600 dark:text-amber-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <FileText size={18} /> {t("tabs.blog")}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-[#0c0a1d] min-h-[calc(100vh-12rem)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "reservations" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: t("reservations.stats.total"),
                  count: reservations.length,
                  color: "text-slate-500 dark:text-slate-400",
                },
                {
                  label: t("reservations.stats.pending"),
                  count: reservations.filter((r) => r.status === "pending")
                    .length,
                  color: "text-yellow-500",
                },
                {
                  label: t("reservations.stats.confirmed"),
                  count: reservations.filter((r) => r.status === "confirmed")
                    .length,
                  color: "text-green-500",
                },
                {
                  label: t("reservations.stats.cancelled"),
                  count: reservations.filter((r) => r.status === "cancelled")
                    .length,
                  color: "text-red-500",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-[#13102b] rounded-lg p-4 border border-slate-200 dark:border-[#2d2a4a]"
                >
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.count}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Notification Toggle */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleNotificationToggle}
                disabled={notificationPermission === "unsupported"}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                  notificationsEnabled
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                    : "bg-slate-100 dark:bg-[#1a1735] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d2a4a]"
                } ${notificationPermission === "unsupported" ? "opacity-50 cursor-not-allowed" : ""}`}
                title={
                  notificationPermission === "unsupported"
                    ? t("reservations.notifications.notSupported")
                    : notificationsEnabled
                    ? t("reservations.notifications.turnOff")
                    : t("reservations.notifications.turnOn")
                }
              >
                {notificationsEnabled ? (
                  <>
                    <Bell size={16} />
                    {t("reservations.notifications.enabled")}
                  </>
                ) : (
                  <>
                    <BellOff size={16} />
                    {t("reservations.notifications.disabled")}
                  </>
                )}
              </button>
            </div>

            {/* Calendar View */}
            <div className="bg-white dark:bg-[#13102b] rounded-lg border border-slate-200 dark:border-[#2d2a4a] p-4 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {t("reservations.calendar.title")}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setCalendarMonth(subMonths(calendarMonth, 1))
                    }
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#1a1735] rounded transition text-slate-600 dark:text-slate-400"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="font-medium text-slate-700 dark:text-slate-300 min-w-[120px] text-center text-sm">
                    {format(calendarMonth, "MMMM yyyy", { locale: dateLocale })}
                  </span>
                  <button
                    onClick={() =>
                      setCalendarMonth(addMonths(calendarMonth, 1))
                    }
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#1a1735] rounded transition text-slate-600 dark:text-slate-400"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    onClick={() => setCalendarMonth(new Date())}
                    className="ml-1 px-2 py-1 text-xs bg-slate-100 dark:bg-[#1a1735] hover:bg-slate-200 dark:hover:bg-[#2d2a4a] text-slate-600 dark:text-slate-400 rounded transition"
                  >
                    {t("reservations.calendar.today")}
                  </button>
                </div>
              </div>

              {/* Calendar Grid - Horizontally scrollable on mobile */}
              <div className="overflow-x-auto -mx-4 px-4 pb-2">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-[#2d2a4a] rounded-lg overflow-hidden">
                    {/* Day Headers */}
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 dark:bg-[#1a1735] text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-1.5"
                      >
                        {format(new Date(2024, 0, i + 7), "EEE", {
                          locale: dateLocale,
                        })}
                      </div>
                    ))}

                    {/* Empty cells before first day */}
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="bg-white dark:bg-[#13102b] min-h-[70px]"
                      />
                    ))}

                    {/* Calendar Days */}
                    {calendarDays.map((day) => {
                      const dayReservations = getReservationsForDay(day);
                      const hasReservations = dayReservations.length > 0;

                      return (
                        <div
                          key={day.toISOString()}
                          className={`bg-white dark:bg-[#13102b] min-h-[70px] p-1.5 ${
                            isToday(day) ? "bg-amber-50 dark:bg-amber-900/20" : ""
                          }`}
                        >
                          <div className="flex flex-col h-full">
                            <span
                              className={`text-xs font-medium mb-1 ${
                                isToday(day)
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-slate-500 dark:text-slate-400"
                              }`}
                            >
                              {format(day, "d")}
                            </span>
                            {hasReservations && (
                              <div className="flex-1 space-y-0.5 overflow-hidden">
                                {dayReservations.slice(0, 2).map((reservation) => (
                                  <div
                                    key={reservation.id}
                                    className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate ${
                                      reservation.status === "confirmed"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : reservation.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    }`}
                                    title={`${
                                      reservation.name
                                    } - ${reservation.time.slice(0, 5)}`}
                                  >
                                    {reservation.time.slice(0, 5)}{" "}
                                    {reservation.name.split(" ")[0]}
                                  </div>
                                ))}
                                {dayReservations.length > 2 && (
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 px-1">
                                    +{dayReservations.length - 2} more
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6">
              {(["all", "pending", "confirmed", "cancelled"] as const).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      filter === f
                        ? "bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900"
                        : "bg-white dark:bg-[#13102b] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1735] border border-slate-200 dark:border-[#2d2a4a]"
                    }`}
                  >
                    {filterLabels[f]}
                  </button>
                )
              )}
            </div>

            {/* Reservations List */}
            <div className="space-y-4">
              {filtered.length === 0 ? (
                <div className="bg-white dark:bg-[#13102b] rounded-lg p-8 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#2d2a4a]">
                  {t("reservations.noReservations")}
                </div>
              ) : (
                filtered.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="bg-white dark:bg-[#13102b] rounded-lg p-6 border border-slate-200 dark:border-[#2d2a4a]"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              statusColors[reservation.status]
                            }`}
                          >
                            {statusLabels[reservation.status]}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 text-sm">
                            {t("reservations.booked")}{" "}
                            {format(
                              new Date(reservation.created_at),
                              "MMM d, yyyy",
                              { locale: dateLocale }
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                          <User
                            size={16}
                            className="text-slate-400 dark:text-slate-500"
                          />
                          <span className="font-medium">
                            {reservation.name}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} className="text-amber-500" />
                            {format(
                              new Date(reservation.date),
                              "EEE, MMM d, yyyy",
                              { locale: dateLocale }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-amber-500" />
                            {reservation.time.slice(0, 5)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Mail size={14} /> {reservation.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={14} /> {reservation.phone}
                          </span>
                        </div>

                        {reservation.message && (
                          <div className="flex items-start gap-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                            <MessageSquare
                              size={14}
                              className="mt-0.5 shrink-0"
                            />
                            <span>{reservation.message}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {reservation.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(reservation.id, "confirmed")
                              }
                              className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                              title={t("reservations.actions.confirm")}
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(reservation.id, "cancelled")
                              }
                              className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                              title={t("reservations.actions.cancel")}
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="p-2 bg-slate-100 dark:bg-[#1a1735] text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-[#2d2a4a] transition"
                          title={t("reservations.actions.delete")}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === "properties" && (
          <PropertiesManager initialProperties={properties} />
        )}

        {activeTab === "content" && (
          <ContentEditor initialHeroSlides={heroSlides} />
        )}

        {activeTab === "blog" && (
          <BlogManager initialPosts={blogPosts} />
        )}
      </div>
      </div>
    </div>
  );
}
