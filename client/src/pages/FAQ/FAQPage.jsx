import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  ChevronDown, 
  Search, 
  Star, 
  Shield, 
  Users, 
  Code, 
  Rocket, 
  MessageSquare, 
  CreditCard, 
  HelpCircle 
} from 'lucide-react';
import styles from './FAQPage.module.scss';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const pageRef = useRef(null);
  const faqSections = useRef([]);
  
  const controls = useAnimation();
  const backgroundControls = useAnimation();
  
  // FAQ Data
  const faqCategories = [
    {
      title: "General Questions",
      icon: <HelpCircle size={24} />,
      color: "#E8C547",
      questions: [
        {
          question: "What is PODNEX?",
          answer: "A brand-led, people-powered ecosystem where creators team up in \"Pods\" to build and launch real-world products together — with contribution tracking, reputation scoring, and revenue sharing."
        },
        {
          question: "Who is PODNEX for?",
          answer: "Anyone who wants to create, build, support, or amplify new products: creators, developers, designers, marketers, boosters, and supporters."
        },
        {
          question: "Is it free to join?",
          answer: "Yes — you can join and contribute to Pods for free. Pro features are available with optional upgrade plans."
        }
      ]
    },
    {
      title: "For Pod Creators",
      icon: <Rocket size={24} />,
      color: "#4ECDC4",
      questions: [
        {
          question: "How do I create a Pod?",
          answer: "Click \"Create Pod,\" add your mission, visual style, roles needed, and timeline — then go live or keep it in Draft."
        },
        {
          question: "How do I manage contributors?",
          answer: "As a Pod Creator, you can review applications, assign tasks, verify contributions, and split revenue through the dashboard."
        },
        {
          question: "Can I launch multiple Pods?",
          answer: "Yes — with a Pro Creator plan, you can run unlimited Pods simultaneously."
        },
        {
          question: "How is revenue shared?",
          answer: "Revenue is split based on verified contributions. You can customize split logic manually or use the built-in auto-distribution system."
        }
      ]
    },
    {
      title: "For Contributors",
      icon: <Code size={24} />,
      color: "#6B5B95",
      questions: [
        {
          question: "How do I join a Pod?",
          answer: "Browse Pods via the Explore or Help Feed and apply to join based on your skills and interests."
        },
        {
          question: "How do I earn reputation or XP?",
          answer: "Complete and verify contributions, receive peer feedback, and participate in Pods. Your rep grows with every task you complete."
        },
        {
          question: "What happens if a Pod dies?",
          answer: "Your contributions and reputation stay logged. You can fork the Pod or reuse your work in a new one."
        }
      ]
    },
    {
      title: "For Boosters",
      icon: <Star size={24} />,
      color: "#FF6B6B",
      questions: [
        {
          question: "What does a Booster do?",
          answer: "Boosters test, share, promote, and give feedback on Pods — earning XP, badges, and potential perks along the way."
        },
        {
          question: "Can I earn without building?",
          answer: "Yes. Boosters earn XP through non-technical contributions like feedback, testing, or marketing support."
        }
      ]
    },
    {
      title: "Platform Features",
      icon: <MessageSquare size={24} />,
      color: "#3B82F6",
      questions: [
        {
          question: "What is the Help Feed?",
          answer: "A live feed showing Pods that need urgent help. You can filter by role, status, or skill."
        },
        {
          question: "What is the Pod Storefront?",
          answer: "Each Pod has its own storefront to sell products, showcase the team, and track performance."
        },
        {
          question: "How does the reputation system work?",
          answer: "Reputation is built from: \n• Task completion \n• Peer reviews \n• Pod success \n• Consistency \n• XP earned \n\nIt determines visibility, matchmaking, and future opportunities."
        }
      ]
    },
    {
      title: "Payments & Ownership",
      icon: <CreditCard size={24} />,
      color: "#10B981",
      questions: [
        {
          question: "How do I get paid?",
          answer: "Payments are processed through Stripe Connect (Phase 1). Crypto and smart contract-based payouts are in the roadmap."
        },
        {
          question: "Can I prove my work outside PODNEX?",
          answer: "Yes — your profile graph and contribution history can be linked, exported, or used as a verifiable portfolio."
        }
      ]
    }
  ];
  
  // All questions for search functionality
  const allQuestions = faqCategories.flatMap((category, categoryIndex) => 
    category.questions.map((q, questionIndex) => ({
      ...q,
      categoryIndex,
      questionIndex,
      categoryTitle: category.title,
      color: category.color
    }))
  );
  
  // Filtered questions based on search
  const filteredQuestions = searchQuery ? 
    allQuestions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];
  
  // Toggle FAQ item
  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Scroll to category
  const scrollToCategory = (index) => {
    setActiveCategory(index);
    if (faqSections.current[index]) {
      faqSections.current[index].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };
  
  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      // Calculate mouse position relative to the center of the screen
      const newX = (clientX / window.innerWidth) - 0.5;
      const newY = (clientY / window.innerHeight) - 0.5;
      
      setMousePosition({ x: newX, y: newY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (pageRef.current) {
        const scrollTop = window.scrollY;
        setScrollPosition(scrollTop);
        
        // Determine active section based on scroll position
        faqSections.current.forEach((section, index) => {
          if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
              setActiveCategory(index);
            }
          }
        });
        
        // Parallax effect on scroll
        backgroundControls.start({
          y: scrollTop * 0.2,
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [backgroundControls]);
  
  // Animation on component mount
  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
  }, [controls]);
  
  return (
    <div className={styles.faqPage} ref={pageRef}>
      {/* Animated Background */}
      <motion.div 
        className={styles.gridBackground}
        animate={backgroundControls}
        initial={{ opacity: 1, y: 0 }}
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      />
      
      {/* 3D Floating Shapes */}
      <motion.div
        className={`${styles.floatingShape} ${styles.shape1}`}
        animate={{
          x: [0, 15, 0],
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        style={{
          translateZ: `${mousePosition.x * 50}px`,
        }}
      />
      <motion.div
        className={`${styles.floatingShape} ${styles.shape2}`}
        animate={{
          x: [0, -20, 0],
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        style={{
          translateZ: `${mousePosition.y * 50}px`,
        }}
      />
      <motion.div
        className={`${styles.floatingShape} ${styles.shape3}`}
        animate={{
          x: [0, 25, 0],
          y: [0, 10, 0],
          rotate: [0, 15, 0],
        }}
        transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
        style={{
          translateZ: `${mousePosition.x * -30}px`,
        }}
      />
      
      {/* Header Section */}
      <motion.div 
        className={styles.headerSection}
        initial={{ opacity: 0, y: 30 }}
        animate={controls}
      >
        <motion.div 
          className={styles.headerContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className={styles.badgeWrapper}>
            <span className={styles.badge}>
              <HelpCircle size={14} />
              Support Center
            </span>
          </div>
          
          <h1 className={styles.pageTitle}>
            Frequently Asked <span className={styles.highlight}>Questions</span>
          </h1>
          
          <p className={styles.pageLead}>
            Everything you need to know about the PODNEX ecosystem, features, and community
          </p>
          
          <div className={styles.searchWrapper}>
            <div className={styles.searchBox}>
              <Search size={20} className={styles.searchIcon} />
              <input 
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className={styles.clearSearch}
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
            
            {searchQuery && (
              <div className={styles.searchResults}>
                <div className={styles.searchResultsHeader}>
                  <h4>Search Results ({filteredQuestions.length})</h4>
                </div>
                
                {filteredQuestions.length > 0 ? (
                  <div className={styles.searchResultsList}>
                    {filteredQuestions.map((q, index) => (
                      <div 
                        key={index} 
                        className={styles.searchResultItem}
                        onClick={() => {
                          setActiveCategory(q.categoryIndex);
                          setTimeout(() => {
                            scrollToCategory(q.categoryIndex);
                            toggleItem(q.categoryIndex, q.questionIndex);
                          }, 100);
                          setSearchQuery('');
                        }}
                      >
                        <div className={styles.resultCategory} style={{ color: q.color }}>
                          {q.categoryTitle}
                        </div>
                        <div className={styles.resultQuestion}>
                          {q.question}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>
                      <HelpCircle size={32} />
                    </div>
                    <h4>No results found</h4>
                    <p>Try different keywords or browse categories below</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      
      {/* Main FAQ Content */}
      <div className={styles.faqContent}>
        {/* Category Navigation */}
        <motion.div 
          className={styles.categoryNav}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ top: Math.max(scrollPosition > 100 ? 20 : scrollPosition - 80, 0) }}
        >
          <div className={styles.navHeader}>
            <Users size={20} />
            <span>Categories</span>
          </div>
          
          <div className={styles.navItems}>
            {faqCategories.map((category, index) => (
              <motion.button
                key={index}
                className={`${styles.navItem} ${activeCategory === index ? styles.active : ''}`}
                onClick={() => scrollToCategory(index)}
                whileHover={{ x: 5 }}
                style={activeCategory === index ? { 
                  color: category.color,
                  borderColor: category.color,
                  backgroundColor: `${category.color}10` 
                } : {}}
              >
                <span className={styles.navIcon} style={activeCategory === index ? { color: category.color } : {}}>
                  {category.icon}
                </span>
                <span className={styles.navText}>{category.title}</span>
              </motion.button>
            ))}
          </div>
          
          <div className={styles.navFooter}>
            <Shield size={16} />
            <span>Need more help?</span>
            <a href="/contact" className={styles.contactLink}>Contact Support</a>
          </div>
        </motion.div>
        
        {/* FAQ Sections */}
        <div className={styles.faqSections}>
          {faqCategories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex} 
              className={styles.faqSection}
              ref={el => faqSections.current[categoryIndex] = el}
            >
              <motion.div 
                className={styles.sectionHeader}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div 
                  className={styles.sectionIcon} 
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  {category.icon}
                </div>
                <h2 className={styles.sectionTitle} style={{ color: category.color }}>
                  {category.title}
                </h2>
              </motion.div>
              
              <div className={styles.questionsList}>
                {category.questions.map((item, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openItems[key] || false;
                  
                  return (
                    <motion.div 
                      key={questionIndex}
                      className={`${styles.questionItem} ${isOpen ? styles.open : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: questionIndex * 0.1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      onClick={() => toggleItem(categoryIndex, questionIndex)}
                      style={isOpen ? { borderColor: `${category.color}40` } : {}}
                    >
                      <div className={styles.questionHeader}>
                        <h3 className={styles.question}>{item.question}</h3>
                        <motion.div 
                          className={styles.toggleIcon}
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          style={isOpen ? { backgroundColor: `${category.color}20`, color: category.color } : {}}
                        >
                          <ChevronDown size={20} />
                        </motion.div>
                      </div>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={styles.answerContainer}
                          >
                            <div className={styles.answer}>
                              {item.answer.split('\n').map((text, i) => (
                                <p key={i}>{text}</p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Contact Section */}
      <motion.div 
        className={styles.contactSection}
        id="contact"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className={styles.contactContent}>
          <div className={styles.contactIcon}>
            <MessageSquare size={32} />
          </div>
          <h2>Still have questions?</h2>
          <p>Our support team is ready to help you with any issues or questions about PODNEX</p>
          <div className={styles.contactButtons}>
            <motion.button 
              className={styles.primaryBtn}
              whileHover={{ scale: 1.05, backgroundColor: "#E8C547" }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Support
            </motion.button>
            <motion.button 
              className={styles.secondaryBtn}
              whileHover={{ scale: 1.05, borderColor: "#E8C547", color: "#E8C547" }}
              
              whileTap={{ scale: 0.95 }}
            >
              Join Community
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      {/* Scroll progress */}
      <div className={styles.scrollProgress}>
        <div 
          className={styles.scrollProgressBar} 
          style={{ width: `${Math.min((scrollPosition / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default FAQPage;