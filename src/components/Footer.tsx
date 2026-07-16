export default function Footer() {
  return (
    <footer className="bg-bg-color border-t-2 border-primary-border">
      <div className="container mx-auto px-4 md:px-8 lg:px-10 py-15 text-text-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-30 gap-y-10 mb-12">
          <div>
            <h5 className="text-white font-black text-2xl mb-3">
              Build<span className="text-primary-green text-2xl">•</span>Site
            </h5>
            <p>
              Premium web agency delivering fast, beautiful, and conversion-ready
              websites for businesses worldwide.
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <i className="ri-whatsapp-line p-3 bg-bg-skills-color text-xl text-text-primary border-2 border-primary-border rounded-xl hover:border-primary-green hover:text-primary-green cursor-pointer transition duration-200"></i>
              <i className="ri-instagram-line p-3 bg-bg-skills-color text-xl text-text-primary border-2 border-primary-border rounded-xl hover:border-primary-green hover:text-primary-green cursor-pointer transition duration-200"></i>
              <i className="ri-facebook-fill p-3 bg-bg-skills-color text-xl text-text-primary border-2 border-primary-border rounded-xl hover:border-primary-green hover:text-primary-green cursor-pointer transition duration-200"></i>
              <i className="ri-tiktok-fill p-3 bg-bg-skills-color text-xl text-text-primary border-2 border-primary-border rounded-xl hover:border-primary-green hover:text-primary-green cursor-pointer transition duration-200"></i>
            </div>
          </div>

          <div>
            <h6 className="text-lg font-black text-text-primary mb-4">PAGES</h6>
            <ul className="flex flex-col gap-3 text-lg">
              <li className="hover:text-primary-green cursor-pointer">Home</li>
              <li className="hover:text-primary-green cursor-pointer">Work</li>
              <li className="hover:text-primary-green cursor-pointer">Services</li>
              <li className="hover:text-primary-green cursor-pointer">Contact</li>
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-black text-text-primary mb-4">SERVICES</h6>
            <ul className="flex flex-col gap-3 text-lg">
              <li className="hover:text-primary-green cursor-pointer">Custom Websites</li>
              <li className="hover:text-primary-green cursor-pointer">Landing Pages</li>
              <li className="hover:text-primary-green cursor-pointer">E-commerce</li>
              <li className="hover:text-primary-green cursor-pointer">Redesign</li>
              <li className="hover:text-primary-green cursor-pointer">White Label</li>
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-black text-text-primary mb-4">CONTACT</h6>
            <ul className="flex flex-col gap-3 text-lg">
              <li className="hover:text-primary-green cursor-pointer">WhatsApp us</li>
              <li className="hover:text-primary-green cursor-pointer">Instagram DM</li>
              <li className="hover:text-primary-green cursor-pointer">hello@buildsite.agency</li>
            </ul>
          </div>
        </div>

        <div>
          <hr className="text-primary-border" />
          <div className="mt-10 flex flex-wrap justify-between items-center">
            <p className="text-md pb-3">© 2025 Build.Site — All rights reserved</p>
            <div className="flex flex-wrap gap-3">
              <div className="py-2 px-4 bg-bg-skills-color border-2 border-primary-border rounded-4xl">
                <i className="ri-draft-fill text-primary-green pr-1 text-sm"></i>
                <span>Fast Delivery</span>
              </div>
              <div className="py-2 px-4 bg-bg-skills-color border-2 border-primary-border rounded-4xl">
                <i className="ri-flashlight-fill text-primary-green pr-1 text-sm"></i>
                <span>Fast Delivery</span>
              </div>
              <div className="py-2 px-4 bg-bg-skills-color border-2 border-primary-border rounded-4xl">
                <i className="ri-earth-fill text-primary-green pr-1 text-sm"></i>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
