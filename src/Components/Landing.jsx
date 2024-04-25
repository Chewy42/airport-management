import plane_flying_right from "../Assets/LottieAnims/plane-flying-right.json";
import Lottie from "react-lottie";

export default function Landing() {
  return (
    <div
      id="landing"
      className="w-[100%] h-[100%] flex justify-center align-middle"
    >
      <div className="w-full h-full flex justify-center align-middle">
        <p className="text-left my-auto min-w-fit min-h-fit font-medium text-[44px]"><span className="text-blue-800">Y</span>our<br /><span className="text-blue-800">A</span>irport<br /><span className="text-blue-800">M</span>anagement<br /><span className="text-blue-800">S</span>ystem</p>
      </div>
      <div className="w-full h-full">
        <Lottie options={{ animationData: plane_flying_right }} />
      </div>
    </div>
  );
}
