
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.members': 'Members',
    'nav.finances': 'Finances',
    'nav.facilities': 'Facilities',
    'nav.announcements': 'Announcements',
    'nav.documents': 'Documents',
    'nav.settings': 'Settings',
    'nav.activity': 'Activity Log',
    
    // Common
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    
    // Financial Management
    'finances.title': 'Financial Management',
    'finances.subtitle': 'Track expenses, manage budgets, and monitor society finances',
    'finances.add_expense': 'Add Expense',
    'finances.total_expenses': 'Total Expenses',
    'finances.budget_allocated': 'Budget Allocated',
    'finances.variance': 'Variance',
    'finances.pending_approvals': 'Pending Approvals',
    'finances.budget_utilization': 'Budget Utilization',
    'finances.expense_categories': 'Expense Categories',
    'finances.recent_expenses': 'Recent Expenses',
    
    // Quick Actions
    'quick_actions.title': 'Quick Actions',
    'quick_actions.add_expense': 'Add New Expense',
    'quick_actions.send_announcement': 'Send Announcement',
    'quick_actions.generate_report': 'Generate Report',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Configure society settings, user permissions, and system preferences',
    
    // Members
    'members.title': 'Member Management',
    'members.subtitle': 'Manage residents, track payments, and handle communications',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.members': 'सदस्य',
    'nav.finances': 'वित्त',
    'nav.facilities': 'सुविधाएं',
    'nav.announcements': 'घोषणाएं',
    'nav.documents': 'दस्तावेज',
    'nav.settings': 'सेटिंग्स',
    'nav.activity': 'गतिविधि लॉग',
    
    // Common
    'common.add': 'जोड़ें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.close': 'बंद करें',
    'common.loading': 'लोड हो रहा है...',
    'common.search': 'खोजें',
    'common.filter': 'फिल्टर',
    'common.export': 'निर्यात',
    
    // Financial Management
    'finances.title': 'वित्तीय प्रबंधन',
    'finances.subtitle': 'खर्च ट्रैक करें, बजट प्रबंधन करें, और सोसाइटी वित्त की निगरानी करें',
    'finances.add_expense': 'खर्च जोड़ें',
    'finances.total_expenses': 'कुल खर्च',
    'finances.budget_allocated': 'आवंटित बजट',
    'finances.variance': 'भिन्नता',
    'finances.pending_approvals': 'लंबित अनुमोदन',
    'finances.budget_utilization': 'बजट उपयोग',
    'finances.expense_categories': 'खर्च श्रेणियां',
    'finances.recent_expenses': 'हाल के खर्च',
    
    // Quick Actions
    'quick_actions.title': 'त्वरित कार्य',
    'quick_actions.add_expense': 'नया खर्च जोड़ें',
    'quick_actions.send_announcement': 'घोषणा भेजें',
    'quick_actions.generate_report': 'रिपोर्ट बनाएं',
    
    // Settings
    'settings.title': 'सेटिंग्स',
    'settings.subtitle': 'सोसाइटी सेटिंग्स, उपयोगकर्ता अनुमतियां और सिस्टम प्राथमिकताएं कॉन्फ़िगर करें',
    
    // Members
    'members.title': 'सदस्य प्रबंधन',
    'members.subtitle': 'निवासियों का प्रबंधन करें, भुगतान ट्रैक करें और संचार संभालें',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
