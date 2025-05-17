import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Shield, 
  User, 
  Lock, 
  CreditCard, 
  AlertTriangle, 
  MessageSquare, 
  Mail, 
  Globe,
  ChevronRight,
  ArrowUp,
  Clock
} from 'lucide-react';
import styles from './TermsOfService.module.scss';

const TermsOfService = () => {
  // State for navigation and animation
  const [activeSection, setActiveSection] = useState('overview');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [lastUpdated] = useState('May 18, 2025');
  
  // References for the sections
  const overviewRef = useRef(null);
  const definitionsRef = useRef(null);
  const accountRef = useRef(null);
  const podsRef = useRef(null);
  const contentRef = useRef(null);
  const paymentsRef = useRef(null);
  const privacyRef = useRef(null);
  const liabilityRef = useRef(null);
  const terminationRef = useRef(null);
  const changesRef = useRef(null);
  const contactRef = useRef(null);
  
  // Sections data for navigation
  const sections = [
    { id: 'overview', label: 'Overview', icon: <FileText size={18} />, ref: overviewRef },
    { id: 'definitions', label: 'Definitions', icon: <Globe size={18} />, ref: definitionsRef },
    { id: 'account', label: 'Account Terms', icon: <User size={18} />, ref: accountRef },
    { id: 'pods', label: 'Pod Guidelines', icon: <Shield size={18} />, ref: podsRef },
    { id: 'content', label: 'User Content', icon: <MessageSquare size={18} />, ref: contentRef },
    { id: 'payments', label: 'Payments & Revenue', icon: <CreditCard size={18} />, ref: paymentsRef },
    { id: 'privacy', label: 'Privacy & Data', icon: <Lock size={18} />, ref: privacyRef },
    { id: 'liability', label: 'Liability & Warranty', icon: <AlertTriangle size={18} />, ref: liabilityRef },
    { id: 'termination', label: 'Termination', icon: <Clock size={18} />, ref: terminationRef },
    { id: 'changes', label: 'Changes to Terms', icon: <FileText size={18} />, ref: changesRef },
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
    <div className={styles.termsPage}>
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
      <div className={styles.termsHeader}>
        <div className={styles.container}>
          <motion.div 
            className={styles.termsHeaderContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={styles.termsTitle}>Terms of Service</h1>
            <div className={styles.termsSubtitle}>
              Last Updated: <span className={styles.accentText}>{lastUpdated}</span>
            </div>
            
            <div className={styles.effectiveDate}>
              <Clock size={16} />
              <span>Effective immediately for new users, May 25, 2025 for existing users</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className={styles.termsContent}>
        <div className={styles.container}>
          <div className={styles.termsGrid}>
            {/* Sidebar Navigation */}
            <div className={styles.termsSidebar}>
              <div className={styles.sidebarSticky}>
                <div className={styles.sidebarIntro}>
                  <Shield size={20} className={styles.sidebarIcon} />
                  <h3>Navigate Terms</h3>
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
                  <Link to="/privacy" className={styles.sidebarLink}>
                    Privacy Policy
                  </Link>
                  <Link to="/contact" className={styles.sidebarLink}>
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className={styles.termsMain}>
              <motion.div
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
                className={styles.termsIntro}
              >
                <p>
                  Welcome to PODNEX. These Terms of Service govern your access to and use of 
                  PODNEX's platform, services, websites, and applications. By accessing or using 
                  our services, you agree to be bound by these terms.
                </p>
                <p className={styles.termsHighlight}>
                  Please read these terms carefully before using PODNEX. If you do not agree to 
                  these terms, you may not access or use our services.
                </p>
              </motion.div>
              
              {/* 1. Overview */}
              <div ref={overviewRef} id="overview" className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <FileText size={24} className={styles.termsSectionIcon} />
                  <h2>1. Overview</h2>
                </div>
                
                <div className={styles.termsSectionContent}>
                  <p>
                    PODNEX is a creator-driven ecosystem that enables users to form collaborative 
                    squads called "Pods" to build, launch, and monetize real products, brands, and 
                    movements.
                  </p>
                  <p>
                    Our mission is to provide a structured creation ecosystem where contributions 
                    are tracked, reputations are earned, and rewards are distributed fairly and 
                    transparently.
                  </p>
                  <p>
                    These Terms of Service constitute a legally binding agreement between you and 
                    PODNEX regarding your access to and use of the Services. By using any of our 
                    Services, you acknowledge that you have read, understood, and agree to be bound 
                    by these Terms.
                  </p>
                </div>
              </div>
              
              {/* 2. Definitions */}
              <div ref={definitionsRef} id="definitions" className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <Globe size={24} className={styles.termsSectionIcon} />
                  <h2>2. Definitions</h2>
                </div>
                
                <div className={styles.termsSectionContent}>
                  <div className={styles.definitionList}>
                    <div className={styles.definitionItem}>
                      <h4>"PODNEX," "we," "our," or "us"</h4>
                      <p>Refers to PODNEX, Inc., its subsidiaries, affiliates, officers, directors, employees, agents, and representatives.</p>
                    </div>
                    <div className={styles.definitionItem}>
                      <h4>"Services"</h4>
                      <p>Refers to PODNEX's platform, applications, websites, and related services that allow users to create, join, and participate in Pods.</p>
                    </div>
                    <div className={styles.definitionItem}>
                      <h4>"User," "you," or "your"</h4>
                      <p>Refers to any individual or entity that accesses or uses our Services.</p>
                    </div>
                    <div className={styles.definitionItem}>
                      <h4>"Pod"</h4>
                      <p>A collaborative unit on PODNEX that brings together different skillsets to work on projects with clear objectives, transparent contribution tracking, and fair distribution of value created.</p>
                    </div>
                    <div className={styles.definitionItem}>
                      <h4>"Contribution"</h4>
                      <p>Any action performed by a User within a Pod that is tracked, verified, and valued by the platform.</p>
                    </div>
                    <div className={styles.definitionItem}>
                      <h4>"Reputation"</h4>
                      <p>A comprehensive, verifiable record of a User's expertise based on their Contributions across all Pods they participate in.</p>
                    </div>
                    <div className={styles.definitionItem}>
                      <h4>"User Content"</h4>
                      <p>Any content, materials, information, data, or other items that Users upload, post, submit, or transmit to or through the Services.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 3. Account Terms */}
              <div ref={accountRef} id="account" className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <User size={24} className={styles.termsSectionIcon} />
                  <h2>3. Account Terms</h2>
                </div>
                
                <div className={styles.termsSectionContent}>
                  <h3>3.1 Account Registration</h3>
                  <p>
                    To use certain features of the Services, you must register for an account. 
                    When you register, you must provide accurate and complete information. You are 
                    responsible for maintaining the security of your account, and you are fully 
                    responsible for all activities that occur under your account.
                  </p>
                  
                  <h3>3.2 Account Requirements</h3>
                  <p>
                    You must be at least 16 years old to create an account. If you are under 18 
                    years old, you must have the permission of a parent or legal guardian to use 
                    the Services and they must agree to these Terms on your behalf.
                  </p>
                  
                  <h3>3.3 Account Security</h3>
                  <p>
                    You are responsible for safeguarding your password and for any activities or 
                    actions under your account. PODNEX cannot and will not be liable for any losses 
                    or damages arising from your failure to maintain the security of your account.
                  </p>
                  
                  <h3>3.4 Account Ownership</h3>
                  <p>
                    Your account is personal to you and you may not transfer it to any other person 
                    or entity. You may not create accounts for others or allow others to use your 
                    account. If you are creating an account for a business entity, you represent 
                    that you have the authority to bind that entity to these Terms.
                  </p>
                </div>
              </div>
              
              {/* 4. Pod Guidelines */}
              <div ref={podsRef} id="pods" className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <Shield size={24} className={styles.termsSectionIcon} />
                  <h2>4. Pod Guidelines</h2>
                </div>
                
                <div className={styles.termsSectionContent}>
                  <h3>4.1 Creating Pods</h3>
                  <p>
                    Any registered user can create a Pod by defining the project scope, required 
                    roles, contribution value system, and goals. As a Pod creator, you are 
                    responsible for setting clear expectations, managing the Pod, and ensuring fair 
                    treatment of all contributors.
                  </p>
                  
                  <h3>4.2 Pod States and Lifecycle</h3>
                  <p>
                    Pods may exist in various states (Draft, Open, In Progress, Pre-Launch, Live, 
                    Archived) as defined in the platform. Pod creators are responsible for 
                    accurately updating Pod states to reflect current activity and progress.
                  </p>
                  
                  <h3>4.3 Joining and Contributing to Pods</h3>
                  <p>
                    Users may join open Pods by applying and being accepted by the Pod creator or 
                    designees. By joining a Pod, you agree to fulfill the responsibilities of your 
                    chosen role and abide by the Pod's specific guidelines and contribution metrics.
                  </p>
                  
                  <h3>4.4 Pod Content and Products</h3>
                  <p>
                    Pods must not create or promote products, services, or content that violate 
                    our Content Guidelines, applicable laws, or the rights of third parties. Pod 
                    creators and contributors are jointly responsible for ensuring compliance.
                  </p>
                  
                  <h3>4.5 Pod Termination</h3>
                  <p>
                    PODNEX reserves the right to terminate any Pod that violates these Terms, 
                    misrepresents its purpose or activities, or fails to maintain minimum activity 
                    levels. Users may fork stalled Pods according to the Forking Rights policy.
                  </p>
                </div>
              </div>
              
              {/* 5. User Content */}
              <div ref={contentRef} id="content" className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <MessageSquare size={24} className={styles.termsSectionIcon} />
                  <h2>5. User Content</h2>
                </div>
                
                <div className={styles.termsSectionContent}>
                  <h3>5.1 Content Ownership</h3>
                  <p>
                    You retain all ownership rights to the User Content you submit to the Services. 
                    However, by submitting User Content to PODNEX, you grant us a worldwide, 
                    non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, 
                    translate, distribute, and display such User Content for the purpose of 
                    providing and promoting the Services.
                  </p>
                  
                  <h3>5.2 Content Restrictions</h3>
                  <p>
                    You may not upload, post, or transmit any User Content that:
                  </p>
                  <ul className={styles.contentList}>
                    <li>Violates any applicable law or regulation</li>
                    <li>Infringes on the intellectual property rights of others</li>
                    <li>Contains harmful, abusive, obscene, or offensive content</li>
                    <li>Impersonates any person or entity</li>
                    <li>Contains malware, viruses, or other harmful code</li>
                    <li>Interferes with the proper functioning of the Services</li>
                    <li>Promotes illegal activities or harm to others</li>
                  </ul>
                  
                  <h3>5.3 Content Monitoring</h3>
                  <p>
                    PODNEX does not monitor or control User Content and is not responsible for 
                    any User Content posted on the Services. However, we reserve the right to 
                    review, modify, or remove any User Content at our sole discretion, without 
                    notice, at any time, and for any reason.
                  </p>
                  
                  <h3>5.4 DMCA Compliance</h3>
                  <p>
                    PODNEX respects the intellectual property rights of others and expects users 
                    to do the same. If you believe that your work has been copied in a way that 
                    constitutes copyright infringement, please follow our DMCA takedown procedure 
                    available in our Copyright Policy.
                  </p>
                </div>
              </div>
              
              {/* 6. Payments & Revenue */}
              <div ref={paymentsRef} id="payments" className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <CreditCard size={24} className={styles.termsSectionIcon} />
                  <h2>6. Payments & Revenue</h2>
                </div>
                
                <div className={styles.termsSectionContent}>
                  <h3>6.1 Platform Fee</h3>
                  <p>
                    PODNEX charges a 10% fee on all revenue generated through the platform. This 
                    fee supports ongoing platform development, infrastructure, and services that 
                    enable Pods to function effectively.
                  </p>
                  
                  <h3>6.2 Revenue Distribution</h3>
                  <p>
                    Revenue from Pod products or services is distributed according to logged and 
                    verified contributions within each Pod, as specified in the Pod's contribution 
                    agreement. PODNEX facilitates this distribution but is not responsible for 
                    disputes between Pod members regarding contribution valuations.
                  </p>
                  
                  <h3>6.3 Payment Processing</h3>
                  <p>
                    PODNEX uses third-party payment processors to handle all financial transactions. 
                    By using our Services, you agree to comply with these processors' terms of 
                    service and provide accurate payment information.
                  </p>
                  
                  <h3>6.4 Taxes</h3>
                  <p>
                    You are solely responsible for determining what, if any, taxes apply to your 
                    earnings from the platform. PODNEX is not responsible for determining, collecting, 
                    withholding, or paying any taxes on your behalf.
                  </p>
                  
                  <h3>6.5 Refunds</h3>
                  <p>
                    Refund policies for products and services sold through Pods are determined by 
                    individual Pod creators. PODNEX does not guarantee refunds for any purchases 
                    made through the platform but will help facilitate refund requests according 
                    to the Pod's stated policies.
                  </p>
                </div>
              </div>
              
              {/* 7. Privacy & Data */}
              <div ref={privacyRef} id="privacy" className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <Lock size={24} className={styles.termsSectionIcon} />
                  <h2>7. Privacy & Data</h2>
                </div>
                
                <div className={styles.termsSectionContent}>
                  <p>
                    Your privacy is important to us. Our Privacy Policy explains how we collect, 
                    use, and share information about you when you use our Services. By using 
                    PODNEX, you agree to the collection, use, and sharing of your information as 
                    described in our Privacy Policy.
                  </p>
                  <p>
                    The Privacy Policy is incorporated by reference into these Terms. Please read 
                    it carefully as it contains important information about your rights and 
                    obligations.
                  </p>
                  <div className={styles.policyLink}>
                    <Link to="/privacy">Read our full Privacy Policy</Link>
                  </div>
                </div>
              </div>
              
              {/* 8. Liability & Warranty */}
              <div ref={liabilityRef} id="liability" className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <AlertTriangle size={24} className={styles.termsSectionIcon} />
                  <h2>8. Liability & Warranty</h2>
                </div>
                
                <div className={styles.termsSectionContent}>
                  <h3>8.1 Disclaimer of Warranties</h3>
                  <p className={styles.disclaimerText}>
                    THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY 
                    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED 
                    WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND 
                    NON-INFRINGEMENT. PODNEX DOES NOT WARRANT THAT THE SERVICES WILL BE 
                    UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE 
                    SERVICES OR THE SERVERS THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER 
                    HARMFUL COMPONENTS.
                  </p>
                  
                  <h3>8.2 Limitation of Liability</h3>
                  <p className={styles.disclaimerText}>
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PODNEX SHALL NOT BE LIABLE 
                    FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR 
                    ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR 
                    ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                  </p>
                  <ul className={styles.liabilityList}>
                    <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES;</li>
                    <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES;</li>
                    <li>ANY CONTENT OBTAINED FROM THE SERVICES; OR</li>
                    <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT.</li>
                  </ul>
                  <p className={styles.disclaimerText}>
                    IN NO EVENT SHALL PODNEX'S AGGREGATE LIABILITY FOR ALL CLAIMS RELATED TO THE 
                    SERVICES EXCEED ONE HUNDRED U.S. DOLLARS ($100.00) OR THE TOTAL AMOUNT OF FEES 
                    PAID BY YOU TO PODNEX IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE 
                    TO THE LIABILITY, WHICHEVER IS GREATER.
                  </p>
                  
                  <h3>8.3 Indemnification</h3>
                  <p>
                    You agree to indemnify, defend, and hold harmless PODNEX, its officers, 
                    directors, employees, agents, and affiliates from and against any and all 
                    claims, damages, obligations, losses, liabilities, costs, or debt, and 
                    expenses (including but not limited to attorney's fees) arising from:
                  </p>
                  <ul className={styles.contentList}>
                    <li>Your use of and access to the Services;</li>
                    <li>Your violation of any term of these Terms;</li>
                    <li>Your violation of any third-party right, including without limitation any copyright, property, or privacy right; or</li>
                    <li>Any claim that your User Content caused damage to a third party.</li>
                  </ul>
                </div>
              </div>
              
              {/* 9. Termination */}
              <div ref={terminationRef} id="termination" className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <Clock size={24} className={styles.termsSectionIcon} />
                  <h2>9. Termination</h2>
                </div>
                
                <div className={styles.termsSectionContent}>
                  <h3>9.1 Termination by You</h3>
                  <p>
                    You may terminate your account at any time by following the instructions in 
                    your account settings or by contacting us at support@podnex.com. Upon 
                    termination, you will continue to be bound by portions of these Terms that, by 
                    their nature, should survive termination.
                  </p>
                  
                  <h3>9.2 Termination by PODNEX</h3>
                  <p>
                    PODNEX may terminate or suspend your account and access to the Services at any 
                    time and for any reason, including, but not limited to, if you breach these 
                    Terms. Upon termination, your right to use the Services will immediately cease.
                  </p>
                  
                  <h3>9.3 Effects of Termination</h3>
                  <p>
                    After account termination:
                  </p>
                  <ul className={styles.contentList}>
                    <li>Your profile and content may no longer be accessible</li>
                    <li>Your earned reputation will be retained in the system</li>
                    <li>Your contributions to active Pods will remain</li>
                    <li>Any revenue due to you at the time of termination will be paid according to our standard payment schedule</li>
                  </ul>
                  <p>
                    If your account was terminated due to violations of these Terms, PODNEX 
                    reserves the right to remove your content, withhold unpaid revenue, and 
                    prohibit you from creating a new account.
                  </p>
                </div>
              </div>
              
              {/* 10. Changes to Terms */}
              <div ref={changesRef} id="changes" className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <FileText size={24} className={styles.termsSectionIcon} />
                  <h2>10. Changes to Terms</h2>
                </div>
                
                <div className={styles.termsSectionContent}>
                  <p>
                    PODNEX reserves the right to modify these Terms at any time. We will notify 
                    you of any changes by posting the new Terms on the platform and updating the 
                    "Last Updated" date. If we make material changes, we will provide at least 14 
                    days' notice before the changes take effect by sending an email to the email 
                    address associated with your account.
                  </p>
                  <p>
                    Your continued use of the Services after the effective date of the revised 
                    Terms constitutes your acceptance of the changes. If you do not agree to the 
                    new Terms, you must stop using the Services.
                  </p>
                  <p>
                    We keep a record of all previous versions of our Terms, which are available 
                    upon request by contacting us at legal@podnex.com.
                  </p>
                </div>
              </div>
              
              {/* 11. Contact Us */}
              <div ref={contactRef} id="contact" className={styles.termsSection}>
                <div className={styles.termsSectionHeader}>
                  <Mail size={24} className={styles.termsSectionIcon} />
                  <h2>11. Contact Us</h2>
                </div>
                
                <div className={styles.termsSectionContent}>
                  <p>
                    If you have any questions about these Terms or our Services, please contact us:
                  </p>
                  <div className={styles.contactInfo}>
                    <div className={styles.contactMethod}>
                      <span className={styles.contactLabel}>Email:</span>
                      <a href="mailto:legal@podnex.com" className={styles.contactLink}>legal@podnex.com</a>
                    </div>
                    <div className={styles.contactMethod}>
                      <span className={styles.contactLabel}>Support:</span>
                      <a href="mailto:support@podnex.com" className={styles.contactLink}>support@podnex.com</a>
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
      <div className={styles.termsFooter}>
        <div className={styles.container}>
          <div className={styles.termsFooterContent}>
            <h3>Have more questions?</h3>
            <p>Our support team is here to help you understand our Terms of Service</p>
            <div className={styles.termsFooterActions}>
              <Link to="/contact" className={styles.footerButton}>
                Contact Us
              </Link>
              <Link to="/faq" className={styles.footerButtonSecondary}>
                View FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;