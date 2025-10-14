import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/logo.png'

const Navbar = () => {
  return (
    <header className='py-4 shadow-sm bg-white'>
      <nav className='px-20 flex space-between'>
        <Link href="./">
          <Image src = "/logo1.png" alt="Logo" width={350} height={110}/>
        </Link>
      </nav>
    </header>
  )
}

export default Navbar
