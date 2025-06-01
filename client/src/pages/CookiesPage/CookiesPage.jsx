import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cookie, 
  Shield, 
  ToggleLeft, 
  Info, 
  AlertTriangle, 
  Globe,
  CheckSquare,
  ChevronRight,
  ArrowUp,
  Clock,
  Mail,
  X,
  BarChart,
  Fingerprint
} from 'lucide-react';
import styles from './CookiesPage.module.scss';

const CookiesPage = () => {
  // State for navigation and animation
  const [activeSection, setActiveSection] = useState('overview');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lastUpdated] = useState('May 15, 2025');
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    functional: false,
    analytics: false,
    advertising: false
  });
  const [showPreferencesSaved, setShowPreferencesSaved] = useState(false);
  
  // References for the sections
  const overviewRef = useRef(null);
  const essentialRef = useRef(null);
  const functionalRef = useRef(null);
  const analyticsRef = useRef(null);
  const advertisingRef = useRef(null);
  const managementRef = useRef(null);
  const contactRef = useRef(null);
  
  // Sections data for navigation
  const sections = [
    { id: 'overview', label: 'Cookie Overview', icon: <Cookie size={18} />, ref: overviewRef },
    { id: 'essential', label: 'Essential Cookies', icon: <Shield size={18} />, ref: essentialRef },
    { id: 'functional', label: 'Functional Cookies', icon: <ToggleLeft size={18} />, ref: functionalRef },
    { id: 'analytics', label: 'Analytics Cookies', icon: <BarChart size={18} />, ref: analyticsRef },
    { id: 'advertising', label: 'Advertising Cookies', icon: <Globe size={18} />, ref: advertisingRef },
    { id: 'management', label: 'Cookie Management', icon: <Fingerprint size={18} />, ref: managementRef },
    { id: 'contact', label: 'Contact Us', icon: <Mail size={18} />, ref: contactRef },
  ];

  // Handle scroll for section highlighting and back to top button
  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button when scrolled down
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
      
      // Find active section based on scroll position
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current && section.ref.current.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);
  
  // Scroll to section
  const scrollToSection = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (section && section.ref.current) {
      section.ref.current.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };
  
  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle cookie preference toggle
  const handleCookieToggle = (type) => {
    if (type === 'essential') return; // Essential cookies can't be disabled
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // Save cookie preferences
  const saveCookiePreferences = () => {
    // Here you would save to localStorage or send to backend
    setShowPreferencesSaved(true);
    
    setTimeout(() => {
      setShowPreferencesSaved(false);
    }, 3000);
  };
  
  // Accept all cookies
  const acceptAllCookies = () => {
    setCookiePreferences({
      essential: true,
      functional: true,
      analytics: true,
      advertising: true
    });
    
    setShowPreferencesSaved(true);
    
    setTimeout(() => {
      setShowPreferencesSaved(false);
    }, 3000);
  };
  
  // Reject non-essential cookies
  const rejectNonEssentialCookies = () => {
    setCookiePreferences({
      essential: true,
      functional: false,
      analytics: false,
      advertising: false
    });
    
    setShowPreferencesSaved(true);
    
    setTimeout(() => {
      setShowPreferencesSaved(false);
    }, 3000);
  };

  return (
    <div className={styles.cookiesPage}>
      {/* Particle background */}
      <div className={styles.particleContainer}>
        {Array.from({ length: 30 }).map((_, index) => (
          <div
            key={index}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              opacity: Math.random() * 0.5 + 0.1,
              animationDuration: `${Math.random() * 20 + 10}s`,
            }}
          />
        ))}
      </div>
      
      {/* Floating decorative shapes */}
      <motion.div
        className={`${styles.floatingShape} ${styles.shape1}`}
        animate={{
          x: [0, 15, 0],
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.floatingShape} ${styles.shape2}`}
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
      />
      
      {/* Header */}
      <div className={styles.cookiesHeader}>
        <div className={styles.container}>
          <motion.div 
            className={styles.cookiesHeaderContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.cookiesTitle}>Cookie Policy</h1>
            <div className={styles.cookiesSubtitle}>
              Last Updated: <span className={styles.accentText}>{lastUpdated}</span>
            </div>
            
            <div className={styles.effectiveDate}>
              <Clock size={16} />
              <span>Effective immediately for all users</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Success Message */}
      <AnimatePresence>
        {showPreferencesSaved && (
          <motion.div 
            className={styles.successMessage}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CheckSquare size={18} />
            <span>Your cookie preferences have been saved!</span>
            <button className={styles.closeButton} onClick={() => setShowPreferencesSaved(false)}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={styles.cookiesContent}>
        <div className={styles.container}>
          <div className={styles.cookiesGrid}>
            {/* Sidebar Navigation */}
            <div className={styles.cookiesSidebar}>
              <div className={styles.sidebarSticky}>
                <div className={styles.sidebarIntro}>
                  <Cookie size={20} className={styles.sidebarIcon} />
                  <h3>Cookie Settings</h3>
                </div>
                
                <nav className={styles.sidebarNav}>
                  <ul className={styles.sidebarList}>
                    {sections.map((section) => (
                      <li 
                        key={section.id}
                        className={`${styles.sidebarItem} ${activeSection === section.id ? styles.activeSidebarItem : ''}`}
                      >
                        <button 
                          className={styles.sidebarButton}
                          onClick={() => scrollToSection(section.id)}
                        >
                          <span className={styles.sidebarIcon}>{section.icon}</span>
                          <span className={styles.sidebarLabel}>{section.label}</span>
                          <ChevronRight size={14} className={styles.sidebarArrow} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                <div className={styles.sidebarActions}>
                  <button className={styles.acceptAllButton} onClick={acceptAllCookies}>
                    Accept All Cookies
                  </button>
                  <button className={styles.rejectButton} onClick={rejectNonEssentialCookies}>
                    Essential Only
                  </button>
                  <button className={styles.saveButton} onClick={saveCookiePreferences}>
                    Save Preferences
                  </button>
                </div>
                
                <div className={styles.sidebarLinks}>
                  <Link to="/privacy-policy" className={styles.sidebarLink}>
                    Privacy Policy
                  </Link>
                  <Link to="/terms-of-service" className={styles.sidebarLink}>
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className={styles.cookiesMain}>
              <div className={styles.cookiesIntro}>
                <p>
                  At PODNEX, we use cookies and similar technologies to enhance your browsing experience, 
                  personalize content, and analyze our traffic. This Cookie Policy explains how and why 
                  we use these technologies and the choices you have.
                </p>
                <p className={styles.cookiesHighlight}>
                  By using our platform, you consent to our use of cookies in accordance with this 
                  Cookie Policy. You can manage your cookie preferences at any time using the controls on this page.
                </p>
              </div>
              
              {/* 1. Overview */}
              <div ref={overviewRef} id="overview" className={styles.cookiesSection}>
                <div className={styles.cookiesSectionHeader}>
                  <Cookie size={24} className={styles.cookiesSectionIcon} />
                  <h2>1. Cookie Overview</h2>
                </div>
                
                <div className={styles.cookiesSectionContent}>
                  <p>
                    Cookies are small text files that are placed on your device when you visit our website. 
                    They are widely used to make websites work more efficiently and provide information to 
                    the website owners.
                  </p>
                  
                  <div className={styles.cookieManagerPreview}>
                    <div className={styles.cookieManagerHeader}>
                      <h3>Your Cookie Preferences</h3>
                      <p>You can customize which cookies you allow us to use. Essential cookies cannot be disabled as they are necessary for the website to function properly.</p>
                    </div>
                    
                    <div className={styles.cookieToggles}>
                      {/* Essential Cookies */}
                      <div className={styles.cookieToggleRow}>
                        <div className={styles.cookieToggleInfo}>
                          <h4>Essential Cookies</h4>
                          <p>Necessary for the website to function properly. Cannot be disabled.</p>
                        </div>
                        <div className={styles.cookieToggleControl}>
                          <button 
                            className={`${styles.cookieToggleButton} ${styles.active} ${styles.disabled}`}
                            disabled={true}
                          >
                            <span className={styles.toggleTrack}>
                              <span className={styles.toggleKnob}></span>
                            </span>
                            <span className={styles.toggleLabel}>Enabled</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Functional Cookies */}
                      <div className={styles.cookieToggleRow}>
                        <div className={styles.cookieToggleInfo}>
                          <h4>Functional Cookies</h4>
                          <p>Enable personalized features and preferences.</p>
                        </div>
                        <div className={styles.cookieToggleControl}>
                          <button 
                            className={`${styles.cookieToggleButton} ${cookiePreferences.functional ? styles.active : ''}`}
                            onClick={() => handleCookieToggle('functional')}
                          >
                            <span className={styles.toggleTrack}>
                              <span className={styles.toggleKnob}></span>
                            </span>
                            <span className={styles.toggleLabel}>
                              {cookiePreferences.functional ? 'Enabled' : 'Disabled'}
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Analytics Cookies */}
                      <div className={styles.cookieToggleRow}>
                        <div className={styles.cookieToggleInfo}>
                          <h4>Analytics Cookies</h4>
                          <p>Help us improve our website by collecting anonymous usage data.</p>
                        </div>
                        <div className={styles.cookieToggleControl}>
                          <button 
                            className={`${styles.cookieToggleButton} ${cookiePreferences.analytics ? styles.active : ''}`}
                            onClick={() => handleCookieToggle('analytics')}
                          >
                            <span className={styles.toggleTrack}>
                              <span className={styles.toggleKnob}></span>
                            </span>
                            <span className={styles.toggleLabel}>
                              {cookiePreferences.analytics ? 'Enabled' : 'Disabled'}
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Advertising Cookies */}
                      <div className={styles.cookieToggleRow}>
                        <div className={styles.cookieToggleInfo}>
                          <h4>Advertising Cookies</h4>
                          <p>Enable personalized ads and measure ad performance.</p>
                        </div>
                        <div className={styles.cookieToggleControl}>
                          <button 
                            className={`${styles.cookieToggleButton} ${cookiePreferences.advertising ? styles.active : ''}`}
                            onClick={() => handleCookieToggle('advertising')}
                          >
                            <span className={styles.toggleTrack}>
                              <span className={styles.toggleKnob}></span>
                            </span>
                            <span className={styles.toggleLabel}>
                              {cookiePreferences.advertising ? 'Enabled' : 'Disabled'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.cookieManagerActions}>
                      <button className={styles.acceptAllButton} onClick={acceptAllCookies}>
                        Accept All
                      </button>
                      <button className={styles.rejectButton} onClick={rejectNonEssentialCookies}>
                        Essential Only
                      </button>
                      <button className={styles.saveButton} onClick={saveCookiePreferences}>
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 2. Essential Cookies */}
              <div ref={essentialRef} id="essential" className={styles.cookiesSection}>
                <div className={styles.cookiesSectionHeader}>
                  <Shield size={24} className={styles.cookiesSectionIcon} />
                  <h2>2. Essential Cookies</h2>
                </div>
                
                <div className={styles.cookiesSectionContent}>
                  <p>
                    Essential cookies are necessary for the website to function properly. They enable core 
                    functionality such as security, network management, and account access. You cannot 
                    disable these cookies.
                  </p>
                  
                  <h3>Why We Use Essential Cookies</h3>
                  <ul className={styles.contentList}>
                    <li>To authenticate your account and keep you logged in</li>
                    <li>To prevent fraudulent activities and enhance security</li>
                    <li>To remember items in your cart or saved workspaces</li>
                    <li>To process transactions and handle payment information</li>
                    <li>To ensure the website operates correctly</li>
                  </ul>
                  
                  <div className={styles.cookieTable}>
                    <div className={styles.cookieTableHeader}>
                      <div className={styles.cookieTableCell}>Cookie Name</div>
                      <div className={styles.cookieTableCell}>Purpose</div>
                      <div className={styles.cookieTableCell}>Duration</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>PODNEX_SESSION</div>
                      <div className={styles.cookieTableCell}>Maintains your authenticated session</div>
                      <div className={styles.cookieTableCell}>Session</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>CSRF_TOKEN</div>
                      <div className={styles.cookieTableCell}>Prevents cross-site request forgery attacks</div>
                      <div className={styles.cookieTableCell}>1 hour</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>ACCOUNT_AUTH</div>
                      <div className={styles.cookieTableCell}>Verifies your authentication status</div>
                      <div className={styles.cookieTableCell}>7 days</div>
                    </div>
                  </div>
                  
                  <div className={styles.alertBox}>
                    <AlertTriangle size={20} />
                    <p>
                      Essential cookies cannot be disabled as they are necessary for the website to function properly. 
                      Without these cookies, certain features of the website would not be available.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 3. Functional Cookies */}
              <div ref={functionalRef} id="functional" className={styles.cookiesSection}>
                <div className={styles.cookiesSectionHeader}>
                  <ToggleLeft size={24} className={styles.cookiesSectionIcon} />
                  <h2>3. Functional Cookies</h2>
                </div>
                
                <div className={styles.cookiesSectionContent}>
                  <p>
                    Functional cookies enable the website to provide enhanced functionality and personalization. 
                    They may be set by us or by third-party providers whose services we have added to our pages.
                  </p>
                  
                  <div className={styles.cookieToggleBar}>
                    <div className={styles.cookieToggleInfo}>
                      <h4>Functional Cookies</h4>
                      <p>Enable personalized features and preferences</p>
                    </div>
                    <button 
                      className={`${styles.cookieToggleButton} ${cookiePreferences.functional ? styles.active : ''}`}
                      onClick={() => handleCookieToggle('functional')}
                    >
                      <span className={styles.toggleTrack}>
                        <span className={styles.toggleKnob}></span>
                      </span>
                      <span className={styles.toggleLabel}>
                        {cookiePreferences.functional ? 'Enabled' : 'Disabled'}
                      </span>
                    </button>
                  </div>
                  
                  <div className={styles.cookieTable}>
                    <div className={styles.cookieTableHeader}>
                      <div className={styles.cookieTableCell}>Cookie Name</div>
                      <div className={styles.cookieTableCell}>Purpose</div>
                      <div className={styles.cookieTableCell}>Duration</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>LANGUAGE_PREF</div>
                      <div className={styles.cookieTableCell}>Remembers your language preference</div>
                      <div className={styles.cookieTableCell}>1 year</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>UI_THEME</div>
                      <div className={styles.cookieTableCell}>Saves your light/dark mode preference</div>
                      <div className={styles.cookieTableCell}>1 year</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>RECENT_VIEWS</div>
                      <div className={styles.cookieTableCell}>Tracks recently viewed pods</div>
                      <div className={styles.cookieTableCell}>30 days</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 4. Analytics Cookies */}
              <div ref={analyticsRef} id="analytics" className={styles.cookiesSection}>
                <div className={styles.cookiesSectionHeader}>
                  <BarChart size={24} className={styles.cookiesSectionIcon} />
                  <h2>4. Analytics Cookies</h2>
                </div>
                
                <div className={styles.cookiesSectionContent}>
                  <p>
                    Analytics cookies help us understand how visitors interact with our website by collecting 
                    and reporting information anonymously. They help us improve our website and services.
                  </p>
                  
                  <div className={styles.cookieToggleBar}>
                    <div className={styles.cookieToggleInfo}>
                      <h4>Analytics Cookies</h4>
                      <p>Help us improve our website by collecting anonymous usage data</p>
                    </div>
                    <button 
                      className={`${styles.cookieToggleButton} ${cookiePreferences.analytics ? styles.active : ''}`}
                      onClick={() => handleCookieToggle('analytics')}
                    >
                      <span className={styles.toggleTrack}>
                        <span className={styles.toggleKnob}></span>
                      </span>
                      <span className={styles.toggleLabel}>
                        {cookiePreferences.analytics ? 'Enabled' : 'Disabled'}
                      </span>
                    </button>
                  </div>
                  
                  <div className={styles.cookieTable}>
                    <div className={styles.cookieTableHeader}>
                      <div className={styles.cookieTableCell}>Cookie Name</div>
                      <div className={styles.cookieTableCell}>Purpose</div>
                      <div className={styles.cookieTableCell}>Duration</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>_ga</div>
                      <div className={styles.cookieTableCell}>Google Analytics - Distinguishes unique users</div>
                      <div className={styles.cookieTableCell}>2 years</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>_gid</div>
                      <div className={styles.cookieTableCell}>Google Analytics - Identifies user session</div>
                      <div className={styles.cookieTableCell}>24 hours</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>PODNEX_METRICS</div>
                      <div className={styles.cookieTableCell}>Measures site performance and user flows</div>
                      <div className={styles.cookieTableCell}>90 days</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 5. Advertising Cookies */}
              <div ref={advertisingRef} id="advertising" className={styles.cookiesSection}>
                <div className={styles.cookiesSectionHeader}>
                  <Globe size={24} className={styles.cookiesSectionIcon} />
                  <h2>5. Advertising Cookies</h2>
                </div>
                
                <div className={styles.cookiesSectionContent}>
                  <p>
                    Advertising cookies are used to track visitors across websites. They are used to display 
                    ads that are relevant and engaging for individual users, and to measure the effectiveness 
                    of advertising campaigns.
                  </p>
                  
                  <div className={styles.cookieToggleBar}>
                    <div className={styles.cookieToggleInfo}>
                      <h4>Advertising Cookies</h4>
                      <p>Enable personalized ads and measure ad performance</p>
                    </div>
                    <button 
                      className={`${styles.cookieToggleButton} ${cookiePreferences.advertising ? styles.active : ''}`}
                      onClick={() => handleCookieToggle('advertising')}
                    >
                      <span className={styles.toggleTrack}>
                        <span className={styles.toggleKnob}></span>
                      </span>
                      <span className={styles.toggleLabel}>
                        {cookiePreferences.advertising ? 'Enabled' : 'Disabled'}
                      </span>
                    </button>
                  </div>
                  
                  <div className={styles.cookieTable}>
                    <div className={styles.cookieTableHeader}>
                      <div className={styles.cookieTableCell}>Cookie Name</div>
                      <div className={styles.cookieTableCell}>Purpose</div>
                      <div className={styles.cookieTableCell}>Duration</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>_fbp</div>
                      <div className={styles.cookieTableCell}>Facebook Pixel - Tracks conversions</div>
                      <div className={styles.cookieTableCell}>90 days</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>IDE</div>
                      <div className={styles.cookieTableCell}>Google DoubleClick - Used for targeted advertising</div>
                      <div className={styles.cookieTableCell}>1 year</div>
                    </div>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableCell}>PODNEX_RECS</div>
                      <div className={styles.cookieTableCell}>Powers personalized recommendations</div>
                      <div className={styles.cookieTableCell}>60 days</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 6. Cookie Management */}
              <div ref={managementRef} id="management" className={styles.cookiesSection}>
                <div className={styles.cookiesSectionHeader}>
                  <Fingerprint size={24} className={styles.cookiesSectionIcon} />
                  <h2>6. Cookie Management</h2>
                </div>
                
                <div className={styles.cookiesSectionContent}>
                  <p>
                    In addition to the preferences controls on this page, you can manage cookies through 
                    your browser settings. Most web browsers allow you to control cookies through their 
                    settings preferences.
                  </p>
                  
                  <div className={styles.browserGrid}>
                    <div className={styles.browserCard}>
                      <h4>Google Chrome</h4>
                      <ol className={styles.browserSteps}>
                        <li>Click the three dots in the top-right corner</li>
                        <li>Select "Settings"</li>
                        <li>Click "Privacy and Security"</li>
                        <li>Select "Cookies and other site data"</li>
                        <li>Choose your preferred cookie settings</li>
                      </ol>
                    </div>
                    
                    <div className={styles.browserCard}>
                      <h4>Mozilla Firefox</h4>
                      <ol className={styles.browserSteps}>
                        <li>Click the three lines in the top-right corner</li>
                        <li>Select "Options" (Windows) or "Preferences" (Mac)</li>
                        <li>Click "Privacy & Security"</li>
                        <li>Under "Cookies and Site Data," choose your settings</li>
                      </ol>
                    </div>
                    
                    <div className={styles.browserCard}>
                      <h4>Safari</h4>
                      <ol className={styles.browserSteps}>
                        <li>Click "Safari" in the menu bar</li>
                        <li>Select "Preferences"</li>
                        <li>Click the "Privacy" tab</li>
                        <li>Choose your cookie settings</li>
                      </ol>
                    </div>
                    
                    <div className={styles.browserCard}>
                      <h4>Microsoft Edge</h4>
                      <ol className={styles.browserSteps}>
                        <li>Click the three dots in the top-right corner</li>
                        <li>Select "Settings"</li>
                        <li>Click "Cookies and site permissions"</li>
                        <li>Select "Manage and delete cookies and site data"</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 7. Contact Us */}
              <div ref={contactRef} id="contact" className={styles.cookiesSection}>
                <div className={styles.cookiesSectionHeader}>
                  <Mail size={24} className={styles.cookiesSectionIcon} />
                  <h2>7. Contact Us</h2>
                </div>
                
                <div className={styles.cookiesSectionContent}>
                  <p>
                    If you have any questions about this Cookie Policy or our data practices, please contact us:
                  </p>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactMethod}>
                      <span className={styles.contactLabel}>Privacy Team:</span>
                      <a href="mailto:privacy@podnex.com" className={styles.contactLink}>privacy@podnex.com</a>
                    </div>
                    <div className={styles.contactMethod}>
                      <span className={styles.contactLabel}>Data Protection Officer:</span>
                      <a href="mailto:dpo@podnex.com" className={styles.contactLink}>dpo@podnex.com</a>
                    </div>
                    <div className={styles.contactMethod}>
                      <span className={styles.contactLabel}>Address:</span>
                      <address className={styles.contactAddress}>
                        PODNEX, Inc.<br />
                        123 Creator Avenue<br />
                        Suite 456<br />
                        San Francisco, CA 94107<br />
                        United States
                      </address>
                    </div>
                  </div>
                  
                  <div className={styles.contactActions}>
                    <Link to="/contact" className={styles.contactButton}>
                      Contact Form
                    </Link>
                    <Link to="/support" className={styles.contactButton}>
                      Help Center
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          className={styles.backToTopButton}
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
      
      {/* Footer Banner */}
      <div className={styles.cookiesFooter}>
        <div className={styles.container}>
          <div className={styles.cookiesFooterContent}>
            <h3>Manage Your Cookie Preferences</h3>
            <p>You have control over how we use cookies on our site. Update your preferences at any time.</p>
            <div className={styles.cookiesFooterActions}>
              <button onClick={acceptAllCookies} className={styles.footerButton}>
                Accept All Cookies
              </button>
              <button onClick={rejectNonEssentialCookies} className={styles.footerButtonSecondary}>
                Essential Only
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;