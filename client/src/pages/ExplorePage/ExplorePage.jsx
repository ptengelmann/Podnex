import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Grid, 
  Search, 
  Plus, 
  Sliders, 
  X, 
  Filter, 
  ArrowUp, 
  TrendingUp,
  Clock,
  Star,
  Radio,
  Users,
  Layers,
  Calendar,
  BarChart2,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Award,
  AlertTriangle
} from 'lucide-react';
import styles from './ExplorePage.module.scss';
import PodCard from '../../components/PodCard/PodCard';

const ExplorePage = () => {
  // Refs
  const scrollRef = useRef(null);
  const filtersRef = useRef(null);
  
  // State
  const [pods, setPods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [activeTimeFilter, setActiveTimeFilter] = useState('all');
  const [activeFormatFilter, setActiveFormatFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trendingPods, setTrendingPods] = useState([]);
  const [featuredPod, setFeaturedPod] = useState(null);
  
  // Filter categories
  const statusFilters = ['all', 'open', 'in progress', 'live', 'draft', 'pre-launch'];
  const categoryFilters = ['all', 'development', 'design', 'marketing', 'content', 'video', 'research', 'product', 'community'];
  const timeFilters = ['all', 'today', 'this week', 'this month'];
  const formatFilters = ['all', 'project', 'ongoing', 'event', 'mentorship'];
  
  // Sorting options
  const sortOptions = [
    { id: 'newest', label: 'Newest First', icon: <Clock size={16} /> },
    { id: 'popular', label: 'Most Popular', icon: <TrendingUp size={16} /> },
    { id: 'deadline', label: 'Deadline (Soon)', icon: <Calendar size={16} /> },
    { id: 'members', label: 'Team Size', icon: <Users size={16} /> }
  ];
  
  // Mouse parallax effect
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
  
  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Fetch pods data
  useEffect(() => {
    const fetchPods = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/pods');
        setPods(res.data);
        
        // Set trending pods (mock for demo)
        const trending = [...res.data]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setTrendingPods(trending);
        
        // Set featured pod (mock for demo)
        if (res.data.length > 0) {
          setFeaturedPod(res.data[Math.floor(Math.random() * res.data.length)]);
        }
        
        setError(null);
      } catch (err) {
        console.error(err.response?.data?.message || err.message);
        setError('Failed to load pods. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPods();
  }, []);
  
  // Update filters applied flag
  useEffect(() => {
    if (
      activeStatusFilter !== 'all' || 
      activeCategoryFilter !== 'all' || 
      activeTimeFilter !== 'all' || 
      activeFormatFilter !== 'all' || 
      searchQuery !== ''
    ) {
      setFiltersApplied(true);
    } else {
      setFiltersApplied(false);
    }
  }, [activeStatusFilter, activeCategoryFilter, activeTimeFilter, activeFormatFilter, searchQuery]);
  
  // Reset position of filters panel when closing
  useEffect(() => {
    if (!showFilters && filtersRef.current) {
      filtersRef.current.scrollTop = 0;
    }
  }, [showFilters]);
  
  // Filter pods based on active filters and search query
  const filteredPods = pods.filter(pod => {
    const matchesStatus = activeStatusFilter === 'all' || 
      (pod.status ? pod.status.toLowerCase() === activeStatusFilter.toLowerCase() : false);
    
    const matchesCategory = activeCategoryFilter === 'all' || 
      (pod.category ? pod.category.toLowerCase() === activeCategoryFilter.toLowerCase() : false);
    
    const matchesFormat = activeFormatFilter === 'all' || 
      (pod.format ? pod.format.toLowerCase() === activeFormatFilter.toLowerCase() : false);
    
    // Mock time filter logic (would need real dates in your data)
    const matchesTime = activeTimeFilter === 'all';
    
    const matchesSearch = pod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pod.description && pod.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pod.creator?.name && pod.creator.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesCategory && matchesTime && matchesFormat && matchesSearch;
  });
  
  // Sort pods based on selected option
  const sortedPods = [...filteredPods].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'popular':
        // Mock logic for popularity sorting
        return (b.teamSize || 0) - (a.teamSize || 0);
      case 'deadline':
        // Sort by deadline (closest first)
        return new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31');
      case 'members':
        return (b.teamSize || 0) - (a.teamSize || 0);
      default:
        return 0;
    }
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  // Reset all filters
  const resetFilters = () => {
    setActiveStatusFilter('all');
    setActiveCategoryFilter('all');
    setActiveTimeFilter('all');
    setActiveFormatFilter('all');
    setSearchQuery('');
    setSortOption('newest');
  };
  
  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className={styles.explorePage} ref={scrollRef}>
      {/* Animated background */}
      <motion.div 
        className={styles.gridBackground}
        style={{
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
        }}
      />
      
      {/* Floating shapes */}
      <motion.div
        className={`${styles.floatingShape} ${styles.shape1}`}
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.floatingShape} ${styles.shape2}`}
        animate={{
          x: [0, -15, 0],
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.titleArea}>
              <div className={styles.sectionTitleWrapper}>
                <motion.h1 
                  className={styles.sectionTitle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Discover Pods
                </motion.h1>
                <motion.div 
                  className={styles.titleDecoration}
                  initial={{ width: '0%', opacity: 0 }}
                  animate={{ width: '60%', opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
              <motion.p 
                className={styles.sectionDescription}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Find your next passion project, connect with talented creators,
                and bring your podcast ideas to life
              </motion.p>
            </div>
            
            {/* Featured pod card (if available) */}
            {featuredPod && (
              <motion.div 
                className={styles.featuredPodSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className={styles.featuredLabel}>
                  <Award size={16} />
                  <span>Featured Pod</span>
                </div>
                <div className={styles.featuredPodCard}>
                  <PodCard
                    id={featuredPod._id}
                    title={featuredPod.title}
                    description={featuredPod.description}
                    status={featuredPod.status || "open"}
                    urgency={featuredPod.urgency || "medium"}
                    category={featuredPod.category || "development"}
                    format={featuredPod.format || "project"}
                    progress={featuredPod.progress || 0}
                    deadline={featuredPod.deadline}
                    budget={featuredPod.budget}
                    creator={featuredPod.creator || {}}
                    rolesNeeded={featuredPod.rolesNeeded || []}
                    skills={featuredPod.skills || []}
                    teamSize={featuredPod.teamSize || 0}
                    maxMembers={featuredPod.maxMembers || 8}
                    commitment={featuredPod.commitment || "part-time"}
                  />
                </div>
              </motion.div>
            )}
            
            {/* Search and control bar */}
            <motion.div 
              className={styles.searchControlsBar}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className={styles.searchContainer}>
                <Search size={18} />
                <input 
                  type="text" 
                  placeholder="Search pods, creators, or skills..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button onClick={clearSearch} className={styles.clearSearchBtn}>
                    <X size={16} />
                  </button>
                )}
              </div>
              
              <button 
                className={`${styles.filtersButton} ${showFilters ? styles.active : ''} ${filtersApplied ? styles.filtersApplied : ''}`} 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Sliders size={16} />
                <span>Filters</span>
                {filtersApplied && (
                  <span className={styles.filtersCount}></span>
                )}
              </button>
              
              <div className={styles.sortDropdown}>
                <button className={styles.sortButton}>
                  {sortOptions.find(option => option.id === sortOption)?.icon}
                  <span>{sortOptions.find(option => option.id === sortOption)?.label}</span>
                  <ChevronDown size={14} />
                </button>
                
                <div className={styles.sortOptions}>
                  {sortOptions.map(option => (
                    <button 
                      key={option.id}
                      className={`${styles.sortOption} ${sortOption === option.id ? styles.active : ''}`}
                      onClick={() => setSortOption(option.id)}
                    >
                      {option.icon}
                      <span>{option.label}</span>
                      {sortOption === option.id && (
                        <div className={styles.activeMark} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                className={styles.createPodButton}
                onClick={() => window.location.href = '/create-pod'}
              >
                <Plus size={18} />
                <span>Create Pod</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Filters Panel (Slide in/out) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className={styles.filtersPanel}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            ref={filtersRef}
          >
            <div className={styles.container}>
              <div className={styles.filtersPanelHeader}>
                <h3>
                  <Filter size={18} />
                  Filter Pods
                </h3>
                <button 
                  className={styles.closeFiltersButton}
                  onClick={() => setShowFilters(false)}
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className={styles.filtersGrid}>
                {/* Status filter */}
                <div className={styles.filterGroup}>
                  <h4>Status</h4>
                  <div className={styles.filterOptions}>
                    {statusFilters.map(filter => (
                      <button
                        key={filter}
                        className={`${styles.filterOption} ${activeStatusFilter === filter ? styles.active : ''}`}
                        onClick={() => setActiveStatusFilter(filter)}
                      >
                        {filter === 'all' ? 'All Status' : filter}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Category filter */}
                <div className={styles.filterGroup}>
                  <h4>Category</h4>
                  <div className={styles.filterOptions}>
                    {categoryFilters.map(filter => (
                      <button
                        key={filter}
                        className={`${styles.filterOption} ${activeCategoryFilter === filter ? styles.active : ''}`}
                        onClick={() => setActiveCategoryFilter(filter)}
                      >
                        {filter === 'all' ? 'All Categories' : filter}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Time filter */}
                <div className={styles.filterGroup}>
                  <h4>Time Frame</h4>
                  <div className={styles.filterOptions}>
                    {timeFilters.map(filter => (
                      <button
                        key={filter}
                        className={`${styles.filterOption} ${activeTimeFilter === filter ? styles.active : ''}`}
                        onClick={() => setActiveTimeFilter(filter)}
                      >
                        {filter === 'all' ? 'Any Time' : filter}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Format filter */}
                <div className={styles.filterGroup}>
                  <h4>Pod Format</h4>
                  <div className={styles.filterOptions}>
                    {formatFilters.map(filter => (
                      <button
                        key={filter}
                        className={`${styles.filterOption} ${activeFormatFilter === filter ? styles.active : ''}`}
                        onClick={() => setActiveFormatFilter(filter)}
                      >
                        {filter === 'all' ? 'All Formats' : filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={styles.filterActions}>
                <button 
                  className={styles.resetFiltersButton}
                  onClick={resetFilters}
                >
                  Reset All
                </button>
                <button 
                  className={styles.applyFiltersButton}
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Trending Pod Section */}
      {trendingPods.length > 0 && (
        <div className={styles.trendingSection}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWrapper}>
                <h2>
                  <TrendingUp size={18} />
                  Trending Pods
                </h2>
                <div className={styles.titleBadge}>
                  <Sparkles size={12} />
                  <span>Popular right now</span>
                </div>
              </div>
            </div>
            
            <div className={styles.trendingGrid}>
              {trendingPods.map((pod, index) => (
                <motion.div 
                  key={pod._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <PodCard
                    id={pod._id}
                    title={pod.title}
                    description={pod.description}
                    status={pod.status || "open"}
                    urgency={pod.urgency || "medium"}
                    category={pod.category || "development"}
                    format={pod.format || "project"}
                    progress={pod.progress || 0}
                    deadline={pod.deadline}
                    budget={pod.budget}
                    creator={pod.creator || {}}
                    rolesNeeded={pod.rolesNeeded || []}
                    skills={pod.skills || []}
                    teamSize={pod.teamSize || 0}
                    maxMembers={pod.maxMembers || 8}
                    commitment={pod.commitment || "part-time"}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Pods Section */}
      <div className={styles.podsSection}>
        <div className={styles.container}>
          {/* Results info header */}
          <div className={styles.resultsHeader}>
            <div className={styles.resultsInfo}>
              <BarChart2 size={16} />
              <h2>Explore Pods</h2>
              <p className={styles.resultsCount}>
                {isLoading ? (
                  <span>Loading pods...</span>
                ) : (
                  <span>
                    Showing <span className={styles.countHighlight}>{filteredPods.length}</span> {filteredPods.length === 1 ? 'pod' : 'pods'}
                    {filtersApplied && <> (filtered)</>}
                  </span>
                )}
              </p>
            </div>
            
            {filtersApplied && (
              <button 
                className={styles.clearFiltersButton}
                onClick={resetFilters}
              >
                <RefreshCw size={14} />
                <span>Clear Filters</span>
              </button>
            )}
          </div>
          
          {/* Active filters pills */}
          {filtersApplied && (
            <motion.div 
              className={styles.activeFilters}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeStatusFilter !== 'all' && (
                <div className={styles.filterPill}>
                  <span>Status: {activeStatusFilter}</span>
                  <button onClick={() => setActiveStatusFilter('all')}>
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {activeCategoryFilter !== 'all' && (
                <div className={styles.filterPill}>
                  <span>Category: {activeCategoryFilter}</span>
                  <button onClick={() => setActiveCategoryFilter('all')}>
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {activeTimeFilter !== 'all' && (
                <div className={styles.filterPill}>
                  <span>Time: {activeTimeFilter}</span>
                  <button onClick={() => setActiveTimeFilter('all')}>
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {activeFormatFilter !== 'all' && (
                <div className={styles.filterPill}>
                  <span>Format: {activeFormatFilter}</span>
                  <button onClick={() => setActiveFormatFilter('all')}>
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {searchQuery && (
                <div className={styles.filterPill}>
                  <span>Search: {searchQuery}</span>
                  <button onClick={clearSearch}>
                    <X size={12} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Pods grid or loading/error state */}
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <motion.div 
                className={styles.loader}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p>Loading amazing pods...</p>
              </motion.div>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <AlertTriangle size={48} />
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button 
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : (
            <>
              <motion.div 
                className={styles.podGrid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {sortedPods.length > 0 ? (
                  sortedPods.map((pod, index) => (
                    <motion.div 
                      key={pod._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      layout
                    >
                      <PodCard
                        id={pod._id}
                        title={pod.title}
                        description={pod.description}
                        status={pod.status || "open"}
                        urgency={pod.urgency || "medium"}
                        category={pod.category || "development"}
                        format={pod.format || "project"}
                        progress={pod.progress || 0}
                        deadline={pod.deadline}
                        budget={pod.budget}
                        creator={pod.creator || {}}
                        rolesNeeded={pod.rolesNeeded || []}
                        skills={pod.skills || []}
                        teamSize={pod.teamSize || 0}
                        maxMembers={pod.maxMembers || 8}
                        commitment={pod.commitment || "part-time"}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className={styles.noResultsContainer}>
                    <Radio size={48} />
                    {filtersApplied ? (
                      <>
                        <h3>No matching pods found</h3>
                        <p>Try adjusting your filters or search terms</p>
                        <button 
                          className={styles.resetFiltersButton}
                          onClick={resetFilters}
                        >
                          Reset Filters
                        </button>
                      </>
                    ) : (
                      <>
                        <h3>No pods available yet</h3>
                        <p>Be the first to create a new podcast collaboration!</p>
                        <button 
                          className={styles.createPodButton}
                          onClick={() => window.location.href = '/create-pod'}
                        >
                          <Plus size={18} />
                          Create Your Pod
                        </button>
                      </>
                    )}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className={styles.scrollTopButton}
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExplorePage;