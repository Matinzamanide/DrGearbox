import Categories from "../../components/Categories";
import Category from "../../components/Category";
import Customers from "../../components/Customers";
import CustomersOpinion from "../../components/CustomersOpinion";
// import HeroSlider from "../../components/HeroSection";
import AnimateVideo from "../../components/Video";
import BestSellers from "../BestSellers/BestSellers";
const Home=()=>{
    return(

        <>
        <AnimateVideo/>
        {/* <HeroSlider/> */}
        <Category/>
        <BestSellers/>
        <Categories/>
        <img className="w-full" src="https://www.kalasanati.com/portals/0/Banner/banner_receive_credit.webp" alt="" />
        <Customers/>
        <CustomersOpinion/>
        </>
    )    
}
export default Home;
