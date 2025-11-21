import FloatingDockDemo from "@/components/floating-dock-demo";

export default function FloatingDockTestPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent">
                        FloatingDock Component Demo
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        macOS-style floating navigation with hover magnification
                    </p>
                </div>

                {/* Main Demo */}
                <FloatingDockDemo />

                {/* Instructions */}
                <div className="mt-16 max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl">
                        <h2 className="text-2xl font-bold mb-4">How to Use</h2>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">•</span>
                                <div>
                                    <strong className="text-foreground">Desktop:</strong> Hover over icons to see the magnification effect
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">•</span>
                                <div>
                                    <strong className="text-foreground">Mobile:</strong> Click the menu button to expand/collapse
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="text-purple-500 mr-2">•</span>
                                <div>
                                    <strong className="text-foreground">Tooltips:</strong> Hover to see navigation item names
                                </div>
                            </li>
                        </ul>

                        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                            <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">
                                Integration Code
                            </h3>
                            <pre className="text-sm overflow-x-auto">
                                <code className="text-purple-800 dark:text-purple-300">
                                    {`import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome } from "@tabler/icons-react";

const links = [
  {
    title: "Home",
    icon: <IconHome className="h-full w-full" />,
    href: "/",
  },
];

<FloatingDock items={links} />`}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
