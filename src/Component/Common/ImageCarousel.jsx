import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";

const images = [
  {
    url: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    caption: "Beautiful Sunset",
  },
  {
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    caption: "Mountain View",
  },
  {
    url: "https://images.unsplash.com/photo-1499955085172-a104c9463ece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    caption: "Calm Beach",
  },
  {
    url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    caption: "Forest Path",
  },
  {
    url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    caption: "Starry Night",
  },
];

export const Slider = ({ images }) => {
  return (
    <AwesomeSlider style={{ height: "30vw" }} animation="cubeAnimation">
      {images.map((each, index) => {
        return (
          <div key={`${each.caption}`}>
            <img src={each.url} />
          </div>
        );
      })}
    </AwesomeSlider>
  );
};
