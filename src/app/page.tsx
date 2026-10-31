import HeroSlider from "@/components/home/HeroSlider";
import BrowseCategories from "@/components/home/BrowseCategories";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import HowItWorks from "@/components/home/HowItWorks";
import AboutUs from "@/components/home/AboutUs";


export default function Home() {
  return (
    <div>
      <HeroSlider/>
      <BrowseCategories/>
      <FeaturedStudios />
      <HowItWorks />
      <AboutUs />
      
    </div>
  );
}
