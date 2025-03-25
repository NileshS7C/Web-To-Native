import { useState } from 'react'
import CouponsFormData from './CouponsFormData'

const CreateCoupons = () => {
    const [formData, setFormData] = useState({});

  return (
    <CouponsFormData mode='edit' formData={formData} setFormData={setFormData} />
  )
}

export default CreateCoupons