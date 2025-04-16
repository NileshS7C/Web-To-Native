import { Popover, PopoverButton } from '@headlessui/react';
import React, { useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { NavBar } from '../SideNavBar/NavBar';
import ReactDOM from 'react-dom';
import { IoClose } from "react-icons/io5";


const Hamburger = () => {
  const [openHamburger, setOpenHamburger] = useState(false);

  const handleHamburgerClick = () => {
    setOpenHamburger(!openHamburger);
  }

  const handleOverlayClick = () => {
    setOpenHamburger(false);
  }

  return (
    <Popover>
      <PopoverButton onClick={handleHamburgerClick} className='focus:outline-none'>
        {openHamburger ? <IoClose/> : <GiHamburgerMenu/>}
      </PopoverButton>
      
      {ReactDOM.createPortal(
        <AnimatePresence>
          {openHamburger && (
            <motion.div 
              className='fixed top-[76px] bottom-0 left-0 right-0 bg-white flex items-center justify-center z-50' 
              initial={{ opacity: 0, translateX: '100%' }} 
              animate={{ opacity: 1, translateX: 0 }} 
              exit={{ opacity: 1, translateX: '100%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              onClick={handleOverlayClick}
            >
              <div className='overflow-auto h-full w-full'>
                <NavBar/>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.getElementById('portal-drawer')
      )}
    </Popover>
  )
}

export default Hamburger