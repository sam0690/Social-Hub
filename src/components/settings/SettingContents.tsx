"use client";

import { useState } from "react";
import { ArrowRight, Camera, Check, Eye, EyeOff, Moon, Monitor, Smartphone, Sun } from "lucide-react";

type SettingsSectionId =
  | "profile"
  | "security"
  | "language"
  | "notifications"
  | "appearance"
  | "storage"
  | "billing";

type SettingContentsProps = {
  activeSection: SettingsSectionId;
};

type ToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
};

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition ${checked ? "border-indigo-500 bg-indigo-500" : "border-slate-300 bg-slate-200 dark:border-white/10 dark:bg-white/10"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <div className="rounded-3xl border border-slate-300 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

type RowProps = {
  title: string;
  desc?: string;
  children: React.ReactNode;
};

function Row({ title, desc, children }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 py-4 last:border-b-0 dark:border-white/10">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900 dark:text-white">{title}</div>
        {desc ? <div className="mt-1 text-sm leading-6 text-slate-500 dark:text-zinc-400">{desc}</div> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

type TextFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
};

function TextField({ label, type = "text", placeholder, defaultValue }: TextFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-zinc-300">{label}</label>
      <div className="relative">
        <input
          type={isPassword && !showPassword ? "password" : type}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-zinc-500"
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

const accentColors = ["#5B5FEF", "#FF6B4A", "#2FAE6E", "#F5A623", "#E75480"];

export default function SettingContents({ activeSection }: SettingContentsProps) {
  const [twoFA, setTwoFA] = useState(false);
  const [theme, setTheme] = useState("system");
  const [accent, setAccent] = useState("#5B5FEF");
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    follows: false,
    messages: true,
    mentions: true,
    email: false,
    push: true,
  });

  const storageUsed = 6.4;
  const storageTotal = 10;
  const storagePct = (storageUsed / storageTotal) * 100;

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <>
            <SectionCard title="Profile photo" subtitle="Shown on your posts, comments, and profile.">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-indigo-500 via-blue-500 to-fuchsia-500 text-2xl font-bold text-white">
                  MK
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white dark:border-[#030313]"
                    aria-label="Change profile photo"
                  >
                    <Camera size={13} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                    Upload new
                  </button>
                  <button type="button" className="rounded-2xl border border-transparent px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white">
                    Remove
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Profile details">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Display name" defaultValue="Maya Kapoor" />
                <TextField label="Username" defaultValue="@mayakapoor" />
                <TextField label="Email" type="email" defaultValue="maya@example.com" />
                <TextField label="Website" placeholder="https://" />
              </div>
              <div className="mt-4">
                <TextField label="Bio" placeholder="Tell people about yourself" />
              </div>
              <button type="button" className="mt-5 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
                Save changes
              </button>
            </SectionCard>
          </>
        );
      case "security":
        return (
          <>
            <SectionCard title="Change password">
              <div className="space-y-4">
                <TextField label="Current password" type="password" />
                <TextField label="New password" type="password" placeholder="At least 8 characters" />
                <TextField label="Confirm new password" type="password" />
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-500 dark:bg-white/5 dark:text-zinc-400">
                  Enter a new password to see its strength.
                </div>
              </div>
              <button type="button" className="mt-5 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">
                Update password
              </button>
            </SectionCard>

            <SectionCard title="Two-factor authentication" subtitle="Add a second step when signing in.">
              <Row title="Require a code at login" desc={twoFA ? "Enabled via authenticator app" : "Currently turned off"}>
                <Toggle checked={twoFA} onChange={setTwoFA} label="Two-factor authentication" />
              </Row>
              <Row title="Backup codes" desc="Generate one-time codes for when you can't use your phone.">
                <button type="button" className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                  Generate
                </button>
              </Row>
            </SectionCard>

            <SectionCard title="Active sessions" subtitle="Where you're currently signed in.">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 py-4 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <Smartphone size={18} className="text-slate-500" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">iPhone 15 Pro · Bhaktapur, NP</div>
                      <div className="text-sm text-slate-500 dark:text-zinc-400">Active now</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-500">This device</span>
                </div>
                <div className="flex items-center justify-between gap-4 py-4">
                  <div className="flex items-center gap-3">
                    <Smartphone size={18} className="text-slate-500" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">Chrome on MacBook Air · Kathmandu, NP</div>
                      <div className="text-sm text-slate-500 dark:text-zinc-400">2 hours ago</div>
                    </div>
                  </div>
                  <button type="button" className="text-sm font-semibold text-rose-500 transition hover:text-rose-400">
                    Sign out
                  </button>
                </div>
              </div>
            </SectionCard>
          </>
        );
      case "language":
        return (
          <SectionCard title="Language & region">
            <Row title="App language" desc="Menus, buttons, and notifications will show in this language.">
              <select className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-black/20 dark:text-white">
                <option>English (US)</option>
                <option>नेपाली (Nepali)</option>
                <option>हिन्दी (Hindi)</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </Row>
            <Row title="Region" desc="Used for date formats and local trends.">
              <select className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-white/10 dark:bg-black/20 dark:text-white">
                <option>Nepal</option>
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
              </select>
            </Row>
            <Row title="Auto-translate posts" desc="Translate posts written in other languages automatically.">
              <Toggle checked={true} onChange={() => undefined} label="Auto-translate posts" />
            </Row>
          </SectionCard>
        );
      case "notifications":
        return (
          <>
            <SectionCard title="Activity" subtitle="Choose what you're notified about.">
              <Row title="Likes" desc="When someone likes your post or comment">
                <Toggle checked={notifications.likes} onChange={(value) => setNotifications({ ...notifications, likes: value })} label="Likes" />
              </Row>
              <Row title="Comments" desc="When someone comments on your post">
                <Toggle checked={notifications.comments} onChange={(value) => setNotifications({ ...notifications, comments: value })} label="Comments" />
              </Row>
              <Row title="New followers" desc="When someone follows you">
                <Toggle checked={notifications.follows} onChange={(value) => setNotifications({ ...notifications, follows: value })} label="Followers" />
              </Row>
              <Row title="Direct messages" desc="When you receive a new message">
                <Toggle checked={notifications.messages} onChange={(value) => setNotifications({ ...notifications, messages: value })} label="Messages" />
              </Row>
              <Row title="Mentions" desc="When someone tags you">
                <Toggle checked={notifications.mentions} onChange={(value) => setNotifications({ ...notifications, mentions: value })} label="Mentions" />
              </Row>
            </SectionCard>

            <SectionCard title="Delivery" subtitle="Where notifications should reach you.">
              <Row title="Push notifications" desc="On this device">
                <Toggle checked={notifications.push} onChange={(value) => setNotifications({ ...notifications, push: value })} label="Push" />
              </Row>
              <Row title="Email digest" desc="A weekly summary sent to your inbox">
                <Toggle checked={notifications.email} onChange={(value) => setNotifications({ ...notifications, email: value })} label="Email" />
              </Row>
            </SectionCard>
          </>
        );
      case "appearance":
        return (
          <>
            <SectionCard title="Theme">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { id: "light", label: "Light", icon: Sun },
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "system", label: "System", icon: Monitor },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = theme === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id)}
                      className={`flex flex-col items-center gap-2 rounded-3xl border px-4 py-5 transition ${isActive ? "border-indigo-400 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-black/20 dark:text-zinc-300 dark:hover:bg-white/5"}`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Accent color" subtitle="Used for buttons, links, and highlights.">
              <div className="flex flex-wrap gap-3">
                {accentColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAccent(color)}
                    aria-label={`Accent ${color}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2"
                    style={{ backgroundColor: color, borderColor: accent === color ? "#1C1B1A" : "transparent" }}
                  >
                    {accent === color ? <Check size={14} className="text-white" /> : null}
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Feed layout">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "card", label: "Card" },
                  { id: "compact", label: "Compact" },
                  { id: "media", label: "Media grid" },
                ].map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${index === 0 ? "border-indigo-400 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300" : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-black/20 dark:text-zinc-300 dark:hover:bg-white/5"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </SectionCard>
          </>
        );
      case "storage":
        return (
          <>
            <SectionCard title="Storage usage">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white">{storageUsed} GB used</span>
                  <span className="text-slate-500 dark:text-zinc-400">of {storageTotal} GB</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10">
                  <div className="h-2 rounded-full bg-linear-to-r from-indigo-500 to-rose-500" style={{ width: `${storagePct}%` }} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Breakdown">
              {[
                { label: "Photos", value: "3.1 GB" },
                { label: "Videos", value: "2.6 GB" },
                { label: "Messages & cache", value: "0.7 GB" },
              ].map((item) => (
                <Row key={item.label} title={item.label}>
                  <span className="text-sm text-slate-500 dark:text-zinc-400">{item.value}</span>
                </Row>
              ))}
            </SectionCard>

            <SectionCard title="Manage" subtitle="Free up space on this device.">
              <Row title="Clear cached media" desc="Downloaded photos and videos will be re-fetched when needed">
                <button type="button" className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                  Clear cache
                </button>
              </Row>
              <Row title="Download your data" desc="Get a copy of everything you've posted">
                <button type="button" className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                  Request archive
                </button>
              </Row>
            </SectionCard>
          </>
        );
      case "billing":
        return (
          <>
            <SectionCard title="Current plan">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">Plus</span>
                    <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Active</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">$8.99/month · renews Aug 1, 2026</p>
                </div>
                <button type="button" className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                  Change plan
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Payment method">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-12 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-bold text-white">
                    VISA
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">•••• •••• •••• 4291</div>
                    <div className="text-sm text-slate-500 dark:text-zinc-400">Expires 09/28</div>
                  </div>
                </div>
                <button type="button" className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300">
                  Update
                </button>
              </div>
            </SectionCard>

            <SectionCard title="Billing history">
              {[
                { date: "Jul 1, 2026", amount: "$8.99", status: "Paid" },
                { date: "Jun 1, 2026", amount: "$8.99", status: "Paid" },
                { date: "May 1, 2026", amount: "$8.99", status: "Paid" },
              ].map((item, index) => (
                <div key={item.date} className={`grid grid-cols-3 items-center gap-2 border-b border-slate-200 py-4 last:border-b-0 dark:border-white/10 ${index === 0 ? "" : ""}`}>
                  <span className="text-sm text-slate-500 dark:text-zinc-400">{item.date}</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.amount}</span>
                  <span className="text-right text-sm font-semibold text-emerald-500">{item.status}</span>
                </div>
              ))}
            </SectionCard>
          </>
        );
      default:
        return null;
    }
  };

  return <div className="space-y-5">{renderSection()}</div>;
}
