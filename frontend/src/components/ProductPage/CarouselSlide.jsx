import { Box } from "@mui/material";
import Carousel from "react-material-ui-carousel";

const CarouselSlide = ({ items }) => {
  if (items.length === 0) {
    items = ['/src/assets/default.jpg']
  }
  return (
    <Box sx={{ width: '80%', margin: '0 auto' }}>
      <Carousel>
        {items.map((item, i) => (
          <Box 
            key={i} 
            component='img' 
            src={item} 
            sx={{ 
              maxHeight: '400px', 
              maxWidth: '100%', 
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto' 
            }}
          />
        ))}
      </Carousel>
    </Box>
  );
}

export default CarouselSlide;