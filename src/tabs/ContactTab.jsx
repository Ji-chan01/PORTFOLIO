import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  FaPaperPlane, FaEnvelope, FaFacebookF, FaGithub, FaCheckCircle, FaExclamationCircle, FaTimes, FaShieldAlt
} from 'react-icons/fa';

const RATE_LIMIT_KEY = 'portfolio_contact_limit';
const MAX_REQUESTS = 3;

const getRateLimit = () => {
  const today = new Date().toDateString();
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  if (!stored) return { count: 0, date: today };

  const data = JSON.parse(stored);
  if (data.date !== today) return { count: 0, date: today };

  return data;
};

const incrementRateLimit = () => {
  const data = getRateLimit();
  data.count += 1;
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
};

export default function ContactTab() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null);

  // OTP States
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [userOtp, setUserOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(null);

  useEffect(() => {
    // Initialize EmailJS
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    }

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

    const limitData = getRateLimit();
    if (limitData.count >= MAX_REQUESTS) {
      setStatus('limit');
      return;
    }

    setIsSending(true);
    setStatus(null);
    setVerificationError(null);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const verifyTemplateId = import.meta.env.VITE_EMAILJS_VERIFY_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !verifyTemplateId || !publicKey) {
        throw new Error('EmailJS configuration is missing. Please check your .env file.');
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      const result = await emailjs.send(
        serviceId,
        verifyTemplateId,
        {
          from_name: formData.name,
          to_email: formData.email,
          verification_code: otp,
        }
      );

      if (result.text === 'OK') {
        setIsVerifying(true); // Show the OTP input modal
      } else {
        console.error('OTP Send Failed:', result);
        setStatus('error');
      }
    } catch (error) {
      console.error('OTP Send Error:', error);
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyAndSend = async (e) => {
    e.preventDefault();
    if (userOtp !== generatedOtp) {
      setVerificationError('Invalid verification code. Please check your email.');
      return;
    }

    setIsSending(true);
    setVerificationError(null);

    try {
      // 3. If OTP matches, send the final message
      const result = await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current
      );

      if (result.text === 'OK') {
        incrementRateLimit();
        setStatus('success');
        setIsVerifying(false);
        setUserOtp('');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Final Send Error:', error);
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
        className="bg-grid h-full"
      >
        <div className="w-full h-full grid min-[1264px]:grid-cols-2">
          <div className="flex flex-col h-full">


            {/* Map */}
            <div className="flex-1 overflow-hidden min-h-[30vh] min-[1264px]:min-h-0">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123654.19548293324!2d120.88645862130612!3d14.415999962462854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d2407b04433f%3A0x779154cd6b3d2d4c!2sBacoor%2C%20Cavite!5e0!3m2!1sen!2sph!4v1724651308187!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
                className="dark:[filter:grayscale(1)_invert(1)]"
              />
            </div>
          </div>

          <div className="h-full flex flex-col">
            <div className="card rounded-none p-6 md:p-8 h-full flex flex-col">
              <form ref={formRef} onSubmit={handleSubmit} id="contact-form" className="space-y-4">
                <p className="section-subtitle">Get In Touch</p>
                <h2 className="section-title">Let's Build Something Together!</h2>
                {/* <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
                  Have a project in mind? Need a full-stack solution or a UI/UX overhaul? I'm open to freelance
                  projects, collaborations, and conversations. Fill out the form and I'll get back to you
                  within 24 hours.
                </p> */}
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
        {isVerifying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-zinc-800"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100">Verify Your Email</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                    We've sent a 6-digit code to <span className="font-semibold text-accent">{formData.email}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsVerifying(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-gray-400"
                >
                  <FaTimes size={18} />
                </button>
              </div>

              <form onSubmit={handleVerifyAndSend} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-xs font-semibold text-gray-700 dark:text-zinc-300 mb-2">
                    Enter Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value.replace(/\D/g, ''))}
                    className="input-field text-center text-2xl tracking-[0.5em] font-bold py-4"
                    autoFocus
                  />
                  {verificationError && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      <FaExclamationCircle size={10} />
                      {verificationError}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsVerifying(false)}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending || userOtp.length !== 6}
                    className="flex-2 bg-accent-dark text-white font-bold px-8 py-3 rounded-xl shadow active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      'Verify & Send'
                    )}
                  </button>
                </div>
              </form>

              <p className="text-center text-[11px] text-gray-400 dark:text-zinc-500 mt-6">
                Didn't receive the code? Check your spam folder or try again in a few minutes.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-0 right-0 mx-auto w-[calc(100%-2rem)] max-w-[400px] md:top-auto md:bottom-6 md:right-6 md:left-auto md:mx-0 md:w-auto z-[120] flex items-center gap-3 p-4 rounded-2xl shadow-2xl border bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${status === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' :
              status === 'limit' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' :
                'bg-red-50 dark:bg-red-900/20 text-red-600'
              }`}>
              {status === 'success' ? <FaCheckCircle size={20} /> :
                status === 'limit' ? <FaShieldAlt size={20} /> :
                  <FaExclamationCircle size={20} />}
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">
                {status === 'success' ? 'Success!' :
                  status === 'limit' ? 'Rate Limit Reached' :
                    'Error!'}
              </p>
              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                {status === 'success'
                  ? "Your message has been sent successfully. I'll get back to you soon!"
                  : status === 'limit'
                    ? "You have reached the daily limit of 3 messages. Please try again tomorrow."
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
              className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl origin-left ${status === 'success' ? 'bg-green-500' :
                status === 'limit' ? 'bg-amber-500' :
                  'bg-red-500'
                }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
