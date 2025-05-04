import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Footer.module.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Animation variants
  const socialIconVariants = {
    hover: { 
      scale: 1.15,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      } 
    },
    tap: { scale: 0.95 }
  };

  const footerLinkVariants = {
    hover: { 
      x: 5,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 10 
      } 
    },
    tap: { y: 0 }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        {/* Logo & Brief */}
        <div className={styles.footerBranding}>
          <Link to="/" className={styles.footerLogo}>
            <div className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.27002 6.96002L12 12.01L20.73 6.96002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className={styles.logoText}>PODNEX</span>
          </Link>
          <p className={styles.footerTagline}>
            Connect, collaborate, and create amazing podcasts together
          </p>
          
          {/* Social Icons */}
          <div className={styles.socialIcons}>
            <motion.a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer"
              variants={socialIconVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="X (Twitter)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.9922 3H19.9616L13.7799 10.1318L21 21H15.0476L10.5427 14.4706L5.41855 21H2.44544L9.09472 13.3244L2.22717 3H8.32456L12.3776 8.97059L16.9922 3ZM15.8275 19.2353H17.3405L7.46558 4.70588H5.84767L15.8275 19.2353Z" fill="currentColor"/>
              </svg>
            </motion.a>
            <motion.a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              variants={socialIconVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="Facebook"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>

            <motion.a 
  href="https://www.reddit.com/r/podnex/" 
  target="_blank" 
  rel="noopener noreferrer"
  variants={socialIconVariants}
  whileHover="hover"
  whileTap="tap"
  aria-label="Reddit"
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 12.256c0-1.188-.962-2.15-2.15-2.15a2.15 2.15 0 00-1.857 1.07c-1.022-.68-2.35-1.1-3.827-1.16l.61-2.87 2.03.48a1.618 1.618 0 001.6 1.34 1.613 1.613 0 100-3.226 1.61 1.61 0 00-1.57 1.235l-2.3-.55a.375.375 0 00-.454.28l-.71 3.36c-1.48.05-2.822.47-3.847 1.15a2.15 2.15 0 00-1.856-1.06 2.15 2.15 0 00-.003 4.3h.005c-.04.25-.06.51-.06.78 0 2.75 3.58 4.99 8 4.99s8-2.24 8-4.99c0-.27-.02-.53-.06-.78h.01ZM8.79 14.39a1.075 1.075 0 11.002-2.15 1.075 1.075 0 01-.002 2.15Zm6.42 0a1.075 1.075 0 110-2.15 1.075 1.075 0 010 2.15Zm-6.15 2.08c.91.62 2.18.95 3.44.95 1.26 0 2.53-.33 3.44-.95a.37.37 0 01.52.1.37.37 0 01-.1.52c-1.06.73-2.44 1.12-3.86 1.12s-2.8-.4-3.86-1.12a.37.37 0 01-.1-.52.37.37 0 01.52-.1Z" fill="currentColor"/>
  </svg>
</motion.a>
            <motion.a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              variants={socialIconVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
            <motion.a 
              href="https://discord.com" 
              target="_blank" 
              rel="noopener noreferrer"
              variants={socialIconVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="Discord"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 005.996-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" fill="currentColor"/>
              </svg>
            </motion.a>
            <motion.a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              variants={socialIconVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          </div>
        </div>
        
        {/* Links Columns */}
        <div className={styles.footerLinksGrid}>
          <div className={styles.linksColumn}>
            <h3 className={styles.columnTitle}>
              <span className={styles.titleText}>Products</span>
              <span className={styles.titleDecoration}></span>
            </h3>
            <ul>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/features">Features</Link>
              </motion.li>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/pricing">Pricing</Link>
              </motion.li>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/faq">FAQ</Link>
              </motion.li>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/explore">Discover Pods</Link>
              </motion.li>
            </ul>
          </div>
          
          <div className={styles.linksColumn}>
            <h3 className={styles.columnTitle}>
              <span className={styles.titleText}>Company</span>
              <span className={styles.titleDecoration}></span>
            </h3>
            <ul>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/about">About Us</Link>
              </motion.li>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/careers">Careers</Link>
              </motion.li>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/contact">Contact</Link>
              </motion.li>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/community">Community</Link>
              </motion.li>
            </ul>
          </div>
          
          <div className={styles.linksColumn}>
            <h3 className={styles.columnTitle}>
              <span className={styles.titleText}>Resources</span>
              <span className={styles.titleDecoration}></span>
            </h3>
            <ul>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/tutorials">Tutorials</Link>
              </motion.li>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/blog">Blog</Link>
              </motion.li>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/help">Help Center</Link>
              </motion.li>
              <motion.li variants={footerLinkVariants} whileHover="hover" whileTap="tap">
                <Link to="/api">API</Link>
              </motion.li>
            </ul>
          </div>
          
          {/* Newsletter Signup */}
          <div className={styles.footerNewsletter}>
            <h3 className={styles.columnTitle}>
              <span className={styles.titleText}>Subscribe</span>
              <span className={styles.titleDecoration}></span>
            </h3>
            <p>Get the latest updates directly to your inbox</p>
            <form className={styles.newsletterForm}>
              <div className={styles.inputWrapper}>
                <input type="email" placeholder="Enter your email" aria-label="Email for newsletter" />
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <p className={styles.copyright}>&copy; {currentYear} PODNEX. All rights reserved.</p>
          <div className={styles.footerLegal}>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;