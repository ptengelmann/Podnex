  import React, { useState, useRef, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { motion, AnimatePresence } from 'framer-motion';
  import { 
      Sparkles,
      HelpCircle,
      Book,
      Award,
      Users,
      Target,
      Clock,
      CheckCircle,
      X,
      ChevronRight,
      ChevronDown,
      Link,
      Plus,
      Briefcase,
      MessageSquare,
      Code,
      PenTool,
      Search,
      FileText,
      AlertTriangle,
      ArrowRight,
      PlayCircle,
      Bookmark,
      Star,
      ThumbsUp,
      Settings,
      Zap,
      UserPlus,
      Calendar,
      Download,
      Copy,
      Image
    } from 'lucide-react';
  import styles from './PodHelp.module.scss';

  const PodHelp = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [expandedFaqs, setExpandedFaqs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const sectionRefs = useRef({});

    // Auto-scroll to selected section
    useEffect(() => {
      if (sectionRefs.current[activeSection]) {
        sectionRefs.current[activeSection].scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, [activeSection]);

    // Categories of help content
    const helpCategories = [
      { id: 'overview', label: 'Overview', icon: <Book size={20} /> },
      { id: 'planning', label: 'Planning Your Pod', icon: <Target size={20} /> },
      { id: 'roles', label: 'Defining Roles', icon: <Users size={20} /> },
      { id: 'timeline', label: 'Creating Timelines', icon: <Clock size={20} /> },
      { id: 'tips', label: 'Success Tips', icon: <Award size={20} /> },
      { id: 'examples', label: 'Example Pods', icon: <Sparkles size={20} /> },
      { id: 'faq', label: 'FAQ', icon: <HelpCircle size={20} /> }
    ];

    // Pod types with examples
    const podTypes = [
      {
        title: 'Project Pod',
        icon: <FileText size={24} />,
        description: 'Time-boxed team with specific deliverables',
        example: 'Building a mobile app with clear requirements and launch date',
        skills: ['Frontend Development', 'UI/UX Design', 'Project Management']
      },
      {
        title: 'Learning Pod',
        icon: <Book size={24} />,
        description: 'Focus on skill development through hands-on collaboration',
        example: 'Group learning AI/ML by building projects together',
        skills: ['Teaching', 'Research', 'Technical Writing']
      },
      {
        title: 'Ongoing Pod',
        icon: <Clock size={24} />,
        description: 'Long-term team working on continuous products or services',
        example: 'Running a community-driven open source project',
        skills: ['Community Management', 'Development', 'Maintenance']
      },
      {
        title: 'Event Pod',
        icon: <Calendar size={24} />,
        description: 'Team assembled to organize and execute a specific event',
        example: 'Hackathon, webinar series, or conference',
        skills: ['Event Planning', 'Marketing', 'Logistics']
      }
    ];
    // Common roles in pods
    const commonRoles = [
      {
        title: 'Technical Lead',
        description: 'Guides technical direction and architecture decisions',
        responsibilities: ['Code review', 'Architecture design', 'Technical mentorship'],
        icon: <Code size={20} />
      },
      {
        title: 'UI/UX Designer',
        description: 'Creates user-centered designs and visual assets',
        responsibilities: ['User research', 'Wireframing', 'Visual design'],
        icon: <PenTool size={20} />
      },
      {
        title: 'Project Manager',
        description: 'Coordinates tasks and ensures timely delivery',
        responsibilities: ['Sprint planning', 'Progress tracking', 'Risk management'],
        icon: <Briefcase size={20} />
      },
      {
        title: 'Community Manager',
        description: 'Handles communication and user engagement',
        responsibilities: ['User support', 'Content moderation', 'Community events'],
        icon: <MessageSquare size={20} />
      }
    ];

    // FAQ data
    const faqData = [
      {
        question: "What makes a successful pod?",
        answer: "Successful pods have clear goals, well-defined roles, active communication, and committed members. Setting realistic timelines, documenting decisions, and celebrating milestones also contribute to success."
      },
      {
        question: "How many people should be in a pod?",
        answer: "The ideal pod size depends on your project's scope, but typically ranges from 3-8 members. Smaller pods (3-5) move quickly and have tight communication, while larger pods can tackle more complex projects but require more coordination."
      },
      {
        question: "How detailed should my pod description be?",
        answer: "Your pod description should be comprehensive enough that potential members understand the vision, commitment required, and their potential role. Include the project goal, timeline, expected outcomes, and the specific skills you're looking for."
      },
      {
        question: "What if someone wants to leave my pod?",
        answer: "People leaving is normal. Have a documented offboarding process that includes knowledge transfer and role reassignment. Be transparent with the team, thank departing members for their contributions, and maintain a positive relationship."
      },
      {
        question: "How often should pod members communicate?",
        answer: "Most successful pods have weekly synchronous meetings and daily asynchronous updates. However, the frequency should match your project's pace and team preferences. The key is consistency and ensuring everyone stays informed."
      },
      {
        question: "How do I handle conflicts in my pod?",
        answer: "Address conflicts promptly and privately. Listen to all perspectives, focus on issues rather than personalities, and work toward solutions that satisfy everyone's core needs. Document agreements and follow up to ensure the resolution is working."
      }
    ];

    // Example pods
    const examplePods = [
      {
        title: 'Mobile App Launch',
        category: 'Software Development',
        description: 'A 3-month pod to design, build, and launch a meditation app for iOS and Android',
        roles: ['Mobile Developer', 'UI/UX Designer', 'Product Manager', 'QA Tester'],
        timeline: '12 weeks with bi-weekly milestones',
        successFactors: 'Clear feature scope, regular user testing, and experienced developers'
      },
      {
        title: 'Community Newsletter',
        category: 'Content Creation',
        description: 'An ongoing pod creating a weekly tech newsletter with 4 team members',
        roles: ['Content Writer', 'Editor', 'Designer', 'Growth Manager'],
        timeline: 'Weekly publication with 3-day content cycle',
        successFactors: 'Content calendar, style guide, and division of topic areas'
      },
      {
        title: 'Machine Learning Study Group',
        category: 'Learning',
        description: 'A 6-month learning pod working through ML projects together',
        roles: ['ML Engineer', 'Data Scientist', 'Project Coordinator', 'Domain Expert'],
        timeline: 'Monthly projects with weekly check-ins',
        successFactors: 'Structured curriculum, project documentation, and knowledge sharing'
      }
    ];

    // Timeline phases
    const timelinePhases = [
      {
        title: 'Planning Phase',
        duration: 'Weeks 1-2',
        milestones: [
          'Define project scope and objectives',
          'Identify required roles and skills',
          'Create initial timeline and milestones',
          'Set up communication channels'
        ]
      },
      {
        title: 'Development Phase',
        duration: 'Weeks 3-6',
        milestones: [
          'Begin core development work',
          'Regular check-ins and progress updates',
          'Address challenges and adjust scope if needed',
          'Review quality of initial deliverables'
        ]
      },
      {
        title: 'Testing Phase',
        duration: 'Weeks 7-8',
        milestones: [
          'Internal testing of deliverables',
          'User feedback sessions',
          'Bug fixes and improvements',
          'Prepare for launch or handoff'
        ]
      },
      {
        title: 'Launch Phase',
        duration: 'Weeks 9-10',
        milestones: [
          'Final preparations for launch',
          'Go-live activities',
          'Monitor initial performance',
          'Document lessons learned'
        ]
      }
    ];

    // Toggle FAQ expand/collapse
    const toggleFaq = (index) => {
      setExpandedFaqs(prev => {
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        } else {
          return [...prev, index];
        }
      });
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
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1, y: 0,
        transition: {
          duration: 0.4,
          ease: "easeOut"
        }
      }
    };

    return (
      <div className={styles.podHelpPage}>
        {/* Animated background */}
        <div className={styles.backgroundWrapper}>
          <div className={styles.gridBackground}></div>
          <div className={styles.bgGlow1}></div>
          <div className={styles.bgGlow2}></div>
        </div>
        
        <div className={styles.pageContainer}>
          {/* Header */}
          <motion.header 
            className={styles.header}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.breadcrumbs}>
              <span onClick={() => navigate('/')}>Home</span>
              <ChevronRight size={14} />
              <span className={styles.current}>Pod Help Center</span>
            </div>
            
            <div className={styles.headerContent}>
              <div className={styles.heroIcon}>
                <Sparkles size={32} />
                <div className={styles.iconGlow}></div>
              </div>
              <h1>Pod Creation Guide</h1>
              <p>Everything you need to know to create successful collaborative pods</p>
            </div>
            
            <div className={styles.searchBar}>
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search help topics..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.header>

          {/* Main content area */}
          <div className={styles.contentWrapper}>
            {/* Sidebar navigation */}
            <motion.nav 
              className={styles.sidebar}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={styles.sidebarContent}>
                <h3>Guide Sections</h3>
                <ul className={styles.navList}>
                  {helpCategories.map((category) => (
                    <li 
                      key={category.id}
                      className={activeSection === category.id ? styles.active : ''}
                    >
                      <button onClick={() => setActiveSection(category.id)}>
                        {category.icon}
                        <span>{category.label}</span>
                        {activeSection === category.id && <ChevronRight size={16} />}
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className={styles.sidebarCta}>
                  <h4>Ready to Start?</h4>
                  <p>Create your own pod and start collaborating</p>
                  <motion.button 
                    className={styles.ctaButton}
                    onClick={() => navigate('/create-pod')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Plus size={16} />
                    Create a Pod
                  </motion.button>
                </div>
              </div>
            </motion.nav>

            {/* Main content */}
            <motion.main 
              className={styles.mainContent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Overview Section */}
              <section 
                ref={el => sectionRefs.current['overview'] = el}
                className={`${styles.contentSection} ${activeSection === 'overview' ? styles.activeSection : ''}`}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeSection === 'overview' ? "visible" : "hidden"}
                >
                  <motion.h2 variants={itemVariants}>Pod Overview</motion.h2>
                  <motion.p variants={itemVariants} className={styles.sectionIntro}>
                    Pods are collaborative teams formed around specific projects, learning goals, or ongoing initiatives. 
                    They bring together people with complementary skills to achieve shared objectives.
                  </motion.p>
                  
                  <motion.h3 variants={itemVariants}>Types of Pods</motion.h3>
                  <motion.div variants={itemVariants} className={styles.podTypesGrid}>
                    {podTypes.map((type, index) => (
                      <div key={index} className={styles.podTypeCard}>
                        <div className={styles.podTypeIcon}>
                          {type.icon}
                        </div>
                        <h4>{type.title}</h4>
                        <p>{type.description}</p>
                        <div className={styles.podTypeExample}>
                          <strong>Example:</strong> {type.example}
                        </div>
                        <div className={styles.podTypeSkills}>
                          {type.skills.map((skill, i) => (
                            <span key={i} className={styles.skillTag}>{skill}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className={styles.keyPoints}>
                    <h3>Key Elements of Successful Pods</h3>
                    <ul className={styles.checkList}>
                      <li>
                        <div className={styles.checkIcon}><CheckCircle size={16} /></div>
                        <div>
                          <strong>Clear Purpose</strong>
                          <p>Define what your pod aims to achieve and why it matters</p>
                        </div>
                      </li>
                      <li>
                        <div className={styles.checkIcon}><CheckCircle size={16} /></div>
                        <div>
                          <strong>Defined Roles</strong>
                          <p>Clearly outlined responsibilities and expectations for each role</p>
                        </div>
                      </li>
                      <li>
                        <div className={styles.checkIcon}><CheckCircle size={16} /></div>
                        <div>
                          <strong>Realistic Timeline</strong>
                          <p>Well-planned schedule with achievable milestones</p>
                        </div>
                      </li>
                      <li>
                        <div className={styles.checkIcon}><CheckCircle size={16} /></div>
                        <div>
                          <strong>Communication Plan</strong>
                          <p>Established channels and cadence for updates and discussions</p>
                        </div>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className={styles.note}>
                    <div className={styles.noteIcon}><AlertTriangle size={18} /></div>
                    <div className={styles.noteContent}>
                      <strong>Pro Tip:</strong> The quality of your pod description directly impacts the quality of members who apply. 
                      Be specific about skills needed, time commitment, and expected outcomes.
                    </div>
                  </motion.div>
                </motion.div>
              </section>
              
              {/* Planning Section */}
              <section 
                ref={el => sectionRefs.current['planning'] = el}
                className={`${styles.contentSection} ${activeSection === 'planning' ? styles.activeSection : ''}`}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeSection === 'planning' ? "visible" : "hidden"}
                >
                  <motion.h2 variants={itemVariants}>Planning Your Pod</motion.h2>
                  <motion.p variants={itemVariants} className={styles.sectionIntro}>
                    Careful planning is essential for pod success. This section guides you through the key planning steps 
                    to ensure your pod is well-structured and ready for collaboration.
                  </motion.p>
                  
                  <motion.div variants={itemVariants} className={styles.planningSteps}>
                    <div className={styles.planningStep}>
                      <div className={styles.stepNumber}>01</div>
                      <div className={styles.stepContent}>
                        <h3>Define Your Purpose</h3>
                        <p>Start with a clear mission statement that explains what your pod will accomplish and why it matters. 
                          Be specific about deliverables and impact.</p>
                        <div className={styles.exampleBox}>
                          <strong>Example:</strong> "Create a web application that helps remote teams organize virtual 
                          social events, launching in 3 months with core features that address the isolation problem 
                          in distributed teams."
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.planningStep}>
                      <div className={styles.stepNumber}>02</div>
                      <div className={styles.stepContent}>
                        <h3>Determine Required Skills</h3>
                        <p>Identify the specific skills needed to achieve your pod's goals. Consider both technical 
                          and soft skills that complement each other.</p>
                        <div className={styles.skillsGrid}>
                          <div className={styles.skillColumn}>
                            <h4>Technical Skills</h4>
                            <ul>
                              <li>Frontend Development (React)</li>
                              <li>Backend Development (Node.js)</li>
                              <li>UI/UX Design</li>
                              <li>Database Architecture</li>
                            </ul>
                          </div>
                          <div className={styles.skillColumn}>
                            <h4>Soft Skills</h4>
                            <ul>
                              <li>Project Management</li>
                              <li>Communication</li>
                              <li>User Research</li>
                              <li>Quality Assurance</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.planningStep}>
                      <div className={styles.stepNumber}>03</div>
                      <div className={styles.stepContent}>
                        <h3>Create a Timeline</h3>
                        <p>Establish a realistic schedule with key milestones. Break the project into phases 
                          with specific deliverables for each.</p>
                        <div className={styles.timelineSample}>
                          <div className={styles.timelinePhase}>
                            <span className={styles.phaseLabel}>Planning</span>
                            <div className={styles.phaseBar}></div>
                            <span className={styles.phaseDuration}>2 weeks</span>
                          </div>
                          <div className={styles.timelinePhase}>
                            <span className={styles.phaseLabel}>Development</span>
                            <div className={styles.phaseBar}></div>
                            <span className={styles.phaseDuration}>6 weeks</span>
                          </div>
                          <div className={styles.timelinePhase}>
                            <span className={styles.phaseLabel}>Testing</span>
                            <div className={styles.phaseBar}></div>
                            <span className={styles.phaseDuration}>2 weeks</span>
                          </div>
                          <div className={styles.timelinePhase}>
                            <span className={styles.phaseLabel}>Launch</span>
                            <div className={styles.phaseBar}></div>
                            <span className={styles.phaseDuration}>2 weeks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.planningStep}>
                      <div className={styles.stepNumber}>04</div>
                      <div className={styles.stepContent}>
                        <h3>Establish Communication Plan</h3>
                        <p>Decide how and when team members will communicate. Choose tools, meeting frequency, 
                          and documentation standards.</p>
                        <div className={styles.communicationPlan}>
                          <div className={styles.communicationItem}>
                            <MessageSquare size={16} />
                            <strong>Daily Updates:</strong> Async chat updates
                          </div>
                          <div className={styles.communicationItem}>
                            <Users size={16} />
                            <strong>Weekly Meeting:</strong> Video call for progress review
                          </div>
                          <div className={styles.communicationItem}>
                            <FileText size={16} />
                            <strong>Documentation:</strong> Shared workspace for all artifacts
                          </div>
                          <div className={styles.communicationItem}>
                            <Code size={16} />
                            <strong>Code Review:</strong> Regular pull request reviews
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className={styles.planningTemplate}>
                    <h3>Pod Planning Template</h3>
                    <p>Use this template as a starting point for planning your pod:</p>
                    <div className={styles.templateBox}>
                      <div className={styles.templateSection}>
                        <h4>Pod Name:</h4>
                        <div className={styles.dottedLine}></div>
                      </div>
                      <div className={styles.templateSection}>
                        <h4>Mission Statement:</h4>
                        <div className={styles.dottedLines}>
                          <div className={styles.dottedLine}></div>
                          <div className={styles.dottedLine}></div>
                        </div>
                      </div>
                      <div className={styles.templateSection}>
                        <h4>Key Deliverables:</h4>
                        <div className={styles.emptyCheckboxes}>
                          <div className={styles.emptyCheckbox}></div>
                          <div className={styles.dottedLine} style={{ width: "80%" }}></div>
                          <div className={styles.emptyCheckbox}></div>
                          <div className={styles.dottedLine} style={{ width: "80%" }}></div>
                          <div className={styles.emptyCheckbox}></div>
                          <div className={styles.dottedLine} style={{ width: "80%" }}></div>
                        </div>
                      </div>
                      <div className={styles.templateSection}>
                        <h4>Roles Needed:</h4>
                        <div className={styles.emptyList}>
                          <div>1. <div className={styles.dottedLine} style={{ width: "80%" }}></div></div>
                          <div>2. <div className={styles.dottedLine} style={{ width: "80%" }}></div></div>
                          <div>3. <div className={styles.dottedLine} style={{ width: "80%" }}></div></div>
                          <div>4. <div className={styles.dottedLine} style={{ width: "80%" }}></div></div>
                        </div>
                      </div>
                      <motion.button
                        className={styles.downloadButton}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FileText size={16} />
                        Download Full Template
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              </section>
              
              {/* Roles Section */}
              <section 
                ref={el => sectionRefs.current['roles'] = el}
                className={`${styles.contentSection} ${activeSection === 'roles' ? styles.activeSection : ''}`}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeSection === 'roles' ? "visible" : "hidden"}
                >
                  <motion.h2 variants={itemVariants}>Defining Roles</motion.h2>
                  <motion.p variants={itemVariants} className={styles.sectionIntro}>
                    Clear role definitions help attract the right members and ensure everyone understands 
                    their responsibilities. This section covers how to structure roles effectively.
                  </motion.p>
                  
                  <motion.div variants={itemVariants} className={styles.rolesSection}>
                    <h3>Common Pod Roles</h3>
                    <div className={styles.rolesGrid}>
                      {commonRoles.map((role, index) => (
                        <div key={index} className={styles.roleCard}>
                          <div className={styles.roleIcon}>{role.icon}</div>
                          <h4>{role.title}</h4>
                          <p>{role.description}</p>
                          <div className={styles.roleResponsibilities}>
                            <h5>Key Responsibilities:</h5>
                            <ul>
                              {role.responsibilities.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className={styles.roleDefinition}>
                    <h3>How to Write Effective Role Descriptions</h3>
                    
                    <div className={styles.roleExample}>
                      <div className={styles.roleBadExample}>
                        <h4>
                          <X size={16} className={styles.invalidIcon} />
                          Ineffective Example
                        </h4>
                        <div className={styles.exampleContent}>
                          <strong>Frontend Developer</strong>
                          <p>Looking for someone who knows React to help build our app. Should be good at making things look nice and work well. Previous experience preferred.</p>
                        </div>
                        <div className={styles.exampleProblems}>
                          <div className={styles.problemItem}>
                            <AlertTriangle size={14} />
                            Too vague about specific skills required
                          </div>
                          <div className={styles.problemItem}>
                            <AlertTriangle size={14} />
                            No mention of time commitment
                          </div>
                          <div className={styles.problemItem}>
                            <AlertTriangle size={14} />
                            Unclear responsibilities and expectations
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.roleGoodExample}>
                        <h4>
                          <CheckCircle size={16} className={styles.validIcon} />
                          Effective Example
                        </h4>
                        <div className={styles.exampleContent}>
                          <strong>Frontend Developer (React)</strong>
                          <p>We're seeking a React developer with 1+ years of experience to build responsive UI components and integrate with our backend APIs. You'll collaborate with our designer to implement the user experience for our community platform.</p>
                          <div className={styles.roleDetails}>
                            <div className={styles.roleDetail}>
                              <strong>Time Commitment:</strong> 10-15 hours/week for 3 months
                            </div>
                            <div className={styles.roleDetail}>
                              <strong>Key Skills:</strong> React, TypeScript, CSS/SCSS, RESTful APIs
                            </div>
                            <div className={styles.roleDetail}>
                              <strong>Responsibilities:</strong>
                              <ul>
                                <li>Develop and maintain frontend components</li>
                                <li>Ensure responsive design and cross-browser compatibility</li>
                                <li>Optimize application for performance</li>
                                <li>Participate in code reviews and team meetings</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className={styles.roleTemplate}>
                    <h3>Role Description Template</h3>
                    <div className={styles.templateBox}>
                      <div className={styles.templateSection}>
                        <h4>Role Title:</h4>
                        <div className={styles.dottedLine}></div>
                      </div>
                      <div className={styles.templateSection}>
                        <h4>Description:</h4>
                        <div className={styles.dottedLines}>
                          <div className={styles.dottedLine}></div>
                          <div className={styles.dottedLine}></div>
                        </div>
                      </div>
                      <div className={styles.templateSection}>
                        <h4>Required Skills:</h4>
                        <div className={styles.emptyList}>
                          <div>• <div className={styles.dottedLine} style={{ width: "80%" }}></div></div>
                          <div>• <div className={styles.dottedLine} style={{ width: "80%" }}></div></div>
                          <div>• <div className={styles.dottedLine} style={{ width: "80%" }}></div></div>
                        </div>
                      </div>
                      <div className={styles.templateSection}>
                        <h4>Responsibilities:</h4>
                        <div className={styles.emptyList}>
                          <div>• <div className={styles.dottedLine} style={{ width: "80%" }}></div></div>
                          <div>• <div className={styles.dottedLine} style={{ width: "80%" }}></div></div>
                          <div>• <div className={styles.dottedLine} style={{ width: "80%" }}></div></div>
                        </div>
                      </div>
                      <div className={styles.templateSection}>
                        <h4>Time Commitment:</h4>
                        <div className={styles.dottedLine}></div>
                      </div>
                      <div className={styles.templateSection}>
                        <h4>Compensation:</h4>
                        <div className={styles.dottedLine}></div>
                      </div>
                      <motion.button
                        className={styles.downloadButton}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FileText size={16} />
                        Download Template
                      </motion.button>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className={styles.note}>
                    <div className={styles.noteIcon}><AlertTriangle size={18} /></div>
                    <div className={styles.noteContent}>
                      <strong>Remember:</strong> Be upfront about compensation structure. Whether it's paid, equity, 
                      revenue-sharing, or volunteer work, clear expectations prevent misunderstandings later.
                    </div>
                  </motion.div>
                </motion.div>
              </section>
              
              {/* Timeline Section */}
              <section 
                ref={el => sectionRefs.current['timeline'] = el}
                className={`${styles.contentSection} ${activeSection === 'timeline' ? styles.activeSection : ''}`}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeSection === 'timeline' ? "visible" : "hidden"}
                >
                  <motion.h2 variants={itemVariants}>Creating Timelines</motion.h2>
                  <motion.p variants={itemVariants} className={styles.sectionIntro}>
                    Well-structured timelines help keep your pod on track and set clear expectations.
                    Learn how to create effective timelines with realistic milestones.
                  </motion.p>
                  
                  <motion.div variants={itemVariants} className={styles.timelineVisual}>
                    <h3>Sample Project Timeline</h3>
                    <div className={styles.timelineSteps}>
                      {timelinePhases.map((phase, index) => (
                        <div key={index} className={styles.timelineStep}>
                          <div className={styles.timelineStepHeader}>
                            <div className={styles.stepNumber}>{index + 1}</div>
                            <div className={styles.stepInfo}>
                              <h4>{phase.title}</h4>
                              <span className={styles.duration}>{phase.duration}</span>
                            </div>
                          </div>
                          <div className={styles.timelineStepContent}>
                            <ul className={styles.milestoneslist}>
                              {phase.milestones.map((milestone, i) => (
                                <li key={i}>{milestone}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className={styles.timelineGuidance}>
                    <h3>Timeline Best Practices</h3>
                    <div className={styles.guidanceColumns}>
                      <div className={styles.guidanceColumn}>
                        <h4>Do's</h4>
                        <ul className={styles.dosList}>
                          <li>
                            <CheckCircle size={16} />
                            <span>Include buffer time for unexpected challenges</span>
                          </li>
                          <li>
                            <CheckCircle size={16} />
                            <span>Break large milestones into smaller, measurable tasks</span>
                          </li>
                          <li>
                            <CheckCircle size={16} />
                            <span>Clearly define what "done" means for each milestone</span>
                          </li>
                          <li>
                            <CheckCircle size={16} />
                            <span>Schedule regular check-ins to assess progress</span>
                          </li>
                          <li>
                            <CheckCircle size={16} />
                            <span>Revisit and adjust the timeline as the project evolves</span>
                          </li>
                        </ul>
                      </div>
                      <div className={styles.guidanceColumn}>
                        <h4>Don'ts</h4>
                        <ul className={styles.dontsList}>
                          <li>
                            <X size={16} />
                            <span>Set unrealistic deadlines that lead to burnout</span>
                          </li>
                          <li>
                            <X size={16} />
                            <span>Be vague about deliverables for each phase</span>
                          </li>
                          <li>
                            <X size={16} />
                            <span>Forget to account for onboarding new members</span>
                          </li>
                          <li>
                            <X size={16} />
                            <span>Neglect to communicate timeline changes</span>
                          </li>
                          <li>
                            <X size={16} />
                            <span>Plan without input from team members</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className={styles.timelineTools}>
                    <h3>Timeline Tools & Templates</h3>
                    <div className={styles.toolsGrid}>
                      <div className={styles.toolCard}>
                        <div className={styles.toolIcon}>
                          <Calendar size={24} />
                        </div>
                        <h4>Gantt Chart Template</h4>
                        <p>Visualize project phases and dependencies with our customizable Gantt chart</p>
                        <motion.button
                          className={styles.toolButton}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Download size={14} />
                          Download Template
                        </motion.button>
                      </div>
                      <div className={styles.toolCard}>
                        <div className={styles.toolIcon}>
                          <FileText size={24} />
                        </div>
                        <h4>Milestone Checklist</h4>
                        <p>Track progress with a comprehensive milestone checklist that includes key deliverables</p>
                        <motion.button
                          className={styles.toolButton}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Download size={14} />
                          Download Template
                        </motion.button>
                      </div>
                      <div className={styles.toolCard}>
                        <div className={styles.toolIcon}>
                          <Target size={24} />
                        </div>
                        <h4>Sprint Planning Board</h4>
                        <p>Organize work into sprints with this agile-inspired planning template</p>
                        <motion.button
                          className={styles.toolButton}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Download size={14} />
                          Download Template
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </section>
              
              {/* Success Tips Section */}
              <section 
                ref={el => sectionRefs.current['tips'] = el}
                className={`${styles.contentSection} ${activeSection === 'tips' ? styles.activeSection : ''}`}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeSection === 'tips' ? "visible" : "hidden"}
                >
                  <motion.h2 variants={itemVariants}>Success Tips</motion.h2>
                  <motion.p variants={itemVariants} className={styles.sectionIntro}>
                    Learn from experienced pod creators about what makes pods successful
                    and how to avoid common pitfalls.
                  </motion.p>
                  
                  <motion.div variants={itemVariants} className={styles.tipsCards}>
                    <div className={styles.tipCard}>
                      <div className={styles.tipIcon}>
                        <Users size={24} />
                      </div>
                      <h3>Member Selection</h3>
                      <p>Prioritize team fit and communication skills alongside technical abilities. 
                      A balanced team with complementary skills and collaborative attitudes achieves more than 
                      a collection of technical experts who don't work well together.</p>
                      <div className={styles.tipActionItem}>
                        <CheckCircle size={16} />
                        <span>Create a brief application process that assesses communication and teamwork</span>
                      </div>
                      <div className={styles.tipActionItem}>
                        <CheckCircle size={16} />
                        <span>Consider a short trial period or starter task for new members</span>
                      </div>
                    </div>
                    
                    <div className={styles.tipCard}>
                      <div className={styles.tipIcon}>
                        <MessageSquare size={24} />
                      </div>
                      <h3>Communication Rhythm</h3>
                      <p>Establish a consistent communication pattern from day one. Regular updates 
                      keep everyone aligned and help identify issues early. Documentation ensures knowledge 
                      is shared and preserved.</p>
                      <div className={styles.tipActionItem}>
                        <CheckCircle size={16} />
                        <span>Create a communication plan with specific channels for different purposes</span>
                      </div>
                      <div className={styles.tipActionItem}>
                        <CheckCircle size={16} />
                        <span>Document decisions and ensure they're accessible to all team members</span>
                      </div>
                    </div>
                    
                    <div className={styles.tipCard}>
                      <div className={styles.tipIcon}>
                        <Target size={24} />
                      </div>
                      <h3>Scope Management</h3>
                      <p>Start with a minimal viable product or outcome and expand only when initial goals 
                      are achieved. Feature creep is a common cause of pods failing to deliver.</p>
                      <div className={styles.tipActionItem}>
                        <CheckCircle size={16} />
                        <span>Create a clear definition of "done" for each feature or deliverable</span>
                      </div>
                      <div className={styles.tipActionItem}>
                        <CheckCircle size={16} />
                        <span>Maintain a "nice-to-have" list for future iterations</span>
                      </div>
                    </div>
                    
                    <div className={styles.tipCard}>
                      <div className={styles.tipIcon}>
                        <Award size={24} />
                      </div>
                      <h3>Celebration & Recognition</h3>
                      <p>Regularly acknowledge achievements and celebrate milestones. Recognition 
                      keeps motivation high and builds team cohesion, especially in virtual environments.</p>
                      <div className={styles.tipActionItem}>
                        <CheckCircle size={16} />
                        <span>Schedule milestone celebrations, even for remote teams</span>
                      </div>
                      <div className={styles.tipActionItem}>
                        <CheckCircle size={16} />
                        <span>Create a system for recognizing individual contributions</span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className={styles.quoteSection}>
                    <h3>From Pod Leaders</h3>
                    <div className={styles.quotes}>
                      <div className={styles.quote}>
                        <div className={styles.quoteContent}>
                          "The most successful pods I've led had crystal clear goals but flexible paths to get there. 
                          This allowed for creativity while still ensuring we delivered what was promised."
                        </div>
                        <div className={styles.quoteAuthor}>
                          <div className={styles.authorAvatar}>JS</div>
                          <div className={styles.authorInfo}>
                            <strong>Jamie Smith</strong>
                            <span>Led 12 successful project pods</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.quote}>
                        <div className={styles.quoteContent}>
                          "Don't underestimate the importance of documentation. In pods where members may join or leave, 
                          good documentation ensures continuity and prevents knowledge silos."
                        </div>
                        <div className={styles.quoteAuthor}>
                          <div className={styles.authorAvatar}>RT</div>
                          <div className={styles.authorInfo}>
                            <strong>Ray Torres</strong>
                            <span>Community pod specialist</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </section>
              
              {/* Example Pods Section */}
              <section 
                ref={el => sectionRefs.current['examples'] = el}
                className={`${styles.contentSection} ${activeSection === 'examples' ? styles.activeSection : ''}`}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeSection === 'examples' ? "visible" : "hidden"}
                >
                  <motion.h2 variants={itemVariants}>Example Pods</motion.h2>
                  <motion.p variants={itemVariants} className={styles.sectionIntro}>
                    Learn from these real-world pod examples that demonstrate effective structure and planning.
                  </motion.p>
                  
                  <motion.div variants={itemVariants} className={styles.examplePods}>
                    {examplePods.map((pod, index) => (
                      <div key={index} className={styles.examplePodCard}>
                        <div className={styles.podCardHeader}>
                          <div className={styles.podCategory}>{pod.category}</div>
                          <div className={styles.podBookmark}>
                            <Bookmark size={16} />
                          </div>
                        </div>
                        <h3>{pod.title}</h3>
                        <p className={styles.podDescription}>{pod.description}</p>
                        <div className={styles.podDetails}>
                          <div className={styles.podDetailItem}>
                            <Users size={16} />
                            <strong>Roles:</strong>
                            <div className={styles.podRoles}>
                              {pod.roles.map((role, i) => (
                                <span key={i} className={styles.podRole}>{role}</span>
                              ))}
                            </div>
                          </div>
                          <div className={styles.podDetailItem}>
                            <Clock size={16} />
                            <strong>Timeline:</strong>
                            <span>{pod.timeline}</span>
                          </div>
                          <div className={styles.podDetailItem}>
                            <Star size={16} />
                            <strong>Success Factors:</strong>
                            <span>{pod.successFactors}</span>
                          </div>
                        </div>
                        <div className={styles.podActions}>
                          <motion.button
                            className={styles.podActionButton}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FileText size={16} />
                            View Details
                          </motion.button>
                          <motion.button
                            className={styles.podActionButton}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Copy size={16} />
                            Use as Template
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className={styles.featuredExample}>
                    <h3>Featured Success Story</h3>
                    <div className={styles.successStory}>
                      <div className={styles.storyImage}>
                        <div className={styles.imagePlaceholder}>
                          <Image size={32} />
                        </div>
                      </div>
                      <div className={styles.storyContent}>
                        <h4>Community News Platform</h4>
                        <p>A team of 6 creators built a community news platform in 4 months that now 
                        serves over 50,000 readers. Their pod structure allowed specialists in development, 
                        content creation, and community building to collaborate efficiently while working 
                        part-time on the project.</p>
                        <div className={styles.storyHighlights}>
                          <div className={styles.highlightItem}>
                            <div className={styles.highlightIcon}>
                              <Users size={16} />
                            </div>
                            <div className={styles.highlightContent}>
                              <strong>6 Members</strong>
                              <span>Cross-functional team</span>
                            </div>
                          </div>
                          <div className={styles.highlightItem}>
                            <div className={styles.highlightIcon}>
                              <Clock size={16} />
                            </div>
                            <div className={styles.highlightContent}>
                              <strong>4 Months</strong>
                              <span>From concept to launch</span>
                            </div>
                          </div>
                          <div className={styles.highlightItem}>
                            <div className={styles.highlightIcon}>
                              <Award size={16} />
                            </div>
                            <div className={styles.highlightContent}>
                              <strong>50,000 Users</strong>
                              <span>Reached within 6 months</span>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          className={styles.storyButton}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FileText size={16} />
                          Read Full Case Study
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </section>
              
              {/* FAQ Section */}
              <section 
                ref={el => sectionRefs.current['faq'] = el}
                className={`${styles.contentSection} ${activeSection === 'faq' ? styles.activeSection : ''}`}
              >
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate={activeSection === 'faq' ? "visible" : "hidden"}
                >
                  <motion.h2 variants={itemVariants}>Frequently Asked Questions</motion.h2>
                  <motion.p variants={itemVariants} className={styles.sectionIntro}>
                    Find answers to common questions about creating and managing pods.
                  </motion.p>
                  
                  <motion.div variants={itemVariants} className={styles.faqList}>
                    {faqData.map((faq, index) => (
                      <div 
                        key={index} 
                        className={`${styles.faqItem} ${expandedFaqs.includes(index) ? styles.expanded : ''}`}
                      >
                        <div 
                          className={styles.faqQuestion}
                          onClick={() => toggleFaq(index)}
                        >
                          <h3>{faq.question}</h3>
                          <div className={styles.faqToggle}>
                            {expandedFaqs.includes(index) ? 
                              <ChevronDown size={20} /> : 
                              <ChevronRight size={20} />
                            }
                          </div>
                        </div>
                        <AnimatePresence>
                          {expandedFaqs.includes(index) && (
                            <motion.div 
                              className={styles.faqAnswer}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <p>{faq.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className={styles.faqSupport}>
                    <h3>Still Have Questions?</h3>
                    <p>Our community is here to help you create successful pods.</p>
                    <div className={styles.supportOptions}>
                      <motion.div
                        className={styles.supportOption}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={styles.supportIcon}>
                          <MessageSquare size={24} />
                        </div>
                        <h4>Community Forum</h4>
                        <p>Join discussions with other pod creators and find answers</p>
                        <button className={styles.supportButton}>
                          Visit Forum
                          <ArrowRight size={16} />
                        </button>
                      </motion.div>
                      <motion.div
                        className={styles.supportOption}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={styles.supportIcon}>
                          <PlayCircle size={24} />
                        </div>
                        <h4>Workshop Videos</h4>
                        <p>Watch tutorials on planning and managing successful pods</p>
                        <button className={styles.supportButton}>
                          Watch Videos
                          <ArrowRight size={16} />
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </section>
            </motion.main>
          </div>
          
          {/* Call to action */}
          <motion.div 
            className={styles.ctaSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className={styles.ctaContent}>
              <div className={styles.ctaIconWrapper}>
                <Zap size={32} />
                <div className={styles.ctaIconGlow}></div>
              </div>
              <h2>Ready to Start Your Pod?</h2>
              <p>Apply what you've learned and create your first collaborative pod</p>
              <motion.button 
                className={styles.primaryButton}
                onClick={() => navigate('/create-pod')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={18} />
                Create Your Pod
              </motion.button>
              <div className={styles.secondaryAction}>
                <span>Or browse existing pods first</span>
                <motion.button 
                  className={styles.secondaryButton}
                  onClick={() => navigate('/explore-pods')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search size={16} />
                  Explore Pods
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  export default PodHelp;