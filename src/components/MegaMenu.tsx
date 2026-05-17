// src/components/Megamenu.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const menuItems = [
  {
    name: 'الکتروموتور',
    href: '/electromotor',
    subItems: [
      { name: 'الکتروموتور سه فاز', href: '/three-phase' },
      { name: 'الکتروموتور تک فاز', href: '/single-phase' },
      { name: 'الکتروموتور ضد انفجار', href: '/explosion-proof' },
      { name: 'الکتروموتور موتوژن', href: '/motogen' },
      { name: 'الکتروموتور جمکو', href: '/jemco' },
    ]
  },
  {
    name: 'گیربکس صنعتی',
    href: '/gearbox',
    subItems: [
      { name: 'گیربکس حلزونی', href: '/worm-gearbox' },
      { name: 'گیربکس هلیکال', href: '/helical-gearbox' },
      { name: 'گیربکس خورشیدی', href: '/planetary-gearbox' },
      { name: 'گیربکس شریف', href: '/sharif-gearbox' },
    ]
  },
  {
    name: 'پمپ',
    href: '/pump',
    subItems: [
      { name: 'پمپ آب خانگی', href: '/home-pump' },
      { name: 'پمپ صنعتی', href: '/industrial-pump' },
      { name: 'پمپ پمپیران', href: '/pumpiran' },
      { name: 'پمپ لئو', href: '/leo-pump' },
    ]
  },
  {
    name: 'اینورتر',
    href: '/inverter',
    subItems: [
      { name: 'اینورتر سه فاز', href: '/three-phase-inverter' },
      { name: 'اینورتر تک فاز', href: '/single-phase-inverter' },
      { name: 'اینورتر LS', href: '/ls-inverter' },
    ]
  },
  { name: 'موتور ویبره', href: '/vibrator', subItems: [] },
  { name: 'تماس با ما', href: '/contact', subItems: [] },
];

const Megamenu = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <nav className="hidden lg:block">
      <ul className="flex gap-1">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className="relative group"
            onMouseEnter={() => setActiveMenu(item.name)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <a
              href={item.href}
              className="flex items-center gap-1 px-4 py-3 text-gray-700 hover:text-primary-500 transition-colors font-medium"
            >
              {item.name}
              {item.subItems.length > 0 && (
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              )}
            </a>
            
            {/* Dropdown Megamenu */}
            {item.subItems.length > 0 && activeMenu === item.name && (
              <div className="absolute top-full right-0 w-64 bg-white shadow-xl rounded-lg border border-gray-100 py-2 z-50 animate-fadeIn">
                {item.subItems.map((sub) => (
                  <a
                    key={sub.name}
                    href={sub.href}
                    className="block px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    {sub.name}
                  </a>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Megamenu;