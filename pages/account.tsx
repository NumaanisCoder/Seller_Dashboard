import React, { useEffect, useState } from 'react';
import style from '@/styles/account.module.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

interface UserData {
  name: string;
  businessName: string;
  address: string; // Assuming this is the same as warehouseAddress
  warehouseAddress: string; // Assuming this is the same as warehouseAddress
  gst: string;
  email: string;
  phone: string;
}

const Account: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null); // Initialize state to null
  const router = useRouter();

  const fetchUserData = async () => {
    const token = Cookies.get("authtokenbyan");
    if(token == null){
      router.push("/login");
    }
    const tokenJson = { token: token };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seller/getseller`, tokenJson);
      console.log(response.data);
      // Assuming response.data contains sellerdetail attribute
      if (response.data && response.data.sellerDetail) {
        setUserData(response.data.sellerDetail); // Set userData to sellerdetail
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className={style.parent}>
      <div className={style.infoContainer}>
        {userData ? ( // Conditional rendering to check if userData is available
          <>
            <div className={style.singleDetail}><span>Name: </span>{userData.name}</div>
            <div className={style.singleDetail}><span>Business Name: </span>{userData.businessName}</div>
            <div className={style.singleDetail}><span>Address: </span>{userData.address}</div>
            <div className={style.singleDetail}><span>Warehouse Address: </span>{userData.warehouseAddress}</div>
            <div className={style.singleDetail}><span>GST: </span>{userData.gst}</div>
            <div className={style.singleDetail}><span>Email: </span>{userData.email}</div>
            <div className={style.singleDetail}><span>Phone: </span>{userData.phone}</div>
          </>
        ) : (
          <div className={style.singleDetail}>Loading user data...</div> // Loading state
        )}
      </div>
    </div>
  );
}

export default Account;
