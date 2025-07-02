import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import {
  FaTachometerAlt,
  FaCalendarCheck,
  FaReceipt,
  FaUserMd,
  FaFlask,
  FaClipboardList,
  FaRoute,
  FaChartBar,
  FaAngleDown,
  FaUsers,
  FaChartPie,
  FaTimes
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [contactsOpen, setContactsOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Update mobile menu visibility based on isOpen prop
  useEffect(() => {
    if (isMobile) {
      setShowMobileMenu(isOpen);
    } else {
      // Ensure mobile menu is closed when switching to desktop
      setShowMobileMenu(false);
    }
  }, [isOpen, isMobile]);

  // Auto-expand sections based on current route
  useEffect(() => {
    if (location.pathname.startsWith('/contact')) {
      setContactsOpen(true);
    }
    if (location.pathname.startsWith('/dcr') || location.pathname.startsWith('/tours')) {
      setActivitiesOpen(true);
    }
    if (location.pathname.startsWith('/reports')) {
      setReportsOpen(true);
    }
  }, [location.pathname]);

  // Don't show sidebar on login page
  if (location.pathname === '/login') {
    return null;
  }

  const NavItem = ({ to, icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-2.5 text-gray-700 rounded-md transition-colors",
          "hover:bg-gray-100 hover:text-blue-600",
          isActive && "bg-blue-50 text-blue-700 font-medium shadow-sm",
          !isOpen && !isMobile && "justify-center px-2"
        )
      }
      title={label} // Add title for tooltip on hover in collapsed mode
    >
      <span className={cn("text-lg mr-3", !isOpen && !isMobile && "mr-0")}>{icon}</span>
      <span className={cn("transition-opacity duration-200", (!isOpen && !isMobile) && "hidden")}>
        {label}
      </span>
    </NavLink>
  );

  const SectionTitle = ({ title, isExpanded, toggleExpand, children, icon }) => (
    <div className="mb-2">
      <button
        onClick={toggleExpand}
        className={cn(
          "flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider",
          "hover:bg-gray-50 rounded-md",
          !isOpen && !isMobile && "justify-center px-2"
        )}
        title={title} // Add title for tooltip on hover in collapsed mode
      >
        <div className="flex items-center">
          {icon && <span className={cn("text-lg mr-2 text-gray-500", !isOpen && !isMobile && "mr-0")}>{icon}</span>}
          <span className={cn("transition-opacity duration-200", (!isOpen && !isMobile) && "hidden")}>
            {title}
          </span>
        </div>
        <FaAngleDown
          className={cn(
            "transition-transform duration-200",
            isExpanded && "rotate-180",
            (!isOpen && !isMobile) && "hidden"
          )}
        />
      </button>
      <div className={cn(
        "space-y-1 mt-1 pl-4", // Keep padding for expanded items
        // Only hide children when section is not expanded (original logic)
        !isExpanded && "hidden"
      )}>
        {children}
      </div>
    </div>
  );

  // Define the navigation structure
  const navStructure = [
    { type: 'item', to: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { type: 'item', to: '/leave', icon: <FaCalendarCheck />, label: 'Leave Requests' },
    { type: 'item', to: '/expense', icon: <FaReceipt />, label: 'Expense Claims' },
    { type: 'separator' },
    {
      type: 'section',
      title: 'Contacts',
      icon: <FaUsers />,
      stateKey: 'contactsOpen',
      children: [
        { to: '/contact/doctors', icon: <FaUserMd />, label: 'Doctors' },
        { to: '/contact/chemists', icon: <FaFlask />, label: 'Chemists' },
      ],
    },
    {
      type: 'section',
      title: 'Activities',
      icon: <FaClipboardList />,
      stateKey: 'activitiesOpen',
      children: [
        { to: '/dcr', icon: <FaClipboardList />, label: 'Daily Call Reports' },
        { to: '/tours', icon: <FaRoute />, label: 'Tour Programs' },
      ],
    },
    {
      type: 'section',
      title: 'Reports',
      icon: <FaChartPie />,
      stateKey: 'reportsOpen',
      children: [
        { to: '/reports', icon: <FaChartBar />, label: 'Summary Reports' },
      ],
    },
  ];

  // Helper function to get state and toggle function based on key
  const getStateAndToggle = (key) => {
    switch (key) {
      case 'contactsOpen': return { isExpanded: contactsOpen, toggleExpand: () => setContactsOpen(!contactsOpen) };
      case 'activitiesOpen': return { isExpanded: activitiesOpen, toggleExpand: () => setActivitiesOpen(!activitiesOpen) };
      case 'reportsOpen': return { isExpanded: reportsOpen, toggleExpand: () => setReportsOpen(!reportsOpen) };
      default: return { isExpanded: false, toggleExpand: () => {} };
    }
  };

  // Flatten the structure for the collapsed view
  const flatNavItems = navStructure.flatMap(item => {
    if (item.type === 'item') {
      return [{ to: item.to, icon: item.icon, label: item.label }];
    }
    if (item.type === 'section') {
      return item.children.map(child => ({ to: child.to, icon: child.icon, label: child.label }));
    }
    return []; // Ignore separators in flat view
  });

  // Mobile sidebar using Sheet component
  if (isMobile) {
    return (
      <Sheet
        open={showMobileMenu}
        onOpenChange={(open) => {
          setShowMobileMenu(open);

          // Sync the sidebar state with the sheet state
          if (!open && isOpen) {
            // Find the toggle button more reliably using ID
            const toggleButton = document.getElementById('sidebar-toggle-button');
            if (toggleButton) {
              toggleButton.click();
            } else {
              // Fallback to aria-label if ID not found
              const toggleButtonByAriaLabel = document.querySelector('button[aria-label="Toggle sidebar"]');
              if (toggleButtonByAriaLabel) {
                toggleButtonByAriaLabel.click();
              } else {
                console.warn("Toggle sidebar button not found");
              }
            }
          }
        }}
      >
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <span className="bg-blue-600 text-white p-1 rounded mr-2">SR</span>
                <span className="font-bold text-xl">SalesRM</span>
              </div>
            </div>
            <ScrollArea className="flex-1 py-2">
              <div className="px-3 py-2">
                {navStructure.map((item, index) => {
                  if (item.type === 'item') {
                    return <NavItem key={item.to || index} {...item} />;
                  }
                  if (item.type === 'separator') {
                    return <Separator key={`sep-${index}`} className="my-4" />;
                  }
                  if (item.type === 'section') {
                    const { isExpanded, toggleExpand } = getStateAndToggle(item.stateKey);
                    return (
                      <SectionTitle
                        key={item.title}
                        title={item.title}
                        icon={item.icon}
                        isExpanded={isExpanded}
                        toggleExpand={toggleExpand}
                      >
                        {item.children.map((child) => (
                          <NavItem key={child.to} {...child} />
                        ))}
                      </SectionTitle>
                    );
                  }
                  return null;
                })}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 h-screen overflow-hidden transition-all duration-300 fixed sticky top-0 z-50",
        "flex-shrink-0",
        isOpen ? "w-64" : "w-20",
        isMobile ? "hidden" : "flex flex-col"
      )}
    >
      <ScrollArea className="flex-1">
        <div className="py-6 px-3">
          {isOpen ? (
            // Expanded View: Render sections and items
            <nav className="space-y-1">
              {navStructure.map((item, index) => {
                if (item.type === 'item') {
                  return <NavItem key={item.to || index} {...item} />;
                }
                if (item.type === 'separator') {
                  return <Separator key={`sep-${index}`} className="my-4" />;
                }
                if (item.type === 'section') {
                  const { isExpanded, toggleExpand } = getStateAndToggle(item.stateKey);
                  return (
                    <SectionTitle
                      key={item.title}
                      title={item.title}
                      icon={item.icon}
                      isExpanded={isExpanded}
                      toggleExpand={toggleExpand}
                    >
                      {item.children.map((child) => (
                        <NavItem key={child.to} {...child} />
                      ))}
                    </SectionTitle>
                  );
                }
                return null;
              })}
            </nav>
          ) : (
            // Collapsed View: Render flat list of all NavItems
            <nav className="space-y-1">
              {flatNavItems.map((item, index) => (
                <NavItem key={item.to || index} {...item} />
              ))}
            </nav>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;