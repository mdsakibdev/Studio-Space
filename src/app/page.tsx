import HeroSlider from "@/components/home/HeroSlider";
import BrowseCategories from "@/components/home/BrowseCategories";
import FeaturedStudios from "@/components/home/FeaturedStudios";
import HowItWorks from "@/components/home/HowItWorks";


export default function Home() {
  return (
    <div>
      <HeroSlider/>
      <BrowseCategories/>
      <FeaturedStudios />
      <HowItWorks />
      
    </div>
  );
}
