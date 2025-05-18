import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  User, 
  Lock, 
  Database, 
  AlertTriangle, 
  Globe,
  Eye,
  ChevronRight,
  ArrowUp,
  Clock,
  Mail,
  Key,
  CreditCard,
  Server,
  Trash,
  Share2
} from 'lucide-react';
import styles from './PrivacyPolicy.module.scss';

const PrivacyPolicy = () => {
  // State for navigation and animation
  const [activeSection, setActiveSection] = useState('overview');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lastUpdated] = useState('May 18, 2025');
  
  // References for the sections
  const overviewRef = useRef(null);
  const informationCollectedRef = useRef(null);
  const useOfInformationRef = useRef(null);
  const sharingRef = useRef(null);
  const cookiesRef = useRef(null);
  const dataSecurityRef = useRef(null);
  const userRightsRef = useRef(null);
  const childrenPrivacyRef = useRef(null);
  const internationalRef = useRef(null);
  const changesRef = useRef(null);
  const contactRef = useRef(null);
  
  // Sections data for navigation
  const sections = [
    { id: 'overview', label: 'Overview', icon: <FileText size={18} />, ref: overviewRef },
    { id: 'informationCollected', label: 'Information Collected', icon: <Database size={18} />, ref: informationCollectedRef },
    { id: 'useOfInformation', label: 'How We Use Information', icon: <Eye size={18} />, ref: useOfInformationRef },
    { id: 'sharing', label: 'Information Sharing', icon: <Share2 size={18} />, ref: sharingRef },
    { id: 'cookies', label: 'Cookies & Tracking', icon: <Globe size={18} />, ref: cookiesRef },
    { id: 'dataSecurity', label: 'Data Security', icon: <Shield size={18} />, ref: dataSecurityRef },
    { id: 'userRights', label: 'Your Privacy Rights', icon: <Key size={18} />, ref: userRightsRef },
    { id: 'childrenPrivacy', label: 'Children\'s Privacy', icon: <User size={18} />, ref: childrenPrivacyRef },
    { id: 'international', label: 'International Transfers', icon: <Server size={18} />, ref: internationalRef },
    { id: 'changes', label: 'Policy Changes', icon: <Clock size={18} />, ref: changesRef },
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

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className={styles.privacyPage}>
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
      <div className={styles.privacyHeader}>
        <div className={styles.container}>
          <motion.div 
            className={styles.privacyHeaderContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.privacyTitle}>Privacy Policy</h1>
            <div className={styles.privacySubtitle}>
              Last Updated: <span className={styles.accentText}>{lastUpdated}</span>
            </div>
            
            <div className={styles.effectiveDate}>
              <Clock size={16} />
              <span>Effective immediately for new users, May 25, 2025 for existing users</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className={styles.privacyContent}>
        <div className={styles.container}>
          <div className={styles.privacyGrid}>
            {/* Sidebar Navigation */}
            <div className={styles.privacySidebar}>
              <div className={styles.sidebarSticky}>
                <div className={styles.sidebarIntro}>
                  <Lock size={20} className={styles.sidebarIcon} />
                  <h3>Privacy Navigation</h3>
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
                  <Link to="/terms-of-service" className={styles.sidebarLink}>
                    Terms of Service
                  </Link>
                  <Link to="/contact" className={styles.sidebarLink}>
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className={styles.privacyMain}>
              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className={styles.privacyIntro}
              >
                <p>
                  At PODNEX, we're committed to protecting your privacy and providing you with 
                  clear information about how we handle your personal data. This Privacy Policy 
                  explains our practices regarding the collection, use, and disclosure of your information.
                </p>
                <p className={styles.privacyHighlight}>
                  Please read this Privacy Policy carefully. By accessing or using PODNEX's platform, 
                  services, websites, and applications, you agree to the collection, use, and transfer 
                  of your information as described in this policy.
                </p>
              </motion.div>
              
              {/* 1. Overview */}
              <div ref={overviewRef} id="overview" className={styles.privacySection}>
                <div className={styles.privacySectionHeader}>
                  <FileText size={24} className={styles.privacySectionIcon} />
                  <h2>1. Overview</h2>
                </div>
                
                <div className={styles.privacySectionContent}>
                  <p>
                    This Privacy Policy applies to all information collected through our platform, 
                    services, websites, and applications (collectively, the "Services"), as well as 
                    any related services, sales, marketing, or events.
                  </p>
                  <p>
                    We respect your privacy and are committed to protecting your personal data. This 
                    privacy policy will inform you about how we look after your personal data when 
                    you visit our website or use our Services and tell you about your privacy rights 
                    and how the law protects you.
                  </p>
                  <p>
                    Our platform allows users to form collaborative squads called "Pods" to build, 
                    launch, and monetize products, brands, and movements. In providing these Services, 
                    we process certain personal information about our users, which we are committed to 
                    protecting and respecting.
                  </p>
                </div>
              </div>
              
              {/* 2. Information We Collect */}
              <div ref={informationCollectedRef} id="informationCollected" className={styles.privacySection}>
                <div className={styles.privacySectionHeader}>
                  <Database size={24} className={styles.privacySectionIcon} />
                  <h2>2. Information We Collect</h2>
                </div>
                
                <div className={styles.privacySectionContent}>
                  <p>
                    We collect several types of information from and about users of our Services, including:
                  </p>
                  
                  <h3>2.1 Information You Provide to Us</h3>
                  <div className={styles.infoCard}>
                    <h4>Account Information</h4>
                    <p>When you register for an account, we collect:</p>
                    <ul className={styles.contentList}>
                      <li>Your name, email address, and password</li>
                      <li>Profile information, such as a username, profile photo, bio, and skills</li>
                      <li>Payment information when you make or receive payments through the platform</li>
                    </ul>
                  </div>
                  
                  <div className={styles.infoCard}>
                    <h4>Pod-Related Information</h4>
                    <p>When you create or participate in Pods, we collect:</p>
                    <ul className={styles.contentList}>
                      <li>Pod details, including titles, descriptions, roles, and project specifications</li>
                      <li>Content you post, upload, or provide to Pods</li>
                      <li>Contribution logs and activity data</li>
                    </ul>
                  </div>
                  
                  <div className={styles.infoCard}>
                    <h4>Communications</h4>
                    <p>We collect information when you:</p>
                    <ul className={styles.contentList}>
                      <li>Contact our support team</li>
                      <li>Provide feedback or testimonials</li>
                      <li>Communicate with other users through our platform</li>
                    </ul>
                  </div>
                  
                  <h3>2.2 Information We Collect Automatically</h3>
                  <div className={styles.infoCard}>
                    <h4>Usage Data</h4>
                    <p>As you navigate through and interact with our Services, we may automatically collect:</p>
                    <ul className={styles.contentList}>
                      <li>Information about your interactions with the platform (pages visited, features used, actions taken)</li>
                      <li>Time spent on different parts of the platform</li>
                      <li>User interaction patterns and preferences</li>
                    </ul>
                  </div>
                  
                  <div className={styles.infoCard}>
                    <h4>Device and Connection Information</h4>
                    <p>We collect:</p>
                    <ul className={styles.contentList}>
                      <li>Device information (device type, operating system, and browser type)</li>
                      <li>IP address and general location information</li>
                      <li>Log data (access times, pages viewed, referring sites)</li>
                    </ul>
                  </div>
                  
                  <h3>2.3 Information from Third Parties</h3>
                  <p>
                    We may receive information about you if you use any of the other websites we operate 
                    or services we provide. We also work with third parties (including business partners, 
                    service providers, payment processors) and may receive information about you from them.
                  </p>
                </div>
              </div>
              
              {/* 3. How We Use Your Information */}
              <div ref={useOfInformationRef} id="useOfInformation" className={styles.privacySection}>
                <div className={styles.privacySectionHeader}>
                  <Eye size={24} className={styles.privacySectionIcon} />
                  <h2>3. How We Use Your Information</h2>
                </div>
                
                <div className={styles.privacySectionContent}>
                  <p>
                    We use the information we collect for various purposes, including:
                  </p>
                  
                  <div className={styles.infoTable}>
                    <div className={styles.infoTableRow}>
                      <div className={styles.infoTablePurpose}>
                        <h4>Providing and Improving Our Services</h4>
                      </div>
                      <div className={styles.infoTableDescription}>
                        <ul>
                          <li>Creating and managing your account</li>
                          <li>Facilitating Pod creation, collaboration, and management</li>
                          <li>Processing transactions and distributing revenue</li>
                          <li>Tracking contributions and calculating reputation scores</li>
                          <li>Enhancing, improving, or modifying our Services</li>
                          <li>Identifying usage trends and developing new features</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className={styles.infoTableRow}>
                      <div className={styles.infoTablePurpose}>
                        <h4>Communications</h4>
                      </div>
                      <div className={styles.infoTableDescription}>
                        <ul>
                          <li>Responding to your inquiries and support requests</li>
                          <li>Sending administrative messages about your account or the platform</li>
                          <li>Providing updates on Pods you're participating in</li>
                          <li>Sending notifications about activity relevant to you</li>
                          <li>Delivering marketing communications (with your consent)</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className={styles.infoTableRow}>
                      <div className={styles.infoTablePurpose}>
                        <h4>Security and Compliance</h4>
                      </div>
                      <div className={styles.infoTableDescription}>
                        <ul>
                          <li>Protecting our Services and our users</li>
                          <li>Detecting, preventing, and addressing fraud, security breaches, and prohibited activities</li>
                          <li>Verifying your identity</li>
                          <li>Enforcing our Terms of Service and other policies</li>
                          <li>Complying with legal obligations</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className={styles.infoTableRow}>
                      <div className={styles.infoTablePurpose}>
                        <h4>Personalization</h4>
                      </div>
                      <div className={styles.infoTableDescription}>
                        <ul>
                          <li>Customizing your experience on our platform</li>
                          <li>Recommending Pods that may interest you</li>
                          <li>Matching you with relevant opportunities based on your skills and interests</li>
                          <li>Showing you relevant content and features</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <p>
                    We will not use your personal information for purposes that are incompatible 
                    with the purposes for which we have collected it, unless required or authorized 
                    to do so by law, or with your consent.
                  </p>
                </div>
              </div>
              
              {/* 4. Information Sharing */}
              <div ref={sharingRef} id="sharing" className={styles.privacySection}>
                <div className={styles.privacySectionHeader}>
                  <Share2 size={24} className={styles.privacySectionIcon} />
                  <h2>4. Information Sharing</h2>
                </div>
                
                <div className={styles.privacySectionContent}>
                  <p>
                    We may share your personal information in the following situations:
                  </p>
                  
                  <h3>4.1 With Other Users</h3>
                  <p>
                    When you use our platform, certain information will be visible to other users, including:
                  </p>
                  <ul className={styles.contentList}>
                    <li>Your profile information, such as your name, username, profile picture, bio, and skills</li>
                    <li>Your contributions to Pods and associated reputation scores</li>
                    <li>Content you post or share within Pods</li>
                    <li>Messages you send to other users through our platform</li>
                  </ul>
                  
                  <h3>4.2 With Service Providers</h3>
                  <p>
                    We may share your information with third-party service providers who perform services on our behalf, such as:
                  </p>
                  <ul className={styles.contentList}>
                    <li>Payment processors to facilitate transactions</li>
                    <li>Cloud storage providers to store our data</li>
                    <li>Analytics providers to help us understand how our Services are used</li>
                    <li>Email service providers to send communications</li>
                    <li>Customer support services to assist with inquiries</li>
                  </ul>
                  <p>
                    These service providers are contractually obligated to use your information only as necessary to provide services to us and in accordance with this Privacy Policy.
                  </p>
                  
                  <h3>4.3 Business Transfers</h3>
                  <p>
                    If we are involved in a merger, acquisition, financing, reorganization, bankruptcy, or sale of company assets, your information may be transferred as part of that transaction. We will notify you of any such change in ownership or control of your personal information.
                  </p>
                  
                  <h3>4.4 Legal Requirements</h3>
                  <p>
                    We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency). We may also disclose your information to:
                  </p>
                  <ul className={styles.contentList}>
                    <li>Enforce our Terms of Service and other agreements</li>
                    <li>Protect and defend our rights or property</li>
                    <li>Prevent or investigate possible wrongdoing in connection with the Services</li>
                    <li>Protect the personal safety of users of the Services or the public</li>
                  </ul>
                  
                  <h3>4.5 With Your Consent</h3>
                  <p>
                    We may share your information for other purposes with your explicit consent.
                  </p>
                </div>
              </div>
              
              {/* 5. Cookies and Tracking */}
              <div ref={cookiesRef} id="cookies" className={styles.privacySection}>
                <div className={styles.privacySectionHeader}>
                  <Globe size={24} className={styles.privacySectionIcon} />
                  <h2>5. Cookies and Tracking Technologies</h2>
                </div>
                
                <div className={styles.privacySectionContent}>
                  <p>
                    We use cookies and similar tracking technologies to collect and use information about you and your interaction with our Services. We use these technologies to:
                  </p>
                  
                  <ul className={styles.contentList}>
                    <li>Enable certain functions of the Services</li>
                    <li>Provide enhanced functionality and personalization</li>
                    <li>Analyze usage of our Services</li>
                    <li>Deliver relevant content and advertisements</li>
                    <li>Remember your preferences</li>
                  </ul>
                  
                  <h3>5.1 Types of Cookies We Use</h3>
                  <div className={styles.cookieTable}>
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableType}>
                        <h4>Essential Cookies</h4>
                      </div>
                      <div className={styles.cookieTableDescription}>
                        <p>Required for the operation of our Services. These include cookies that enable you to log into secure areas of our Services, use a shopping cart, or use e-billing.</p>
                      </div>
                    </div>
                    
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableType}>
                        <h4>Functional Cookies</h4>
                      </div>
                      <div className={styles.cookieTableDescription}>
                        <p>Allow us to recognize and count the number of visitors and see how visitors move around our Services. This helps us improve the way our Services work, for example, by ensuring that users can easily find what they're looking for.</p>
                      </div>
                    </div>
                    
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableType}>
                        <h4>Analytical Cookies</h4>
                      </div>
                      <div className={styles.cookieTableDescription}>
                        <p>Allow us to recognize and count the number of visitors and see how visitors move around our Services. This helps us improve the way our Services work.</p>
                      </div>
                    </div>
                    
                    <div className={styles.cookieTableRow}>
                      <div className={styles.cookieTableType}>
                        <h4>Advertising Cookies</h4>
                      </div>
                      <div className={styles.cookieTableDescription}>
                        <p>Record your visit to our Services, the pages you have visited, and the links you have followed. We use this information to make our Services and the advertising displayed on them more relevant to your interests.</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3>5.2 Your Cookie Choices</h3>
                  <p>
                    Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Services.
                  </p>
                  
                  <h3>5.3 Do Not Track</h3>
                  <p>
                    Some browsers include the ability to transmit "Do Not Track" signals. We do not process or respond to "Do Not Track" signals. Instead, we adhere to the standards outlined in this Privacy Policy.
                  </p>
                </div>
              </div>
              
              {/* 6. Data Security */}
              <div ref={dataSecurityRef} id="dataSecurity" className={styles.privacySection}>
                <div className={styles.privacySectionHeader}>
                  <Shield size={24} className={styles.privacySectionIcon} />
                  <h2>6. Data Security</h2>
                </div>
                
                <div className={styles.privacySectionContent}>
                  <p>
                    We implement appropriate technical and organizational measures to protect the personal information that we collect and process about you. The measures we use are designed to provide a level of security appropriate to the risk of processing your personal information.
                  </p>
                  
                  <h3>6.1 Security Measures</h3>
                  <p>
                    Our security measures include, but are not limited to:
                  </p>
                  <ul className={styles.contentList}>
                    <li>Encryption of data in transit using SSL technology</li>
                    <li>Regular security assessments and penetration testing</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Regular monitoring for suspicious activities</li>
                    <li>Employee training on data security practices</li>
                  </ul>
                  
                  <h3>6.2 Data Breach</h3>
                  <p>
                    In the event of a data breach that affects your personal information, we will notify you and relevant authorities as required by applicable law. We will take reasonable steps to minimize the impact and prevent future incidents.
                  </p>
                  
                  <div className={styles.securityNote}>
                    <AlertTriangle size={20} />
                    <p>
                      While we implement safeguards designed to protect your information, no security system is impenetrable. Due to the inherent nature of the Internet, we cannot guarantee that information, during transmission through the Internet or while stored on our systems or otherwise in our care, is absolutely safe from intrusion by others.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 7. Your Privacy Rights */}
              <div ref={userRightsRef} id="userRights" className={styles.privacySection}>
                <div className={styles.privacySectionHeader}>
                  <Key size={24} className={styles.privacySectionIcon} />
                  <h2>7. Your Privacy Rights</h2>
                </div>
                
                <div className={styles.privacySectionContent}>
                  <p>
                    Depending on your location, you may have certain rights regarding your personal information. These may include:
                  </p>
                  
                  <div className={styles.rightsCard}>
                    <h4>Access and Portability</h4>
                    <p>The right to access personal information we hold about you and to request a copy of your personal information in a structured, commonly used, and machine-readable format.</p>
                  </div>
                  
                  <div className={styles.rightsCard}>
                    <h4>Correction</h4>
                    <p>The right to request that we correct inaccurate or incomplete personal information about you.</p>
                  </div>
                  
                  <div className={styles.rightsCard}>
                    <h4>Deletion</h4>
                    <p>The right to request that we delete your personal information in certain circumstances, subject to certain exceptions.</p>
                  </div>
                  
                  <div className={styles.rightsCard}>
                    <h4>Restriction</h4>
                    <p>The right to request that we restrict the processing of your personal information in certain circumstances.</p>
                  </div>
                  
                  <div className={styles.rightsCard}>
                    <h4>Objection</h4>
                    <p>The right to object to the processing of your personal information in certain circumstances.</p>
                  </div>
                  
                  <div className={styles.rightsCard}>
                    <h4>Withdraw Consent</h4>
                    <p>The right to withdraw your consent at any time where we rely on consent to process your personal information.</p>
                  </div>
                  
                  <h3>7.1 How to Exercise Your Rights</h3>
                  <p>
                    To exercise your rights, you can:
                  </p>
                  <ul className={styles.contentList}>
                    <li>Access and update certain information through your account settings</li>
                    <li>Contact our Privacy Team at privacy@podnex.com</li>
                    <li>Submit a request through our Privacy Request Form on the Contact Us page</li>
                  </ul>
                  <p>
                    We will respond to your request within the timeframe required by applicable law (typically within 30 days). We may ask for additional information to verify your identity before fulfilling your request.
                  </p>
                  
                  <h3>7.2 Limitations</h3>
                  <p>
                    In some cases, we may not be able to fulfill your request, such as:
                  </p>
                  <ul className={styles.contentList}>
                    <li>When fulfilling your request would adversely affect others</li>
                    <li>When we have a legal obligation to retain certain information</li>
                    <li>When we need the information to complete a transaction or provide a service</li>
                    <li>When we need the information to comply with legal obligations</li>
                  </ul>
                  <p>
                    If we cannot fulfill your request, we will explain why.
                  </p>
                </div>
              </div>
              
              {/* 8. Children's Privacy */}
              <div ref={childrenPrivacyRef} id="childrenPrivacy" className={styles.privacySection}>
                <div className={styles.privacySectionHeader}>
                  <User size={24} className={styles.privacySectionIcon} />
                  <h2>8. Children's Privacy</h2>
                </div>
                
                <div className={styles.privacySectionContent}>
                  <p>
                    Our Services are not directed to children under the age of 16, and we do not 
                    knowingly collect personal information from children under 16. If you are a 
                    parent or guardian and you believe your child has provided us with personal 
                    information, please contact us immediately at privacy@podnex.com.
                  </p>
                  
                  <p>
                    If we become aware that we have collected personal information from children 
                    without verification of parental consent, we will take steps to remove that 
                    information from our servers.
                  </p>
                  
                  <div className={styles.alertBox}>
                    <AlertTriangle size={20} />
                    <p>
                      Per our Terms of Service, users must be at least 16 years of age to create an 
                      account. Users between 16 and 18 years of age must have permission from a 
                      parent or legal guardian who agrees to our Terms of Service and this Privacy 
                      Policy on their behalf.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 9. International Data Transfers */}
              <div ref={internationalRef} id="international" className={styles.privacySection}>
                <div className={styles.privacySectionHeader}>
                  <Server size={24} className={styles.privacySectionIcon} />
                  <h2>9. International Data Transfers</h2>
                </div>
                
                <div className={styles.privacySectionContent}>
                  <p>
                    PODNEX is headquartered in the United States, and we may process, store, and 
                    transfer your personal information in countries which may have different data 
                    protection laws than your country of residence.
                  </p>
                  
                  <p>
                    When we transfer your personal information to other countries, we will protect 
                    that information as described in this Privacy Policy and in accordance with 
                    applicable law. We take measures to ensure that any international transfers of 
                    personal information are made with appropriate safeguards, such as:
                  </p>
                  
                  <ul className={styles.contentList}>
                    <li>Ensuring recipients have data protection policies consistent with ours</li>
                    <li>Using standard contractual clauses and other legal mechanisms to ensure the protection of your data</li>
                    <li>Implementing technical and organizational security measures to protect your data</li>
                  </ul>
                  
                  <h3>9.1 EU/EEA Users</h3>
                  <p>
                    For users in the European Union (EU) and European Economic Area (EEA), we comply 
                    with the EU General Data Protection Regulation (GDPR) and provide appropriate 
                    safeguards for transfers of personal information to countries outside the EU/EEA.
                  </p>
                  
                  <h3>9.2 California Users</h3>
                  <p>
                    For users in California, we comply with the California Consumer Privacy Act (CCPA) 
                    and the California Privacy Rights Act (CPRA). Please see our California Privacy 
                    Notice for more information.
                  </p>
                </div>
              </div>
              
              {/* 10. Changes to This Privacy Policy */}
              <div ref={changesRef} id="changes" className={styles.privacySection}>
                <div className={styles.privacySectionHeader}>
                  <Clock size={24} className={styles.privacySectionIcon} />
                  <h2>10. Changes to This Privacy Policy</h2>
                </div>
                
                <div className={styles.privacySectionContent}>
                  <p>
                    We may update our Privacy Policy from time to time in response to changing legal, 
                    technical, or business developments. When we update our Privacy Policy, we will 
                    take appropriate measures to inform you, consistent with the significance of the 
                    changes we make.
                  </p>
                  
                  <p>
                    We will obtain your consent to any material changes if and where this is required 
                    by applicable data protection laws. The date at the top of this Privacy Policy 
                    indicates when it was last updated.
                  </p>
                  
                  <div className={styles.updateProcess}>
                    <h3>How We Notify You of Changes</h3>
                    <div className={styles.processStep}>
                      <span className={styles.stepNumber}>1</span>
                      <div className={styles.stepContent}>
                        <h4>Policy Update</h4>
                        <p>We update the "Last Updated" date at the top of this Privacy Policy.</p>
                      </div>
                    </div>
                    
                    <div className={styles.processStep}>
                      <span className={styles.stepNumber}>2</span>
                      <div className={styles.stepContent}>
                        <h4>Notification</h4>
                        <p>For significant changes, we'll send you an email notification or display a prominent notice when you access our Services.</p>
                      </div>
                    </div>
                    
                    <div className={styles.processStep}>
                      <span className={styles.stepNumber}>3</span>
                      <div className={styles.stepContent}>
                        <h4>Prior Versions</h4>
                        <p>We'll keep prior versions of this Privacy Policy in an archive for your review.</p>
                      </div>
                    </div>
                  </div>
                  
                  <p>
                    We encourage you to review this Privacy Policy periodically to stay informed about 
                    our collection, processing, and sharing of your personal information.
                  </p>
                </div>
              </div>
              
              {/* 11. Contact Us */}
              <div ref={contactRef} id="contact" className={styles.privacySection}>
                <div className={styles.privacySectionHeader}>
                  <Mail size={24} className={styles.privacySectionIcon} />
                  <h2>11. Contact Us</h2>
                </div>
                
                <div className={styles.privacySectionContent}>
                  <p>
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
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
      <div className={styles.privacyFooter}>
        <div className={styles.container}>
          <div className={styles.privacyFooterContent}>
            <h3>Your Privacy Matters to Us</h3>
            <p>Have questions about how we protect your data? Our privacy team is here to help.</p>
            <div className={styles.privacyFooterActions}>
              <Link to="/contact" className={styles.footerButton}>
                Contact Us
              </Link>
              <Link to="/faq" className={styles.footerButtonSecondary}>
                Privacy FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;