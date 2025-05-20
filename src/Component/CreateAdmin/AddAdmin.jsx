import React from "react";
import { useGetAllAdmins } from "./AdminHooks";

const AddAdmin = () => {
  const { data: admins, isLoading, error } = useGetAllAdmins();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log(admins,"Ye---")
  return (
    <div>
      <h1>Admin List</h1>
    </div>
  );
};

export default AddAdmin;