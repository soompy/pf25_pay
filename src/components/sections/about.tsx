'use client';

import { motion } from 'framer-motion';
import { Code, Palette, Zap, Users } from 'lucide-react';

export function AboutSection() {
  const skills = [
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      level: 90,
    },
    {
      category: 'State Management',
      items: ['Zustand', 'Redux', 'React Query', 'Context API'],
      level: 85,
    },
    {
      category: 'Tools & Others',
      items: ['Git', 'Figma', 'Webpack', 'ESLint', 'Storybook'],
      level: 80,
    },
  ];

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Clean Code',
      description: 'Writing maintainable, readable code following best practices',
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'UI/UX Focus',
      description: 'Creating intuitive and beautiful user interfaces',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Performance',
      description: 'Optimizing applications for speed and efficiency',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Collaboration',
      description: 'Working effectively with teams and stakeholders',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            About Me
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            I&apos;m a passionate frontend developer with expertise in modern web technologies.
            I love creating efficient, scalable, and user-friendly applications.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Skills & Expertise
            </h3>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900">{skill.category}</h4>
                    <span className="text-sm text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="bg-green-600 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {skill.items.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-lg"
              >
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}