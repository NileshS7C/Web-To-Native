import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import { uploadImage } from '../../redux/Upload/uploadActions'
import { imageUpload } from '../../Assests'
import { useGetEventOwnerById, useUpdateEventOwner } from '../../Hooks/SocialEventsHooks'

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .required('Phone is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  password: Yup.string()
    .test('password-validation', 'Password validation', function(value) {
      // If password is empty, it's valid (optional)
      if (!value || value.length === 0) {
        return true;
      }
      
      // If password is provided, validate it
      const hasMinLength = value.length >= 8;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

      if (!hasMinLength) {
        return this.createError({ message: 'Password must be at least 8 characters' });
      }
      if (!hasUpperCase) {
        return this.createError({ message: 'Password must contain at least one uppercase letter' });
      }
      if (!hasLowerCase) {
        return this.createError({ message: 'Password must contain at least one lowercase letter' });
      }
      if (!hasNumber) {
        return this.createError({ message: 'Password must contain at least one number' });
      }
      if (!hasSpecialChar) {
        return this.createError({ message: 'Password must contain at least one special character' });
      }

      return true;
    }),
  brandName: Yup.string().required('Brand name is required'),
  brandEmail: Yup.string().email('Invalid email').required('Brand email is required'),
  brandPhone: Yup.string()
    .required('Brand phone is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  line1: Yup.string().required('Address line 1 is required'),
  line2: Yup.string().required('Address line 2 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  postalCode: Yup.string()
    .required('Postal code is required')
    .matches(/^\d{6}$/, 'Postal code must be exactly 6 digits'),
  brandLogoImage: Yup.string().required('Brand logo is required')
})

const FormInput = ({ label, name, type = "text", placeholder, className = "", ...props }) => (
  <div className='flex flex-col items-start gap-3'>
    <p className='text-base leading-[19.36px] text-[#232323]'>{label}</p>
    <Field
      type={type}
      name={name}
      placeholder={placeholder}
      className={`w-full px-[19px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
  </div>
)

const ViewEditEventOwner = ({ ownerId, isOpen, onClose }) => {
  const dispatch = useDispatch()
  const { data: ownerData, isLoading: isLoadingOwner } = useGetEventOwnerById(ownerId)
  const { mutate: updateEventOwner, isLoading: isUpdating } = useUpdateEventOwner()

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      ...(values.password && { password: values.password }),
      ownerDetails: {
        brandName: values.brandName,
        brandEmail: values.brandEmail,
        brandPhone: values.brandPhone,
        address: {
          line1: values.line1,
          line2: values.line2,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          location: {
            type: "Point",
            coordinates: [0, 0],
            is_location_exact: false
          }
        },
        brandLogoImage: values.brandLogoImage
      }
    }

    updateEventOwner({ ownerId, payload }, {
      onSuccess: () => {
        onClose()
      },
      onError: (error) => {
        console.error('Error updating event owner:', error)
      }
    })
    setSubmitting(false)
  }

  const handleFileUpload = async (e, setFieldValue) => {
    const file = e.target.files[0]
    if (!file?.type?.startsWith("image/")) {
      alert("Invalid file type. Please upload an image.")
      e.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File must be less than 5MB.")
      e.target.value = ''
      return
    }

    try {
      const result = await dispatch(uploadImage(file)).unwrap()
      const url = result.data.url
      setFieldValue('brandLogoImage', url)
    } catch (err) {
      alert(err?.data?.message || "Upload failed.")
    } finally {
      e.target.value = ''
    }
  }

  if (!isOpen) return null

  if (isLoadingOwner) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          Loading...
        </div>
      </div>
    )
  }

  const owner = ownerData?.data
  const ownerDetails = owner?.owner?.[0]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-[90%] md:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Formik
          initialValues={{
            name: owner?.name || '',
            email: owner?.email || '',
            phone: owner?.phone || '',
            password: '', // Password is empty by default for security
            brandName: ownerDetails?.brandName || '',
            brandEmail: ownerDetails?.brandEmail || '',
            brandPhone: ownerDetails?.brandPhone || '',
            line1: ownerDetails?.address?.line1 || '',
            line2: ownerDetails?.address?.line2 || '',
            city: ownerDetails?.address?.city || '',
            state: ownerDetails?.address?.state || '',
            postalCode: ownerDetails?.address?.postalCode || '',
            brandLogoImage: ownerDetails?.brandLogoImage || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values }) => (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">View/Edit Event Owner</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Name"
                    name="name"
                    placeholder="Enter name"
                  />
                  <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter email"
                  />
                  <FormInput
                    label="Phone"
                    name="phone"
                    placeholder="Enter phone number"
                    maxLength="10"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  <FormInput
                    label="Password"
                    name="password"
                    type="text"
                    placeholder="Enter new password (leave empty to keep current)"
                  />
                  <FormInput
                    label="Brand Name"
                    name="brandName"
                    placeholder="Enter brand name"
                  />
                  <FormInput
                    label="Brand Email"
                    name="brandEmail"
                    type="email"
                    placeholder="Enter brand email"
                  />
                  <FormInput
                    label="Brand Phone"
                    name="brandPhone"
                    placeholder="Enter brand phone number"
                    maxLength="10"
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault()
                      }
                    }}
                  />
                  <div className="">
                    <p className="text-base leading-[19.36px] text-[#232323] mb-3 text-left">Brand Logo</p>
                    <div className="flex items-center gap-4">
                      <img
                        src={values.brandLogoImage || imageUpload}
                        alt="Brand logo preview"
                        className="h-20 w-20 object-cover rounded"
                      />
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, setFieldValue)}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <ErrorMessage name="brandLogoImage" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <FormInput
                    label="Address Line 1"
                    name="line1"
                    placeholder="Enter address line 1"
                  />
                  <FormInput
                    label="Address Line 2"
                    name="line2"
                    placeholder="Enter address line 2"
                  />
                  <FormInput
                    label="City"
                    name="city"
                    placeholder="Enter city"
                  />
                  <FormInput
                    label="State"
                    name="state"
                    placeholder="Enter state"
                  />
                  <FormInput
                    label="Postal Code"
                    name="postalCode"
                    placeholder="Enter postal code"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    {isUpdating ? 'Updating...' : 'Update Event Owner'}
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ViewEditEventOwner 