import {
  FaEnvelope, FaFacebookF, FaGithub, FaMapMarkerAlt
} from 'react-icons/fa';
import { EMAIL, FACEBOOK_URL, GITHUB_URL } from '../lib/constants';
import { getEmailHref, isMobileDevice } from '../lib/contact';

// Contacts list shown in the mobile header's dropdown. (On desktop the same links live in TabNav.)
const contactItems = [
  { icon: FaEnvelope, label: EMAIL, href: getEmailHref(), id: 'contact-email' },
  { icon: FaFacebookF, label: 'facebook.com/jichannn', href: FACEBOOK_URL, id: 'contact-facebook' },
  { icon: FaGithub, label: 'github.com/Ji-chan01', href: GITHUB_URL, id: 'contact-github' },
  { icon: FaMapMarkerAlt, label: 'Bacoor City, Cavite', href: null, id: 'contact-location' },
];

const socialButton =
  'w-9 h-9 md:w-11 md:h-11 rounded-xl bg-gray-100 dark:bg-zinc-800 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 dark:text-zinc-400 hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-black transition-all duration-200';
const iconBox =
  'w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-blue-50 dark:bg-zinc-800 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0';
const divider = 'mx-6 border-t border-gray-100 dark:border-zinc-800 dark:border-zinc-700';

export default function Sidebar() {
  const onMobile = isMobileDevice();

  return (
    <aside className="flex flex-col bg-white dark:bg-black w-full pb-4">
      <div className="px-6 py-4">
        <div className="mb-3">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-zinc-500 dark:text-zinc-500">
            Contacts
          </span>
        </div>

        <ul className="space-y-3">
          {contactItems.map(({ icon: Icon, label, href, id }) => (
            <li key={id}>
              {href ? (
                <a id={id} href={href} target={href.startsWith('mailto:') ? undefined : "_blank"} rel="noreferrer" className="sidebar-link !text-gray-600 dark:!text-zinc-300 hover:!text-accent dark:hover:!text-accent">
                  <span className={iconBox}>
                    <Icon className="text-accent text-[12px] md:text-[16px]" />
                  </span>
                  <span className="text-xs md:text-sm truncate">{label}</span>
                </a>
              ) : (
                <span id={id} className="sidebar-link cursor-default !text-gray-600 dark:!text-zinc-300">
                  <span className={iconBox}>
                    <Icon className="text-accent text-[12px] md:text-[16px]" />
                  </span>
                  <span className="text-xs md:text-sm truncate">{label}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className={divider} />

      <div className="px-6 py-4 flex items-center gap-2 justify-center">
        <a
          id="social-email"
          href={getEmailHref()}
          target={onMobile ? undefined : "_blank"}
          rel={onMobile ? undefined : "noreferrer"}
          className={socialButton}
          aria-label="Email"
        >
          <FaEnvelope className="text-[14px] md:text-[18px]" />
        </a>
        <a
          id="social-facebook"
          href={FACEBOOK_URL}
          target="_blank" rel="noreferrer"
          className={socialButton}
          aria-label="Facebook"
        >
          <FaFacebookF className="text-[14px] md:text-[18px]" />
        </a>
        <a
          id="social-github"
          href={GITHUB_URL}
          target="_blank" rel="noreferrer"
          className={socialButton}
          aria-label="GitHub"
        >
          <FaGithub className="text-[14px] md:text-[18px]" />
        </a>
      </div>
    </aside>
  );
}
