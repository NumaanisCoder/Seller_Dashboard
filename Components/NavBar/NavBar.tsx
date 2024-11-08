import { useState, useEffect } from 'react';
import style from './NavBar.module.css';
import Link from 'next/link';
import Cookies from "js-cookie";
import { useRouter } from 'next/router';
import axios from "axios";


interface UserData {
    name: string;
    businessName: string;
    address: string; // Assuming this is the same as warehouseAddress
    warehouseAddress: string; // Assuming this is the same as warehouseAddress
    gst: string;
    email: string;
    phone: string;
  }

const NavBar: React.FC = () => {
  

    const [token, setToken] = useState<string | null>(null); // State can hold a string or null
    const [userData, setUserData] = useState<UserData | null>(null); 
    const router = useRouter();

    useEffect(() => {
        // Get the token from cookies and set it
        const authToken = Cookies.get("authtokenbyan");
        setToken(authToken || null); // Set null if token is not found
    }, []); // Empty dependency array ensures this runs only on mount

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
        <nav className={style.parent}>
            <div className={style.companyLogo}>
                CompanyLogo
            </div>

            <ul className={style.anchoContainer}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/orders">Orders</Link></li>
                <li><Link href="/products">Products</Link></li>
                <li><Link href="/inventory">Inventory</Link></li>
            </ul>

            <div className={style.seller}>
                {!token ? (
                    <div className={style.loginDiv}>
                        <Link href="/login">Login</Link>
                    </div>
                ) : (
                    <Link href="/account" className={style.sellerDetailContainer}>
                        {userData?.businessName}
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
