import React, { useEffect, useState } from 'react'
// import userService from '../services/user'
import billService from '../../services/bills'
import Loading from '../Loading'
import { useSelector } from 'react-redux'
import BillCard from './BillCard'

const BillsPage = () => {
  const [bills, setBills] = useState([])
  const user = useSelector(state => state.user.info)

  useEffect(() => {
    const fetchBills = async () => {
      const bills = await billService.getAll()
      console.log(bills)
      setBills(bills)
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
        {bills.map(bill => (
          <BillCard key={bill.billId} bill={bill} />
          
        ))}
        
      </ul>
    </div>
  )
}

export default BillsPage