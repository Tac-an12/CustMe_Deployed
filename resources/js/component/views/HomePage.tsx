import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeader from './forms/components/HomeHeader';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/register?role=2');
  };

  const handleJoin = () => {
    navigate('/join');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <HomeHeader />

      {/* Main Content */}
      <section className="flex-grow">
        <section className="flex flex-col lg:flex-row items-center justify-center mt-12 lg:mt-3 lg:space-x-40 min-h-screen">
          <div className="text-center lg:text-left max-w-lg">
            <h1 className="text-black font-extrabold text-5xl lg:text-6xl">
              Personalize your world with
            </h1>
            <h1 className="text-black font-extrabold text-5xl lg:text-6xl">
              <span className="text-blue-500">C</span>
              <span className="text-blue-500">u</span>
              <span className="text-blue-500">s</span>
              <span className="text-yellow-500">t</span>
              <span className="text-blue-500">M</span>
              <span className="text-yellow-500">e</span>
            </h1>
            <p className="text-black font-normal mt-4 text-xl">
              Connect with Designers and Printing providers.
            </p>
            <div className="flex-justify-center space-x-6 mt-7">
              {/* Sign-up Button */}
              <Button 
                onClick={handleSignUp} 
                variant="contained" 
                color="primary" 
                className="bg-blue-500 text-black font-semibold px-4 py-2"
              >
                Get Started
              </Button>
              {/* Join Button */}
              <Button 
                onClick={handleJoin} 
                variant="outlined" 
                className="border border-yellow-500 text-yellow-500 font-semibold px-7 py-2"
              >
                Join
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center items-center w-100 h-100 ml-8">
            <img
              src="https://s3-ap-south-1.amazonaws.com/internshala-blog/wp-content/uploads/2021/02/Careers-in-graphic-design.jpg.webp"
              alt="Hero"
              className="w-[500px] h-[500px] max-w-full max-h-full"
            />
          </div>
        </section>

        {/* Services Section */}
        <div className="flex flex-col items-center py-16 bg-white text-black">
          <h1 className="text-3xl font-semibold text-center mb-8 mt-2">
          Your One-Stop Solution for <br /> Custom Designs and Printing Services
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full max-w-6xl pt-8">
            <ServiceItem
              icon={<PeopleAltIcon className="text-4xl mb-4 text-blue-600" />}
              text="Work with experienced freelance designers to create personalized products that match your vision."
            />
            <ServiceItem
              icon={<DesignServicesIcon className="text-4xl mb-4 text-blue-600" />}
              text="Create one-of-a-kind gifts for special occasions like birthdays, anniversaries, or corporate events."
            />
            <ServiceItem
              icon={<LocalPrintshopIcon className="text-4xl mb-4 text-blue-600" />}
              text="Choose between local printing providers to print your custom designs on everything from apparel and accessories to business cards, posters, and home decor."
            />
            <ServiceItem
              icon={<BusinessCenterIcon className="text-4xl mb-4 text-blue-600" />}
              text="From concept creation with a freelance designer to high-quality printing, everything you need is in one place."
            />
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="min-h-screen flex justify-center items-center bg-white p-6">
          <div className="bg-gradient-to-r from-blue-500 to-yellow-500 text-white rounded-lg shadow-lg p-12 max-w-6xl">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-white">About CustMe</h1>
            </div>
            <h6 className="text-2xl font-bold text-white">OUR STORY</h6>
            <p className="text-white text-justify text-lg mt-4">
              CustMe was founded on the belief that everyone deserves personalized products that reflect their unique style. Recognizing a market need for affordable, high-quality customization, we created a platform that connects customers with skilled designers and reliable printing services, ensuring a seamless design and print experience.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <div id="services" className="min-h-screen flex flex-col items-center justify-center bg-white py-16">
  <h1 className="text-3xl font-semibold mb-8 text-center">CustMe Services</h1>
  <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl px-4">
    <ServiceCard
      title="Design Services"
      description="Connect with freelance designers to create unique, personalized designs tailored to your needs."
      imageUrl="https://i.pinimg.com/originals/e5/29/ae/e529ae5785e684063b0ecf58137078b6.png"
    />
    <ServiceCard
      title="Printing Services"
      description="Access a wide range of high-quality printing options to bring your designs to life, from digital prints to eco-friendly solutions."
      imageUrl="https://image.freepik.com/free-vector/digital-printing-concept-illustration_23-2148470662.jpg"
    />
  </div>
</div>



        {/* Simple Footer */}
        <footer className="bg-gray-100 py-4 border-t border-gray-200">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
            {/* Left side: Logo and Copyright */}
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl font-bold text-gray-600 pr-6">CustMe</h1>
              <span className="text-gray-600 text-sm">© Copyright CustMe 2024. All rights reserved</span>
            </div>

            {/* Middle: Social Icons */}
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-gray-500 hover:text-gray-800">
                <InstagramIcon />
              </a>
              <a href="https://linkedin.com" className="text-gray-500 hover:text-gray-800">
                <LinkedInIcon />
              </a>
              <a href="https://facebook.com" className="text-gray-500 hover:text-gray-800">
                <FacebookIcon />
              </a>
              <a href="https://pinterest.com" className="text-gray-500 hover:text-gray-800">
                <PinterestIcon />
              </a>
              <a href="https://twitter.com" className="text-gray-500 hover:text-gray-800">
                <TwitterIcon />
              </a>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

const ServiceItem = ({ icon, text }) => (
  <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md hover:bg-blue-100 transition-colors duration-300">
    {icon}
    <p className="text-lg font-medium mt-4">{text}</p>
  </div>
);

const ServiceCard = ({ title, description, imageUrl }) => {
  return (
    <Card className="shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col">
      <div className="relative w-full h-64 sm:h-72 md:h-80 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full rounded-t-lg"
        />
      </div>
      <CardContent className="flex flex-col items-center py-6 px-4">
        <Typography variant="h6" className="font-semibold mb-4 text-center text-sm sm:text-base md:text-lg">
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="text-center text-xs sm:text-sm md:text-base">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};


export default HomePage;