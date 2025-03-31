'use client';
import { 
  Leaf, Globe, Trees, Recycle, Users, Zap, 
  Building, Car, Hotel, Calendar, Star, Award,
  BarChart2, TrendingUp, ShoppingBag, ArrowRight,
  Check, Shield, ChevronDown, Play, Mail, Phone, MapPin,
  Sparkles, Lock, LineChart
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Updated feature cards to be more story-driven
  const features = [
    {
      title: "Connect & Track",
      description: "Join a community making sustainability simple and rewarding. Track your impact, join challenges, and earn rewards.",
      icon: <Users className="w-6 h-6 text-green-600" />,
      benefits: ["Activity Tracking", "Community Challenges", "Digital Rewards"]
    },
    {
      title: "Measure & Report",
      description: "Transform complex sustainability data into clear insights and reports that showcase your environmental impact.",
      icon: <LineChart className="w-6 h-6 text-green-600" />,
      benefits: ["Impact Analytics", "Progress Reports", "Performance Tracking"]
    },
    {
      title: "Grow & Share",
      description: "Be part of a movement. Share your sustainability journey and inspire others to join the cause.",
      icon: <Sparkles className="w-6 h-6 text-green-600" />,
      benefits: ["Success Stories", "Community Impact", "Knowledge Sharing"]
    }
  ];

  // Dual journey paths
  const journeyPaths = {
    individual: [
      {
        stage: "Start",
        title: "Track Your Impact",
        description: "Connect your daily activities to sustainability metrics",
        icon: <Leaf className="w-8 h-8 text-green-600" />
      },
      {
        stage: "Engage",
        title: "Join Challenges",
        description: "Participate in community initiatives and earn rewards",
        icon: <Users className="w-8 h-8 text-green-600" />
      },
      {
        stage: "Grow",
        title: "Lead Change",
        description: "Inspire others and expand your positive impact",
        icon: <Star className="w-8 h-8 text-green-600" />
      }
    ],
    business: [
      {
        stage: "Start",
        title: "Measure & Report",
        description: "Set up your sustainability tracking framework",
        icon: <LineChart className="w-8 h-8 text-green-600" />
      },
      {
        stage: "Optimize",
        title: "Improve & Adapt",
        description: "Use insights to enhance your sustainability practices",
        icon: <TrendingUp className="w-8 h-8 text-green-600" />
      },
      {
        stage: "Scale",
        title: "Expand Impact",
        description: "Grow your sustainability initiatives across operations",
        icon: <Globe className="w-8 h-8 text-green-600" />
      }
    ]
  };

  // Community focus instead of success stories
  const communityInitiatives = [
    {
      type: "individual",
      title: "Personal Impact",
      description: "Track your daily sustainable choices and see how small actions add up to meaningful change",
      features: [
        "Activity Tracking",
        "Personal Dashboard",
        "Community Challenges",
        "Reward System"
      ]
    },
    {
      type: "business",
      title: "Business Impact",
      description: "Transform your operations with comprehensive sustainability tracking and reporting",
      features: [
        "ESG Integration",
        "Team Engagement",
        "Impact Analytics",
        "Progress Tracking"
      ]
    }
  ];

  // Platform capabilities
  const capabilities = [
    {
      title: "Activity Tracking",
      description: "Connect your daily actions to meaningful sustainability metrics",
      icon: <LineChart className="w-6 h-6 text-green-600" />
    },
    {
      title: "Community Platform",
      description: "Join challenges and share experiences with like-minded individuals and organizations",
      icon: <Users className="w-6 h-6 text-green-600" />
    },
    {
      title: "Impact Analytics",
      description: "Understand and improve your environmental impact with clear insights",
      icon: <BarChart2 className="w-6 h-6 text-green-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="w-8 h-8 text-green-600 mr-2" />
              <span className="font-bold text-2xl">CarbonGero</span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-green-600">Features</a>
              <a href="#journey" className="text-gray-600 hover:text-green-600">Journey</a>
              <a href="#community" className="text-gray-600 hover:text-green-600">Community</a>
              <a href="#contact" className="text-gray-600 hover:text-green-600">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-green-600">
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                Join The Movement <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70 z-10"></div>
          <video 
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover"
            poster="/api/placeholder/1920/1080"
          >
            <source src="/video/home.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pt-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight flex flex-col">
  <span className="whitespace-nowrap">Smart for Business</span>
  <span className="text-green-400">Great for Planet</span>
</h1>
              <p className="text-xl mb-8 leading-relaxed opacity-90">
                Join a community making sustainability simple, measurable, and rewarding. 
                Every action counts towards a better future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  Start Your Journey <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-green-600 transition-colors flex items-center justify-center">
                  Learn How <Play className="w-5 h-5 ml-2" />
                </button>
              </div>
              
              {/* Trust Elements */}
              <div className="mt-12 grid grid-cols-2 gap-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-black bg-opacity-30 rounded-lg flex items-center justify-center mr-3">
                    <img src="/api/placeholder/32/32" alt="Algorand" className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-medium">Built on Algorand</div>
                    <div className="text-sm text-green-300">Sustainable Blockchain</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-black bg-opacity-30 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium">Community Driven</div>
                    <div className="text-sm text-green-300">Growing Together</div>
                  </div>
                </div>
              </div>
          </div>
          </div>
        </div>
      </section>
    
            {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold mb-2 inline-block">The Platform</span>
            <h2 className="text-4xl font-bold mb-6">Sustainability Made Simple</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track, measure, and improve your environmental impact with tools designed for everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 bg-white rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-green-600 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Journey Section */}
      <section id="journey" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold mb-2 inline-block">Your Path</span>
            <h2 className="text-4xl font-bold mb-6">Choose Your Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're an individual or a business, there's a path for everyone to make an impact
            </p>
          </div>

          {/* Individual Journey */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <Users className="w-10 h-10 text-green-600 mr-4" />
                <div>
                  <h3 className="text-2xl font-bold">For Individuals</h3>
                  <p className="text-gray-600">Make every action count</p>
                </div>
              </div>
              <div className="space-y-6">
                {journeyPaths.individual.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Journey */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <Building className="w-10 h-10 text-green-600 mr-4" />
                <div>
                  <h3 className="text-2xl font-bold">For Businesses</h3>
                  <p className="text-gray-600">Lead the change</p>
                </div>
              </div>
              <div className="space-y-6">
                {journeyPaths.business.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Community Impact */}
          <div className="grid md:grid-cols-2 gap-8">
            {communityInitiatives.map((initiative, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">{initiative.title}</h3>
                <p className="text-gray-600 mb-6">{initiative.description}</p>
                <ul className="space-y-3">
                  {initiative.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-green-600 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section id="platform" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-green-600 font-semibold mb-2 inline-block">How It Works</span>
              <h2 className="text-4xl font-bold mb-6">Simple Tools for Real Impact</h2>
              <div className="space-y-6">
                {capabilities.map((capability, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mr-4 mt-1">
                      {capability.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{capability.title}</h3>
                      <p className="text-gray-600">{capability.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-6">Platform Features</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Personal Impact Tracking</span>
                    <span className="text-green-600">Available Now</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Community Challenges</span>
                    <span className="text-green-600">Available Now</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Business Analytics</span>
                    <span className="text-green-600">Available Now</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold mb-2 inline-block">Join Us</span>
            <h2 className="text-4xl font-bold mb-6">Be Part of the Change</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with a community of changemakers and discover how small actions lead to big impact
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Users className="w-12 h-12 text-green-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Community Challenges</h3>
              <p className="text-gray-600">
                Join monthly sustainability challenges and compete with others to create positive change.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Star className="w-12 h-12 text-green-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Recognition Program</h3>
              <p className="text-gray-600">
                Earn badges and rewards as you progress on your sustainability journey.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Globe className="w-12 h-12 text-green-600 mb-6" />
              <h3 className="text-xl font-semibold mb-4">Global Impact</h3>
              <p className="text-gray-600">
                See how your actions contribute to global sustainability goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-12 shadow-xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Join a community of changemakers and start making a difference today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    Get Started <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                  <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center">
                    Learn More <Calendar className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-6 rounded-xl">
                  <Users className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-gray-600 text-sm">Join like-minded people</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <Star className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="font-semibold mb-2">Rewards</h3>
                  <p className="text-gray-600 text-sm">Earn as you grow</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <Zap className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="font-semibold mb-2">Easy Start</h3>
                  <p className="text-gray-600 text-sm">Begin in minutes</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <Globe className="w-8 h-8 text-green-600 mb-4" />
                  <h3 className="font-semibold mb-2">Impact</h3>
                  <p className="text-gray-600 text-sm">Make a difference</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center">
                <Leaf className="w-8 h-8 text-green-400 mr-2" />
                <span className="font-bold text-2xl">CarbonGero</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Smart for Business, Great for Planet. Making sustainability accessible and rewarding.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white">Getting Started</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-400">
                  <Mail className="w-5 h-5 mr-2" />
                  hello@carbongero.com
                </li>
                <li className="flex items-center text-gray-400">
                  <MapPin className="w-5 h-5 mr-2" />
                  Bangalore, India
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 CarbonGero. Smart for Business, Great for Planet.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}