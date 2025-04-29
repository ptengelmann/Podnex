import React, { useState, useEffect, useRef } from 'react';
import styles from './Testimonials.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Shield, Zap, Award } from 'lucide-react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredTestimonial, setHoveredTestimonial] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const slideRef = useRef(null);
  
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      author: "Sarah Johnson",
      role: "Designer",
      company: "DesignFusion",
      avatar: "/api/placeholder/80/80",
      content: "PODNEX transformed how I collaborate with developers. My contributions are tracked and valued, and I've built connections with amazing creators I'd never have met otherwise.",
      rating: 5,
      category: "creators",
      tags: ["designer", "collaboration"],
      bgColor: "#E8C547" // Gold
    },
    {
      id: 2,
      author: "Michael Chen",
      role: "Full-Stack Developer",
      company: "CodeNexus",
      avatar: "/api/placeholder/80/80",
      content: "As a developer, I can now focus on coding while the platform handles everything else. The transparent contribution tracking ensures everyone's work is recognized fairly.",
      rating: 5,
      category: "creators",
      tags: ["developer", "transparency"],
      bgColor: "#34D399" // Green
    },
    {
      id: 3,
      author: "Alex Rivera",
      role: "Product Manager",
      company: "Launchpad Inc.",
      avatar: "/api/placeholder/80/80",
      content: "The Pod structure is revolutionary. We launched our MVP in half the time it would have taken with traditional methods. The built-in team formation saved us months of recruitment.",
      rating: 5,
      category: "leaders",
      tags: ["efficiency", "team-building"],
      bgColor: "#818CF8" // Purple
    },
    {
      id: 4,
      author: "Jessica Williams",
      role: "Content Strategist",
      company: "WordCraft",
      avatar: "/api/placeholder/80/80",
      content: "Finding the right collaborators used to be my biggest challenge. PODNEX makes it seamless to connect with talented creators who complement my skills.",
      rating: 4,
      category: "creators",
      tags: ["content", "networking"],
      bgColor: "#EC4899" // Pink
    },
    {
      id: 5,
      author: "David Park",
      role: "CEO",
      company: "Venture Labs",
      avatar: "/api/placeholder/80/80",
      content: "We've used PODNEX to launch three digital products in the past year. The transparent ecosystem creates accountability that traditional project management tools simply can't match.",
      rating: 5,
      category: "leaders",
      tags: ["leadership", "accountability"],
      bgColor: "#F59E0B" // Amber
    },
  ];

  // Filter the testimonials based on the active filter
  const filteredTestimonials = activeFilter === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.category === activeFilter);

  // Category filters
  const categories = [
    { id: 'all', label: 'All Testimonials', icon: <Star size={16} /> },
    { id: 'creators', label: 'Creators & Contributors', icon: <Zap size={16} /> },
    { id: 'leaders', label: 'Leaders & Managers', icon: <Shield size={16} /> },
  ];

  // Autoplay logic
  useEffect(() => {
    let interval;
    if (isAutoplay) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % filteredTestimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, filteredTestimonials.length]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoplay(false);
  const handleMouseLeave = () => setIsAutoplay(true);

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle navigation
  const handlePrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? filteredTestimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => 
      (prevIndex + 1) % filteredTestimonials.length
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  // Render functions
  const renderRatingStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        size={16} 
        fill={index < rating ? "#E8C547" : "none"} 
        stroke={index < rating ? "#E8C547" : "#848484"} 
      />
    ));
  };

  return (
    <section className={styles.testimonialsSection}>
      {/* Background elements */}
      <div 
        className={styles.gridBackground}
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      />
      
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
      
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.badgeWrapper}>
            <span className={styles.badge}>Client Success</span>
          </div>
          <h2 className={styles.title}>
            What <span className={styles.highlight}>Creators</span> Are Saying
          </h2>
          <p className={styles.subtitle}>
            Discover how PODNEX is transforming collaborative creation across industries
          </p>
        </motion.div>
        
        {/* Category filters */}
        <motion.div 
          className={styles.filterTabs}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {categories.map(category => (
            <motion.button
              key={category.id}
              className={`${styles.filterTab} ${activeFilter === category.id ? styles.activeTab : ''}`}
              onClick={() => {
                setActiveFilter(category.id);
                setActiveIndex(0);
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {category.icon}
              <span>{category.label}</span>
            </motion.button>
          ))}
        </motion.div>
        
        {/* Featured testimonial carousel */}
        <motion.div 
          className={styles.carouselWrapper}
          ref={slideRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className={styles.navigation}>
            <button 
              className={styles.navButton}
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className={styles.navButton}
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className={styles.carousel}>
            <AnimatePresence mode="wait">
              {filteredTestimonials.length > 0 && (
                <motion.div
                  key={filteredTestimonials[activeIndex].id}
                  className={styles.testimonialCard}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    '--card-color': filteredTestimonials[activeIndex].bgColor
                  }}
                >
                  <div className={styles.quoteIcon}>
                    <Quote size={40} />
                  </div>
                  
                  <div className={styles.testimonialContent}>
                    <p>{filteredTestimonials[activeIndex].content}</p>
                  </div>
                  
                  <div className={styles.testimonialFooter}>
                    <div className={styles.authorInfo}>
                      <div className={styles.authorAvatar}>
                        <div className={styles.avatarInitial}>
                          {filteredTestimonials[activeIndex].author.charAt(0)}
                        </div>
                      </div>
                      <div className={styles.authorMeta}>
                        <div className={styles.authorName}>
                          {filteredTestimonials[activeIndex].author}
                        </div>
                        <div className={styles.authorRole}>
                          {filteredTestimonials[activeIndex].role} at {filteredTestimonials[activeIndex].company}
                        </div>
                      </div>
                    </div>
                    <div className={styles.rating}>
                      {renderRatingStars(filteredTestimonials[activeIndex].rating)}
                    </div>
                  </div>

                  <div className={styles.testimonialTags}>
                    {filteredTestimonials[activeIndex].tags.map(tag => (
                      <span key={tag} className={styles.tag}>#{tag}</span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.indicators}>
            {filteredTestimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${activeIndex === index ? styles.activeIndicator : ''}`}
                onClick={() => setActiveIndex(index)}
                style={{
                  backgroundColor: activeIndex === index 
                    ? filteredTestimonials[index].bgColor 
                    : 'rgba(255, 255, 255, 0.2)'
                }}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Testimonial Grid */}
        <motion.div 
          className={styles.testimonialGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`${styles.gridItem} ${hoveredTestimonial === testimonial.id ? styles.hoveredItem : ''}`}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                boxShadow: '0 15px 30px rgba(0,0,0,0.2), 0 0 20px rgba(232, 197, 71, 0.1)'
              }}
              onMouseEnter={() => setHoveredTestimonial(testimonial.id)}
              onMouseLeave={() => setHoveredTestimonial(null)}
              style={{
                '--item-color': testimonial.bgColor,
                opacity: activeIndex === index ? 1 : 0.7
              }}
            >
              <div className={styles.gridItemContent}>
                <div className={styles.gridQuoteIcon}>
                  <Quote size={20} color={testimonial.bgColor} />
                </div>
                <p className={styles.gridQuote}>
                  {testimonial.content.length > 100 
                    ? `${testimonial.content.substring(0, 100)}...`
                    : testimonial.content
                  }
                </p>
                <div className={styles.gridAuthor}>
                  <div className={styles.gridAvatar}>
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className={styles.gridName}>{testimonial.author}</div>
                    <div className={styles.gridRole}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Stats section */}
        <motion.div 
          className={styles.statsSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className={styles.stat}>
            <div className={styles.statNumber}>97%</div>
            <div className={styles.statLabel}>Satisfaction Rate</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>250+</div>
            <div className={styles.statLabel}>Active Pods</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNumber}>4.9<span className={styles.statSmall}>/5</span></div>
            <div className={styles.statLabel}>Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;