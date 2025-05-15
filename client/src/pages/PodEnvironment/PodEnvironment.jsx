import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; // Add this import
import { 
  Sparkles,
  Users,
  Target,
  Clock,
  CheckCircle,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Link,
  Plus,
  Briefcase,
  MessageSquare,
  Code,
  FileText,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Zap,
  BarChart2,
  Settings,
  Bell,
  MoreHorizontal,
  Send,
  Paperclip,
  Download,
  ExternalLink,
  AlertCircle,
  UserPlus,
  Menu,
  LogOut,
  Archive,
  Crown // Add this import
} from 'lucide-react';
import styles from './PodEnvironment.module.scss';
import { io } from "socket.io-client";


// Mock data for development purposes
const mockPod = {
  id: 'pod-12345',
  title: 'Project Alpha: Mobile App Development',
  mission: 'Build a cutting-edge mobile application with seamless UX and robust backend',
  creator: {
    id: 'user-1',
    name: 'Alex Morgan',
    avatar: null, // null will use initials
    role: 'Project Lead'
  },
  createdAt: '2025-03-15',
  dueDate: '2025-07-15',
  status: 'active',
  progress: 37, // percentage
  members: [
    { id: 'user-1', name: 'Alex Morgan', avatar: null, role: 'Project Lead', status: 'online' },
    { id: 'user-2', name: 'Jamie Chen', avatar: null, role: 'Frontend Developer', status: 'away' },
    { id: 'user-3', name: 'Riley Smith', avatar: null, role: 'UI/UX Designer', status: 'online' },
    { id: 'user-4', name: 'Taylor Johnson', avatar: null, role: 'Backend Developer', status: 'offline' }
  ],
  stats: {
    totalTasks: 32,
    completedTasks: 12,
    activeMilestones: 3,
    totalMilestones: 6,
    daysRemaining: 68,
    team: {
      tasksPerMember: [
        { id: 'user-1', completed: 5, total: 8 },
        { id: 'user-2', completed: 3, total: 9 },
        { id: 'user-3', completed: 2, total: 8 },
        { id: 'user-4', completed: 2, total: 7 }
      ],
      completionRate: 37.5, // percentage
    }
  }
};

const mockMilestones = [
  {
    id: 'ms-1',
    title: 'Project Planning',
    description: 'Complete project scope, requirements, and team structure',
    dueDate: '2025-04-01',
    status: 'completed',
    progress: 100
  },
  {
    id: 'ms-2',
    title: 'Design Phase',
    description: 'UI/UX designs for all app screens and user flows',
    dueDate: '2025-05-15',
    status: 'in-progress',
    progress: 70
  },
  {
    id: 'ms-3',
    title: 'Frontend Development',
    description: 'Implement core app interface components',
    dueDate: '2025-06-01',
    status: 'in-progress',
    progress: 40
  },
  {
    id: 'ms-4',
    title: 'Backend Development',
    description: 'Set up API endpoints and database structures',
    dueDate: '2025-06-15',
    status: 'in-progress',
    progress: 25
  },
  {
    id: 'ms-5',
    title: 'Testing Phase',
    description: 'Perform unit and integration tests',
    dueDate: '2025-06-30',
    status: 'not-started',
    progress: 0
  },
  {
    id: 'ms-6',
    title: 'Public Beta Launch',
    description: 'Release beta version to selected users',
    dueDate: '2025-07-15',
    status: 'not-started',
    progress: 0
  }
];

const mockTasks = [
  {
    id: 'task-1',
    title: 'User Research',
    description: 'Conduct user interviews and analyze target audience needs',
    status: 'completed',
    assignedTo: ['user-1', 'user-3'],
    createdBy: 'user-1',
    createdAt: '2025-03-18',
    dueDate: '2025-03-25',
    milestoneId: 'ms-1',
    priority: 'high',
    comments: [
      { id: 'comment-1', userId: 'user-1', text: 'All 12 interviews have been completed', createdAt: '2025-03-24' },
      { id: 'comment-2', userId: 'user-3', text: 'User personas created and uploaded to resources', createdAt: '2025-03-25' }
    ]
  },
  {
    id: 'task-2',
    title: 'Wireframe Design',
    description: 'Create wireframes for primary app screens',
    status: 'completed',
    assignedTo: ['user-3'],
    createdBy: 'user-1',
    createdAt: '2025-03-26',
    dueDate: '2025-04-10',
    milestoneId: 'ms-2',
    priority: 'medium',
    comments: [
      { id: 'comment-3', userId: 'user-3', text: 'First draft of wireframes uploaded', createdAt: '2025-04-05' },
      { id: 'comment-4', userId: 'user-1', text: 'Wireframes approved with minor changes', createdAt: '2025-04-07' }
    ]
  },
  {
    id: 'task-3',
    title: 'UI Design System',
    description: 'Develop the color palette, typography, and component library',
    status: 'completed',
    assignedTo: ['user-3'],
    createdBy: 'user-1',
    createdAt: '2025-04-12',
    dueDate: '2025-04-25',
    milestoneId: 'ms-2',
    priority: 'high',
    comments: []
  },
  {
    id: 'task-4',
    title: 'React Native Setup',
    description: 'Initialize project and configure development environment',
    status: 'completed',
    assignedTo: ['user-2'],
    createdBy: 'user-1',
    createdAt: '2025-04-15',
    dueDate: '2025-04-20',
    milestoneId: 'ms-3',
    priority: 'high',
    comments: []
  },
  {
    id: 'task-5',
    title: 'User Authentication',
    description: 'Implement login, registration, and password recovery flows',
    status: 'in-progress',
    assignedTo: ['user-2', 'user-4'],
    createdBy: 'user-1',
    createdAt: '2025-04-21',
    dueDate: '2025-05-05',
    milestoneId: 'ms-3',
    priority: 'high',
    comments: [
      { id: 'comment-5', userId: 'user-4', text: 'API endpoints created for auth flows', createdAt: '2025-04-28' }
    ]
  },
  {
    id: 'task-6',
    title: 'Navigation Component',
    description: 'Create the main navigation system for the app',
    status: 'in-progress',
    assignedTo: ['user-2'],
    createdBy: 'user-1',
    createdAt: '2025-04-22',
    dueDate: '2025-05-10',
    milestoneId: 'ms-3',
    priority: 'medium',
    comments: []
  },
  {
    id: 'task-7',
    title: 'Database Schema Design',
    description: 'Design and implement the database structure',
    status: 'in-progress',
    assignedTo: ['user-4'],
    createdBy: 'user-1',
    createdAt: '2025-04-25',
    dueDate: '2025-05-15',
    milestoneId: 'ms-4',
    priority: 'high',
    comments: []
  },
  {
    id: 'task-8',
    title: 'Profile Screen UI',
    description: 'Implement the user profile screen and settings',
    status: 'to-do',
    assignedTo: ['user-2', 'user-3'],
    createdBy: 'user-1',
    createdAt: '2025-05-01',
    dueDate: '2025-05-20',
    milestoneId: 'ms-3',
    priority: 'medium',
    comments: []
  }
];

