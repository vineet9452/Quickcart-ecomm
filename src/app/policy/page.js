import Image from "next/image";

export default function Policy() {
  return (
    <>
      <div className="row contactus">
        <div className="col-md-6">
          <Image
            src="/images/contactus.jpeg"
            alt="Privacy Policy"
            width={600} // अपनी आवश्यकता अनुसार Width सेट करें
            height={400} // अपनी आवश्यकता अनुसार Height सेट करें
            layout="responsive"
          />
        </div>
        <div className="col-md-4">
          <p>add privacy policy</p>
          <p>add privacy policy</p>
          <p>add privacy policy</p>
          <p>add privacy policy</p>
          <p>add privacy policy</p>
          <p>add privacy policy</p>
          <p>add privacy policy</p>
          <p>add privacy policy</p>
        </div>
      </div>
    </>
  );
}
