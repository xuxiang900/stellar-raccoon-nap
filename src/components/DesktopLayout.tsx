import { ReactNode } from "react";
import { LayoutDashboard, Menu } from "lucide-react";

interface DesktopLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: <LayoutDashboard className="w-5 h-5 mr-2" />, label: "仪表盘" },
  { icon: <Menu className="w-5 h-5 mr-2" />, label: "菜单一" },
  { icon: <Menu className="w-5 h-5 mr-2" />, label: "菜单二" },
];

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="w-[1200px] h-[768px] bg-white rounded-2xl shadow-2xl flex overflow-hidden border mx-auto my-12">
      {/* 左侧侧边栏 */}
      <aside className="w-64 bg-gray-50 border-r flex flex-col items-center py-8">
        {/* logo+名称 */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-2">
            <span className="text-white text-2xl font-bold">🍏</span>
          </div>
          <span className="text-lg font-semibold text-gray-800 mt-1">Mac原型App</span>
        </div>
        {/* 主菜单 */}
        <nav className="flex-1 w-full">
          <ul className="space-y-2 px-4">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <button className="flex items-center w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-100 transition">
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* 右侧工作区 */}
      <main className="flex-1 bg-gray-100 p-8 flex flex-col">{children}</main>
    </div>
  );
}