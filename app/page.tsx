"use client";
import Link from 'next/link';
import TexturaLogo from './components/TexturaLogo';
import { useState } from 'react';

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl ${
        isDarkMode ? 'bg-black/80 border-white/10' : 'bg-white/80 border-black/10'
      } border-b`}>
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <TexturaLogo />
              <span className="text-lg font-semibold tracking-tight">Textura.ai</span>
            </Link>
            <div className="flex items-center space-x-6">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-white/10 hover:bg-white/20' 
                    : 'bg-black/5 hover:bg-black/10'
                }`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <Link 
                href="/editor"
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-white/10 hover:bg-white/20' 
                    : 'bg-black/5 hover:bg-black/10'
                }`}
              >
                Open Editor
              </Link>
              <a 
                href="https://github.com/NandishChampaneria/textura-ai"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm hover:text-current transition-colors duration-200 ${
                  isDarkMode ? 'text-white/70' : 'text-black/70'
                }`}
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-white to-white/50' 
                : 'bg-gradient-to-r from-black to-black/50'
              } text-transparent bg-clip-text`}>
              Transform Your Images with Beautiful Text
            </h1>
            <p className={`text-xl mb-8 ${
              isDarkMode ? 'text-white/70' : 'text-black/70'
            }`}>
              Add stunning text overlays to your images with our powerful editor. Remove backgrounds, customize fonts, and create professional designs in minutes.
            </p>
            <Link
              href="/editor"
              className={`inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                isDarkMode 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-black text-white hover:bg-black/90'
              }`}
            >
              Start Creating
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`py-20 border-t ${
        isDarkMode ? 'border-white/10' : 'border-black/10'
      }`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards - updating hover states and backgrounds */}
            {features.map((feature, index) => (
              <div key={index} className={`p-6 rounded-2xl transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-white/5 hover:bg-white/10' 
                  : 'bg-black/5 hover:bg-black/10'
              }`}>
                <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                  isDarkMode ? 'bg-white/10' : 'bg-black/10'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={isDarkMode ? 'text-white/70' : 'text-black/70'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 border-t ${
        isDarkMode ? 'border-white/10' : 'border-black/10'
      }`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Create?</h2>
            <p className={`text-xl mb-8 ${
              isDarkMode ? 'text-white/70' : 'text-black/70'
            }`}>
              Start creating beautiful text overlays for your images today. No sign-up required.
            </p>
            <Link
              href="/editor"
              className={`inline-flex items-center px-8 py-4 rounded-xl transition-all duration-200 font-medium text-lg ${
                isDarkMode 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-black text-white hover:bg-black/90'
              }`}
            >
              Open Editor
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 border-t ${
        isDarkMode ? 'border-white/10' : 'border-black/10'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <TexturaLogo className="w-6 h-6" />
              <span className={`text-sm ${
                isDarkMode ? 'text-white/70' : 'text-black/70'
              }`}>© 2024 Textura.ai</span>
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href="https://github.com/NandishChampaneria/textura-ai"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm hover:text-current transition-colors duration-200 ${
                  isDarkMode ? 'text-white/70' : 'text-black/70'
                }`}
              >
                GitHub
              </a>
              <Link
                href="/editor"
                className={`text-sm hover:text-current transition-colors duration-200 ${
                  isDarkMode ? 'text-white/70' : 'text-black/70'
                }`}
              >
                Editor
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Features data
const features = [
  {
    title: "Background Removal",
    description: "Instantly remove backgrounds from your images with our advanced AI technology.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Multiple Text Layers",
    description: "Add and manage multiple text layers with independent styling and positioning.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    )
  },
  {
    title: "Rich Customization",
    description: "Customize fonts, colors, spacing, and more with our intuitive controls.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    )
  },
  {
    title: "Real-time Preview",
    description: "See your changes instantly with our real-time preview system.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Privacy First",
    description: "All processing is done locally in your browser. Your images never leave your device.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )
  },
  {
    title: "Easy Export",
    description: "Export your creations in high quality with just one click.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    )
  }
]; 