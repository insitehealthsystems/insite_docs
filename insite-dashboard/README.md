# InSite Health System

A modern React-based healthcare technology platform converted from HTML template to a fully functional multi-page application.

## 🏥 About InSite Health System

InSite Health System is a comprehensive healthcare technology solution that provides intelligent asset tracking, mobile-first secure environments, capital planning visibility, and site monitoring for healthcare organizations.

## ✨ Features

### 🎯 **Multi-Page Application**
- **Homepage** - Complete overview with hero section, features, solutions, and CTAs
- **About** - Company information, process, team preview, and testimonials
- **Services** - Comprehensive service showcase with team and working process
- **Team** - Full team directory with member profiles and recruitment section
- **Contact** - Contact forms, pilot process, maps, and contact information
- **Blog** - Healthcare-focused blog with sidebar widgets and pagination

### 🛠️ **Technical Stack**
- **React 18** with Vite for fast development and building
- **React Router DOM** for client-side routing
- **Tailwind CSS** for modern, responsive styling
- **Lucide React** for consistent iconography
- **Yup** for form validation
- **React Hook Form** for efficient form handling
- **Swiper** for interactive carousels and sliders

### 🎨 **Design Features**
- **Fully Responsive** - Mobile-first design that works on all devices
- **Healthcare-Themed** - Professional color palette and medical-focused content
- **Interactive Components** - Hover effects, animations, and smooth transitions
- **Modern UI/UX** - Clean, accessible interface with proper semantic markup
- **Performance Optimized** - Fast loading with optimized assets

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Richey24/insite-health.git
   cd insite-health
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📱 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Hero section, features, solutions, testimonials |
| `/about` | About | Company info, why choose us, team, app download |
| `/services` | Services | Service showcase, team members, working process |
| `/team` | Team | Full team directory, member profiles, recruitment |
| `/contact` | Contact | Pilot process, contact forms, map, contact info |
| `/blog` | Blog | Healthcare articles, sidebar widgets, pagination |

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.jsx      # Main navigation with mobile menu
│   ├── Footer.jsx      # Site footer with links and info
│   ├── Hero.jsx        # Homepage hero section
│   ├── Features.jsx    # Features showcase component
│   ├── Solutions.jsx   # Solutions section
│   ├── Testimonials.jsx # Client testimonials
│   ├── TestimonialSlider.jsx # Testimonial carousel
│   └── ...
├── pages/              # Page components
│   ├── HomePage.jsx    # Complete homepage
│   ├── AboutPage.jsx   # About page with company info
│   ├── ServicesPage.jsx # Services showcase
│   ├── TeamPage.jsx    # Team directory
│   ├── ContactPage.jsx # Contact forms and info
│   └── BlogPage.jsx    # Blog with sidebar
├── utils/              # Utility functions
│   └── formValidation.js # Yup validation schemas
├── App.jsx             # Main app with routing
├── main.jsx            # React app entry point
└── index.css           # Global styles and Tailwind
```

## 🎨 Color Palette

The application uses a professional healthcare-focused color scheme:

- **Primary Blue**: `#083791` - Main brand color
- **Secondary Cyan**: `#18c8ff` - Accent color
- **Light Blue**: `#4fc1f0` - Light variant
- **Orange Accent**: `#FF8E32` - Call-to-action color

## 📞 Contact Information

- **Phone**: +(99) 125 696 889 788
- **Email**: info@insite.health
- **Address**: Healthcare Innovation Hub
- **Support**: 24/7 technical support available

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original HTML template design inspiration
- Healthcare industry best practices
- Modern React development patterns
- Accessibility guidelines and standards

---

**Built with ❤️ for healthcare technology innovation**
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
