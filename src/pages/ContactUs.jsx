import { useEffect, useRef } from 'react';

const ContactUs = () => {
  const fadeInRefs = useRef([]);

  useEffect(() => {
    // Fade in animation observer
    const fadeInObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    fadeInRefs.current.forEach((ref) => {
      if (ref) fadeInObserver.observe(ref);
    });

    return () => {
      fadeInRefs.current.forEach((ref) => {
        if (ref) fadeInObserver.unobserve(ref);
      });
    };
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-none">
          <img
            decoding="auto"
            src="/assets/images/delivering-bg.jpg"
            alt="Delivering background"
            className="block w-full h-full object-cover object-center"
          />
        </div>

        {/* Overlay */}
        <div className="contact-us-hero-overlay"></div>

        {/* Content Container */}
        <div className="absolute z-20 w-full bottom-0 left-0 right-0 pt-24 pb-20">
          <div className="mx-auto px-[48px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-end">
              {/* Left Side - Title Section */}
              <div
                className="flex flex-col items-start justify-end contact-us-fade-in"
                ref={(el) => (fadeInRefs.current[0] = el)}
              >
                <h2 className="contact-us-hero-title text-white mb-4 whitespace-nowrap">
                Add value <br />to your success with 
                </h2>
                <h2 className="contact-us-hero-subtitle text-white whitespace-nowrap">
                Laxmi Electronics
                </h2>
              </div>
              <div></div>

              {/* Right Side - Description Section */}
              <div
                className="flex flex-col justify-end contact-us-fade-in"
                ref={(el) => (fadeInRefs.current[1] = el)}
              >
                {/* Divider Line */}
                <div className="mb-6 flex justify-start">
                  <div className="h-px w-20 bg-[#9CAEAF]"></div>
                </div>

                {/* Description Text */}
                <div className="max-w-md">
                  <p className="contact-us-hero-description">
                  If you would like to make a request for a quote for the manufacture of a mold or components – fill out the form below and we will be in touch as soon as possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="section-2" className="contact-form-section">
        <div className="contact-form-container">
          

          {/* Content Grid: Left Text, Right Form */}
          <div className="contact-form-content-grid">
            {/* Tag/Description - Left Side with Two Columns */}
            <div className="contact-form-tag-wrapper">
              <div className="contact-form-tag">
                {/* Divider Line */}
                <div className="contact-form-divider-container">
                  <div className="contact-form-divider"></div>
                </div>
                <p className="contact-form-tag-text">
                  <strong>Let's talk.</strong>
                  <br />
                  Whether you're ready to start a project or just exploring options, we're here to help. Fill out the form and we'll get back to you shortly.
                </p>
              </div>
              <div className="contact-form-tag-spacer"></div>
            </div>

            {/* Form - Right Side */}
            <div id="form" className="contact-form-wrapper">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              {/* First Name and Last Name Row */}
              <div className="contact-form-row">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>First Name <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      required
                      name="first_name"
                      placeholder="First Name *"
                      className="contact-form-input"
                    />
                  </div>
                </label>
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Last Name <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      required
                      name="last_name"
                      placeholder="Last Name *"
                      className="contact-form-input"
                    />
                  </div>
                </label>
              </div>

              {/* Mobile Number and Email Row */}
              <div className="contact-form-row">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Mobile Number</p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="tel"
                      name="mobile_number"
                      placeholder="Mobile Number"
                      className="contact-form-input"
                    />
                  </div>
                </label>
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Email Id <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="email"
                      required
                      name="email"
                      placeholder="Email Id *"
                      className="contact-form-input"
                    />
                  </div>
                </label>
              </div>

              {/* Organisation Name and Street Address Row */}
              <div className="contact-form-row">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Organisation Name <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      required
                      name="organisation_name"
                      placeholder="Organisation Name *"
                      className="contact-form-input"
                    />
                  </div>
                </label>
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Street Address</p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      name="street_address"
                      placeholder="Street Address"
                      className="contact-form-input"
                    />
                  </div>
                </label>
              </div>

              {/* City and State Row */}
              <div className="contact-form-row">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>City <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      required
                      name="city"
                      placeholder="City *"
                      className="contact-form-input"
                    />
                  </div>
                </label>
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>State <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <input
                      type="text"
                      required
                      name="state"
                      placeholder="State *"
                      className="contact-form-input"
                    />
                  </div>
                </label>
              </div>

              {/* Requirement Textarea */}
              <div className="contact-form-row-full">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Requirement <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <textarea
                      required
                      name="requirement"
                      placeholder="Requirement *"
                      className="contact-form-input contact-form-textarea"
                      rows={5}
                    ></textarea>
                  </div>
                </label>
              </div>

              {/* File Uploads Row */}
              <div className="contact-form-row">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>CAD file (with dimensions and UOM)</p>
                  </div>
                  <div className="contact-form-file-upload">
                    <input
                      type="file"
                      name="cad_file"
                      accept=".doc,.docx,.xls,.ppt,.pptx,.pdf,.jpg,.dwg"
                      className="contact-form-file-input"
                      id="cad_file"
                    />
                    <label htmlFor="cad_file" className="contact-form-file-label">
                      <svg viewBox="0 0 1024 1024" width="50px" height="50px" fill="currentColor" aria-hidden="true">
                        <path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0 0 60.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
                      </svg>
                      <span className="contact-form-file-text">Click or drag a file to this area to upload.</span>
                    </label>
                    <div className="contact-form-file-description">
                      (Preferred Files: doc, docx, xl, xls, ppt, pptx, pdf, jpg, dwg & below 5mb)
                    </div>
                  </div>
                </label>
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Copy of RFQ/Contract with applicable clauses</p>
                  </div>
                  <div className="contact-form-file-upload">
                    <input
                      type="file"
                      name="rfq_file"
                      accept=".doc,.docx,.xls,.pdf"
                      className="contact-form-file-input"
                      id="rfq_file"
                    />
                    <label htmlFor="rfq_file" className="contact-form-file-label">
                      <svg viewBox="0 0 1024 1024" width="50px" height="50px" fill="currentColor" aria-hidden="true">
                        <path d="M885.2 446.3l-.2-.8-112.2-285.1c-5-16.1-19.9-27.2-36.8-27.2H281.2c-17 0-32.1 11.3-36.9 27.6L139.4 443l-.3.7-.2.8c-1.3 4.9-1.7 9.9-1 14.8-.1 1.6-.2 3.2-.2 4.8V830a60.9 60.9 0 0 0 60.8 60.8h627.2c33.5 0 60.8-27.3 60.9-60.8V464.1c0-1.3 0-2.6-.1-3.7.4-4.9 0-9.6-1.3-14.1zm-295.8-43l-.3 15.7c-.8 44.9-31.8 75.1-77.1 75.1-22.1 0-41.1-7.1-54.8-20.6S436 441.2 435.6 419l-.3-15.7H229.5L309 210h399.2l81.7 193.3H589.4zm-375 76.8h157.3c24.3 57.1 76 90.8 140.4 90.8 33.7 0 65-9.4 90.3-27.2 22.2-15.6 39.5-37.4 50.7-63.6h156.5V814H214.4V480.1z"></path>
                      </svg>
                      <span className="contact-form-file-text">Click or drag a file to this area to upload.</span>
                    </label>
                    <div className="contact-form-file-description">
                      (Preferred Files: doc, docx, xl, xls, pdf & below 5mb)
                    </div>
                  </div>
                </label>
              </div>

              {/* Estimated Volume Textarea */}
              <div className="contact-form-row-full">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Estimated volume for the next 18-24 months (Please include the tentative release schedule) <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <textarea
                      required
                      name="estimated_volume"
                      placeholder="Estimated volume for the next 18-24 months (Please include the tentative release schedule) *"
                      className="contact-form-input contact-form-textarea"
                      rows={5}
                    ></textarea>
                  </div>
                </label>
              </div>

              {/* Tentative Order Release Date Textarea */}
              <div className="contact-form-row-full">
                <label className="contact-form-field">
                  <div className="contact-form-label">
                    <p>Please include the tentative order release date <span className="contact-form-required">*</span></p>
                  </div>
                  <div className="contact-form-input-wrapper">
                    <textarea
                      required
                      name="order_release_date"
                      placeholder="Please include the tentative order release date *"
                      className="contact-form-input contact-form-textarea"
                      rows={5}
                    ></textarea>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="contact-form-submit-container">
                <button
                  type="submit"
                  className="contact-form-submit-button"
                >
                  <span>Submit</span>
                </button>
              </div>

              {/* Honeypot fields for spam protection */}
              <input
                type="text"
                name="wpforms[fields][19]"
                tabIndex="-1"
                aria-hidden="true"
                style={{ position: 'absolute', overflow: 'hidden', display: 'inline', height: '1px', width: '1px', zIndex: -1000, padding: 0 }}
              />
              <input
                type="text"
                name="wpforms[fields][1]"
                tabIndex="-1"
                aria-hidden="true"
                style={{ position: 'absolute', transform: 'scale(0)' }}
              />
            </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contacts Section */}
      <main id="section-2-1" className="contact-contacts-section">
        {/* Decorative Shapes */}
        <figure className="contact-shape-1">
          <img
            decoding="auto"
            width="743"
            height="404"
            sizes="780px"
            srcSet="https://framerusercontent.com/images/vfC405O6yaNKJbRR1D2pFFXHE.svg?scale-down-to=512&width=743&height=404 512w,https://framerusercontent.com/images/vfC405O6yaNKJbRR1D2pFFXHE.svg?width=743&height=404 743w"
            src="https://framerusercontent.com/images/vfC405O6yaNKJbRR1D2pFFXHE.svg?width=743&height=404"
            alt="component shape"
            className="contact-shape-img"
          />
        </figure>
        <figure className="contact-shape-2">
          <img
            decoding="auto"
            width="743"
            height="754"
            sizes="600px"
            srcSet="https://framerusercontent.com/images/brE0LzaBg4dUMi0nQeg6IAa25c.svg?width=743&height=754 743w"
            src="https://framerusercontent.com/images/brE0LzaBg4dUMi0nQeg6IAa25c.svg?width=743&height=754"
            alt="congwheel component"
            className="contact-shape-img"
          />
        </figure>

        {/* Email and Phone Section */}
        <div className="contact-email-phone">
          <div className="contact-email-phone-header">
            {/* Divider Line */}
            <div className="contact-divider-container">
              <div className="contact-divider-line"></div>
            </div>
            <div className="contact-section-tag">
              <p>General Inquiries</p>
            </div>
          </div>
          <div className="contact-email-phone-content">
            <div className="contact-description">
              <h6>For partnerships, custom solutions, or technical support, reach out to us:</h6>
            </div>
            <ul className="contact-info-list">
              <li className="contact-info-item">
                <div className="contact-info-title">
                  <p>Email</p>
                </div>
                <div className="contact-info-text">
                  <h6>
                    <a href="mailto:contact@omnis.com" target="_blank" rel="noopener">contact@omnis.com</a>
                  </h6>
                </div>
              </li>
              <li className="contact-info-item">
                <div className="contact-info-title">
                  <p>Phone</p>
                </div>
                <div className="contact-info-text">
                  <h6>
                    <a href="tel:16175550123" target="_blank" rel="noopener">+1 (617) 555-0123</a>
                  </h6>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Locations Section */}
        <div className="contact-locations">
          <div className="contact-locations-header">
            {/* Empty Divider Line */}
            <div className="contact-divider-container-empty">
              <div className="contact-divider-line-empty"></div>
            </div>
            <div className="contact-section-tag">
              <p>Locations</p>
            </div>
          </div>
          <div className="contact-locations-content">
            <div className="contact-location-item">
              <div className="contact-location-label">
                <h6>Headquarters</h6>
              </div>
              <div className="contact-location-address">
                <p>
                  123 Innovation Drive<br />
                  Boston, MA 02110<br />
                  United States
                </p>
              </div>
            </div>
            <div className="contact-location-item">
              <div className="contact-location-label">
                <h6>R&D Facility – Landrobe, PA</h6>
              </div>
              <div className="contact-location-address">
                <p>
                  456 Advanced Materials Road<br />
                  Landrobe, PA 15650<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;

