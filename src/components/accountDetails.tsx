"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, PencilLine, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Account } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { accountsAtom, accountsLoadingAtom, historyAtom } from "@/state/atoms";
import supabase from "@/lib/supabase";
import { formatCurrency } from "@/lib/formatCurrency";

export default function AccountDetails() {
  const { id } = useParams();

  const [accounts, setAccounts] = useAtom(accountsAtom);
  const history = useAtomValue(historyAtom);
  const loading = useAtomValue(accountsLoadingAtom);

  const [account, setAccount] = useState<Account>({
    id: "",
    name: "",
    balance: 0,
    created_at: "2023-09-15T10:30:00Z",
    icon: "",
    owner: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: account.name,
    balance: account.balance.toString(),
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    const account = accounts.find(account => account.id === id);
    if (account) {
      setAccount(account);
    }
  }, [id, accounts, loading]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = () => {
    setIsSaving(true);

    const parsedBalance = Number.parseFloat(editForm.balance);

    if (isNaN(parsedBalance)) {
      toast.error("Invalid amount, please enter a valid number for balance");
      setIsSaving(false);
      return;
    }

    try {
      supabase
        .from("user_accounts")
        .update({
          name: editForm.name,
          balance: parsedBalance,
          owner: {
            name: editForm.ownerName,
            email: editForm.ownerEmail,
            phone: editForm.ownerPhone,
          },
        })
        .eq("id", id)
        .then(() => {
          setIsEditing(false);
          setIsSaving(false);
          toast.success("Account details have been successfully updated");
        });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update account details");
      }
      setIsSaving(false);
      return;
    }

    setAccount({
      ...account,
      name: editForm.name,
      balance: parsedBalance,
      owner: {
        name: editForm.ownerName,
        email: editForm.ownerEmail,
        phone: editForm.ownerPhone,
      },
    });

    setAccounts(
      accounts.map(currentAccount =>
        currentAccount.id === id
          ? {
              ...currentAccount,
              name: editForm.name,
              balance: parsedBalance,
              owner: {
                name: editForm.ownerName,
                email: editForm.ownerEmail,
                phone: editForm.ownerPhone,
              },
            }
          : currentAccount
      )
    );
  };

  return (
    <div className='container mx-auto py-6 px-4 max-w-5xl'>
      <div className='flex items-center mb-6'>
        <Link
          to='/'
          className='flex items-center text-sm font-medium text-muted-foreground hover:text-primary'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Dashboard
        </Link>
      </div>
      {isEditing && (
        <div className='bg-primary/10 border border-primary/30 text-primary rounded-md p-3 mb-8 flex items-center'>
          <div className='flex items-center'>
            <PencilLine className='h-4 w-4 mr-2' />
            <p className='text-sm font-medium'>
              Editing mode active. Fields with dashed borders can be edited.
            </p>
          </div>
          <Button
            variant='destructive'
            onClick={() => setIsEditing(false)}
            className='ml-auto cursor-pointer'
          >
            Cancel
          </Button>
        </div>
      )}

      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {isEditing ? (
              <div className='relative'>
                <Label
                  htmlFor='name'
                  className='absolute -top-5 text-xs text-primary font-medium'
                >
                  Account Name
                </Label>
                <Input
                  id='name'
                  value={editForm.name}
                  onChange={e =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className='font-bold text-2xl h-auto py-1 px-2 border-dashed border-primary'
                />
                <PencilLine className='absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              </div>
            ) : (
              account.name
            )}
          </h1>
          <p className='text-muted-foreground'>
            Created on {formatDate(account.created_at)}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {isEditing ? (
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <span className='flex items-center'>
                  <svg
                    className='animate-spin -ml-1 mr-2 h-4 w-4'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className='h-4 w-4 mr-2' />
                  Save
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEditForm({
                  name: account.name,
                  balance: account.balance.toString(),
                  ownerName: account.owner.name,
                  ownerEmail: account.owner.email,
                  ownerPhone: account.owner.phone,
                });
                setIsEditing(true);
              }}
            >
              <PencilLine className='h-4 w-4 mr-2' />
              Edit
            </Button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Account ID
                </h3>
                <p className='font-medium'>{account.id}</p>
              </div>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Status
                </h3>
                <Badge
                  variant='default'
                  className='bg-green-100 text-green-800 hover:bg-green-100'
                >
                  Active
                </Badge>
              </div>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Created Date
                </h3>
                <div className='flex items-center'>
                  <Calendar className='h-4 w-4 mr-2 text-muted-foreground' />
                  <p>{formatDate(account.created_at)}</p>
                </div>
              </div>

              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Account Type
                </h3>
                <p>{"Personal"}</p>
              </div>

              <div className='md:col-span-2'>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Current Balance
                </h3>
                {isEditing ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-full max-w-xs relative'>
                      <Input
                        id='balance'
                        type='number'
                        step='0.01'
                        value={editForm.balance}
                        onChange={e =>
                          setEditForm({ ...editForm, balance: e.target.value })
                        }
                        className='font-medium border-dashed border-primary'
                      />
                      <PencilLine className='absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    </div>
                    <p className='text-sm text-muted-foreground'>USD</p>
                  </div>
                ) : (
                  <p className='text-xl font-bold'>
                    {formatCurrency(account.balance)}
                  </p>
                )}
              </div>
            </div>

            <Separator className='my-4' />

            <div>
              <h3 className='text-sm font-medium mb-2'>Recent Transactions</h3>
              <div className='rounded-md border'>
                <table className='min-w-full divide-y divide-border'>
                  <thead>
                    <tr className='bg-muted/50'>
                      <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Date
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Description
                      </th>
                      <th className='px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-background divide-y divide-border'>
                    {history
                      .filter(transaction => transaction.account === account.id)
                      .map(transaction => (
                        <tr key={transaction.id}>
                          <td className='px-4 py-3 whitespace-nowrap text-sm'>
                            {formatDate(transaction.transaction_date)}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm'>
                            {transaction.description}
                          </td>
                          <td className='px-4 py-3 whitespace-nowrap text-sm text-right'>
                            {transaction.type === 1 ? (
                              <span className='text-green-600'>
                                +{formatCurrency(transaction.amount)}
                              </span>
                            ) : (
                              <span
                                className={
                                  transaction.type === 3
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {formatCurrency(transaction.amount)}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between font-medium'>
                <span>Current Balance</span>
                <span className='font-bold'>
                  {formatCurrency(account.balance)}
                </span>
              </div>
              <div className='flex justify-between text-sm text-muted-foreground'>
                <span>Available Credit</span>
                <span>{formatCurrency(account.balance * 0.8)}</span>
              </div>
              <div className='flex justify-between text-sm text-muted-foreground'>
                <span>Pending Transactions</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <Separator />
              <div className='flex justify-between font-medium'>
                <span>Monthly Interest Rate</span>
                <span>0.05%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Owner</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Name
                </h3>
                {isEditing ? (
                  <div className='relative'>
                    <Input
                      id='ownerName'
                      value={editForm.ownerName}
                      onChange={e =>
                        setEditForm({ ...editForm, ownerName: e.target.value })
                      }
                      className='mt-1 border-dashed border-primary'
                    />
                    <PencilLine className='absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  </div>
                ) : (
                  <p>{account.owner.name}</p>
                )}
              </div>

              <div>
                <h3 className='text-sm font-medium text-muted-foreground mb-1'>
                  Contact Information
                </h3>
                {isEditing ? (
                  <div className='space-y-2'>
                    <div className='relative'>
                      <Input
                        id='email'
                        type='email'
                        placeholder='Email'
                        value={editForm.ownerEmail}
                        onChange={e =>
                          setEditForm({
                            ...editForm,
                            ownerEmail: e.target.value,
                          })
                        }
                        className='border-dashed border-primary'
                      />
                      <PencilLine className='absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    </div>
                    <div className='relative mt-6'>
                      <Input
                        id='phone'
                        type='tel'
                        placeholder='Phone'
                        value={editForm.ownerPhone}
                        onChange={e =>
                          setEditForm({
                            ...editForm,
                            ownerPhone: e.target.value,
                          })
                        }
                        className='border-dashed border-primary'
                      />
                      <PencilLine className='absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className='text-sm'>{account.owner.email}</p>
                    <p className='text-sm'>{account.owner.phone}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
