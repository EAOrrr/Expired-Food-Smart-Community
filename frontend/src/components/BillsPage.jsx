import React, { useEffect, useState } from 'react'
import userService from '../services/user'

const BillsPage = () => {
  const [bills, setBills] = useState([])
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const fetchBills = async () => {
      const fetchedBills = await userService.getBills()
      setBills(fetchedBills)
      if (fetchedBills.length > 0) {
        setBalance(fetchedBills[0].balance)
      }
    }
    fetchBills()
  }, [])

  return (
    <div>
      <h2>账单</h2>
      <p>当前余额: {balance}</p>
      <ul>
        {bills.map(bill => (
          <li key={bill.id}>
            <p>金额: {bill.amount}</p>
            <p>操作: {bill.operation}</p>
            <p>创建时间: {new Date(bill.createdAt).toLocaleString()}</p>
            <p>备注: {bill.note}</p>
            <p>余额: {bill.balance}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BillsPage