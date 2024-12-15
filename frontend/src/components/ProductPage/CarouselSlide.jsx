import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";


const CarouselSlide = ({ items} ) => {
  return (
    <Carousel>
      {items.map((item, i) => (
        <Box key={i} component='img' src={`/api/images/${item.imageId}`}/>
      ))}
    </Carousel>
  );
}

export default CarouselSlide;