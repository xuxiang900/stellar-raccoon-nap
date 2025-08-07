import DesktopLayout from "@/components/DesktopLayout";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <DesktopLayout>
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">欢迎来到工作区</h1>
          <p className="text-gray-600 mb-8">这里是你的Mac桌面应用原型工作区。</p>
          <MadeWithDyad />
        </div>
      </DesktopLayout>
    </div>
  );
};

export default Index;