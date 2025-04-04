import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { formatDate } from "@/lib/formatDate";
import { useState } from "react";
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
import { useAtomValue } from "jotai";
import { accountsAtom, historyAtom, historyLoadingAtom } from "@/state/atoms";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();

  const transactions = useAtomValue(historyAtom);
  const accounts = useAtomValue(accountsAtom);
  const loading = useAtomValue(historyLoadingAtom);

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / 10);

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
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className='text-center'>
                  No recent transactions
                </TableCell>
              </TableRow>
            ) : (
              transactions.map(transaction => (
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
                    <div className='flex flex-col items-end'>
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
