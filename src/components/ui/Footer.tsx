'use client'

import Link from 'next/link'

const HAMBURGER_MENU = [
  { label: 'Home',         href: '/',         icon: 'home' },
  { label: 'Materi',       href: '#materi',   icon: 'book' },
  { label: 'Quotes',       href: '#quotes',   icon: 'book' },
  { label: 'Team',         href: '#team',      icon: 'pencil' },
  { label: 'Anggota',      href: '#anggota',    icon: 'gamepad' },
]

export function Footer() {
  return (
    <footer className="relative border-t border-gray-100 bg-gray-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">

          {/* Brand */}
          <div className="max-w-xs cursor-default">
            <p
              className="text-2xl font-black text-gray-900 tracking-tight mb-2"
              style={{ fontFamily: '"Georgia", serif', fontStyle: 'italic' }}
            >
              VI-sion
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">platform pembelajaran kalkulus interaktif berbasis teknologi yang tidak membuatmu bosan belajar.</p>
          </div>

          {/* Nav links */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 cursor-default">Navigasi</p>
            <ul className="flex flex-col gap-2">
              {HAMBURGER_MENU.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className='cursor-default'>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Info</p>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li>Kelompok 6</li>
              <li>Latihan Kepemimpinan Siswa</li>
              <li>Universitas Siliwangi</li>
            </ul>
          </div>
        </div>
        <FooterCopyright />
      </div>
    </footer>
  )
}

export function FooterCopyright() {
  return (
    <div className="border-t border-gray-200 py-4 relative bg-gray-100">
      <p className="text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} VI-sion. All rights reserved.
      </p>
    </div>
  )
}