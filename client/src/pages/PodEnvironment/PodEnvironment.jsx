import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { io } from 'socket.io-client';
// Import modal components
import CreateTaskModal from './modals/CreateTaskModal';
import CreateMilestoneModal from './modals/CreateMilestoneModal';
import ResourceUploadModal from './modals/ResourceUploadModal'; // If you have this component

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
  Crown,
  Wifi,
  WifiOff,
  Activity
} from 'lucide-react';
import styles from './PodEnvironment.module.scss';


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

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get user initials from name
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

// Format date to readable string
const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format date with time
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  
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

const PodEnvironment = () => {
  const navigate = useNavigate();
  const { podId } = useParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expandedTask, setExpandedTask] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Modal state
const [taskModalOpen, setTaskModalOpen] = useState(false);
const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
const [resourceModalOpen, setResourceModalOpen] = useState(false);
  
  // Pod and user state
  const [currentUser, setCurrentUser] = useState(null);
  const [podData, setPodData] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [podMembers, setPodMembers] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  // Pod content data
  const [tasks, setTasks] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [podMessages, setPodMessages] = useState([]);
  const [resources, setResources] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socketError, setSocketError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [errorNotification, setErrorNotification] = useState(null);
  const [lastActivity, setLastActivity] = useState(new Date());
  const typingTimeoutRef = useRef(null);
  
  // Derived data
  const todoTasks = tasks.filter(task => task.status === 'to-do');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');


  // Handler functions at component scope
  const handleCreateTask = async (taskData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const response = await axios.post(`http://localhost:5000/api/pods/${podId}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Add new task to state
      setTasks(prevTasks => [...prevTasks, response.data]);
      
      // Close modal and show notification if needed
      setTaskModalOpen(false);
      
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleCreateMilestone = async (milestoneData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      const response = await axios.post(`http://localhost:5000/api/pods/${podId}/milestones`, milestoneData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Add new milestone to state
      setMilestones(prevMilestones => [...prevMilestones, response.data]);
      
      // Close modal
      setMilestoneModalOpen(false);
      
      return response.data;
    } catch (error) {
      console.error('Error creating milestone:', error);
      throw error;
    }
  };
  
  const handleResourceUpload = async (resourceData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', resourceData.file);
      if (resourceData.name) formData.append('name', resourceData.name);
      if (resourceData.description) formData.append('description', resourceData.description);
      if (resourceData.tags) formData.append('tags', JSON.stringify(resourceData.tags));
      
      const response = await axios.post(`http://localhost:5000/api/pods/${podId}/resources`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Add new resource to state
      setResources(prevResources => [...prevResources, response.data]);
      
      // Close modal
      setResourceModalOpen(false);
      
      return response.data;
    } catch (error) {
      console.error('Error uploading resource:', error);
      throw error;
    }
  };
  
// Main data fetching hook - runs when podId changes
useEffect(() => {
  const fetchPodData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userData);
      setCurrentUser(user);
      
      // 1. Fetch the pod details first
      const podResponse = await axios.get(`http://localhost:5000/api/pods/${podId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!podResponse.data) {
        setError('Pod not found');
        setLoading(false);
        return;
      }
      
      // Store the pod data
      setPodData(podResponse.data);
      
      // Check if user is creator
      setIsCreator(podResponse.data.creator && 
                  podResponse.data.creator._id === user._id);
      
      // 2. Fetch pod members
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
        setUserRole(null);
      }
      
      // 3. Load all necessary data for dashboard view
      await Promise.all([
        fetchTasks(),
        fetchMilestones(),
        fetchMessages(),
        fetchResources()
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading pod environment:', error);
      setError(error.message || 'Failed to load pod data');
      setLoading(false);
    }
  };
  
  fetchPodData();
}, [podId]); // Only re-run when podId changes

// Load tab-specific data when tab changes
useEffect(() => {
  // Only fetch data if we're not in the initial loading state
  if (!loading && podData) {
    const fetchTabData = async () => {
      try {
        // Set a lightweight loading state for just the tab content
        setError(null);
        
        switch (activeTab) {
          case 'tasks':
            await fetchTasks();
            break;
          case 'milestones':
            await fetchMilestones();
            break;
          case 'communication':
            await fetchMessages();
            if (messagesEndRef.current) {
              messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            break;
          case 'resources':
            await fetchResources();
            break;
          case 'dashboard':
            // Dashboard needs all data
            await Promise.all([
              fetchTasks(),
              fetchMilestones()
            ]);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error loading ${activeTab} data:`, error);
        setError(`Failed to load ${activeTab} data`);
      }
    };
    
    fetchTabData();
  }
}, [activeTab, podData]);

// Auto-scroll to bottom of messages when messages change
useEffect(() => {
  if (messagesEndRef.current && activeTab === 'communication') {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages, activeTab]);

// Improved fetch functions with error handling and return values
const fetchTasks = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await axios.get(`http://localhost:5000/api/pods/${podId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setTasks(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error; // Re-throw to allow the calling function to handle errors
  }
};

const fetchMilestones = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await axios.get(`http://localhost:5000/api/pods/${podId}/milestones`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setMilestones(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching milestones:', error);
    throw error;
  }
};

