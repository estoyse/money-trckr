import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";

const BottomBar = () => {
  return (
    <div className='fixed bottom-2 right-1/2 translate-x-1/2 shadow-md p-2 px-6 bg-white/1 backdrop-blur-2xl border flex justify-around gap-12 items-center rounded-4xl z-10'>
      <Link to='/' className='text-center'>
        <span>Home</span>
      </Link>
      <Link to='/about' className='text-center'>
        <span>About</span>
      </Link>
      <ModeToggle />

      {/* Add more links as needed */}
    </div>
  );
};

export default BottomBar;
