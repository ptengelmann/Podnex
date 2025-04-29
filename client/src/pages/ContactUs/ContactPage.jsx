import React, { useState, useRef, useEffect } from 'react';
import styles from './ContactPage.module.scss';
import { motion, useAnimation } from 'framer-motion';
import { 
  MessageSquare, 
  Mail, 
  MapPin, 
  Send, 
  Star, 
  Zap,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Users,
  Code,
  Rocket
} from 'lucide-react';

const ContactPage = () => {
  // Form state
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    interest: 'general' // Default interest
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    error: null,
    loading: false
  });
  
  const [activeAccordion, setActiveAccordion] = useState(null);
  
  // Animation control
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(true);
  const contactRef = useRef(null);
  
  // State for particles
  const [particles, setParticles] = useState([]);
  
  // Generate particles for background effect
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);
  
  // Start animations immediately
  useEffect(() => {
    controls.start("visible");
  }, [controls]);
  
  // Frequently asked questions
  const faqs = [
    {
      question: "What exactly is a Pod on PODNEX?",
      answer: "A Pod is a collaborative team formed around a specific project or objective. Each Pod has defined roles, transparent contribution tracking, and built-in tools for creation, communication, and monetization. Think of Pods as structured, goal-oriented teams with complete transparency about who does what."
    },
    {
      question: "How is PODNEX different from freelance platforms?",
      answer: "Unlike freelance platforms that focus on one-off gigs, PODNEX is built for collaborative creation where multiple contributors work together on shared projects. We emphasize reputation building, transparent contribution tracking, and fair revenue distribution based on verified work. Our ecosystem approach integrates collaboration, reputation, and monetization into a cohesive experience."
    },
    {
      question: "How are contributions tracked and verified?",
      answer: "Each contribution is logged in the Pod's activity stream and can be verified by Pod creators or through peer review. Our system tracks various contribution types (code, design, content, etc.) and maintains a permanent, transparent record of who did what. This builds an authentic reputation based on real work rather than just profiles or testimonials."
    },
    {
      question: "How do creators get paid through PODNEX?",
      answer: "Pods can generate revenue through direct sales, subscriptions, or custom services. Revenue distribution is based on contributor agreements established within each Pod, with payments processed through our secure platform. Every contributor receives their fair share based on their verified contributions to the project."
    },
    {
      question: "Can I join PODNEX if I'm new to collaborative creation?",
      answer: "Absolutely! PODNEX is designed for creators at all experience levels. You can join existing Pods that match your skills, start with small contributions to build your reputation, and eventually create your own Pods as you become more familiar with the ecosystem."
    }
  ];
  
  // Contact methods
  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: "Email Us",
      content: "hello@podnex.com",
      color: "#E8C547" // Gold
    },
    {
      icon: <MapPin size={24} />,
      title: "Location",
      content: "London, United Kingdom",
      color: "#34D399" // Green
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Discord",
      content: "discord.gg/podnex",
      color: "#818CF8" // Purple
    }
  ];
  
  // Interest options
  const interestOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'creator', label: 'Becoming a Pod Creator' },
    { value: 'contributor', label: 'Joining as a Contributor' },
    { value: 'partnership', label: 'Partnership Opportunities' },
    { value: 'support', label: 'Technical Support' }
  ];
  
  // Toggle accordion
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({
        submitted: true,
        success: false,
        error: "Please fill out all required fields",
        loading: false
      });
      return;
    }
    
    // Set loading state
    setFormStatus({
      submitted: false,
      success: false,
      error: null,
      loading: true
    });
    
    // Simulate form submission with timeout
    setTimeout(() => {
      try {
        // Simulate successful submission
        console.log("Form submitted:", formState);
        
        setFormStatus({
          submitted: true,
          success: true,
          error: null,
          loading: false
        });
        
        // Reset form after successful submission
        setFormState({
          name: '',
          email: '',
          subject: '',
          message: '',
          interest: 'general'
        });
      } catch (error) {
        setFormStatus({
          submitted: true,
          success: false,
          error: "There was an error submitting your message. Please try again.",
          loading: false
        });
      }
    }, 1500);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className={styles.contactPage} ref={contactRef}>
      {/* Particle background */}
      <div className={styles.particleContainer}>
        {particles.map(particle => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${20 / particle.speed}s`,
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
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.mainTitle}>
              Get In <span className={styles.highlight}>Touch</span>
            </h1>
            <p className={styles.mainSubtitle}>
              Have questions about PODNEX? We're here to help you navigate the ecosystem and find your place in collaborative creation.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            {/* Left Column - Contact Form */}
            <motion.div 
              className={styles.formSection}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.sectionHeader}>
                <h2>Send Us a Message</h2>
                <p>Fill out the form below and we'll get back to you shortly.</p>
              </div>
              
              <form className={styles.contactForm} onSubmit={handleSubmit}>
                {/* Name Input */}
                <div className={styles.formGroup}>
                  <label htmlFor="name">Your Name <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                {/* Email Input */}
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address <span className={styles.required}>*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                {/* Interest Dropdown */}
                <div className={styles.formGroup}>
                  <label htmlFor="interest">I'm Interested In</label>
                  <select
                    id="interest"
                    name="interest"
                    value={formState.interest}
                    onChange={handleInputChange}
                  >
                    {interestOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Subject Input */}
                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                  />
                </div>
                
                {/* Message Textarea */}
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message <span className={styles.required}>*</span></label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleInputChange}
                    placeholder="Tell us what's on your mind..."
                    rows={5}
                    required
                  ></textarea>
                </div>
                
                {/* Form Status Messages */}
                {formStatus.submitted && (
                  <div className={`${styles.statusMessage} ${formStatus.success ? styles.success : styles.error}`}>
                    {formStatus.success ? (
                      <CheckCircle size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                    <span>
                      {formStatus.success
                        ? "Thanks for your message! We'll be in touch soon."
                        : formStatus.error}
                    </span>
                  </div>
                )}
                
                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={formStatus.loading}
                >
                  {formStatus.loading ? (
                    <span className={styles.loadingText}>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
            
            {/* Right Column - Contact Info & FAQs */}
            <motion.div 
              className={styles.infoSection}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Contact Methods */}
              <div className={styles.contactMethods}>
                <h3>Contact Information</h3>
                <div className={styles.methodsGrid}>
                  {contactMethods.map((method, index) => (
                    <div 
                      key={index} 
                      className={styles.contactMethod}
                      style={{ '--method-color': method.color }}
                    >
                      <div className={styles.methodIcon}>
                        {method.icon}
                      </div>
                      <div className={styles.methodContent}>
                        <h4>{method.title}</h4>
                        <p>{method.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* FAQs Accordion */}
              <div className={styles.faqsSection}>
                <h3>Frequently Asked Questions</h3>
                <div className={styles.accordionContainer}>
                  {faqs.map((faq, index) => (
                    <div 
                      key={index} 
                      className={`${styles.accordionItem} ${activeAccordion === index ? styles.active : ''}`}
                    >
                      <button 
                        className={styles.accordionHeader}
                        onClick={() => toggleAccordion(index)}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown 
                          size={18}
                          className={`${styles.accordionIcon} ${activeAccordion === index ? styles.rotated : ''}`}  
                        />
                      </button>
                      <div className={styles.accordionContent}>
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Team Availability Section */}
      <div className={styles.availabilitySection}>
        <div className={styles.container}>
          <motion.div 
            className={styles.availabilityContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.availabilityCard}>
              <div className={styles.cardHeader}>
                <div className={styles.iconContainer}>
                  <Star size={28} />
                </div>
                <h2>Join Our Creative Ecosystem</h2>
              </div>
              
              <p className={styles.cardDescription}>
                We're always looking for talented individuals to join the PODNEX ecosystem. Whether you're a creator, contributor, or have partnership ideas, let's talk about how we can collaborate.
              </p>
              
              <div className={styles.teamStats}>
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <Users size={18} />
                  </div>
                  <div className={styles.statContent}>
                    <h4>Creator Community</h4>
                    <p>Join thousands of creators building together</p>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <Code size={18} />
                  </div>
                  <div className={styles.statContent}>
                    <h4>Open Platform</h4>
                    <p>Transparent and fair collaboration system</p>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <div className={styles.statIcon}>
                    <Rocket size={18} />
                  </div>
                  <div className={styles.statContent}>
                    <h4>Launch Together</h4>
                    <p>Take projects from concept to market</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;