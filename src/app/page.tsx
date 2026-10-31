import HeroSlider from "@/components/home/HeroSlider";
import BrowseCategories from "@/components/home/BrowseCategories";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import HowItWorks from "@/components/home/HowItWorks";
import AboutUs from "@/components/home/AboutUs";
import WhyChooseUs from "@/components/home/WhyChooseUs";


export default function Home() {
  return (
    <div>
      <HeroSlider/>
      <BrowseCategories/>
      <FeaturedStudios />
      <HowItWorks />
      <WhyChooseUs />
      <AboutUs />
      
    </div>
  );
}