const fetchMessages = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await axios.get(`http://localhost:5000/api/messages/${podId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setPodMessages(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

const fetchResources = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await axios.get(`http://localhost:5000/api/pods/${podId}/resources`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setResources(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};



// Socket connection setup - only connect when we have pod data and user data
useEffect(() => {
  // Only attempt to connect socket when we have both pod data and user data
  if (!podData || !currentUser) return;
  
  // Connect to socket with better configuration
  const newSocket = io("http://localhost:5000", {
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    autoConnect: true
  });
  
  setSocket(newSocket);
  newSocket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    setSocketConnected(false);
  });
  
  newSocket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    setSocketError(error.message);
    setReconnectAttempts(prev => prev + 1);
  });
  
  // Message handling
  newSocket.on('receive_message', (message) => {
    // Update both messages arrays to ensure they stay in sync
    setPodMessages(prev => {
      // Check if message already exists to avoid duplicates
      const exists = prev.some(m => m._id === message._id);
      return exists ? prev : [...prev, message];
    });
    
    setMessages(prev => {
      const exists = prev.some(m => 
        (m._id && m._id === message._id) || 
        (m.tempId && m.tempId === message.tempId)
      );
      return exists ? prev : [...prev, message];
    });
   // Update last activity timestamp
   setLastActivity(new Date());
  });
  
  // System messages (user joined/left)
  newSocket.on('system_message', (message) => {
    setMessages(prev => [...prev, {
      ...message,
      isSystem: true,
      _id: `sys_${Date.now()}${Math.random()}`
    }]);
  });

  // Handle task creation
const handleCreateTask = async (taskData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    const response = await axios.post(`http://localhost:5000/api/pods/${podId}/tasks`, taskData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Add new task to state
    setTasks(prevTasks => [...prevTasks, response.data]);
    
    // Show success notification
    // You could implement a toast notification system here
    
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};


// Handle resource upload
const handleResourceUpload = async (resourceData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', resourceData.file);
    if (resourceData.name) formData.append('name', resourceData.name);
    if (resourceData.description) formData.append('description', resourceData.description);
    if (resourceData.tags) formData.append('tags', JSON.stringify(resourceData.tags));
    
    const response = await axios.post(`http://localhost:5000/api/pods/${podId}/resources`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Add new resource to state
    setResources(prevResources => [...prevResources, response.data]);
    
    // Show success notification
    // You could implement a toast notification system here
    
    return response.data;
  } catch (error) {
    console.error('Error uploading resource:', error);
    throw error;
  }
};
  
  // Handle typing indicators
  newSocket.on('user_typing', ({ userId, userName, isTyping }) => {
    if (isTyping) {
      setTypingUsers(prev => [...prev.filter(u => u.userId !== userId), { userId, userName }]);

  // Clear typing indicator after 3 seconds of inactivity
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }
  
  typingTimeoutRef.current = setTimeout(() => {
    setTypingUsers(prev => prev.filter(u => u.userId !== userId));
  }, 3000);
} else {
  setTypingUsers(prev => prev.filter(u => u.userId !== userId));
}
});
  
  // Handle active users
  newSocket.on('pod_users_updated', (users) => {
    // Update the pod members with online status information
    setPodMembers(prevMembers => {
      return prevMembers.map(member => {
        const onlineUser = users.find(u => u.userId === member.user._id);
        return {
          ...member,
          onlineStatus: onlineUser ? 'online' : 'offline',
          lastActive: onlineUser ? onlineUser.joinedAt : member.lastActive
        };
      });
    });
  });
  
  // Handle message errors
  newSocket.on('message_error', ({ originalMessage, error }) => {
    console.error('Message error:', error);
    setErrorNotification(`Failed to send message: ${error}`);
    
    // Remove any temporary message after error
    setMessages(prev => prev.filter(msg => 
      !(msg.tempId && msg.tempId === originalMessage.tempId)
    ));
  });
  
  // Clean up on component unmount
  return () => {
    if (newSocket) {
      // Leave pod
      newSocket.emit('leave_pod', {
        podId,
        userId: currentUser._id,
        userName: currentUser.name
      });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      newSocket.disconnect();
    }
  };
}, [podId, podData, currentUser]); // Only re-run when these dependencies change

