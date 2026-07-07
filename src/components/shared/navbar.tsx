'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import EnhancedButton from '@/components/ui/enhanced-button'
import { Menu, X } from 'lucide-react'
import { ModeToggle } from '../features/modeToggle'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Community', href: '#community' },
    { label: 'About us', href: '#about'}
  ]

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-md bg-white/75 border-b border-slate-200/70 text-slate-900 shadow-lg shadow-slate-900/5 dark:bg-slate-900/80 dark:border-white/10 dark:text-white dark:shadow-none'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-400 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SH</span>
            </div>
            <span className="hidden sm:inline text-2xl font-bold text-black dark:text-white">
              SocialHub
            </span>
          </motion.div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="text-slate-600 hover:text-slate-900 transition-colors duration-300 font-medium dark:text-slate-300 dark:hover:text-white"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={() => router.push('/login')}
            >
              Log In
            </EnhancedButton>
            <EnhancedButton 
            variant="primary" 
            size="sm"
            onClick={() => router.push('/signup')}
            >
              Sign Up
            </EnhancedButton>
          </div>

          

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-slate-900 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex gap-4 items-center">
              <ModeToggle />
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </div>
          </motion.button>
        </div>

        
        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? 'auto' : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-4 py-6 space-y-4 bg-white/90 backdrop-blur-md border-t border-slate-200/70 dark:bg-slate-800/50 dark:border-white/10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block text-slate-600 hover:text-slate-900 font-medium dark:text-slate-300 dark:hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <EnhancedButton
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  router.push('/login')
                }}
              >
                Log In
              </EnhancedButton>
              <EnhancedButton variant="primary" size="md" className="w-full">
                Sign Up
              </EnhancedButton>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
