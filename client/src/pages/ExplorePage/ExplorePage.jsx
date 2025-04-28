import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import styles from './ExplorePage.module.scss';
import PodCard from '../../components/PodCard/PodCard';

const ExplorePage = () => {
  const [pods, setPods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter categories
  const statusFilters = ['all', 'open', 'in progress', 'live', 'draft', 'pre-launch'];
  
  useEffect(() => {
    const fetchPods = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/pods');
        setPods(res.data);
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
  
  // Filter pods based on active filter and search query
  const filteredPods = pods.filter(pod => {
    const matchesStatus = activeFilter === 'all' || 
      (pod.status ? pod.status.toLowerCase() === activeFilter.toLowerCase() : false);
    
    const matchesSearch = pod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pod.creator?.name && pod.creator.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Clear search input
  const clearSearch = () => {
    setSearchQuery('');
  };
  
  return (
    <div className={styles.explorePage}>
      <div className={styles.heroSection}>
        <motion.div 
          className={styles.gridBackground}
          animate={{ 
            scale: [1, 1.02, 1],
            rotate: [0, 1, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.sectionTitleWrapper}>
              <h1 className={styles.sectionTitle}>Explore Pods</h1>
              <div className={styles.titleDecoration}></div>
            </div>
            <p className={styles.sectionDescription}>
              Discover podcast collaborations, join exciting projects, or find talented creators to bring your vision to life
            </p>
          </motion.div>
          
          {/* Search and Filters */}
          <div className={styles.controlsRow}>
            <motion.div 
              className={styles.searchContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search pods or creators..." 
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button onClick={clearSearch} className={styles.clearSearchBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </motion.div>
            
            <motion.div 
              className={styles.filterContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {statusFilters.map((filter, index) => (
                <button
                  key={filter}
                  className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === 'all' ? 'All Pods' : filter}
                  {activeFilter === filter && <span className={styles.activeDot}></span>}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      
      <div className={styles.podsSection}>
        <div className={styles.container}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loader}></div>
              <p>Loading amazing pods...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>{error}</p>
              <button 
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className={styles.resultsHeader}>
                <p className={styles.resultsCount}>
                  Showing <span>{filteredPods.length}</span> {filteredPods.length === 1 ? 'pod' : 'pods'}
                  {activeFilter !== 'all' && <> with status "<span>{activeFilter}</span>"</>}
                  {searchQuery && <> matching "<span>{searchQuery}</span>"</>}
                </p>
                
                {/* This could be a dropdown for sorting options in the future */}
                <div className={styles.sortOptions}>
                  <button className={styles.sortButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Newest First</span>
                  </button>
                </div>
              </div>
              
              <motion.div 
                className={styles.podGrid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredPods.length > 0 ? (
                  filteredPods.map((pod) => (
                    <motion.div 
                      key={pod._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      layout
                    >
                      <PodCard
                        id={pod._id}
                        title={pod.title}
                        status={pod.status || "Open"}
                        neededRoles={pod.rolesNeeded}
                        creatorName={pod.creator?.name || 'Unknown'}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className={styles.noResultsContainer}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3.27002 6.96002L12 12.01L20.73 6.96002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {activeFilter !== 'all' || searchQuery ? (
                      <>
                        <h3>No pods found</h3>
                        <p>Try adjusting your filters or search terms</p>
                        <button 
                          className={styles.resetFiltersButton}
                          onClick={() => {
                            setActiveFilter('all');
                            setSearchQuery('');
                          }}
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
                          Create a Pod
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
    </div>
  );
};

export default ExplorePage;