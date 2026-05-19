'use client'
const HeroSimple = () => {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Real-Time Equipment Visibility
              <br />
              <span className="text-cyan-400">for Modern Hospitals</span>
            </h1>
            
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 text-blue-200">
              Intelligent, Low-Impact
              <br />
              <span>Equipment Tracking</span>
            </h2>
            
            <h3 className="text-lg md:text-xl lg:text-2xl font-medium mb-4 text-gray-100">
              Built for Hospitals. Designed for Simplicity
            </h3>
            
            <p className="text-base md:text-lg mb-8 text-cyan-300 font-medium">
              With Privacy & Security First!
            </p>
            
            <div className="flex justify-center">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Make an appointment
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSimple;
