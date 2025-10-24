import React from 'react'
import Link from 'next/link'
import Image from 'next/image'


const Navbar = () => {
  return (
    <header className='py-4 bg-black/40'>
      <nav className='px-20 flex space-between'>
        <Link href="./">
          <Image src = "/logo1-removebg-preview.png" alt="Logo" width={350} height={110}/>
        </Link>
      </nav>
    </header>
  )
}

export default Navbar
