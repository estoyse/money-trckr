import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Expenses = () => {
  return (
    <div className='container mx-auto py-6 px-4 p-2 lg:p-6 max-w-7xl w-full'>
      <div className='flex items-center mb-6'>
        <Link
          to='/'
          className='flex items-center text-sm font-medium text-muted-foreground hover:text-primary'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Expenses;
