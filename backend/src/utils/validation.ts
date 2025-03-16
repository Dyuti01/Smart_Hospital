import { Request } from 'express-serve-static-core';
import validator from 'validator'

export const validateSignUpData = async (req:Request) => {
  const { firstName, lastName, email, password, phone } = req.body

  if (!firstName || !lastName){
    throw new Error("Name is not valid!");
  }
  else if (firstName.length < 4 || firstName.length > 50){
    throw new Error("firstName should be 4 to 50 characters! ")
  }

  if (!email && !phone){
    throw new Error("Atleast one of email or phone is needed!")
  }

  if (phone && !validator.isMobilePhone(phone, 'en-IN')){
    throw new Error("Mobile number is not valid!")
  }

  if (email && !validator.isEmail(email)){
    throw new Error("Email is not valid!");
  }
  

  if (password && !validator.isStrongPassword(password)){
    throw new Error("Enter strong password!")
  }
}

export const validatePatientProfileUpdateData = (req:Request):boolean=>{
  const data = req.body.updateData;
  const allowedFields = ["firstName", "lastName", "gender", "bloodType", "avatarUrl", "allergies", "chronicConditions", "address"];

  const isUpdateAllowed = Object.keys(data).every((k) =>
    allowedFields.includes(k)
  );

  return isUpdateAllowed;
}