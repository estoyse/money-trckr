import { Card } from "@/components/ui/card";
import {
  Utensils,
  Train,
  ShoppingBag,
  Heart,
  SandwichIcon as Hamburger,
  Receipt,
} from "lucide-react";

export default function ExpenseList() {
  const expenses = [
    {
      icon: <Utensils className='w-6 h-6' />,
      name: "Food & Dining",
      timestamp: "13 Jan 2025 at 12:56",
      amount: "-so'm 21 000,00",
      category: "",
    },
    {
      icon: <Train className='w-6 h-6' />,
      name: "metro toshkent",
      timestamp: "13 Jan 2025 at 12:56",
      amount: "-so'm 5 100,00",
      category: "Public Transportation",
    },
    {
      icon: <Train className='w-6 h-6' />,
      name: "Loook",
      timestamp: "13 Jan 2025 at 12:55",
      amount: "-so'm 33 000,00",
      category: "Fast Food",
    },
    {
      icon: <ShoppingBag className='w-6 h-6' />,
      name: "Groceries",
      timestamp: "13 Jan 2025 at 12:53",
      amount: "-so'm 70 000,00",
      category: "",
    },
    {
      icon: <Heart className='w-6 h-6' />,
      name: "Health & Fitness",
      timestamp: "13 Jan 2025 at 12:52",
      amount: "-so'm 21 500,00",
      category: "",
    },
    {
      icon: <Train className='w-6 h-6' />,
      name: "metro toshkent",
      timestamp: "13 Jan 2025 at 12:51",
      amount: "-so'm 3 400,00",
      category: "Public Transportation",
    },
    {
      icon: <Hamburger className='w-6 h-6' />,
      name: "Fast Food",
      timestamp: "13 Jan 2025 at 12:51",
      amount: "-so'm 68 000,00",
      category: "",
    },
    {
      icon: <Receipt className='w-6 h-6' />,
      name: "Bills & Utilities",
      timestamp: "13 Jan 2025 at 12:50",
      amount: "-so'm 10 000,00",
      category: "",
    },
  ];

  return (
    <Card className=''>
      <div className='divide-y'>
        {expenses.map((expense, index) => (
          <div key={index} className='flex items-start gap-4 p-4'>
            <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400'>
              {expense.icon}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-lg font-semibold text-white'>{expense.name}</p>
              <div className='flex gap-2 items-center text-sm text-gray-500'>
                <p>{expense.timestamp}</p>
                {expense.category && (
                  <>
                    <span>•</span>
                    <p>{expense.category}</p>
                  </>
                )}
              </div>
            </div>
            <div className='flex-shrink-0'>
              <p className='text-red-500 font-medium whitespace-nowrap'>
                {expense.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
