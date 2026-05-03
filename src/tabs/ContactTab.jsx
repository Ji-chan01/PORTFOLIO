import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  FaPaperPlane, FaEnvelope, FaFacebookF, FaGithub, FaCheckCircle, FaExclamationCircle
} from 'react-icons/fa';

// 🔑 Replace these with your actual EmailJS credentials
const SERVICE_ID = 'service_xxxxxxx';
const TEMPLATE_ID = 'template_xxxxxxx';
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

export default function ContactTab() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus(null);

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch(() => {
        setStatus('error');
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <motion.div
      key="contact"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 md:p-8 bg-grid"
    >
      <div className="max-w-5xl mx-auto grid min-[1264px]:grid-cols-2 gap-10 min-[1264px]:gap-16">
        {/* Left Side - Text */}
        <div className="flex flex-col justify-center">
          <p className="section-subtitle">Get In Touch</p>
          <h2 className="section-title mb-4">Let's Build Something Together</h2>
          <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
            Have a project in mind? Need a full-stack solution or a UI/UX overhaul? I'm open to freelance
            projects, collaborations, and conversations. Fill out the form and I'll get back to you
            within 24 hours.
          </p>
        </div>

        {/* Right Side - Links & Form */}
        <div className="space-y-8">
          {/* Quick Contact Cards */}
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: FaEnvelope, label: 'Email', value: 'briolchristian040@gmail.com', href: 'mailto:briolchristian040@gmail.com', id: 'quick-email' },
              { icon: FaFacebookF, label: 'Facebook', value: 'facebook.com/jirehkun.briol.1', href: 'https://facebook.com/jirehkun.briol.1', id: 'quick-facebook' },
              { icon: FaGithub, label: 'GitHub', value: 'github.com/Ji-chan01', href: 'https://github.com/Ji-chan01', id: 'quick-github' },
            ].map(({ icon: Icon, label, value, href, id }) => (
              <a
                key={id}
                id={id}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="card p-4 flex gap-3 items-center hover:opacity-70 transition-opacity duration-200 min-w-0"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                  <Icon className="text-accent" size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-zinc-100">{label}</p>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400 truncate">{value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="card p-6 md:p-8">
            <form ref={formRef} onSubmit={handleSubmit} id="contact-form" className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="from_name"
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="from_email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-1.5">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  className="input-field resize-none"
                />
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3"
                >
                  <FaCheckCircle />
                  Message sent successfully! I'll get back to you within 24 hours.
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3"
                >
                  <FaExclamationCircle />
                  Something went wrong. Please try emailing me directly at cjbriol@gmail.com
                </motion.div>
              )}

              <button
                id="submit-contact"
                type="submit"
                disabled={isSending}
                className="bg-accent-dark text-white font-bold px-6 py-2.5 rounded-xl shadow active:scale-95 w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={13} />
                    Send Message →
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
