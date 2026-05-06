import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPaperPlane, FaEnvelope, FaFacebookF, FaGithub, FaCheckCircle, FaExclamationCircle, FaTimes
} from 'react-icons/fa';

export default function ContactTab() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <motion.div
        key="contact"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35 }}
        className="p-6 md:p-8 bg-grid"
      >
        <div className="max-w-5xl mx-auto grid min-[1264px]:grid-cols-2 gap-10 min-[1264px]:gap-16">
          <div className="flex flex-col justify-center">
            <p className="section-subtitle">Get In Touch</p>
            <h2 className="section-title mb-4">Let's Build Something Together!</h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
              Have a project in mind? Need a full-stack solution or a UI/UX overhaul? I'm open to freelance
              projects, collaborations, and conversations. Fill out the form and I'll get back to you
              within 24 hours.
            </p>
          </div>

          <div className="space-y-8">

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                {
                  icon: FaEnvelope,
                  label: 'Email',
                  value: 'briolchristian040@gmail.com',
                  href: typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                    ? 'mailto:briolchristian040@gmail.com'
                    : 'https://mail.google.com/mail/?view=cm&fs=1&to=briolchristian040@gmail.com',
                  id: 'quick-email'
                },
                { icon: FaFacebookF, label: 'Facebook', value: 'facebook.com/jirehkun.briol.1', href: 'https://facebook.com/jirehkun.briol.1', id: 'quick-facebook' },
                { icon: FaGithub, label: 'GitHub', value: 'github.com/Ji-chan01', href: 'https://github.com/Ji-chan01', id: 'quick-github' },
              ].map(({ icon: Icon, label, value, href, id }) => (
                <a
                  key={id}
                  id={id}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : "_blank"}
                  rel={href.startsWith('mailto:') ? undefined : "noreferrer"}
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
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 p-4 rounded-2xl shadow-2xl border bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 min-w-[320px] max-w-[400px]"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${status === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>
              {status === 'success' ? <FaCheckCircle size={20} /> : <FaExclamationCircle size={20} />}
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                {status === 'success' ? 'Success!' : 'Error!'}
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                {status === 'success'
                  ? "Your message has been sent successfully. I'll get back to you soon!"
                  : "Failed to send message. Please check your connection or try again later."}
              </p>
            </div>

            <button
              onClick={() => setStatus(null)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={14} />
            </button>

            {/* Progress bar for 5s timer */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: "linear" }}
              className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl origin-left ${status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