const mockMessages = [
  { id: 'msg-1', userId: 'user-1', text: 'Welcome to the Project Alpha pod! Let\'s build something amazing.', createdAt: '2025-03-15T10:30:00' },
  { id: 'msg-2', userId: 'user-2', text: 'Excited to get started on the frontend work!', createdAt: '2025-03-15T10:45:00' },
  { id: 'msg-3', userId: 'user-3', text: 'Just uploaded the initial wireframes to the Resources section.', createdAt: '2025-03-22T14:15:00' },
  { id: 'msg-4', userId: 'user-4', text: 'Backend architecture proposal is ready for review.', createdAt: '2025-03-25T09:20:00' },
  { id: 'msg-5', userId: 'user-1', text: 'Team meeting tomorrow at 10 AM to discuss design system.', createdAt: '2025-04-10T16:40:00' },
  { id: 'msg-6', userId: 'user-3', text: 'Design system documentation is now complete!', createdAt: '2025-04-25T11:05:00' },
  { id: 'msg-7', userId: 'user-2', text: 'Need help with the authentication modules. @Taylor any tips?', createdAt: '2025-05-02T13:50:00' },
  { id: 'msg-8', userId: 'user-4', text: '@Jamie I\'ll help you with the auth setup. Let\'s connect after the daily standup.', createdAt: '2025-05-02T14:20:00' }
];

const mockResources = [
  { id: 'resource-1', name: 'Project Brief.pdf', type: 'document', size: '2.4 MB', uploadedBy: 'user-1', uploadedAt: '2025-03-16' },
  { id: 'resource-2', name: 'User Research.docx', type: 'document', size: '1.8 MB', uploadedBy: 'user-3', uploadedAt: '2025-03-25' },
  { id: 'resource-3', name: 'App Wireframes.fig', type: 'design', size: '5.7 MB', uploadedBy: 'user-3', uploadedAt: '2025-04-05' },
  { id: 'resource-4', name: 'Design System.sketch', type: 'design', size: '8.2 MB', uploadedBy: 'user-3', uploadedAt: '2025-04-24' },
  { id: 'resource-5', name: 'API Documentation.md', type: 'document', size: '645 KB', uploadedBy: 'user-4', uploadedAt: '2025-04-28' },
  { id: 'resource-6', name: 'Meeting Notes - 05-02.md', type: 'document', size: '125 KB', uploadedBy: 'user-1', uploadedAt: '2025-05-02' }
];

const PodEnvironment = () => {
    const navigate = useNavigate();
    const { podId } = useParams();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [expandedTask, setExpandedTask] = useState(null);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
      const [currentUser, setCurrentUser] = useState(mockPod.members[0]); // Simulate current user (the creator for this demo)
    const [isCreator, setIsCreator] = useState(true); // Simulated current user role check
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Add these new state variables
    const [podMembers, setPodMembers] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(false); // Add this for loading state
    const [error, setError] = useState(null); // Add this for error state
    // Add these new state variables
    const [tasks, setTasks] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [podMessages, setPodMessages] = useState([]);
  
    // Updated filtered tasks
    const todoTasks = tasks.filter(task => task.status === 'to-do');
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
    const completedTasks = tasks.filter(task => task.status === 'completed');
  
// Auto-scroll to bottom of messages and fetch pod members 
useEffect(() => {
  if (messagesEndRef.current && activeTab === 'communication') {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
      
  const fetchPodData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
            
      if (!token || !userData) {
        console.error('No auth token or user data found');
        setLoading(false);
        return;
      }
            
      const user = JSON.parse(userData);
      setCurrentUser(user);
            
      try {

        

         // Fetch pod details
    const podResponse = await axios.get(`http://localhost:5000/api/pods/${podId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
                
        const pod = podResponse.data;
                
        // Check if user is creator
    if (podResponse.data.creator && podResponse.data.creator._id === user._id) {
      setIsCreator(true);
    } else {
      setIsCreator(false);
    }
                
        // Fetch pod members
        try {
          const membersResponse = await axios.get(`http://localhost:5000/api/pods/${podId}/members`, {
            headers: { Authorization: `Bearer ${token}` }
          });
                    
          setPodMembers(membersResponse.data);
                    
          // Check if current user is a member
          const memberCheck = membersResponse.data.find(member =>
            member.user._id === user._id
          );
                    
          if (memberCheck) {
            setIsMember(true);
            setUserRole(memberCheck.role);
          } else {
            setIsMember(false);
          }

        } catch (membersError) {
          console.error('Error fetching pod members:', membersError);
        }
              
      } catch (podError) {
        console.error('Error fetching pod details:', podError);
        setError(podError.message || 'Failed to load pod details');
      }
            
      setLoading(false);
  } catch (error) {
    console.error('Error in pod environment setup:', error);
    setError(error.message || 'An error occurred');
    setLoading(false);
  }
};

  // Based on active tab, fetch specific data
  if (activeTab === 'tasks') {
    fetchTasks();
  } else if (activeTab === 'milestones') {
    fetchMilestones();
  } else if (activeTab === 'communication') {
    fetchMessages();
  }
          
  fetchPodData();
}, [podId, activeTab]);

// Fetch tasks
const fetchTasks = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const response = await axios.get(`http://localhost:5000/api/pods/${podId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setTasks(response.data);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

// Fetch milestones
const fetchMilestones = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const response = await axios.get(`http://localhost:5000/api/pods/${podId}/milestones`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setMilestones(response.data);
  } catch (error) {
    console.error('Error fetching milestones:', error);
  }
};

