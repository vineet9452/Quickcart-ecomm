import Image from "next/image";

export const metadata = {
  title: "About | QuickCart E-Commerce",
  description: "Learn more about our e-commerce platform.",
};

export default function About() {
  return (
    <>
      <div className="row contactus">
        <div className="col-md-6">
          {/* Next.js Image Optimization */}
          <Image
            src="/images/about.jpeg"
            alt="About Us"
            width={500}
            height={500}
            layout="responsive"
          />
        </div>
        <div className="col-md-4">
          <p
            className="d-flex align-items-center justify-content-center mt-2"
            style={{ height: "60vh" }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            officiis obcaecati esse tempore unde ratione, eveniet mollitia,
            perferendis eius temporibus dicta blanditiis doloremque explicabo
            quasi sunt vero optio cum aperiam vel consectetur! Laborum enim
            accusantium atque, excepturi sapiente amet! Tenetur ducimus aut
            commodi illum quidem neque tempora nam.
          </p>
        </div>
      </div>
    </>
  );
}
