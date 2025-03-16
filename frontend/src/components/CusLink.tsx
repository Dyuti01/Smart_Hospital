import React from 'react'
import { useNavigate } from 'react-router'

const CusLink = ({to, className, children}:{to:string, className?:string, children:React.ReactNode}) => {
  const navigate = useNavigate()
  return (
    <span onClick={()=>navigate(to)} className={className}>
      {children}
    </span>
  )
}

export default CusLink
