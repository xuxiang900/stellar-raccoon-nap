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
      <aside className="w-64 bg-gray-50 border-r flex flex-col items-center py-8 relative">
        {/* 苹果圆点按钮 */}
        <div className="absolute left-4 top-4 flex space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-red-300"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-200"></span>
          <span className="w-3 h-3 rounded-full bg-green-500 border border-green-300"></span>
        </div>
        {/* logo+名称+版本号 左右分栏 */}
        <div className="flex flex-row items-start mb-12 mt-8 w-full px-8">
          {/* logo */}
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-3 shrink-0">
            <span className="text-white text-2xl font-bold">🍏</span>
          </div>
          {/* 名称+版本号 垂直排列 */}
          <div className="flex flex-col justify-center">
            <span className="text-lg font-semibold text-gray-800 text-left">BookFab</span>
            <span className="text-xs text-gray-400 text-left mt-1">v1.0.0.0</span>
          </div>
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