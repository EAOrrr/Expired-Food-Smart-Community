import React, { useEffect, useState } from 'react'
import userService from '../services/user'
import Loading from './Loading'

const BillsPage = () => {
  const [user, setUser] = useState(null)
  console.log(user)

  useEffect(() => {
    const fetchBills = async () => {
      const fetchedUserWithBills = await userService.getBills()
      console.log('fetchedUserWithBills:', fetchedUserWithBills)
      setUser(fetchedUserWithBills)
    }
    fetchBills()
  }, [])
  
  if (!user) {
    return <Loading message='用户账单加载中'/>
  }

  return (
    <div>
      <h2>账单</h2>
      <p>当前余额: {user.balance}</p>
      <ul>
        {user.Bills.map(bill => (
          <li key={bill.id}>
            <p>金额: {bill.amount}</p>
            <p>操作: {bill.operation}</p>
            <p>创建时间: {new Date(bill.createdAt).toLocaleString()}</p>
          </li>
        ))}
        
      </ul>
    </div>
  )
}

export default BillsPage