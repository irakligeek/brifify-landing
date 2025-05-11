export default function Footer() {
  return (
    <footer className="bg-gray-800 py-6">
      <div className="max-w-screen-lg mx-auto px-4 text-white">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <p className="text-sm text-white">&copy; {new Date().getFullYear()} All rights reserved</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <a href="mailto:irakligeek@gmail.com" className="text-sm !text-white hover:text-white transition-colors">
              Contact
            </a>
            
            {/* Simple social links */}
            <div className="flex items-center space-x-4">
              <a href="https://x.com/irakligeek" className="!text-white hover:text-white transition-colors">
                Twitter
              </a>
              <a href="https://github.com/irakligeek/" className="!text-white hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