// Fetch messages
const fetchMessages = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const response = await axios.get(`http://localhost:5000/api/messages/${podId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setPodMessages(response.data);
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};


// Socket connection setup
useEffect(() => {
  const userData = localStorage.getItem('user');
  
  if (!userData) {
    console.error('No user data found');
    return;
  }
  
  const user = JSON.parse(userData);
  
  // Connect to socket
  const newSocket = io("http://localhost:5000");
  setSocket(newSocket);
  
  // Join pod room when connected
  newSocket.on('connect', () => {
    console.log('Connected to socket');
    newSocket.emit('join_pod', { 
      podId, 
      userId: user._id,
      userName: user.name
    });
  });
  
  // Listen for messages
  newSocket.on('receive_message', (message) => {
    setMessages(prev => [...prev, message]);
  });
  
  // Clean up on component unmount
  return () => {
    newSocket.disconnect();
  };
}, [podId]); // Add podId as a dependency
  
  // Toggle task expanded state
  const toggleTaskExpanded = (taskId) => {
    if (expandedTask === taskId) {
      setExpandedTask(null);
    } else {
      setExpandedTask(taskId);
    }
  };

  
  
  // Get user by ID (helper function)
  const getUserById = (userId) => {
    return mockPod.members.find(member => member.id === userId);
  };
  
  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format date with time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return `${formatDate(dateTimeString)} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  // Generate user initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    
    const userData = JSON.parse(localStorage.getItem('user'));
    
    const messageData = {
      podId,
      senderId: userData._id,
      senderName: userData.name,
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    
    // Emit message to socket
    socket.emit('send_message', messageData);
    
    // Add to local messages immediately for better UX
    setMessages(prev => [...prev, messageData]);

    
    
    // Clear the message input
    setNewMessage('');
  };

  // Get milestone by ID
  const getMilestoneById = (milestoneId) => {
    return mockMilestones.find(milestone => milestone.id === milestoneId);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={styles.podEnvironment}>
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
          <div className={styles.headerContent}>
            <div className={styles.breadcrumbs}>
              <span onClick={() => navigate('/')}>Home</span>
              <ChevronRight size={14} />
              <span onClick={() => navigate('/pods')}>Pods</span>
              <ChevronRight size={14} />
              <span className={styles.current}>{mockPod.title}</span>
            </div>
            
            <div className={styles.headerActions}>
              <div className={styles.mobileMenuToggle} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu size={24} />
              </div>
              
              <div className={styles.notifications}>
                <Bell size={20} />
                <span className={styles.notificationBadge}>3</span>
              </div>
              
              <div className={styles.userMenu}>
                <div className={styles.avatar}>
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} />
                  ) : (
                    <div className={styles.initials}>{getInitials(currentUser.name)}</div>
                  )}
                  <div className={styles.statusIndicator}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.podDetailsBar}>
  <div className={styles.podBasicInfo}>
    <div className={styles.podIcon}>
      <Sparkles size={20} />
    </div>
    <div>
      <h1>{mockPod.title}</h1>
      <p>{mockPod.mission}</p>
    </div>
  </div>
  
  {/* Add the membership status here */}
  <div className={styles.membershipStatus}>
    {isCreator ? (
      <div className={styles.creatorBadge}>
        <Crown size={16} />
        <span>Creator</span>
      </div>
    ) : isMember ? (
      <div className={styles.memberBadge}>
        <CheckCircle size={16} />
        <span>Member - {userRole}</span>
      </div>
    ) : (
      <div className={styles.notMemberMessage}>
        <AlertCircle size={16} />
        <span>You aren't a member of this pod</span>
        <button
          className={styles.applyButton}
          onClick={() => navigate(`/pods/${podId}`)}
        >
          Apply to Join
        </button>
      </div>
    )}
  </div>
            
            <div className={styles.podMeta}>
              <div className={styles.metaItem}>
                <Calendar size={16} />
                <span>Due: {formatDate(mockPod.dueDate)}</span>
              </div>
              <div className={styles.metaItem}>
                <Users size={16} />
                <span>{mockPod.members.length} Members</span>
              </div>
              {isCreator && (
                <motion.button 
                  className={styles.editButton}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit size={16} />
                  <span>Edit Pod</span>
                </motion.button>
              )}
            </div>
          </div>
          
          <div className={styles.progressBar}>
            <div className={styles.progressTrack}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${mockPod.progress}%` }}
              >
                <span className={styles.progressLabel}>{mockPod.progress}% Complete</span>
              </div>
            </div>
          </div>
        </motion.header>
        
        {/* Main content area */}
        <div className={styles.contentWrapper}>
          {/* Sidebar navigation */}
          <motion.nav 
            className={`${styles.sidebar} ${mobileMenuOpen ? styles.mobileActive : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={styles.sidebarContent}>
              <div className={styles.navSection}>
                <h3>Pod Navigation</h3>
                <ul className={styles.navList}>
                  <li className={activeTab === 'dashboard' ? styles.active : ''}>
                    <button onClick={() => setActiveTab('dashboard')}>
                      <Zap size={18} />
                      <span>Dashboard</span>
                      {activeTab === 'dashboard' && <ChevronRight size={16} />}
                    </button>
                  </li>
                  <li className={activeTab === 'tasks' ? styles.active : ''}>
                    <button onClick={() => setActiveTab('tasks')}>
                      <CheckCircle size={18} />
                      <span>Tasks</span>
                      {activeTab === 'tasks' && <ChevronRight size={16} />}
                    </button>
                  </li>
                  <li className={activeTab === 'milestones' ? styles.active : ''}>
                    <button onClick={() => setActiveTab('milestones')}>
                      <Target size={18} />
                      <span>Milestones</span>
                      {activeTab === 'milestones' && <ChevronRight size={16} />}
                    </button>
                  </li>
                  <li className={activeTab === 'communication' ? styles.active : ''}>
                    <button onClick={() => setActiveTab('communication')}>
                      <MessageSquare size={18} />
                      <span>Communication</span>
                      {activeTab === 'communication' && <ChevronRight size={16} />}
                    </button>
                  </li>
                  <li className={activeTab === 'resources' ? styles.active : ''}>
                    <button onClick={() => setActiveTab('resources')}>
                      <FileText size={18} />
                      <span>Resources</span>
                      {activeTab === 'resources' && <ChevronRight size={16} />}
                    </button>
                  </li>
                  {isCreator && (
                    <li className={activeTab === 'analytics' ? styles.active : ''}>
                      <button onClick={() => setActiveTab('analytics')}>
                        <BarChart2 size={18} />
                        <span>Analytics</span>
                        {activeTab === 'analytics' && <ChevronRight size={16} />}
                      </button>
                    </li>
                  )}
                </ul>
              </div>
              
              <div className={styles.navSection}>
                <h3>Team Members</h3>
                <ul className={styles.membersList}>
                  {mockPod.members.map((member) => (
                    <li key={member.id}>
                      <div className={styles.memberAvatar}>
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} />
                        ) : (
                          <div className={styles.memberInitials}>{getInitials(member.name)}</div>
                        )}
                        <div className={`${styles.memberStatus} ${styles[member.status]}`}></div>
                      </div>
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>{member.name}</span>
                        <span className={styles.memberRole}>{member.role}</span>
                      </div>
                      <div className={styles.memberActions}>
                        <button className={styles.memberActionButton}>
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                
                {isCreator && (
                  <button className={styles.addMemberButton}>
                    <UserPlus size={16} />
                    <span>Add Member</span>
                  </button>
                )}
              </div>
              
              <div className={styles.navSection}>
                <h3>External Links</h3>
                <ul className={styles.externalLinksList}>
                  <li>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <div className={styles.linkIcon}>
                        <Link size={16} />
                      </div>
                      <span>GitHub Repository</span>
                      <ExternalLink size={14} />
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <div className={styles.linkIcon}>
                        <Link size={16} />
                      </div>
                      <span>Figma Designs</span>
                      <ExternalLink size={14} />
                    </a>
                  </li>
                  <li>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <div className={styles.linkIcon}>
                        <Link size={16} />
                      </div>
                      <span>Project Wiki</span>
                      <ExternalLink size={14} />
                    </a>
                  </li>
                </ul>
                
                <button className={styles.addLinkButton}>
                  <Plus size={16} />
                  <span>Add Link</span>
                </button>
              </div>
              
              <div className={styles.sidebarFooter}>
                <button className={styles.settingsButton}>
                  <Settings size={16} />
                  <span>Pod Settings</span>
                </button>
                
                <button className={styles.leaveButton}>
                  <LogOut size={16} />
                  <span>Leave Pod</span>
                </button>
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
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <motion.div
                className={styles.dashboardTab}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className={styles.dashboardHeader} variants={itemVariants}>
                  <h2>Pod Dashboard</h2>
                  <div className={styles.dashboardActions}>
                    <button className={styles.refreshButton}>
                      <Clock size={16} />
                      <span>Updated 5m ago</span>
                    </button>
                  </div>
                </motion.div>
                
                <motion.div className={styles.dashboardStats} variants={itemVariants}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <CheckCircle size={20} />
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statValue}>{mockPod.stats.completedTasks}/{mockPod.stats.totalTasks}</span>
                      <span className={styles.statLabel}>Tasks Completed</span>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <Target size={20} />
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statValue}>{mockPod.stats.activeMilestones}/{mockPod.stats.totalMilestones}</span>
                      <span className={styles.statLabel}>Active Milestones</span>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <Clock size={20} />
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statValue}>{mockPod.stats.daysRemaining}</span>
                      <span className={styles.statLabel}>Days Remaining</span>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <Users size={20} />
                    </div>
                    <div className={styles.statInfo}>
                      <span className={styles.statValue}>{mockPod.members.length}</span>
                      <span className={styles.statLabel}>Team Members</span>
                    </div>
                  </div>
                </motion.div>
                
                <div className={styles.dashboardContent}>
                  <div className={styles.dashboardColumn}>
                    <motion.div className={styles.dashboardSection} variants={itemVariants}>
                      <div className={styles.sectionHeader}>
                        <h3>Upcoming Milestones</h3>
                        <button className={styles.viewAllButton} onClick={() => setActiveTab('milestones')}>
                          View All
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      
                      <div className={styles.milestonesList}>
                        {mockMilestones
                          .filter(milestone => milestone.status !== 'completed')
                          .slice(0, 3)
                          .map(milestone => (
                            <div key={milestone.id} className={styles.milestoneCard}>
                              <div className={styles.milestoneHeader}>
                                <div className={`${styles.milestoneStatus} ${styles[milestone.status]}`}></div>
                                <h4>{milestone.title}</h4>
                              </div>
                              <div className={styles.milestoneProgress}>
                                <div className={styles.progressTrack}>
                                  <div 
                                    className={styles.progressFill}
                                    style={{ width: `${milestone.progress}%` }}
                                  ></div>
                                </div>
                                <span className={styles.progressPercentage}>{milestone.progress}%</span>
                              </div>
                              <div className={styles.milestoneMeta}>
                                <div className={styles.metaItem}>
                                  <Calendar size={14} />
                                  <span>Due {formatDate(milestone.dueDate)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                    
                    <motion.div className={styles.dashboardSection} variants={itemVariants}>
                      <div className={styles.sectionHeader}>
                        <h3>Recent Activity</h3>
                      </div>
                      
                      <div className={styles.activityFeed}>
                        <div className={styles.activityItem}>
                          <div className={styles.activityAvatar}>
                            <div className={styles.activityInitials}>{getInitials(mockPod.members[2].name)}</div>
                          </div>
                          <div className={styles.activityContent}>
                            <p>
                              <span className={styles.activityUser}>{mockPod.members[2].name}</span>
                              <span className={styles.activityAction}>completed</span>
                              <span className={styles.activityObject}>UI Design System</span>
                            </p>
                            <span className={styles.activityTime}>2 hours ago</span>
                          </div>
                        </div>
                        
                        <div className={styles.activityItem}>
                          <div className={styles.activityAvatar}>
                            <div className={styles.activityInitials}>{getInitials(mockPod.members[3].name)}</div>
                          </div>
                          <div className={styles.activityContent}>
                            <p>
                              <span className={styles.activityUser}>{mockPod.members[3].name}</span>
                              <span className={styles.activityAction}>commented on</span>
                              <span className={styles.activityObject}>User Authentication</span>
                            </p>
                            <span className={styles.activityTime}>4 hours ago</span>
                          </div>
                        </div>
                        
                        <div className={styles.activityItem}>
                          <div className={styles.activityAvatar}>
                            <div className={styles.activityInitials}>{getInitials(mockPod.members[1].name)}</div>
                          </div>
                          <div className={styles.activityContent}>
                            <p>
                              <span className={styles.activityUser}>{mockPod.members[1].name}</span>
                              <span className={styles.activityAction}>started</span>
                              <span className={styles.activityObject}>Navigation Component</span>
                            </p>
                            <span className={styles.activityTime}>Yesterday</span>
                          </div>
                        </div>
                        
                        <div className={styles.activityItem}>
                          <div className={styles.activityAvatar}>
                            <div className={styles.activityInitials}>{getInitials(mockPod.members[0].name)}</div>
                          </div>
                          <div className={styles.activityContent}>
                            <p>
                              <span className={styles.activityUser}>{mockPod.members[0].name}</span>
                              <span className={styles.activityAction}>created task</span>
                              <span className={styles.activityObject}>Database Schema Design</span>
                            </p>
                            <span className={styles.activityTime}>2 days ago</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className={styles.dashboardColumn}>
                    <motion.div className={styles.dashboardSection} variants={itemVariants}>
                      <div className={styles.sectionHeader}>
                        <h3>Tasks Overview</h3>
                        <button className={styles.viewAllButton} onClick={() => setActiveTab('tasks')}>
                          View All
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      
                      <div className={styles.tasksOverview}>
                        <div className={styles.taskStatusGroup}>
                          <div className={styles.statusHeader}>
                            <div className={`${styles.statusIndicator} ${styles.todo}`}></div>
                            <h4>To Do</h4>
                            <span className={styles.statusCount}>{todoTasks.length}</span>
                          </div>
                          <div className={styles.tasksList}>
                            {todoTasks.slice(0, 2).map(task => (
                              <div key={task.id} className={styles.taskCard}>
                                <h5>{task.title}</h5>
                                <div className={styles.taskMeta}>
                                  <div className={styles.metaItem}>
                                    <Calendar size={12} />
                                    <span>Due {formatDate(task.dueDate)}</span>
                                  </div>
                                  <div className={styles.taskAssignees}>
                                    {task.assignedTo.map(userId => {
                                      const user = getUserById(userId);
                                      return (
                                        <div key={userId} className={styles.taskAssignee}>
                                          {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} />
                                          ) : (
                                            <div className={styles.assigneeInitials}>{getInitials(user.name)}</div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {todoTasks.length > 2 && (
                              <div className={styles.moreTasksIndicator} onClick={() => setActiveTab('tasks')}>
                                +{todoTasks.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className={styles.taskStatusGroup}>
                          <div className={styles.statusHeader}>
                            <div className={`${styles.statusIndicator} ${styles.inProgress}`}></div>
                            <h4>In Progress</h4>
                            <span className={styles.statusCount}>{inProgressTasks.length}</span>
                          </div>
                          <div className={styles.tasksList}>
                            {inProgressTasks.slice(0, 2).map(task => (
                              <div key={task.id} className={styles.taskCard}>
                                <h5>{task.title}</h5>
                                <div className={styles.taskMeta}>
                                  <div className={styles.metaItem}>
                                    <Calendar size={12} />
                                    <span>Due {formatDate(task.dueDate)}</span>
                                  </div>
                                  <div className={styles.taskAssignees}>
                                    {task.assignedTo.map(userId => {
                                      const user = getUserById(userId);
                                      return (
                                        <div key={userId} className={styles.taskAssignee}>
                                          {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} />
                                          ) : (
                                            <div className={styles.assigneeInitials}>{getInitials(user.name)}</div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {inProgressTasks.length > 2 && (
                              <div className={styles.moreTasksIndicator} onClick={() => setActiveTab('tasks')}>
                                +{inProgressTasks.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className={styles.taskStatusGroup}>
                          <div className={styles.statusHeader}>
                            <div className={`${styles.statusIndicator} ${styles.completed}`}></div>
                            <h4>Completed</h4>
                            <span className={styles.statusCount}>{completedTasks.length}</span>
                          </div>
                          <div className={styles.tasksList}>
                            {completedTasks.slice(0, 2).map(task => (
                              <div key={task.id} className={styles.taskCard}>
                                <h5>{task.title}</h5>
                                <div className={styles.taskMeta}>
                                  <div className={styles.metaItem}>
                                    <Calendar size={12} />
                                    <span>Completed {formatDate(task.dueDate)}</span>
                                  </div>
                                  <div className={styles.taskAssignees}>
                                    {task.assignedTo.map(userId => {
                                      const user = getUserById(userId);
                                      return (
                                        <div key={userId} className={styles.taskAssignee}>
                                          {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} />
                                          ) : (
                                            <div className={styles.assigneeInitials}>{getInitials(user.name)}</div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {completedTasks.length > 2 && (
                              <div className={styles.moreTasksIndicator} onClick={() => setActiveTab('tasks')}>
                                +{completedTasks.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div className={styles.dashboardSection} variants={itemVariants}>
                      <div className={styles.sectionHeader}>
                        <h3>Recent Messages</h3>
                        <button className={styles.viewAllButton} onClick={() => setActiveTab('communication')}>
                          View All
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      
                      <div className={styles.recentMessages}>
                        {mockMessages.slice(-3).map(message => {
                          const sender = getUserById(message.userId);
                          return (
                            <div key={message.id} className={styles.messageCard}>
                              <div className={styles.messageAvatar}>
                                {sender.avatar ? (
                                  <img src={sender.avatar} alt={sender.name} />
                                ) : (
                                  <div className={styles.messageInitials}>{getInitials(sender.name)}</div>
                                )}
                              </div>
                              <div className={styles.messageContent}>
                                <div className={styles.messageMeta}>
                                  <span className={styles.messageSender}>{sender.name}</span>
                                  <span className={styles.messageTime}>{formatDateTime(message.createdAt)}</span>
                                </div>
                                <p className={styles.messageText}>{message.text}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <motion.div
                className={styles.tasksTab}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className={styles.tabHeader} variants={itemVariants}>
                  <h2>Tasks</h2>
                  <div className={styles.tabActions}>
                    <div className={styles.searchBar}>
                      <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {isCreator && (
                      <motion.button 
                        className={styles.primaryButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus size={16} />
                        <span>New Task</span>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
                
                <motion.div className={styles.taskCategories} variants={itemVariants}>
                  <div className={styles.taskCategory}>
                    <div className={styles.categoryHeader}>
                      <div className={`${styles.statusIndicator} ${styles.todo}`}></div>
                      <h3>To Do</h3>
                      <span className={styles.taskCount}>{todoTasks.length}</span>
                    </div>
                    <div className={styles.categoryTasks}>
                      {todoTasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`${styles.taskItem} ${expandedTask === task.id ? styles.expanded : ''}`}
                        >
                          <div 
                            className={styles.taskHeader} 
                            onClick={() => toggleTaskExpanded(task.id)}
                          >
                            <div className={styles.taskTitle}>
                              <h4>{task.title}</h4>
                              {task.priority === 'high' && (
                                <span className={styles.highPriorityTag}>High Priority</span>
                              )}
                            </div>
                            <div className={styles.taskCollapse}>
                              {expandedTask === task.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {expandedTask === task.id && (
                              <motion.div 
                                className={styles.taskDetails}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className={styles.taskDescription}>
                                  <p>{task.description}</p>
                                </div>
                                
                                <div className={styles.taskMetadata}>
                                  <div className={styles.metadataRow}>
                                    <div className={styles.metaItem}>
                                      <Calendar size={14} />
                                      <span>Due {formatDate(task.dueDate)}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                      <Target size={14} />
                                      <span>Milestone: {getMilestoneById(task.milestoneId).title}</span>
                                    </div>
                                  </div>
                                  
                                  <div className={styles.metadataRow}>
                                    <div className={styles.metaItem}>
                                      <Users size={14} />
                                      <span>Assigned to:</span>
                                      <div className={styles.assigneesList}>
                                        {task.assignedTo.map(userId => {
                                          const user = getUserById(userId);
                                          return (
                                            <div key={userId} className={styles.assigneeTag}>
                                              {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} />
                                              ) : (
                                                <div className={styles.smallInitials}>{getInitials(user.name)}</div>
                                              )}
                                              <span>{user.name}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className={styles.taskComments}>
                                  <h5>Comments</h5>
                                  {task.comments.length > 0 ? (
                                    <div className={styles.commentsSection}>
                                      {task.comments.map(comment => {
                                        const commenter = getUserById(comment.userId);
                                        return (
                                          <div key={comment.id} className={styles.commentItem}>
                                            <div className={styles.commentAvatar}>
                                              {commenter.avatar ? (
                                                <img src={commenter.avatar} alt={commenter.name} />
                                              ) : (
                                                <div className={styles.commentInitials}>{getInitials(commenter.name)}</div>
                                              )}
                                            </div>
                                            <div className={styles.commentContent}>
                                              <div className={styles.commentMeta}>
                                                <span className={styles.commentAuthor}>{commenter.name}</span>
                                                <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                                              </div>
                                              <p className={styles.commentText}>{comment.text}</p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <p className={styles.noComments}>No comments yet.</p>
                                  )}
                                  
                                  <div className={styles.addCommentForm}>
                                    <textarea 
                                      placeholder="Add a comment..."
                                      rows={2}
                                    ></textarea>
                                    <button className={styles.commentButton}>
                                      <Send size={14} />
                                      <span>Send</span>
                                    </button>
                                  </div>
                                </div>
                                
                                <div className={styles.taskActions}>
                                  <button className={styles.secondaryButton}>
                                    <Edit size={14} />
                                    <span>Edit</span>
                                  </button>
                                  <button className={styles.primaryButton}>
                                    <CheckCircle size={14} />
                                    <span>Mark as In Progress</span>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.taskCategory}>
                    <div className={styles.categoryHeader}>
                      <div className={`${styles.statusIndicator} ${styles.inProgress}`}></div>
                      <h3>In Progress</h3>
                      <span className={styles.taskCount}>{inProgressTasks.length}</span>
                    </div>
                    <div className={styles.categoryTasks}>
                      {inProgressTasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`${styles.taskItem} ${expandedTask === task.id ? styles.expanded : ''}`}
                        >
                          <div 
                            className={styles.taskHeader} 
                            onClick={() => toggleTaskExpanded(task.id)}
                          >
                            <div className={styles.taskTitle}>
                              <h4>{task.title}</h4>
                              {task.priority === 'high' && (
                                <span className={styles.highPriorityTag}>High Priority</span>
                              )}
                            </div>
                            <div className={styles.taskCollapse}>
                              {expandedTask === task.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {expandedTask === task.id && (
                              <motion.div 
                                className={styles.taskDetails}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className={styles.taskDescription}>
                                  <p>{task.description}</p>
                                </div>
                                
                                <div className={styles.taskMetadata}>
                                  <div className={styles.metadataRow}>
                                    <div className={styles.metaItem}>
                                      <Calendar size={14} />
                                      <span>Due {formatDate(task.dueDate)}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                      <Target size={14} />
                                      <span>Milestone: {getMilestoneById(task.milestoneId).title}</span>
                                    </div>
                                  </div>
                                  
                                  <div className={styles.metadataRow}>
                                    <div className={styles.metaItem}>
                                      <Users size={14} />
                                      <span>Assigned to:</span>
                                      <div className={styles.assigneesList}>
                                        {task.assignedTo.map(userId => {
                                          const user = getUserById(userId);
                                          return (
                                            <div key={userId} className={styles.assigneeTag}>
                                              {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} />
                                              ) : (
                                                <div className={styles.smallInitials}>{getInitials(user.name)}</div>
                                              )}
                                              <span>{user.name}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className={styles.taskComments}>
                                  <h5>Comments</h5>
                                  {task.comments.length > 0 ? (
                                    <div className={styles.commentsSection}>
                                      {task.comments.map(comment => {
                                        const commenter = getUserById(comment.userId);
                                        return (
                                          <div key={comment.id} className={styles.commentItem}>
                                            <div className={styles.commentAvatar}>
                                              {commenter.avatar ? (
                                                <img src={commenter.avatar} alt={commenter.name} />
                                              ) : (
                                                <div className={styles.commentInitials}>{getInitials(commenter.name)}</div>
                                              )}
                                            </div>
                                            <div className={styles.commentContent}>
                                              <div className={styles.commentMeta}>
                                                <span className={styles.commentAuthor}>{commenter.name}</span>
                                                <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                                              </div>
                                              <p className={styles.commentText}>{comment.text}</p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <p className={styles.noComments}>No comments yet.</p>
                                  )}
                                  
                                  <div className={styles.addCommentForm}>
                                    <textarea 
                                      placeholder="Add a comment..."
                                      rows={2}
                                    ></textarea>
                                    <button className={styles.commentButton}>
                                      <Send size={14} />
                                      <span>Send</span>
                                    </button>
                                  </div>
                                </div>
                                
                                <div className={styles.taskActions}>
                                  <button className={styles.secondaryButton}>
                                    <Edit size={14} />
                                    <span>Edit</span>
                                  </button>
                                  <button className={styles.primaryButton}>
                                    <CheckCircle size={14} />
                                    <span>Mark as Completed</span>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.taskCategory}>
                    <div className={styles.categoryHeader}>
                      <div className={`${styles.statusIndicator} ${styles.completed}`}></div>
                      <h3>Completed</h3>
                      <span className={styles.taskCount}>{completedTasks.length}</span>
                    </div>
                    <div className={styles.categoryTasks}>
                      {completedTasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`${styles.taskItem} ${expandedTask === task.id ? styles.expanded : ''}`}
                        >
                          <div 
                            className={styles.taskHeader} 
                            onClick={() => toggleTaskExpanded(task.id)}
                          >
                            <div className={styles.taskTitle}>
                              <h4>{task.title}</h4>
                            </div>
                            <div className={styles.taskCollapse}>
                              {expandedTask === task.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {expandedTask === task.id && (
                              <motion.div 
                                className={styles.taskDetails}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className={styles.taskDescription}>
                                  <p>{task.description}</p>
                                </div>
                                
                                <div className={styles.taskMetadata}>
                                  <div className={styles.metadataRow}>
                                    <div className={styles.metaItem}>
                                      <Calendar size={14} />
                                      <span>Completed on {formatDate(task.dueDate)}</span>
                                    </div>
                                    <div className={styles.metaItem}>
                                      <Target size={14} />
                                      <span>Milestone: {getMilestoneById(task.milestoneId).title}</span>
                                    </div>
                                  </div>
                                  
                                  <div className={styles.metadataRow}>
                                    <div className={styles.metaItem}>
                                      <Users size={14} />
                                      <span>Completed by:</span>
                                      <div className={styles.assigneesList}>
                                        {task.assignedTo.map(userId => {
                                          const user = getUserById(userId);
                                          return (
                                            <div key={userId} className={styles.assigneeTag}>
                                              {user.avatar ? (
                                                <img src={user.avatar} alt={user.name} />
                                              ) : (
                                                <div className={styles.smallInitials}>{getInitials(user.name)}</div>
                                              )}
                                              <span>{user.name}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className={styles.taskComments}>
                                  <h5>Comments</h5>
                                  {task.comments.length > 0 ? (
                                    <div className={styles.commentsSection}>
                                      {task.comments.map(comment => {
                                        const commenter = getUserById(comment.userId);
                                        return (
                                          <div key={comment.id} className={styles.commentItem}>
                                            <div className={styles.commentAvatar}>
                                              {commenter.avatar ? (
                                                <img src={commenter.avatar} alt={commenter.name} />
                                              ) : (
                                                <div className={styles.commentInitials}>{getInitials(commenter.name)}</div>
                                              )}
                                            </div>
                                            <div className={styles.commentContent}>
                                              <div className={styles.commentMeta}>
                                                <span className={styles.commentAuthor}>{commenter.name}</span>
                                                <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                                              </div>
                                              <p className={styles.commentText}>{comment.text}</p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <p className={styles.noComments}>No comments yet.</p>
                                  )}
                                </div>
                                
                                <div className={styles.taskActions}>
                                  <button className={styles.secondaryButton}>
                                    <Archive size={14} />
                                    <span>Archive</span>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {/* Milestones Tab */}
            {activeTab === 'milestones' && (
              <motion.div
                className={styles.milestonesTab}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className={styles.tabHeader} variants={itemVariants}>
                  <h2>Milestones</h2>
                  <div className={styles.tabActions}>
                    {isCreator && (
                      <motion.button 
                        className={styles.primaryButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus size={16} />
                        <span>New Milestone</span>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
                
                <motion.div className={styles.milestoneTimeline} variants={itemVariants}>
                  {mockMilestones.map((milestone, index) => (
                    <div key={milestone.id} className={`${styles.milestoneTimelineItem} ${styles[milestone.status]}`}>
                      <div className={styles.milestoneTimelineConnector}>
                        <div className={styles.connector}></div>
                        <div className={styles.milestoneMarker}>
                          {milestone.status === 'completed' ? (
                            <CheckCircle size={20} />
                          ) : (
                            <span className={styles.milestoneNumber}>{index + 1}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.milestoneTimelineContent}>
                        <div className={styles.milestoneHeader}>
                          <h3>{milestone.title}</h3>
                          <div className={styles.milestoneDueDate}>
                            <Calendar size={14} />
                            <span>{formatDate(milestone.dueDate)}</span>
                          </div>
                        </div>
                        
                        <p className={styles.milestoneDescription}>{milestone.description}</p>
                        
                        <div className={styles.milestoneProgress}>
                          <div className={styles.progressLabel}>
                            <span className={styles.progressText}>Progress</span>
                            <span className={styles.progressPercentage}>{milestone.progress}%</span>
                          </div>
                          <div className={styles.progressTrack}>
                            <div 
                              className={styles.progressFill}
                              style={{ width: `${milestone.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className={styles.milestoneTasks}>
                          <div className={styles.milestonesTasksHeader}>
                            <h4>Tasks in this milestone</h4>
                            {isCreator && (
                              <button className={styles.smallActionButton}>
                                <Plus size={14} />
                                <span>Add Task</span>
                              </button>
                            )}
                          </div>
                          
                          <div className={styles.milestonesTasksList}>
                            {mockTasks
                              .filter(task => task.milestoneId === milestone.id)
                              .map(task => (
                                <div key={task.id} className={`${styles.milestoneTask} ${styles[task.status]}`}>
                                  <div className={styles.milestoneTaskHeader}>
                                    <div className={styles.taskStatusDot}></div>
                                    <h5>{task.title}</h5>
                                    <div className={styles.taskActions}>
                                      <button 
                                        className={styles.iconButton}
                                        onClick={() => {
                                          setActiveTab('tasks');
                                          setExpandedTask(task.id);
                                        }}
                                      >
                                        <Eye size={14} />
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div className={styles.milestoneTaskMeta}>
                                    <div className={styles.metaItem}>
                                      <Calendar size={12} />
                                      <span>Due {formatDate(task.dueDate)}</span>
                                    </div>
                                    <div className={styles.assigneesList}>
                                      {task.assignedTo.map(userId => {
                                        const user = getUserById(userId);
                                        return (
                                          <div key={userId} className={styles.taskAssignee}>
                                            {user.avatar ? (
                                              <img src={user.avatar} alt={user.name} />
                                            ) : (
                                              <div className={styles.assigneeInitials}>{getInitials(user.name)}</div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}
            
            {activeTab === 'communication' && (
  <motion.div
    className={styles.communicationTab}
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    <motion.div className={styles.tabHeader} variants={itemVariants}>
      <h2>Communication</h2>
    </motion.div>
    
    <motion.div className={styles.chatInterface} variants={itemVariants}>
      <div className={styles.chatMessages}>
        {[...mockMessages.map(message => ({
          id: message.id,
          senderId: message.userId,
          text: message.text,
          timestamp: message.createdAt,
          isFromMock: true
        })), ...messages].sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        ).map((message, index) => {
          // For mock messages, use the existing logic
          if (message.isFromMock) {
            const sender = getUserById(message.senderId);
            const isCurrentUser = message.senderId === currentUser.id;
            
            return (
              <div 
                key={`mock-${message.id}`} 
                className={`${styles.chatMessage} ${isCurrentUser ? styles.outgoing : styles.incoming}`}
              >
                {!isCurrentUser && (
                  <div className={styles.messageAvatar}>
                    {sender.avatar ? (
                      <img src={sender.avatar} alt={sender.name} />
                    ) : (
                      <div className={styles.messageInitials}>{getInitials(sender.name)}</div>
                    )}
                  </div>
                )}
                
                <div className={styles.messageContent}>
                  <div className={styles.messageBubble}>
                    <p>{message.text}</p>
                  </div>
                  <div className={styles.messageInfo}>
                    <span className={styles.messageSender}>{isCurrentUser ? 'You' : sender.name}</span>
                    <span className={styles.messageTime}>{formatDateTime(message.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          } 
          // For real-time messages
          else {
            const userData = JSON.parse(localStorage.getItem('user')) || currentUser;
            const isCurrentUser = userData && message.senderId === userData._id;
            
            return (
              <div 
                key={`rt-${index}`} 
                className={`${styles.chatMessage} ${isCurrentUser ? styles.outgoing : styles.incoming}`}
              >
                {!isCurrentUser && (
                  <div className={styles.messageAvatar}>
                    <div className={styles.messageInitials}>
                      {message.senderName?.charAt(0).toUpperCase() || '?'}
                    </div>
                  </div>
                )}
                
                <div className={styles.messageContent}>
                  <div className={styles.messageBubble}>
                    <p>{message.text}</p>
                  </div>
                  <div className={styles.messageInfo}>
                    <span className={styles.messageSender}>{isCurrentUser ? 'You' : message.senderName}</span>
                    <span className={styles.messageTime}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
        })}
        <div ref={messagesEndRef}></div>
      </div>
      
      <div className={styles.chatInput}>
        <form onSubmit={handleSendMessage}>
          <div className={styles.inputWrapper}>
            <textarea 
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={1}
            />
            <div className={styles.inputActions}>
              <button type="button" className={styles.attachButton}>
                <Paperclip size={18} />
              </button>
              <button type="submit" className={styles.sendButton} disabled={!newMessage.trim()}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  </motion.div>
)}
  
            {/* Resources Tab */}
            {activeTab === 'resources' && (
              <motion.div
                className={styles.resourcesTab}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className={styles.tabHeader} variants={itemVariants}>
                  <h2>Resources</h2>
                  <div className={styles.tabActions}>
                    <div className={styles.searchBar}>
                      <input 
                        type="text" 
                        placeholder="Search resources..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <motion.button 
                      className={styles.primaryButton}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus size={16} />
                      <span>Upload Resource</span>
                    </motion.button>
                  </div>
                </motion.div>
                
                <motion.div className={styles.resourcesGrid} variants={itemVariants}>
                  {mockResources.map(resource => (
                    <div key={resource.id} className={styles.resourceCard}>
                      <div className={styles.resourceIcon}>
                        <FileText size={24} />
                      </div>
                      <div className={styles.resourceInfo}>
                        <h4>{resource.name}</h4>
                        <div className={styles.resourceMeta}>
                          <span className={styles.resourceSize}>{resource.size}</span>
                          <span className={styles.resourceDate}>Added {formatDate(resource.uploadedAt)}</span>
                        </div>
                        <div className={styles.resourceUploader}>
                          {(() => {
                            const uploader = getUserById(resource.uploadedBy);
                            return (
                              <>
                                {uploader.avatar ? (
                                  <img src={uploader.avatar} alt={uploader.name} />
                                ) : (
                                  <div className={styles.uploaderInitials}>{getInitials(uploader.name)}</div>
                                )}
                                <span>Added by {uploader.name}</span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      <div className={styles.resourceActions}>
                        <button className={styles.iconButton}>
                          <Download size={16} />
                        </button>
                        <button className={styles.iconButton}>
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            )}
            
            {/* Analytics Tab (only for creators) */}
            {activeTab === 'analytics' && isCreator && (
              <motion.div
                className={styles.analyticsTab}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div className={styles.tabHeader} variants={itemVariants}>
                  <h2>Analytics</h2>
                </motion.div>
                
                <motion.div className={styles.analyticsGrid} variants={itemVariants}>
                  <div className={styles.analyticsCard}>
                    <h3>Task Completion</h3>
                    <div className={styles.taskCompletionStats}>
                      <div className={styles.completionRateCircle}>
                        <svg width="120" height="120" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="12"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="#FFD700"
                            strokeWidth="12"
                            strokeDasharray="339.3"
                            strokeDashoffset={339.3 * (1 - mockPod.stats.team.completionRate / 100)}
                            transform="rotate(-90 60 60)"
                          />
                        </svg>
                        <div className={styles.completionRateLabel}>
                          <span className={styles.ratePercentage}>{mockPod.stats.team.completionRate}%</span>
                          <span className={styles.rateText}>Complete</span>
                        </div>
                      </div>
                      
                      <div className={styles.tasksBreakdown}>
                        <div className={styles.taskStat}>
                          <span className={styles.statLabel}>Total Tasks</span>
                          <span className={styles.statValue}>{mockPod.stats.totalTasks}</span>
                        </div>
                        <div className={styles.taskStat}>
                          <span className={styles.statLabel}>Completed</span>
                          <span className={styles.statValue}>{mockPod.stats.completedTasks}</span>
                        </div>
                        <div className={styles.taskStat}>
                          <span className={styles.statLabel}>In Progress</span>
                          <span className={styles.statValue}>{inProgressTasks.length}</span>
                        </div>
                        <div className={styles.taskStat}>
                          <span className={styles.statLabel}>Not Started</span>
                          <span className={styles.statValue}>{todoTasks.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.analyticsCard}>
                    <h3>Milestone Progress</h3>
                    <div className={styles.milestoneStats}>
                      {mockMilestones.map(milestone => (
                        <div key={milestone.id} className={styles.milestoneStat}>
                          <div className={styles.milestoneInfo}>
                            <span className={styles.milestoneName}>{milestone.title}</span>
                            <span className={styles.milestonePercentage}>{milestone.progress}%</span>
                          </div>
                          <div className={styles.milestoneStatTrack}>
                            <div 
                              className={styles.milestoneStatFill}
                              style={{ width: `${milestone.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.analyticsCard}>
                    <h3>Team Member Performance</h3>
                    <div className={styles.memberPerformance}>
                      {mockPod.stats.team.tasksPerMember.map(memberStat => {
                        const member = getUserById(memberStat.id);
                        const completionPercentage = (memberStat.completed / memberStat.total) * 100;
                        
                        return (
                          <div key={memberStat.id} className={styles.memberPerformanceRow}>
                            <div className={styles.memberBasicInfo}>
                              <div className={styles.memberAvatar}>
                                {member.avatar ? (
                                  <img src={member.avatar} alt={member.name} />
                                ) : (
                                  <div className={styles.memberInitials}>{getInitials(member.name)}</div>
                                )}
                              </div>
                              <div className={styles.memberNameRole}>
                                <span className={styles.memberName}>{member.name}</span>
                                <span className={styles.memberRole}>{member.role}</span>
                              </div>
                            </div>
                            
                            <div className={styles.memberTasksProgress}>
                              <div className={styles.progressInfo}>
                                <span className={styles.progressFraction}>{memberStat.completed}/{memberStat.total} tasks</span>
                                <span className={styles.progressPercentage}>{completionPercentage.toFixed(0)}%</span>
                              </div>
                              <div className={styles.progressTrack}>
                                <div 
                                  className={styles.progressFill}
                                  style={{ width: `${completionPercentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className={styles.analyticsCard}>
                    <h3>Time to Completion</h3>
                    <div className={styles.timeCompletion}>
                      <div className={styles.timeCircle}>
                        <svg width="120" height="120" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="12"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="12"
                            strokeDasharray="339.3"
                            strokeDashoffset={339.3 * (mockPod.stats.daysRemaining / 120)}
                            transform="rotate(-90 60 60)"
                          />
                        </svg>
                        <div className={styles.timeLabel}>
                          <span className={styles.daysValue}>{mockPod.stats.daysRemaining}</span>
                          <span className={styles.daysText}>Days Left</span>
                        </div>
                      </div>
                      
                      <div className={styles.timeStats}>
                        <div className={styles.timeStat}>
                          <span className={styles.statLabel}>Start Date</span>
                          <span className={styles.statValue}>{formatDate(mockPod.createdAt)}</span>
                        </div>
                        <div className={styles.timeStat}>
                          <span className={styles.statLabel}>Due Date</span>
                          <span className={styles.statValue}>{formatDate(mockPod.dueDate)}</span>
                        </div>
                        <div className={styles.timeStat}>
                          <span className={styles.statLabel}>Elapsed</span>
                          <span className={styles.statValue}>52 days</span>
                        </div>
                        <div className={styles.timeStat}>
                          <span className={styles.statLabel}>Remaining</span>
                          <span className={styles.statValue}>{mockPod.stats.daysRemaining} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </motion.main>
        </div>
      </div>
    </div>
  );
};

export default PodEnvironment;