// Auto-scroll to bottom of messages
useEffect(() => {
  if (messagesEndRef.current && activeTab === 'communication') {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages, activeTab]);
  
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
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !currentUser) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorNotification('You need to be logged in to send messages');
      return;
    }
    
    // Create a temporary message with a unique ID for optimistic UI update
    const tempId = `temp_${Date.now()}`;
    const tempMessage = {
      tempId,
      text: newMessage,
      sender: {
        _id: currentUser._id,
        name: currentUser.name,
        profileImage: currentUser.profileImage
      },
      createdAt: new Date().toISOString(),
      isTemporary: true
    };
    
    // Add to local messages immediately for better UX
    setMessages(prev => [...prev, tempMessage]);
    
    // Prepare message data for socket
    const messageData = {
      podId,
      senderId: currentUser._id,
      senderName: currentUser.name,
      text: newMessage,
      tempId, // Include the temp ID so we can match it later
      timestamp: new Date().toISOString()
    };
    
    // Clear the message input right away for better UX
    setNewMessage('');
    
    // Emit message to socket
    socket.emit('send_message', messageData);
    
    // Also save to database
    try {
      const response = await axios.post(`http://localhost:5000/api/messages`, {
        podId,
        text: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Replace the temporary message with the real one
      setMessages(prev => 
        prev.map(msg => 
          msg.tempId === tempId ? { ...response.data, tempId } : msg
        )
      );
      
      // Also update the podMessages array
      setPodMessages(prev => [...prev, response.data]);
      
    } catch (error) {
      console.error('Error saving message:', error);
      setErrorNotification('Failed to send message: ' + (error.message || 'Unknown error'));
      
      // Remove the temporary message on error
      setMessages(prev => prev.filter(msg => msg.tempId !== tempId));
    }
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
    <>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <h3>Loading Pod Environment...</h3>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <AlertCircle size={40} />
          </div>
          <h3>Error loading Pod</h3>
          <p>{error}</p>
          <button 
            className={styles.retryButton} 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : !podData ? (
        <div className={styles.errorContainer}>
          <h3>Pod Not Found</h3>
          <p>The pod you're looking for doesn't exist or you don't have permission to view it.</p>
          <button 
            className={styles.retryButton} 
            onClick={() => navigate('/pods')}
          >
            Back to Pods
          </button>
        </div>
      ) : (
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
    <h1>{podData?.title || 'Pod Title'}</h1>
    <p>{podData?.mission || 'Pod mission not specified'}</p>
  </div>
</div>
  </div>
  
  {/* Add the membership status here */}
  <div className={styles.membershipStatus}>
  {isCreator ? (
    <div className={`${styles.roleTag} ${styles.creator}`}>
      <Crown size={16} />
      <span>Creator</span>
    </div>
  ) : isMember ? (
    <div className={`${styles.roleTag} ${styles.contributor}`}>
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
    <span>Due: {podData?.deadline ? formatDate(podData.deadline) : 'No deadline'}</span>
  </div>
  <div className={styles.metaItem}>
    <Users size={16} />
    <span>{podMembers.length} Members</span>
  </div>
  {isCreator && (
  <motion.button 
    className={styles.editButton}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => navigate(`/pods/${podId}/edit`)}
  >
    <Edit size={16} />
    <span>Edit Pod</span>
  </motion.button>
)}
</div>
          
<div className={styles.progressBar}>
  <div className={styles.progressTrack}>
    {/* Calculate progress based on completed tasks */}
    {(() => {
      const totalTasks = tasks.length;
      const completedTasksCount = tasks.filter(task => task.status === 'completed').length;
      const progressPercentage = totalTasks > 0 
        ? Math.round((completedTasksCount / totalTasks) * 100)
        : 0;
        
      return (
        <div 
          className={styles.progressFill} 
          style={{ width: `${progressPercentage}%` }}
        >
          <span className={styles.progressLabel}>
            {progressPercentage}% Complete
          </span>
        </div>
      );
    })()}
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
    {podMembers.map((memberData) => {
      const member = memberData.user;
      return (
        <li key={member._id}>
          <div className={styles.memberAvatar}>
            {member.profileImage ? (
              <img src={member.profileImage} alt={member.name} />
            ) : (
              <div className={styles.memberInitials}>{getInitials(member.name)}</div>
            )}
            <div className={`${styles.memberStatus} ${styles[memberData.onlineStatus || 'offline']}`}></div>
          </div>
          <div className={styles.memberInfo}>
            <span className={styles.memberName}>{member.name}</span>
            <span className={styles.memberRole}>{memberData.role}</span>
          </div>
          <div className={styles.memberActions}>
            <button className={styles.memberActionButton}>
              <MessageSquare size={14} />
            </button>
          </div>
        </li>
      );
    })}
  </ul>
  
  {isCreator && (
    <button 
      className={styles.addMemberButton}
      onClick={() => navigate(`/pods/${podId}/members/add`)}
    >
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
      <span className={styles.statValue}>
        {tasks.filter(task => task.status === 'completed').length}/{tasks.length}
      </span>
      <span className={styles.statLabel}>Tasks Completed</span>
    </div>
  </div>
  
  <div className={styles.statCard}>
    <div className={styles.statIcon}>
      <Target size={20} />
    </div>
    <div className={styles.statInfo}>
      <span className={styles.statValue}>
        {milestones.filter(m => m.status === 'in-progress').length}/{milestones.length}
      </span>
      <span className={styles.statLabel}>Active Milestones</span>
    </div>
  </div>
  
  <div className={styles.statCard}>
    <div className={styles.statIcon}>
      <Clock size={20} />
    </div>
    <div className={styles.statInfo}>
      {(() => {
        // Calculate days remaining until deadline
        const deadline = podData?.deadline ? new Date(podData.deadline) : null;
        const today = new Date();
        const daysRemaining = deadline ? 
          Math.max(0, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))) : 
          0;
        
        return (
          <>
            <span className={styles.statValue}>
              {daysRemaining > 0 ? daysRemaining : 'No'}
            </span>
            <span className={styles.statLabel}>Days Remaining</span>
          </>
        );
      })()}
    </div>
  </div>
  
  <div className={styles.statCard}>
    <div className={styles.statIcon}>
      <Users size={20} />
    </div>
    <div className={styles.statInfo}>
      <span className={styles.statValue}>{podMembers.length}</span>
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
    {milestones.length === 0 ? (
      <div className={styles.emptyState}>
        <p>No milestones created yet</p>
        {isCreator && (
          <button 
            className={styles.smallActionButton}
            onClick={() => setActiveTab('milestones')}
          >
            <Plus size={14} />
            <span>Create Milestone</span>
          </button>
        )}
      </div>
    ) : (
      milestones
        .filter(milestone => milestone.status !== 'completed')
        .slice(0, 3)
        .map(milestone => (
          <div key={milestone._id} className={styles.milestoneCard}>
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
                <span>Due {milestone.dueDate ? formatDate(milestone.dueDate) : 'No deadline'}</span>
              </div>
            </div>
          </div>
        ))
    )}
  </div>
</motion.div>
                    
                    <motion.div className={styles.dashboardSection} variants={itemVariants}>
                      <div className={styles.sectionHeader}>
                        <h3>Recent Activity</h3>
                      </div>
                      
                      <div className={styles.activityFeed}>
  {(() => {
    // Generate activity feed from tasks, messages, and resources
    const activities = [
      // Messages (newest 3)
      ...podMessages.slice(-3).map(message => ({
        type: 'message',
        user: message.sender,
        action: 'sent a message',
        object: message.text.length > 30 ? message.text.substring(0, 30) + '...' : message.text,
        timestamp: message.createdAt
      })),
      
      // Tasks that were completed or updated recently
      ...tasks
        .filter(task => task.status === 'completed' || task.status === 'in-progress')
        .slice(0, 3)
        .map(task => ({
          type: 'task',
          user: task.createdBy,
          action: task.status === 'completed' ? 'completed' : 'started',
          object: task.title,
          timestamp: task.updatedAt || task.createdAt
        })),
      
      // Resources (newest 2)
      ...resources.slice(0, 2).map(resource => ({
        type: 'resource',
        user: resource.uploadedBy,
        action: 'uploaded',
        object: resource.name,
        timestamp: resource.createdAt
      }))
    ];
    
    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Format time since activity (e.g., "2 hours ago")
    const getTimeAgo = (timestamp) => {
      const now = new Date();
      const activityTime = new Date(timestamp);
      const diffInSeconds = Math.floor((now - activityTime) / 1000);
      
      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 172800) return 'Yesterday';
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };
    
    return activities.length === 0 ? (
      <div className={styles.emptyState}>
        <p>No activity yet in this pod</p>
      </div>
    ) : (
      activities.slice(0, 4).map((activity, index) => (
        <div key={`${activity.type}-${index}`} className={styles.activityItem}>
          <div className={styles.activityAvatar}>
            {activity.user?.profileImage ? (
              <img src={activity.user.profileImage} alt={activity.user.name} />
            ) : (
              <div className={styles.activityInitials}>
                {getInitials(activity.user?.name || 'Unknown')}
              </div>
            )}
          </div>
          <div className={styles.activityContent}>
            <p>
              <span className={styles.activityUser}>{activity.user?.name || 'Unknown'}</span>
              <span className={styles.activityAction}>{activity.action}</span>
              <span className={styles.activityObject}>{activity.object}</span>
            </p>
            <span className={styles.activityTime}>{getTimeAgo(activity.timestamp)}</span>
          </div>
        </div>
      ))
    );
  })()}
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
      {todoTasks.length === 0 ? (
        <div className={styles.emptyTasksList}>
          <p>No tasks to do</p>
          {isCreator && (
            <button 
              className={styles.smallActionButton}
              onClick={() => setActiveTab('tasks')}
            >
              <Plus size={14} />
              <span>Add Task</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {todoTasks.slice(0, 2).map(task => (
            <div 
              key={task._id} 
              className={styles.taskCard}
              onClick={() => {
                setActiveTab('tasks');
                setExpandedTask(task._id);
              }}
            >
              <h5>{task.title}</h5>
              <div className={styles.taskMeta}>
                <div className={styles.metaItem}>
                  <Calendar size={12} />
                  <span>Due {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}</span>
                </div>
                <div className={styles.taskAssignees}>
                  {task.assignedTo?.map(assignee => (
                    <div key={assignee._id} className={styles.taskAssignee}>
                      {assignee.profileImage ? (
                        <img src={assignee.profileImage} alt={assignee.name} />
                      ) : (
                        <div className={styles.assigneeInitials}>{getInitials(assignee.name)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {todoTasks.length > 2 && (
            <div className={styles.moreTasksIndicator} onClick={() => setActiveTab('tasks')}>
              +{todoTasks.length - 2} more
            </div>
          )}
        </>
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
      {inProgressTasks.length === 0 ? (
        <div className={styles.emptyTasksList}>
          <p>No tasks in progress</p>
        </div>
      ) : (
        <>
          {inProgressTasks.slice(0, 2).map(task => (
            <div 
              key={task._id} 
              className={styles.taskCard}
              onClick={() => {
                setActiveTab('tasks');
                setExpandedTask(task._id);
              }}
            >
              <h5>{task.title}</h5>
              <div className={styles.taskMeta}>
                <div className={styles.metaItem}>
                  <Calendar size={12} />
                  <span>Due {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}</span>
                </div>
                <div className={styles.taskAssignees}>
                  {task.assignedTo?.map(assignee => (
                    <div key={assignee._id} className={styles.taskAssignee}>
                      {assignee.profileImage ? (
                        <img src={assignee.profileImage} alt={assignee.name} />
                      ) : (
                        <div className={styles.assigneeInitials}>{getInitials(assignee.name)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {inProgressTasks.length > 2 && (
            <div className={styles.moreTasksIndicator} onClick={() => setActiveTab('tasks')}>
              +{inProgressTasks.length - 2} more
            </div>
          )}
        </>
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
      {completedTasks.length === 0 ? (
        <div className={styles.emptyTasksList}>
          <p>No completed tasks yet</p>
        </div>
      ) : (
        <>
          {completedTasks.slice(0, 2).map(task => (
            <div 
              key={task._id} 
              className={styles.taskCard}
              onClick={() => {
                setActiveTab('tasks');
                setExpandedTask(task._id);
              }}
            >
              <h5>{task.title}</h5>
              <div className={styles.taskMeta}>
                <div className={styles.metaItem}>
                  <Calendar size={12} />
                  <span>Completed {task.updatedAt ? formatDate(task.updatedAt) : formatDate(task.createdAt)}</span>
                </div>
                <div className={styles.taskAssignees}>
                  {task.assignedTo?.map(assignee => (
                    <div key={assignee._id} className={styles.taskAssignee}>
                      {assignee.profileImage ? (
                        <img src={assignee.profileImage} alt={assignee.name} />
                      ) : (
                        <div className={styles.assigneeInitials}>{getInitials(assignee.name)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {completedTasks.length > 2 && (
            <div className={styles.moreTasksIndicator} onClick={() => setActiveTab('tasks')}>
              +{completedTasks.length - 2} more
            </div>
          )}
        </>
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
    {podMessages.length === 0 ? (
      <div className={styles.emptyState}>
        <p>No messages yet</p>
        <button 
          className={styles.smallActionButton}
          onClick={() => setActiveTab('communication')}
        >
          <MessageSquare size={14} />
          <span>Start a conversation</span>
        </button>
      </div>
    ) : (
      podMessages.slice(-3).map(message => (
        <div key={message._id} className={styles.messageCard}>
          <div className={styles.messageAvatar}>
            {message.sender?.profileImage ? (
              <img src={message.sender.profileImage} alt={message.sender.name} />
            ) : (
              <div className={styles.messageInitials}>{getInitials(message.sender?.name || 'Unknown')}</div>
            )}
          </div>
          <div className={styles.messageContent}>
            <div className={styles.messageMeta}>
              <span className={styles.messageSender}>{message.sender?.name || 'Unknown'}</span>
              <span className={styles.messageTime}>{formatDateTime(message.createdAt)}</span>
            </div>
            <p className={styles.messageText}>{message.text}</p>
          </div>
        </div>
      ))
    )}
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
        {(isCreator || isMember) && (
          <motion.button 
            className={styles.primaryButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Open a modal or navigate to create task page
              // This will be implemented with a modal component
              // For now, we'll implement a placeholder
              console.log('Open create task modal');
              // You would implement a modal open function here
            }}
          >
            <Plus size={16} />
            <span>New Task</span>
          </motion.button>
        )}
      </div>
    </motion.div>
    
    {tasks.length === 0 ? (
      <motion.div className={styles.emptyTasksMessage} variants={itemVariants}>
        <div className={styles.emptyStateIcon}>
          <CheckCircle size={40} />
        </div>
        <h3>No Tasks Yet</h3>
        <p>This pod doesn't have any tasks yet. Create the first task to get started!</p>
        {(isCreator || isMember) && (
          <motion.button 
          className={styles.primaryButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTaskModalOpen(true)}
        >
          <Plus size={16} />
          <span>New Task</span>
        </motion.button>
        )}
      </motion.div>
    ) : (
      <motion.div className={styles.taskCategories} variants={itemVariants}>
        {/* To Do Tasks */}
        <div className={styles.taskCategory}>
          <div className={styles.categoryHeader}>
            <div className={`${styles.statusIndicator} ${styles.todo}`}></div>
            <h3>To Do</h3>
            <span className={styles.taskCount}>{todoTasks.length}</span>
          </div>
          <div className={styles.categoryTasks}>
            {todoTasks.length === 0 ? (
              <div className={styles.emptyCategory}>
                <p>No tasks to do</p>
              </div>
            ) : (
              todoTasks
                .filter(task => 
                  task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map(task => (
                  <div 
                    key={task._id} 
                    className={`${styles.taskItem} ${expandedTask === task._id ? styles.expanded : ''}`}
                  >
                    <div 
                      className={styles.taskHeader} 
                      onClick={() => toggleTaskExpanded(task._id)}
                    >
                      <div className={styles.taskTitle}>
                        <h4>{task.title}</h4>
                        {task.priority === 'high' && (
                          <span className={styles.highPriorityTag}>High Priority</span>
                        )}
                      </div>
                      <div className={styles.taskCollapse}>
                        {expandedTask === task._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedTask === task._id && (
                        <motion.div 
                          className={styles.taskDetails}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={styles.taskDescription}>
                            <p>{task.description || 'No description provided.'}</p>
                          </div>
                          
                          <div className={styles.taskMetadata}>
                            <div className={styles.metadataRow}>
                              <div className={styles.metaItem}>
                                <Calendar size={14} />
                                <span>Due {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}</span>
                              </div>
                              {task.milestone && (
                                <div className={styles.metaItem}>
                                  <Target size={14} />
                                  <span>Milestone: {task.milestone.title}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className={styles.metadataRow}>
                              <div className={styles.metaItem}>
                                <Users size={14} />
                                <span>Assigned to:</span>
                                <div className={styles.assigneesList}>
                                  {task.assignedTo && task.assignedTo.length > 0 ? (
                                    task.assignedTo.map(assignee => (
                                      <div key={assignee._id} className={styles.assigneeTag}>
                                        {assignee.profileImage ? (
                                          <img src={assignee.profileImage} alt={assignee.name} />
                                        ) : (
                                          <div className={styles.smallInitials}>{getInitials(assignee.name)}</div>
                                        )}
                                        <span>{assignee.name}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <span className={styles.noAssignees}>No one assigned</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={styles.taskComments}>
                            <h5>Comments</h5>
                            {task.comments && task.comments.length > 0 ? (
                              <div className={styles.commentsSection}>
                                {task.comments.map(comment => (
                                  <div key={comment._id || `comment-${comment.createdAt}`} className={styles.commentItem}>
                                    <div className={styles.commentAvatar}>
                                      {/* Try to find user in podMembers */}
                                      {(() => {
                                        const commenter = podMembers.find(m => 
                                          m.user._id === comment.userId
                                        )?.user;
                                        
                                        return commenter?.profileImage ? (
                                          <img src={commenter.profileImage} alt={commenter.name} />
                                        ) : (
                                          <div className={styles.commentInitials}>
                                            {commenter ? getInitials(commenter.name) : '?'}
                                          </div>
                                        );
                                      })()}
                                    </div>
                                    <div className={styles.commentContent}>
                                      <div className={styles.commentMeta}>
                                        {/* Try to find user name */}
                                        <span className={styles.commentAuthor}>
                                          {podMembers.find(m => m.user._id === comment.userId)?.user.name || 'Unknown User'}
                                        </span>
                                        <span className={styles.commentDate}>{formatDate(comment.createdAt)}</span>
                                      </div>
                                      <p className={styles.commentText}>{comment.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className={styles.noComments}>No comments yet.</p>
                            )}
                            
                            {(isCreator || isMember) && (
                              <form 
                                className={styles.addCommentForm} 
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  // Implement comment submission
                                  // This would call an API endpoint to add a comment
                                  console.log('Submit comment');
                                }}
                              >
                                <textarea 
                                  placeholder="Add a comment..."
                                  rows={2}
                                  // Handle comment input state
                                ></textarea>
                                <button type="submit" className={styles.commentButton}>
                                  <Send size={14} />
                                  <span>Send</span>
                                </button>
                              </form>
                            )}
                          </div>
                          
                          <div className={styles.taskActions}>
                            {isCreator && (
                              <button className={styles.secondaryButton}>
                                <Edit size={14} />
                                <span>Edit</span>
                              </button>
                            )}
                            {(isCreator || isMember) && (
                              <button 
                                className={styles.primaryButton}
                                onClick={() => {
                                  // Implement status update
                                  // This would call an API endpoint to update task status
                                  console.log('Update task status to in-progress');
                                }}
                              >
                                <CheckCircle size={14} />
                                <span>Mark as In Progress</span>
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
            )}
          </div>
        </div>
        
        {/* In Progress Tasks - Similar structure with updated actions */}
        <div className={styles.taskCategory}>
          <div className={styles.categoryHeader}>
            <div className={`${styles.statusIndicator} ${styles.inProgress}`}></div>
            <h3>In Progress</h3>
            <span className={styles.taskCount}>{inProgressTasks.length}</span>
          </div>
          <div className={styles.categoryTasks}>
            {inProgressTasks.length === 0 ? (
              <div className={styles.emptyCategory}>
                <p>No tasks in progress</p>
              </div>
            ) : (
              /* Similar mapping structure as todoTasks - with appropriate status change buttons */
              inProgressTasks
                .filter(task => 
                  task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map(task => (
                  /* Similar task item structure with "Mark as Completed" action */
                  <div 
                    key={task._id} 
                    className={`${styles.taskItem} ${expandedTask === task._id ? styles.expanded : ''}`}
                  >
                    {/* Task header and content similar to above */}
                    <div 
                      className={styles.taskHeader} 
                      onClick={() => toggleTaskExpanded(task._id)}
                    >
                      <div className={styles.taskTitle}>
                        <h4>{task.title}</h4>
                        {task.priority === 'high' && (
                          <span className={styles.highPriorityTag}>High Priority</span>
                        )}
                      </div>
                      <div className={styles.taskCollapse}>
                        {expandedTask === task._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                    
                    {/* For brevity, details are omitted but would be similar to above */}
                    {/* Action button would be "Mark as Completed" instead */}
                  </div>
                ))
            )}
          </div>
        </div>
        
        {/* Completed Tasks - Similar structure with Archive action */}
        <div className={styles.taskCategory}>
          <div className={styles.categoryHeader}>
            <div className={`${styles.statusIndicator} ${styles.completed}`}></div>
            <h3>Completed</h3>
            <span className={styles.taskCount}>{completedTasks.length}</span>
          </div>
          <div className={styles.categoryTasks}>
            {completedTasks.length === 0 ? (
              <div className={styles.emptyCategory}>
                <p>No completed tasks yet</p>
              </div>
            ) : (
              /* Similar mapping structure as above - with Archive action */
              completedTasks
                .filter(task => 
                  task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map(task => (
                  /* Similar task item structure with "Archive" action */
                  <div 
                    key={task._id} 
                    className={`${styles.taskItem} ${expandedTask === task._id ? styles.expanded : ''}`}
                  >
                    <div 
                      className={styles.taskHeader} 
                      onClick={() => toggleTaskExpanded(task._id)}
                    >
                      <div className={styles.taskTitle}>
                        <h4>{task.title}</h4>
                      </div>
                      <div className={styles.taskCollapse}>
                        {expandedTask === task._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                    
                    {/* For brevity, details are omitted but would be similar to above */}
                    {/* Action button would be "Archive" instead */}
                  </div>
                ))
            )}
          </div>
        </div>
      </motion.div>
    )}
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
                      onClick={() => setMilestoneModalOpen(true)}
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
      {!socketConnected && (
        <div className={styles.socketStatus}>
          <div className={styles.socketIndicator}>
            <WifiOff size={16} />
          </div>
          <span>Connecting to chat server...</span>
        </div>
      )}
      
      <div className={styles.chatMessages}>
        {podMessages.length === 0 ? (
          <div className={styles.emptyChatMessage}>
            <div className={styles.emptyChatIcon}>
              <MessageSquare size={40} />
            </div>
            <h3>No Messages Yet</h3>
            <p>Be the first to send a message in this pod!</p>
          </div>
        ) : (
          // Combine pod messages and socket messages (real-time)
          [...podMessages, ...messages.filter(m => 
            // Only include socket messages not already in podMessages
            m.tempId && !podMessages.some(pm => pm._id === m._id || pm._id === m.tempId)
          )]
          .sort((a, b) => new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp))
          .map((message, index) => {
            const isCurrentUser = currentUser && 
              ((message.sender && message.sender._id === currentUser._id) || 
               (message.senderId === currentUser._id));
            
            // System messages
            if (message.isSystem) {
              return (
                <div key={`system-${index}-${message._id || ''}`} className={styles.systemMessage}>
                  <div className={styles.systemMessageContent}>
                    <p>{message.message}</p>
                    <span className={styles.systemMessageTime}>{formatDateTime(message.timestamp)}</span>
                  </div>
                </div>
              );
            }
            
            // Regular messages
            return (
              <div 
                key={`msg-${index}-${message._id || message.tempId || ''}`} 
                className={`${styles.chatMessage} ${isCurrentUser ? styles.outgoing : styles.incoming} ${message.isTemporary ? styles.temporary : ''}`}
              >
                {!isCurrentUser && (
                  <div className={styles.messageAvatar}>
                    {message.sender?.profileImage ? (
                      <img src={message.sender.profileImage} alt={message.sender.name} />
                    ) : (
                      <div className={styles.messageInitials}>
                        {getInitials(message.sender?.name || message.senderName || 'Unknown')}
                      </div>
                    )}
                  </div>
                )}
                
                <div className={styles.messageContent}>
                  <div className={styles.messageBubble}>
                    <p>{message.text}</p>
                    {message.isTemporary && (
                      <div className={styles.messageStatus}>
                        <span>Sending...</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.messageInfo}>
                    <span className={styles.messageSender}>
                      {isCurrentUser ? 'You' : (message.sender?.name || message.senderName || 'Unknown')}
                    </span>
                    <span className={styles.messageTime}>
                      {formatDateTime(message.createdAt || message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {typingUsers.length > 0 && (
          <div className={styles.typingIndicator}>
            <div className={styles.typingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className={styles.typingText}>
              {typingUsers.length === 1 
                ? `${typingUsers[0].userName} is typing...` 
                : `${typingUsers.length} people are typing...`}
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef}></div>
      </div>
      
      <div className={styles.chatInput}>
        {errorNotification && (
          <div className={styles.errorNotification}>
            <AlertCircle size={14} />
            <span>{errorNotification}</span>
            <button onClick={() => setErrorNotification(null)} className={styles.closeButton}>×</button>
          </div>
        )}
        
        <form onSubmit={handleSendMessage}>
          <div className={styles.inputWrapper}>
            <textarea 
              placeholder={
                !socketConnected ? "Connecting to chat server..." :
                !isMember ? "You must be a member to send messages" :
                "Type your message..."
              }
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                
                // Emit typing status if connected
                if (socket && socketConnected && currentUser) {
                  socket.emit('typing_status', {
                    podId,
                    userId: currentUser._id,
                    userName: currentUser.name,
                    isTyping: e.target.value.length > 0
                  });
                }
              }}
              onBlur={() => {
                // Clear typing status on blur
                if (socket && socketConnected && currentUser) {
                  socket.emit('typing_status', {
                    podId,
                    userId: currentUser._id,
                    userName: currentUser.name,
                    isTyping: false
                  });
                }
              }}
              rows={1}
              disabled={!socketConnected || !isMember}
            />
            <div className={styles.inputActions}>
              <button 
                type="button" 
                className={styles.attachButton}
                disabled={!socketConnected || !isMember}
                onClick={() => {
                  // Implement file attachment
                  console.log('Handle file attachment');
                }}
              >
                <Paperclip size={18} />
              </button>
              <button 
                type="submit" 
                className={styles.sendButton} 
                disabled={!socketConnected || !isMember || !newMessage.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </form>
        
        {!isMember && (
          <div className={styles.nonMemberMessage}>
            <div className={styles.nonMemberInfo}>
              <AlertCircle size={16} />
              <span>You must be a member of this pod to send messages</span>
            </div>
            <button 
              className={styles.joinButton}
              onClick={() => navigate(`/pods/${podId}`)}
            >
              Join Pod
            </button>
          </div>
        )}
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
        {(isCreator || isMember) && (
          <motion.button 
            className={styles.primaryButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Open resource upload modal
              console.log('Open resource upload modal');
              // This would integrate with your modal component
            }}
          >
            <Plus size={16} />
            <span>Upload Resource</span>
          </motion.button>
        )}
      </div>
    </motion.div>
    
    {resources.length === 0 ? (
      <motion.div className={styles.emptyResourcesMessage} variants={itemVariants}>
        <div className={styles.emptyStateIcon}>
          <FileText size={40} />
        </div>
        <h3>No Resources Yet</h3>
        <p>This pod doesn't have any resources uploaded yet.</p>
        {(isCreator || isMember) && (
          <motion.button 
          className={styles.primaryButton}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setResourceModalOpen(true)}
        >
          <Plus size={16} />
          <span>Upload Resource</span>
        </motion.button>
        )}
      </motion.div>
    ) : (
      <motion.div className={styles.resourcesGrid} variants={itemVariants}>
        {resources
          .filter(resource => 
            resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
          )
          .map(resource => (
            <div key={resource._id} className={styles.resourceCard}>
              <div className={styles.resourceIcon}>
                {(() => {
                  // Get appropriate icon based on file type
                  const fileType = resource.fileType.toLowerCase();
                  if (fileType === 'pdf') return <FileText size={24} />;
                  if (fileType === 'doc' || fileType === 'docx') return <FileText size={24} />;
                  if (fileType === 'xls' || fileType === 'xlsx') return <FileText size={24} />;
                  if (fileType === 'ppt' || fileType === 'pptx') return <FileText size={24} />;
                  if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'gif') 
                    return <FileText size={24} />;
                  if (fileType === 'zip' || fileType === 'rar') return <FileText size={24} />;
                  return <FileText size={24} />;
                })()}
              </div>
              <div className={styles.resourceInfo}>
                <h4>{resource.name}</h4>
                <div className={styles.resourceMeta}>
                  <span className={styles.resourceSize}>
                    {formatFileSize(resource.fileSize)}
                  </span>
                  <span className={styles.resourceDate}>
                    Added {formatDate(resource.createdAt)}
                  </span>
                </div>
                <div className={styles.resourceUploader}>
                  {resource.uploadedBy?.profileImage ? (
                    <img src={resource.uploadedBy.profileImage} alt={resource.uploadedBy.name} />
                  ) : (
                    <div className={styles.uploaderInitials}>
                      {getInitials(resource.uploadedBy?.name || 'Unknown')}
                    </div>
                  )}
                  <span>Added by {resource.uploadedBy?.name || 'Unknown'}</span>
                </div>
              </div>
              <div className={styles.resourceActions}>
                <a 
                  href={resource.fileUrl}
                  download={resource.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.iconButton}
                >
                  <Download size={16} />
                </a>
                {(isCreator || 
                  (resource.uploadedBy && currentUser && 
                    resource.uploadedBy._id === currentUser._id)) && (
                  <button 
                    className={styles.iconButton}
                    onClick={() => {
                      // Open delete confirmation modal
                      console.log('Open delete resource confirmation');
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
      </motion.div>
    )}
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
{/* Modals */}
<CreateTaskModal
  isOpen={taskModalOpen}
  onClose={() => setTaskModalOpen(false)}
  onSubmit={handleCreateTask}
  podId={podId}
  podMembers={podMembers}
  milestones={milestones}
/>

<CreateMilestoneModal
  isOpen={milestoneModalOpen}
  onClose={() => setMilestoneModalOpen(false)}
  onSubmit={handleCreateMilestone}
  podId={podId}
/>

<ResourceUploadModal
  isOpen={resourceModalOpen}
  onClose={() => setResourceModalOpen(false)}
  onSubmit={handleResourceUpload}
  podId={podId}
/>
        
      </div>
    </div>
    )}
  </>
);
};

export default PodEnvironment;