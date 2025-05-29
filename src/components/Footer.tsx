import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
    <img src='./images/footer-logo.svg' alt="logo" className="footer__logo" />
      <div className='footer__address'><p>г. Москва, Цветной б-р, 40
+7 495 771 21 11
info@skan.ru </p><p className='footer__copyright'>Copyright. 2025</p></div>
    </footer>
  );
};

export default Footer;
