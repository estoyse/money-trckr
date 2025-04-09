import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabase";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
  TableFooter,
} from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { transactionTypeParser } from "@/lib/transactionTypeParser";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatDate } from "@/lib/formatDate";
import { accountsAtom, historyAtom, historyLoadingAtom } from "@/state/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useAtom(historyAtom);
  const [loading, setLoading] = useAtom(historyLoadingAtom);
  const accounts = useAtomValue(accountsAtom);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate middle pages
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (leftBound > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (rightBound < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("history")
        .select("*")
        .order("transaction_date", { ascending: false })
        .limit(itemsPerPage)
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      if (error) {
        toast.error(error.message);
      } else {
        setHistory(data);
      }
      setLoading(false);
    };

    // Initial fetch
    fetchHistory();
  }, [setHistory, setLoading, currentPage, itemsPerPage]);

  useEffect(() => {
    const countHistoryItems = async () => {
      console.log("fetched");
      const { count, error } = await supabase
        .from("history")
        .select("*", { count: "exact", head: true });
      if (error) {
        toast.error(error.message);
      } else {
        console.log(count);
        setTotalPages(Math.ceil((count ?? 10) / itemsPerPage));
      }
    };

    // Initial fetch
    countHistoryItems();
  }, [itemsPerPage]);

  return (
    <div>
      <h2 className='text-2xl font-semibold py-2'>History</h2>
      <Card>
        <Table className='rounded-lg'>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2}>Transfer Type</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className='w-8'>
                    <Skeleton className='h-8 w-8 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-8 w-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-8' />
                  </TableCell>
                </TableRow>
              ))
            ) : history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className='text-center'>
                  No recent transactions
                </TableCell>
              </TableRow>
            ) : (
              history.map(transaction => (
                <TableRow
                  onClick={() => navigate(`/transaction/${transaction.id}`)}
                  key={transaction.id}
                  className='cursor-pointer'
                >
                  <TableCell className='w-8'>
                    <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400'>
                      {transaction.icon}
                    </div>
                  </TableCell>
                  <TableCell className='flex flex-col'>
                    <span className='text-semibold'>
                      {transaction.location}
                    </span>
                    <span className='text-muted-foreground'>
                      {formatDate(transaction.transaction_date)}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex flex-row items-center justify-end'>
                      <div className='flex flex-col items-end mr-1'>
                        <span
                          className={`${
                            transaction.type !== 3
                              ? "text-red-500"
                              : "text-green-500"
                          } `}
                        >
                          {formatCurrency(transaction.amount)}
                        </span>
                        <span className='text-muted-foreground'>
                          {transactionTypeParser(transaction.type)} (
                          {
                            accounts.find(
                              account => account.id === transaction.account
                            )?.name
                          }
                          )
                        </span>
                      </div>
                      <ChevronRight />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow className='h-12'>
              <TableCell colSpan={3}>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <div className='flex items-center space-x-2 mb-4 sm:mb-0'>
                        <p className='text-sm text-muted-foreground'>
                          Rows per page
                        </p>
                        <Select
                          value={itemsPerPage.toString()}
                          onValueChange={value =>
                            setItemsPerPage(Number(value))
                          }
                          disabled={loading}
                        >
                          <SelectTrigger className='h-8 w-[70px]'>
                            <SelectValue placeholder={itemsPerPage} />
                          </SelectTrigger>
                          <SelectContent side='top'>
                            {[10, 20, 30, 50, 100].map(size => (
                              <SelectItem key={size} value={size.toString()}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationPrevious
                        href='#'
                        onClick={e => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={
                          currentPage <= 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                        aria-disabled={currentPage <= 1}
                      />
                    </PaginationItem>

                    {getPageNumbers().map((pageNum, index) => {
                      if (pageNum < 0) {
                        // Render ellipsis
                        return (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href='#'
                            onClick={e => {
                              e.preventDefault();
                              setCurrentPage(pageNum);
                            }}
                            isActive={pageNum === currentPage}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href='#'
                        onClick={e => {
                          e.preventDefault();
                          if (currentPage < totalPages)
                            setCurrentPage(currentPage + 1);
                        }}
                        className={
                          currentPage >= totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                        aria-disabled={currentPage >= totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </div>
  );
}
