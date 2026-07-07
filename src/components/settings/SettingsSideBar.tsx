import { Bell, CreditCard, Globe, HardDrive, Lock, Palette, Search, Settings, User } from "lucide-react";

const NAV = {
  profile: { label: "Update profile", icon: User },
  security: { label: "Password & security", icon: Lock },
  language: { label: "Language & region", icon: Globe },
  notifications: { label: "Notifications", icon: Bell },
  appearance: { label: "Appearance", icon: Palette },
  storage: { label: "Storage", icon: HardDrive },
  billing: { label: "Billing", icon: CreditCard },
} as const;

type SettingsSectionId = keyof typeof NAV;

type SettingsSidebarProps = {
  activeSection: SettingsSectionId;
  onSectionChange: (section: SettingsSectionId) => void;
  search: string;
  onSearchChange: (value: string) => void;
  items: ReadonlyArray<{ id: SettingsSectionId; label: string }>;
};

const SettingsSidebar = ({ activeSection, onSectionChange, search, onSearchChange, items }: SettingsSidebarProps) => {
  const visibleItems = items.length > 0 ? items : Object.entries(NAV).map(([id, value]) => ({ id: id as SettingsSectionId, label: value.label }));

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-auto border-r border-slate-300 bg-white px-2 py-4 dark:border-white/10 dark:bg-black/50 lg:flex scrollbar-hide item-center">
      <div className="flex items-center px-3 cursor-pointer">
        <Settings size={20} className="text-slate-900 dark:text-white " />
        <h1 className="ml-4 text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </div>
      <div className="gap-2 rounded-full border border-slate-300 px-2 m-4 dark:border-white/10">
        <label htmlFor="search" >
          <div className="flex items-center gap-2 py-1.5 text-slate-400 dark:text-slate-500 cursor-pointer">
          <Search size={14} />
          <input
            type="text"
            id="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="shrink-0 flex-1 bg-transparent text-sm outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            placeholder='Search settings'
          />
        </div>
        </label>
      </div>
      <ul className="flex flex-col gap-1 ">
        {visibleItems.map((item) => {
          const Icon = NAV[item.id].icon;
          const isActive = activeSection === item.id;
       
          return (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg p-3 text-left text-sm cursor-pointer ${isActive ? "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white" : "text-slate-900 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-800"}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default SettingsSidebar