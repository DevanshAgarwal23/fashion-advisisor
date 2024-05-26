
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container h-[calc(100vh-20vh)] mx-auto py-8 text-justify leading-10">
      <h1 className='text-center pb-8 text-3xl font-bold'  style={{fontFamily: 'meno-banner, serif !important'}}>About Us</h1>
      <ul>
        <li>1. At <strong>FashionAdvisor</strong>, we&apos;re committed to revolutionizing your style journey with cutting-edge technology and personalized fashion advice.</li>
        <li>2. With our advanced app, we bring together the power of AI and user-centric design to create an intuitive fashion advisory platform.</li>
        <li>3. Upload your outfit images, and our AI advisor instantly analyzes them to provide tailored fashion suggestions, empowering you to refine your wardrobe effortlessly.</li>
        <li>4. Every suggestion is meticulously curated to align with your personal style preferences, ensuring that each recommendation resonates with your unique fashion sense.</li>
        <li>5. Keep track of your style evolution with our user profile feature, where every suggestion is archived for easy reference and reflection.</li>
        <li>6. Organize your fashion journey by categorizing suggestions into collections such as "Ethnic," "Casual," or any other theme that resonates with your wardrobe aspirations.</li>
        <li>7. With a seamless login system, accessing your fashion profile is quick and secure, ensuring a hassle-free experience every time you visit our platform.</li>
        <li>8. Gain insights into your fashion choices with detailed analytics and trend reports, helping you make informed decisions about your wardrobe.</li>
        <li>9. Our credit system ensures that every suggestion is valuable, with each recommendation deducting one credit from your account, promoting thoughtful use of our advisory services.</li>
        <li>10. Experience the future of fashion advisory with <strong>FashionAdvisor</strong> - where innovation meets style, and your wardrobe's potential knows no bounds.</li>
      </ul>
      </div>
  );
};

export default AboutPage;
