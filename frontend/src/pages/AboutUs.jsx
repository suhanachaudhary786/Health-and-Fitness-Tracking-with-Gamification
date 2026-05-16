// About Us page - Project information and team members
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const AboutUs = () => {
  // Project information
  const projectInfo = {
    titleAr: 'تتبع الصحة واللياقة البدنية باستخدام عناصر اللعب',
    titleEn: 'Health and Fitness Tracking Using Gamification Elements',
    semester: 'F24',
    level: 'PR2',
    specialization: 'الهندسة المعلوماتية – جامعة الفتراضية السورية',
    supervisor: 'د.محمد الشايطة',
    studentCount: 4,
  };

  // Team members with their roles
  const teamMembers = [
    {
      id: 1,
      name: 'محمد عمار محمد نزار فاكهاني',
      studentId: '131556',
      role: 'Front-End Development',
      description: 'Responsible for designing and developing user interfaces using React.js and Tailwind CSS.',
    },
    {
      id: 2,
      name: 'راما محمد رضوان سنجاب',
      studentId: '154838',
      role: 'Database Design',
      description: 'Responsible for database design (ERD), table setup, and backend integration.',
    },
    {
      id: 3,
      name: 'هبة أحمد صوفان',
      studentId: '206067',
      role: 'Back-End Development',
      description: 'Responsible for backend development using Node.js/Express.js, and building APIs for points and badges.',
    },
    {
      id: 4,
      name: 'ماهر جرجس العلي',
      studentId: '108094',
      role: 'Testing & Integration',
      description: 'Responsible for testing, documentation, presentation preparation, and coordinating integration of all project components.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-secondary-light">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                Health Tracker
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-primary font-medium border-b-2 border-primary pb-1"
              >
                About Us
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
            {/* Mobile menu */}
            <div className="md:hidden flex items-center space-x-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center animate-fadeIn">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            About Our Project
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        </div>
      </section>

      {/* Project Information Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Project Overview
          </h2>

          <div className="space-y-6">
            {/* Project Title */}
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Project Title</h3>
              <p className="text-xl font-bold text-gray-900 mb-2" dir="rtl">
                {projectInfo.titleAr}
              </p>
              <p className="text-xl font-bold text-primary">{projectInfo.titleEn}</p>
            </div>

            {/* Project Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Semester
                </h4>
                <p className="text-2xl font-bold text-gray-900">{projectInfo.semester}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Project Level
                </h4>
                <p className="text-2xl font-bold text-gray-900">{projectInfo.level}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Specialization
                </h4>
                <p className="text-lg font-semibold text-gray-900" dir="rtl">
                  {projectInfo.specialization}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Supervisor
                </h4>
                <p className="text-xl font-bold text-gray-900" dir="rtl">
                  {projectInfo.supervisor}
                </p>
              </div>

              <div className="bg-primary/10 rounded-lg p-6 md:col-span-2">
                <h4 className="text-sm font-semibold text-primary uppercase mb-2">
                  Team Size
                </h4>
                <p className="text-3xl font-bold text-primary">{projectInfo.studentCount} Students</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the talented students who brought this project to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                {/* Member Number Badge */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>

                {/* Member Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2" dir="rtl">
                    {member.name}
                  </h3>
                  <div className="mb-3">
                    <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-3 py-1 rounded-full">
                      ID: {member.studentId}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className="inline-block bg-secondary/10 text-secondary text-sm font-semibold px-3 py-1 rounded-full">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Concept Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Project Concept
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Our project aims to revolutionize health and fitness tracking by incorporating
              gamification elements that make staying active fun and engaging. Users can track
              their daily activities, earn points, unlock badges, participate in challenges,
              and compete on leaderboards.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              The platform combines modern web technologies with game mechanics to create an
              immersive experience that motivates users to maintain a healthy lifestyle while
              having fun and staying connected with a community of fitness enthusiasts.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience Our Platform?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join us and start your fitness journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Get Started
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Health Tracker</h3>
              <p className="text-gray-400 text-sm">
                Health and Fitness Tracking Using Gamification Elements
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                to="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/login"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2024 Health Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;

